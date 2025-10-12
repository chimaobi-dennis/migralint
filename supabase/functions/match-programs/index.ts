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

    // Convert UUID to bigint for student_profile lookup
    const { data: bigintId, error: conversionError } = await supabase
      .rpc('get_user_bigint_id', { auth_uuid: user_id });

    if (conversionError || !bigintId) {
      console.error('ID conversion error:', conversionError);
      return new Response(
        JSON.stringify({ error: 'Failed to process user ID' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Processing matching for user:', user_id, 'bigint:', bigintId);

    // Start background task for AI matching
    const matchingTask = async () => {
      try {
        // Get business settings for AI model selection
        const { data: businessSettings } = await supabase
          .from('business_details')
          .select('programMatchingAI')
          .eq('id', 1)
          .single();

        // Map business settings to actual model identifiers
        const modelMapping: Record<string, string> = {
          'Gemini 2.5 Pro': 'google/gemini-2.5-pro',
          'Gemini 2.5 Flash': 'google/gemini-2.5-flash',
          'Gemini 2.5 Flash Lite': 'google/gemini-2.5-flash-lite',
          'Gemini 2.5 Flash Image': 'google/gemini-2.5-flash-image-preview',
          'GPT-5': 'openai/gpt-5',
          'GPT-5 Mini': 'openai/gpt-5-mini',
          'GPT-5 Nano': 'openai/gpt-5-nano',
        };

        const selectedModel = businessSettings?.programMatchingAI 
          ? modelMapping[businessSettings.programMatchingAI] || 'google/gemini-2.5-flash'
          : 'google/gemini-2.5-flash';

        console.log('Using AI model:', selectedModel);

        // Get student profile using bigint ID
        const { data: profile, error: profileError } = await supabase
          .from('student_profile')
          .select('*')
          .eq('user_id', bigintId)
          .single();

        if (profileError || !profile) {
          console.error('Profile fetch error:', profileError);
          return;
        }

        // Get active programs
        const { data: programs, error: programsError } = await supabase
          .from('programs')
          .select('id, course_name, university_name, field_of_study, level, keywords, requirements_id, total_tuition, currency, country, city, degree')
          .limit(1000);

        if (programsError) {
          console.error('Programs fetch error:', programsError);
          return;
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

Return the top 100+ program matches with realistic match percentages (40-95%). Prioritize quality matches but include a wide range of options.`;

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
            model: selectedModel,
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
          return;
        }

        const aiData = await aiResponse.json();
        console.log('AI Response received, processing recommendations...');

        // Extract recommendations from tool call
        const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
        if (!toolCall || !toolCall.function?.arguments) {
          console.error('No tool call in AI response');
          return;
        }

        const recommendations = JSON.parse(toolCall.function.arguments).recommendations || [];
        
        // Sort by match percentage and take top 100+
        const topRecommendations = recommendations
          .sort((a: any, b: any) => b.match_percentage - a.match_percentage)
          .slice(0, 150);

        const programIds = topRecommendations.map((r: any) => r.program_id);
        const matchPercentages = topRecommendations.map((r: any) => r.match_percentage);

        // Update student profile with recommendations using bigint ID
        const { error: updateError } = await supabase
          .from('student_profile')
          .update({
            recommended_programs: programIds,
            recommended_percentage: matchPercentages,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', bigintId);

        if (updateError) {
          console.error('Update error:', updateError);
          return;
        }

        console.log('Successfully matched', programIds.length, 'programs for user', user_id);
      } catch (error) {
        console.error('Background matching error:', error);
      }
    };

    // Start background task
    EdgeRuntime.waitUntil(matchingTask());

    // Return immediate response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Program matching started in background',
        user_id: user_id
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
