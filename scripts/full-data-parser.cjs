const fs = require('fs');
const path = require('path');

/**
 * Comprehensive University and Program Data Parser
 * 
 * This script parses scraped data from universityadmissions.se and extracts:
 * 1. Universities with basic information
 * 2. Programs with detailed information including tuition, dates, etc.
 * 
 * Usage:
 * 1. Save your scraped JSON data as 'scraped-data.json' in the same directory
 * 2. Run: node full-data-parser.cjs
 */

class ComprehensiveDataParser {
  constructor() {
    this.universities = new Map(); // Use Map to store unique universities with details
    this.programs = [];
    this.errors = [];
  }

  // Utility function to clean HTML and extract text
  cleanText(html) {
    if (!html) return '';
    return html
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/&nbsp;/g, ' ') // Replace &nbsp;
      .trim();
  }

  // Extract numeric value from text (handles Swedish number format)
  extractNumber(text) {
    if (!text) return null;
    const match = text.match(/(\d+(?:[\s,]\d+)*)/);
    return match ? parseInt(match[1].replace(/[\s,]/g, '')) : null;
  }

  // Parse subject areas into clean array
  parseSubjectAreas(text) {
    if (!text) return [];
    return text
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .filter((item, index, arr) => arr.indexOf(item) === index); // Remove duplicates
  }

  // Extract application period with better parsing
  parseApplicationPeriod(text) {
    if (!text) return null;
    
    const cleanedText = this.cleanText(text);
    
    if (cleanedText.toLowerCase().includes('not open')) {
      return 'Application period not open';
    }
    
    // Handle various date formats
    const datePattern = /(\d+\s+\w+)\s*[-–]\s*(\d+\s+\w+)/;
    const match = cleanedText.match(datePattern);
    
    return match ? `${match[1]} - ${match[2]}` : cleanedText;
  }

  // Extract program data from HTML content
  extractProgramData(htmlContent) {
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
      total_tuition: null,
      teaching_form: '',
      instructional_time: ''
    };

    try {
      // Extract program name from headline4
      const nameMatch = htmlContent.match(/<h3[^>]*class="headline4"[^>]*>([^<]+)</);
      if (nameMatch) {
        program.name = this.cleanText(nameMatch[1]);
      }

      // Extract credits, university, and location from the info line
      const infoPattern = /(\d+)\s*Credits,\s*([^,]+),\s*Location:\s*([^\n<]+)/;
      const infoMatch = htmlContent.match(infoPattern);
      if (infoMatch) {
        program.credits = parseInt(infoMatch[1]);
        program.university = this.cleanText(infoMatch[2]);
        program.location = this.cleanText(infoMatch[3]);
        
        // Add university to our collection
        if (!this.universities.has(program.university)) {
          this.universities.set(program.university, {
            name: program.university,
            country: "Sweden",
            website: null,
            country_code: "SE",
            state: null
          });
        }
      }

      // Extract structured data using subtitle patterns
      const fieldMappings = {
        'Application code': 'application_code',
        'Level': 'level',
        'Language of instruction': 'language',
        'Period': 'start_date',
        'Pace of study': 'pace_of_study',
        'Teaching form': 'teaching_form',
        'Instructional time': 'instructional_time'
      };

      Object.entries(fieldMappings).forEach(([label, field]) => {
        const pattern = new RegExp(`<span[^>]*class="subtitle"[^>]*>${label}:<\\/span>\\s*([^<\\n]+)`, 'i');
        const match = htmlContent.match(pattern);
        if (match) {
          program[field] = this.cleanText(match[1]);
        }
      });

      // Extract application period with special handling
      const periodMatch = htmlContent.match(/Application period\s*([^<\n]+)/);
      if (periodMatch) {
        program.application_period = this.parseApplicationPeriod(periodMatch[1]);
      }

      // Extract subject areas
      const subjectMatch = htmlContent.match(/<span[^>]*class="subtitle"[^>]*>Subject Areas:<\/span>\s*([^<\n]+)/);
      if (subjectMatch) {
        program.subject_areas = this.parseSubjectAreas(subjectMatch[1]);
      }

      // Extract program link
      const linkMatch = htmlContent.match(/<a[^>]*href="([^"]+)"[^>]*class="external"/);
      if (linkMatch) {
        program.program_link = linkMatch[1];
      }

      // Extract tuition fees with better error handling
      const firstTuitionMatch = htmlContent.match(/First tuition fee instalment:\s*([^\n<]+)/);
      if (firstTuitionMatch) {
        program.first_tuition = this.extractNumber(firstTuitionMatch[1]);
      }

      const totalTuitionMatch = htmlContent.match(/Total tuition fee:\s*([^\n<]+)/);
      if (totalTuitionMatch) {
        program.total_tuition = this.extractNumber(totalTuitionMatch[1]);
      }

    } catch (error) {
      this.errors.push(`Error parsing program: ${error.message}`);
    }

    return program;
  }

  // Recursively search through data structure for program cards
  findProgramCards(data, path = '') {
    const cards = [];

    if (Array.isArray(data)) {
      data.forEach((item, index) => {
        cards.push(...this.findProgramCards(item, `${path}[${index}]`));
      });
    } else if (typeof data === 'object' && data !== null) {
      // Check if this element contains a program card
      if (data.html && data.html.includes('searchresultcard')) {
        cards.push(data);
      }
      
      // Check if this element has the class searchresultcard
      if (data.attributes && data.attributes.class && 
          data.attributes.class.includes('searchresultcard')) {
        cards.push(data);
      }

      // Recursively search all properties
      Object.keys(data).forEach(key => {
        if (key !== 'html') { // Avoid re-parsing HTML content
          cards.push(...this.findProgramCards(data[key], `${path}.${key}`));
        }
      });
    }

    return cards;
  }

  // Main parsing function
  parseData(scrapedData) {
    console.log('🔍 Searching for program data...');
    
    // Find all program cards in the data structure
    const programCards = this.findProgramCards(scrapedData);
    console.log(`Found ${programCards.length} potential program cards`);

    let successfulParses = 0;

    programCards.forEach((card, index) => {
      const htmlContent = card.html || '';
      
      if (htmlContent.includes('headline4')) {
        const program = this.extractProgramData(htmlContent);
        
        // Only add programs with essential data
        if (program.name && program.university) {
          this.programs.push({
            id: successfulParses + 1,
            ...program
          });
          successfulParses++;
        }
      }
    });

    console.log(`✅ Successfully parsed ${successfulParses} programs`);
    
    if (this.errors.length > 0) {
      console.log(`⚠️  ${this.errors.length} parsing errors occurred`);
    }
  }

  // Generate final structured output
  generateOutput() {
    const universitiesArray = Array.from(this.universities.values())
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((uni, index) => ({
        id: index + 1,
        ...uni
      }));

    return {
      metadata: {
        scraped_date: new Date().toISOString(),
        total_universities: universitiesArray.length,
        total_programs: this.programs.length,
        source: "universityadmissions.se",
        parser_version: "4.0",
        parsing_errors: this.errors.length
      },
      universities: universitiesArray,
      programs: this.programs
    };
  }

  // Main execution function
  parse(inputFile = 'scraped-data.json') {
    console.log('🚀 Starting comprehensive data parsing...');
    
    try {
      // Try to read the input file
      const inputPath = path.join(__dirname, inputFile);
      
      if (!fs.existsSync(inputPath)) {
        console.log(`❌ Input file '${inputFile}' not found.`);
        console.log('📝 Creating sample structure for reference...');
        
        // Create a sample structure
        this.createSampleOutput();
        return;
      }

      const rawData = fs.readFileSync(inputPath, 'utf8');
      const scrapedData = JSON.parse(rawData);
      
      console.log('✅ Successfully loaded scraped data');
      
      // Parse the data
      this.parseData(scrapedData);
      
      // Generate output
      const output = this.generateOutput();
      
      // Save results
      const outputPath = path.join(__dirname, 'parsed-university-programs.json');
      fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
      
      console.log(`💾 Results saved to: ${outputPath}`);
      
      // Display summary
      this.displaySummary(output);
      
      return output;
      
    } catch (error) {
      console.error('❌ Error during parsing:', error.message);
      this.createSampleOutput();
    }
  }

  // Create sample output for reference
  createSampleOutput() {
    const sampleOutput = {
      metadata: {
        scraped_date: new Date().toISOString(),
        total_universities: 0,
        total_programs: 0,
        source: "universityadmissions.se",
        parser_version: "4.0",
        note: "Sample structure - replace with actual parsed data"
      },
      universities: [
        {
          id: 1,
          name: "University Name",
          country: "Sweden",
          website: null,
          country_code: "SE",
          state: null
        }
      ],
      programs: [
        {
          id: 1,
          name: "Program Name",
          university: "University Name",
          location: "City",
          credits: 120,
          application_code: "UNI-12345",
          level: "Master's",
          language: "English",
          application_period: "16 Oct - 15 Jan",
          start_date: "Autumn 2026 Period 1",
          pace_of_study: "Full-time",
          subject_areas: ["Subject 1", "Subject 2"],
          program_link: "https://university.edu/program",
          first_tuition: 85000,
          total_tuition: 340000,
          teaching_form: "Programme, On-campus",
          instructional_time: "Daytime"
        }
      ]
    };

    const samplePath = path.join(__dirname, 'sample-output-structure.json');
    fs.writeFileSync(samplePath, JSON.stringify(sampleOutput, null, 2));
    console.log(`📋 Sample output structure saved to: ${samplePath}`);
  }

  // Display parsing summary
  displaySummary(output) {
    console.log('\n📊 PARSING SUMMARY');
    console.log('==================');
    console.log(`Universities: ${output.universities.length}`);
    console.log(`Programs: ${output.programs.length}`);
    console.log(`Parsing errors: ${this.errors.length}`);
    
    if (output.universities.length > 0) {
      console.log('\n🏫 Universities found:');
      output.universities.slice(0, 10).forEach(uni => {
        console.log(`  • ${uni.name}`);
      });
      if (output.universities.length > 10) {
        console.log(`  ... and ${output.universities.length - 10} more`);
      }
    }
    
    if (output.programs.length > 0) {
      console.log('\n📚 Sample programs:');
      output.programs.slice(0, 3).forEach(prog => {
        console.log(`\n  • ${prog.name}`);
        console.log(`    University: ${prog.university}`);
        console.log(`    Level: ${prog.level}, Credits: ${prog.credits}`);
        console.log(`    Subject Areas: ${prog.subject_areas.join(', ')}`);
      });
    }
  }
}

// Usage instructions
console.log(`
📖 USAGE INSTRUCTIONS
====================

1. Save your scraped JSON data as 'scraped-data.json' in this directory
2. Run: node full-data-parser.cjs
3. The parsed data will be saved as 'parsed-university-programs.json'

Expected input format: JSON object with nested structure containing HTML elements
Output format: Structured JSON with universities and programs arrays

`);

// Execute the parser
const parser = new ComprehensiveDataParser();
parser.parse();
