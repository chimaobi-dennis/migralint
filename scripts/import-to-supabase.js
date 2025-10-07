import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Supabase configuration
const SUPABASE_URL = "https://yjzsuzbvvfseouzwtxxt.supabase.co";
const SUPABASE_KEY = "***REMOVED***";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Import parsed university data to Supabase
 */
class SupabaseImporter {
  constructor() {
    this.importedUniversities = 0;
    this.importedPrograms = 0;
    this.errors = [];
  }

  async importUniversities(universities) {
    console.log(`📚 Importing ${universities.length} universities...`);
    
    try {
      // Prepare university data for Supabase
      const universityData = universities.map(uni => ({
        name: uni.name,
        country: uni.country,
        website: uni.website,
        country_code: uni.country_code,
        state: uni.state
      }));

      // Insert universities in batches
      const batchSize = 50;
      for (let i = 0; i < universityData.length; i += batchSize) {
        const batch = universityData.slice(i, i + batchSize);
        
        const { data, error } = await supabase
          .from('universities')
          .upsert(batch, { 
            onConflict: 'name',
            ignoreDuplicates: false 
          });

        if (error) {
          console.error(`Error importing universities batch ${i / batchSize + 1}:`, error);
          this.errors.push(`Universities batch ${i / batchSize + 1}: ${error.message}`);
        } else {
          this.importedUniversities += batch.length;
          console.log(`✅ Imported universities batch ${i / batchSize + 1}`);
        }
      }

    } catch (error) {
      console.error('Error importing universities:', error);
      this.errors.push(`Universities import: ${error.message}`);
    }
  }

  async importPrograms(programs) {
    console.log(`📖 Importing ${programs.length} programs...`);
    
    try {
      // Note: You'll need to create a programs table in Supabase first
      // This is just an example structure
      const programData = programs.map(prog => ({
        name: prog.name,
        university_name: prog.university,
        location: prog.location,
        credits: prog.credits,
        application_code: prog.application_code,
        level: prog.level,
        language: prog.language,
        application_period: prog.application_period,
        start_date: prog.start_date,
        pace_of_study: prog.pace_of_study,
        subject_areas: prog.subject_areas, // JSON array
        program_link: prog.program_link,
        first_tuition: prog.first_tuition,
        total_tuition: prog.total_tuition,
        teaching_form: prog.teaching_form || null,
        instructional_time: prog.instructional_time || null
      }));

      // Insert programs in batches
      const batchSize = 50;
      for (let i = 0; i < programData.length; i += batchSize) {
        const batch = programData.slice(i, i + batchSize);
        
        // Note: Uncomment this when you have a programs table
        /*
        const { data, error } = await supabase
          .from('programs')
          .upsert(batch, { 
            onConflict: 'application_code',
            ignoreDuplicates: false 
          });

        if (error) {
          console.error(`Error importing programs batch ${i / batchSize + 1}:`, error);
          this.errors.push(`Programs batch ${i / batchSize + 1}: ${error.message}`);
        } else {
          this.importedPrograms += batch.length;
          console.log(`✅ Imported programs batch ${i / batchSize + 1}`);
        }
        */
        
        // For now, just count the programs
        this.importedPrograms += batch.length;
        console.log(`📝 Prepared programs batch ${i / batchSize + 1} (${batch.length} programs)`);
      }

    } catch (error) {
      console.error('Error importing programs:', error);
      this.errors.push(`Programs import: ${error.message}`);
    }
  }

  async import(dataFile = 'parsed-university-programs.json') {
    console.log('🚀 Starting Supabase import...');
    
    try {
      // Read the parsed data
      const dataPath = path.join(process.cwd(), 'scripts', dataFile);
      
      if (!fs.existsSync(dataPath)) {
        console.error(`❌ Data file '${dataFile}' not found at ${dataPath}`);
        console.log('💡 Make sure to run the parser first to generate the data file');
        return;
      }

      const rawData = fs.readFileSync(dataPath, 'utf8');
      const parsedData = JSON.parse(rawData);
      
      console.log('✅ Loaded parsed data');
      console.log(`📊 Found ${parsedData.universities.length} universities and ${parsedData.programs.length} programs`);
      
      // Import universities
      await this.importUniversities(parsedData.universities);
      
      // Import programs (commented out until programs table is created)
      await this.importPrograms(parsedData.programs);
      
      // Display summary
      this.displaySummary();
      
    } catch (error) {
      console.error('❌ Import failed:', error.message);
    }
  }

  displaySummary() {
    console.log('\n📊 IMPORT SUMMARY');
    console.log('=================');
    console.log(`Universities imported: ${this.importedUniversities}`);
    console.log(`Programs prepared: ${this.importedPrograms}`);
    console.log(`Errors: ${this.errors.length}`);
    
    if (this.errors.length > 0) {
      console.log('\n❌ Errors:');
      this.errors.forEach(error => console.log(`  • ${error}`));
    }
    
    console.log('\n💡 Next steps:');
    console.log('1. Check your Supabase universities table');
    console.log('2. Create a programs table if you want to import program data');
    console.log('3. Update your university autocomplete to use the new data');
  }
}

// SQL for creating programs table (run this in Supabase SQL editor)
const programsTableSQL = `
-- Create programs table
CREATE TABLE IF NOT EXISTS public.programs (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  name TEXT,
  university_name TEXT,
  location TEXT,
  credits INTEGER,
  application_code TEXT UNIQUE,
  level TEXT,
  language TEXT,
  application_period TEXT,
  start_date TEXT,
  pace_of_study TEXT,
  subject_areas JSONB,
  program_link TEXT,
  first_tuition INTEGER,
  total_tuition INTEGER,
  teaching_form TEXT,
  instructional_time TEXT,
  CONSTRAINT programs_pkey PRIMARY KEY (id)
);

-- Enable RLS
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access" ON public.programs
FOR SELECT USING (true);
`;

console.log('🗄️  SQL for creating programs table:');
console.log(programsTableSQL);
console.log('\n📝 Copy the above SQL and run it in your Supabase SQL editor to create the programs table.\n');

// Run the importer
const importer = new SupabaseImporter();
importer.import();
