const fs = require('fs');

// Read the scraped data
const rawData = fs.readFileSync('/Untitled-1', 'utf8');
const scrapedData = JSON.parse(rawData);

class UniversityProgramParser {
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
  extractNumber(text, pattern = /(\d+(?:,\d+)*)/) {
    if (!text) return null;
    const match = text.match(pattern);
    return match ? parseInt(match[1].replace(/,/g, '')) : null;
  }

  // Parse subject areas into array
  parseSubjectAreas(text) {
    if (!text) return [];
    return text.split(',').map(s => s.trim()).filter(s => s.length > 0);
  }

  // Extract application period
  parseApplicationPeriod(text) {
    if (!text) return null;
    if (text.toLowerCase().includes('not open')) return 'Application period not open';
    const match = text.match(/(\d+\s+\w+)\s*-\s*(\d+\s+\w+)/);
    return match ? `${match[1]} - ${match[2]}` : this.cleanText(text);
  }

  // Find elements by class name recursively
  findElementsByClass(elements, className) {
    const results = [];
    
    function search(items) {
      if (!Array.isArray(items)) return;
      
      items.forEach(item => {
        if (item.attributes && item.attributes.class && 
            item.attributes.class.includes(className)) {
          results.push(item);
        }
        if (item.children) {
          search(item.children);
        }
      });
    }
    
    search(elements);
    return results;
  }

  // Extract program data from HTML content
  extractProgramFromHtml(html) {
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
    const nameMatch = html.match(/<h3[^>]*class="headline4"[^>]*>([^<]+)</);
    if (nameMatch) {
      program.name = this.cleanText(nameMatch[1]);
    }

    // Extract credits, university, and location
    const infoPattern = /(\d+)\s*Credits,\s*([^,]+),\s*Location:\s*([^\n<]+)/;
    const infoMatch = html.match(infoPattern);
    if (infoMatch) {
      program.credits = parseInt(infoMatch[1]);
      program.university = this.cleanText(infoMatch[2]);
      program.location = this.cleanText(infoMatch[3]);
      this.universities.add(program.university);
    }

    // Extract various fields using subtitle pattern
    const fields = {
      'Application code': 'application_code',
      'Level': 'level',
      'Language of instruction': 'language',
      'Period': 'start_date',
      'Pace of study': 'pace_of_study'
    };

    Object.entries(fields).forEach(([label, field]) => {
      const pattern = new RegExp(`<span[^>]*class="subtitle"[^>]*>${label}:<\/span>\\s*([^<]+)`, 'i');
      const match = html.match(pattern);
      if (match) {
        program[field] = this.cleanText(match[1]);
      }
    });

    // Extract application period
    const periodMatch = html.match(/Application period\s*([^<\n]+)/);
    if (periodMatch) {
      program.application_period = this.parseApplicationPeriod(periodMatch[1]);
    }

    // Extract subject areas
    const subjectMatch = html.match(/<span[^>]*class="subtitle"[^>]*>Subject Areas:<\/span>\s*([^<]+)/);
    if (subjectMatch) {
      program.subject_areas = this.parseSubjectAreas(subjectMatch[1]);
    }

    // Extract program link
    const linkMatch = html.match(/<a[^>]*href="([^"]+)"[^>]*class="external"/);
    if (linkMatch) {
      program.program_link = linkMatch[1];
    }

    // Extract tuition fees
    const firstTuitionMatch = html.match(/First tuition fee instalment:\s*([^\n<]+)/);
    if (firstTuitionMatch) {
      program.first_tuition = this.extractNumber(firstTuitionMatch[1]);
    }

    const totalTuitionMatch = html.match(/Total tuition fee:\s*([^\n<]+)/);
    if (totalTuitionMatch) {
      program.total_tuition = this.extractNumber(totalTuitionMatch[1]);
    }

    return program;
  }

  // Parse all programs from the data
  parsePrograms(data) {
    console.log('Starting to parse programs...');
    
    if (!data.value || !data.value.body || !data.value.body.data) {
      console.error('Invalid data structure');
      return;
    }

    // Find all search result cards
    const searchCards = this.findElementsByClass(data.value.body.data, 'searchresultcard');
    console.log(`Found ${searchCards.length} search result cards`);

    searchCards.forEach((card, index) => {
      try {
        const program = this.extractProgramFromHtml(card.html || '');
        
        // Only add if we have essential data
        if (program.name && program.university) {
          this.programs.push({
            id: index + 1,
            ...program
          });
        }
      } catch (error) {
        console.error(`Error parsing program ${index}:`, error.message);
      }
    });

    console.log(`Successfully parsed ${this.programs.length} programs`);
  }

  // Generate final output
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
        parser_version: "2.0"
      },
      universities: universitiesArray,
      programs: this.programs
    };
  }

  // Main parsing function
  parse() {
    console.log('Initializing parser...');
    this.parsePrograms(scrapedData);
    
    const output = this.generateOutput();
    
    // Save to file
    fs.writeFileSync('parsed-university-data.json', JSON.stringify(output, null, 2));
    console.log('✅ Data saved to parsed-university-data.json');
    
    // Display statistics
    console.log('\n📊 Parsing Statistics:');
    console.log(`Universities found: ${output.universities.length}`);
    console.log(`Programs found: ${output.programs.length}`);
    
    // Show sample data
    console.log('\n🏫 Sample Universities:');
    output.universities.slice(0, 5).forEach(uni => console.log(`- ${uni.name}`));
    
    console.log('\n📚 Sample Programs:');
    output.programs.slice(0, 3).forEach(prog => {
      console.log(`- ${prog.name} at ${prog.university}`);
      console.log(`  Level: ${prog.level}, Credits: ${prog.credits}`);
      console.log(`  Subject Areas: ${prog.subject_areas.join(', ')}`);
    });

    return output;
  }
}

// Run the parser
const parser = new UniversityProgramParser();
const result = parser.parse();
