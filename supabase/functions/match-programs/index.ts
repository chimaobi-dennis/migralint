import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id } = await req.json();
    
    if (!user_id) {
      return new Response(
        JSON.stringify({ error: 'user_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get student profile
    const { data: profile, error: profileError } = await supabase
      .from('student_profile')
      .select('*')
      .eq('user_id', user_id)
      .single();

    if (profileError || !profile) {
      console.error('Profile fetch error:', profileError);
      return new Response(
        JSON.stringify({ error: 'Student profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get active programs
    const { data: programs, error: programsError } = await supabase
      .from('programs')
      .select('id, course_name, university_name, field_of_study, level, keywords, requirements_id, total_tuition, currency, country, city, degree')
      .limit(500);

    if (programsError) {
      console.error('Programs fetch error:', programsError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch programs' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prepare matching prompt
    const systemPrompt = `You are an expert education counselor specializing in matching students to university programs.

Analyze the student profile and available programs to recommend the best matches based on:
1. Field of study alignment (primary factor)
2. Keyword overlap with student interests
3. Degree level compatibility
4. Language test requirements
5. Tuition and budget preferences
6. Study environment preferences
7. Work experience alignment with program requirements

Return the top 15-20 program matches with realistic match percentages (40-95%).`;

    const userPrompt = `Student Profile:
- Current Degree: ${profile.degree}
- Field of Study: ${profile.field_of_study}
- Area of Study: ${profile.area_of_study || 'Not specified'}
- Desired Degree Type: ${profile.desired_degree_type}
- Origin Country: ${profile.origin_country}
- Language: ${profile.language}
- Language Test: ${profile.has_language_test ? `${profile.language_test_type}: ${profile.language_test_score}` : 'Not taken'}
- Work Experience: ${profile.work_experience}
- Fee Preference: ${profile.fee_preference}
- Study Environment Preferences: ${JSON.stringify(profile.study_envs || [])}
- Interest Keywords: ${JSON.stringify(profile.interest_keywords || [])}

Available Programs (${programs?.length || 0} total):
${programs?.map(p => `
ID: ${p.id}
Program: ${p.course_name}
University: ${p.university_name}
Field: ${p.field_of_study}
Level: ${p.level}
Degree: ${p.degree}
Location: ${p.city}, ${p.country}
Tuition: ${p.total_tuition} ${p.currency}
Keywords: ${JSON.stringify(p.keywords || [])}
`).join('\n---\n')}

Recommend the best matching programs with match percentages and brief reasons.`;

    // Call Lovable AI with tool calling
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        tools: [{
          type: "function",
          function: {
            name: "recommend_programs",
            description: "Recommend university programs with match percentages",
            parameters: {
              type: "object",
              properties: {
                recommendations: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      program_id: { type: "number", description: "The program ID" },
                      match_percentage: { type: "number", minimum: 40, maximum: 95, description: "Match percentage" },
                      match_reason: { type: "string", description: "Brief reason for the match" }
                    },
                    required: ["program_id", "match_percentage", "match_reason"]
                  }
                }
              },
              required: ["recommendations"]
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "recommend_programs" } }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'AI matching failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    console.log('AI Response:', JSON.stringify(aiData, null, 2));

    // Extract recommendations from tool call
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || !toolCall.function?.arguments) {
      console.error('No tool call in AI response');
      return new Response(
        JSON.stringify({ error: 'Failed to parse AI recommendations' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const recommendations = JSON.parse(toolCall.function.arguments).recommendations || [];
    
    // Sort by match percentage and take top 20
    const topRecommendations = recommendations
      .sort((a: any, b: any) => b.match_percentage - a.match_percentage)
      .slice(0, 20);

    const programIds = topRecommendations.map((r: any) => r.program_id);
    const matchPercentages = topRecommendations.map((r: any) => r.match_percentage);

    // Update student profile with recommendations
    const { error: updateError } = await supabase
      .from('student_profile')
      .update({
        recommended_programs: programIds,
        recommended_percentage: matchPercentages,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user_id);

    if (updateError) {
      console.error('Update error:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to save recommendations' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        recommendations: topRecommendations,
        total_matched: programIds.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
