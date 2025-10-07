const fs = require('fs');
const path = require('path');

// Sample scraped data structure based on what you provided
const sampleData = {
  "status": 200,
  "success": true,
  "message": "⚠ Check Terms of Service before scraping: https://www.universityadmissions.se/en/about-this-website/photos-and-files/",
  "value": {
    "body": {
      "data": [
        // This would contain the actual scraped HTML elements
      ]
    }
  }
};

class UniversityDataExtractor {
  constructor() {
    this.universities = new Set();
    this.programs = [];
  }

  // Clean HTML and extract text
  cleanText(html) {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  }

  // Extract numeric value from text
  extractNumber(text) {
    if (!text) return null;
    const match = text.match(/(\d+(?:,\d+)*)/);
    return match ? parseInt(match[1].replace(/,/g, '')) : null;
  }

  // Parse subject areas into array
  parseSubjectAreas(text) {
    if (!text) return [];
    return text.split(',').map(s => s.trim()).filter(s => s.length > 0);
  }

  // Extract data from the HTML content you provided
  extractFromHtmlContent(htmlContent) {
    const programs = [];
    
    // Split by program cards - look for the pattern that indicates a new program
    const programSections = htmlContent.split(/(?=<h3[^>]*class="headline4")/);
    
    programSections.forEach((section, index) => {
      if (!section.includes('headline4')) return;
      
      const program = {
        name: '',
        university: '',
        location: '',
        credits: null,
        application_code: '',
        level: '',
        language: '',
        application_period: '',
        start_date: '',
        pace_of_study: '',
        subject_areas: [],
        program_link: '',
        first_tuition: null,
        total_tuition: null
      };

      // Extract program name
      const nameMatch = section.match(/<h3[^>]*class="headline4"[^>]*>([^<]+)</);
      if (nameMatch) {
        program.name = this.cleanText(nameMatch[1]);
      }

      // Extract credits, university, and location
      const infoMatch = section.match(/(\d+)\s*Credits,\s*([^,]+),\s*Location:\s*([^\n<]+)/);
      if (infoMatch) {
        program.credits = parseInt(infoMatch[1]);
        program.university = this.cleanText(infoMatch[2]);
        program.location = this.cleanText(infoMatch[3]);
        this.universities.add(program.university);
      }

      // Extract application code
      const codeMatch = section.match(/Application code:<\/span>\s*([^<\n]+)/);
      if (codeMatch) {
        program.application_code = this.cleanText(codeMatch[1]);
      }

      // Extract level
      const levelMatch = section.match(/Level:<\/span>\s*([^<\n]+)/);
      if (levelMatch) {
        program.level = this.cleanText(levelMatch[1]);
      }

      // Extract language
      const langMatch = section.match(/Language of instruction:<\/span>\s*([^<\n]+)/);
      if (langMatch) {
        program.language = this.cleanText(langMatch[1]);
      }

      // Extract period/start date
      const periodMatch = section.match(/Period:<\/span>\s*([^<\n]+)/);
      if (periodMatch) {
        program.start_date = this.cleanText(periodMatch[1]);
      }

      // Extract pace of study
      const paceMatch = section.match(/Pace of study:<\/span>\s*([^<\n]+)/);
      if (paceMatch) {
        program.pace_of_study = this.cleanText(paceMatch[1]);
      }

      // Extract application period
      const appPeriodMatch = section.match(/Application period\s*([^<\n]+)/);
      if (appPeriodMatch) {
        const periodText = this.cleanText(appPeriodMatch[1]);
        program.application_period = periodText.includes('not open') ? 'Application period not open' : periodText;
      }

      // Extract subject areas
      const subjectMatch = section.match(/Subject Areas:<\/span>\s*([^<\n]+)/);
      if (subjectMatch) {
        program.subject_areas = this.parseSubjectAreas(subjectMatch[1]);
      }

      // Extract program link
      const linkMatch = section.match(/href="([^"]+)"[^>]*class="external"/);
      if (linkMatch) {
        program.program_link = linkMatch[1];
      }

      // Extract tuition fees
      const firstTuitionMatch = section.match(/First tuition fee instalment:\s*([^\n<]+)/);
      if (firstTuitionMatch) {
        program.first_tuition = this.extractNumber(firstTuitionMatch[1]);
      }

      const totalTuitionMatch = section.match(/Total tuition fee:\s*([^\n<]+)/);
      if (totalTuitionMatch) {
        program.total_tuition = this.extractNumber(totalTuitionMatch[1]);
      }

      // Only add if we have essential data
      if (program.name && program.university) {
        programs.push(program);
      }
    });

    return programs;
  }

  // Process the sample data from your scraping
  processSampleData() {
    // Based on the content you showed, here are some example programs
    const samplePrograms = [
      {
        name: "Adult Learning and Global Change, Master's Programme, Distance",
        university: "Linköping University",
        location: "Linköping",
        credits: 60,
        application_code: "LIU-91200",
        level: "Master's",
        language: "English",
        application_period: "16 Oct - 15 Jan",
        start_date: "Autumn 2026 Period 1",
        pace_of_study: "Half-time",
        subject_areas: ["Education", "Education/Educational Sciences/Didactics", "Educational Sciences/Didactics"],
        program_link: "https://liu.se/en/education/program/l7mlg",
        first_tuition: 54800,
        total_tuition: 109600
      },
      {
        name: "Aeronautical Engineering, Master's Programme",
        university: "Linköping University",
        location: "Linköping",
        credits: 120,
        application_code: "LIU-91125",
        level: "Master's",
        language: "English",
        application_period: "16 Oct - 15 Jan",
        start_date: "Autumn 2026 Period 1",
        pace_of_study: "Full-time",
        subject_areas: ["Materials, Construction and Manufacturing", "Mechanical Engineering", "Technology", "Vehicle Engineering"],
        program_link: "https://liu.se/en/education/program/6maer",
        first_tuition: 83000,
        total_tuition: 332000
      },
      {
        name: "Agricultural Economics and Management - Master's Programme",
        university: "Swedish University of Agricultural Sciences",
        location: "Uppsala",
        credits: 120,
        application_code: "SLU-81071",
        level: "Master's",
        language: "English",
        application_period: "16 Oct - 15 Jan",
        start_date: "Autumn 2026 Period 1",
        pace_of_study: "Full-time",
        subject_areas: ["Business Administration", "Economics", "Industrial Economics", "Organisation and Management", "Leadership", "Organisation and Management", "Marketing"],
        program_link: "https://www.slu.se/en/education/programmes-courses/course/fb7c8b63-51bc-11f0-9455-252115c64b6d",
        first_tuition: 65000,
        total_tuition: 260000
      },
      {
        name: "AI Engineering (master)",
        university: "Jönköping University",
        location: "Jönköping",
        credits: 120,
        application_code: "HJ-MU126",
        level: "Master's",
        language: "English",
        application_period: "16 Oct - 15 Jan",
        start_date: "Autumn 2026 Period 1",
        pace_of_study: "Full-time",
        subject_areas: ["Computer Science", "Computer Technology", "Information Technology"],
        program_link: "http://ju.se/en/study-at-ju/our-programmes/master-programmes/ai-engineering-master-autumn-2026-mu126.html",
        first_tuition: 85000,
        total_tuition: 340000
      }
    ];

    // Add universities from sample programs
    samplePrograms.forEach(program => {
      this.universities.add(program.university);
    });

    this.programs = samplePrograms.map((program, index) => ({
      id: index + 1,
      ...program
    }));
  }

  // Generate the final JSON output
  generateOutput() {
    const universitiesArray = Array.from(this.universities).sort().map((name, index) => ({
      id: index + 1,
      name: name,
      country: "Sweden",
      website: null,
      country_code: "SE",
      state: null
    }));

    return {
      metadata: {
        scraped_date: new Date().toISOString(),
        total_universities: universitiesArray.length,
        total_programs: this.programs.length,
        source: "universityadmissions.se",
        parser_version: "3.0",
        note: "Sample data extracted from provided HTML content"
      },
      universities: universitiesArray,
      programs: this.programs
    };
  }

  // Main extraction function
  extract() {
    console.log('🚀 Starting university data extraction...');
    
    // Process the sample data
    this.processSampleData();
    
    const output = this.generateOutput();
    
    // Save to file
    const outputPath = path.join(__dirname, 'university-programs-extracted.json');
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
    console.log('✅ Data saved to university-programs-extracted.json');
    
    // Display statistics
    console.log('\n📊 Extraction Statistics:');
    console.log(`Universities found: ${output.universities.length}`);
    console.log(`Programs found: ${output.programs.length}`);
    
    // Show sample data
    console.log('\n🏫 Universities:');
    output.universities.forEach(uni => console.log(`- ${uni.name}`));
    
    console.log('\n📚 Sample Programs:');
    output.programs.slice(0, 2).forEach(prog => {
      console.log(`\n- ${prog.name}`);
      console.log(`  University: ${prog.university}`);
      console.log(`  Level: ${prog.level}, Credits: ${prog.credits}`);
      console.log(`  Location: ${prog.location}`);
      console.log(`  Application Code: ${prog.application_code}`);
      console.log(`  Subject Areas: ${prog.subject_areas.join(', ')}`);
      console.log(`  Tuition: ${prog.first_tuition} SEK (first) / ${prog.total_tuition} SEK (total)`);
    });

    return output;
  }
}

// Instructions for using with your actual scraped data
console.log(`
📋 INSTRUCTIONS FOR USING WITH YOUR SCRAPED DATA:

1. Save your scraped JSON data to a file (e.g., 'scraped-data.json')
2. Modify this script to read from that file:
   const scrapedData = JSON.parse(fs.readFileSync('scraped-data.json', 'utf8'));
3. Update the processSampleData() method to parse your actual HTML content
4. Run the script to extract structured data

For now, running with sample data extracted from your provided content...
`);

// Run the extractor
const extractor = new UniversityDataExtractor();
const result = extractor.extract();
