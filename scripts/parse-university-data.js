const fs = require('fs');

// Read the scraped data
const scrapedData = JSON.parse(fs.readFileSync('/Untitled-1', 'utf8'));

function extractUniversitiesAndPrograms(data) {
  const universities = new Set();
  const programs = [];
  
  // Function to clean and extract text content
  function extractText(html) {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').trim();
  }
  
  // Function to parse subject areas into array
  function parseSubjectAreas(subjectText) {
    if (!subjectText) return [];
    return subjectText.split(',').map(s => s.trim()).filter(s => s.length > 0);
  }
  
  // Function to extract numeric value from tuition text
  function extractTuition(tuitionText) {
    if (!tuitionText) return null;
    const match = tuitionText.match(/(\d+(?:,\d+)*)\s*SEK/);
    return match ? parseInt(match[1].replace(/,/g, '')) : null;
  }
  
  // Function to extract credits
  function extractCredits(creditText) {
    if (!creditText) return null;
    const match = creditText.match(/(\d+)\s*Credits/);
    return match ? parseInt(match[1]) : null;
  }
  
  // Function to extract application period
  function extractApplicationPeriod(periodText) {
    if (!periodText) return null;
    if (periodText.includes('not open')) return 'Application period not open';
    const match = periodText.match(/(\d+\s+\w+)\s*-\s*(\d+\s+\w+)/);
    return match ? `${match[1]} - ${match[2]}` : periodText.trim();
  }
  
  // Parse the HTML structure to find program cards
  function parsePrograms(elements) {
    if (!elements || !Array.isArray(elements)) return;
    
    elements.forEach(element => {
      if (element.attributes && element.attributes.class === 'searchresultcard') {
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
        
        // Extract program details from the HTML content
        const htmlContent = element.html || '';
        
        // Extract program name (headline4 class)
        const nameMatch = htmlContent.match(/<h3[^>]*class="headline4"[^>]*>([^<]+)</);
        if (nameMatch) {
          program.name = extractText(nameMatch[1]);
        }
        
        // Extract university, credits, and location from the paragraph after headline
        const infoMatch = htmlContent.match(/<h3[^>]*class="headline4"[^>]*>.*?<p[^>]*class="universal_medium"[^>]*>\s*(\d+)\s*Credits,\s*([^,]+),\s*Location:\s*([^<]+)/s);
        if (infoMatch) {
          program.credits = parseInt(infoMatch[1]);
          program.university = extractText(infoMatch[2]);
          program.location = extractText(infoMatch[3]);
          universities.add(program.university);
        }
        
        // Extract application code
        const codeMatch = htmlContent.match(/<span[^>]*class="subtitle"[^>]*>Application code:<\/span>\s*([^<]+)/);
        if (codeMatch) {
          program.application_code = extractText(codeMatch[1]);
        }
        
        // Extract level
        const levelMatch = htmlContent.match(/<span[^>]*class="subtitle"[^>]*>Level:<\/span>\s*([^<]+)/);
        if (levelMatch) {
          program.level = extractText(levelMatch[1]);
        }
        
        // Extract language
        const langMatch = htmlContent.match(/<span[^>]*class="subtitle"[^>]*>Language of instruction:<\/span>\s*([^<]+)/);
        if (langMatch) {
          program.language = extractText(langMatch[1]);
        }
        
        // Extract application period
        const periodMatch = htmlContent.match(/<p>\s*Application period\s*([^<]+)/);
        if (periodMatch) {
          program.application_period = extractApplicationPeriod(extractText(periodMatch[1]));
        }
        
        // Extract start date (Period)
        const startMatch = htmlContent.match(/<span[^>]*class="subtitle"[^>]*>Period:<\/span>\s*([^<]+)/);
        if (startMatch) {
          program.start_date = extractText(startMatch[1]);
        }
        
        // Extract pace of study
        const paceMatch = htmlContent.match(/<span[^>]*class="subtitle"[^>]*>Pace of study:<\/span>\s*([^<]+)/);
        if (paceMatch) {
          program.pace_of_study = extractText(paceMatch[1]);
        }
        
        // Extract subject areas
        const subjectMatch = htmlContent.match(/<span[^>]*class="subtitle"[^>]*>Subject Areas:<\/span>\s*([^<]+)/);
        if (subjectMatch) {
          program.subject_areas = parseSubjectAreas(extractText(subjectMatch[1]));
        }
        
        // Extract program link
        const linkMatch = htmlContent.match(/<a[^>]*href="([^"]+)"[^>]*class="external"[^>]*>/);
        if (linkMatch) {
          program.program_link = linkMatch[1];
        }
        
        // Extract tuition fees
        const firstTuitionMatch = htmlContent.match(/First tuition fee instalment:\s*([^<]+)/);
        if (firstTuitionMatch) {
          program.first_tuition = extractTuition(extractText(firstTuitionMatch[1]));
        }
        
        const totalTuitionMatch = htmlContent.match(/Total tuition fee:\s*([^<]+)/);
        if (totalTuitionMatch) {
          program.total_tuition = extractTuition(extractText(totalTuitionMatch[1]));
        }
        
        // Only add program if it has essential data
        if (program.name && program.university) {
          programs.push(program);
        }
      }
      
      // Recursively parse child elements
      if (element.children) {
        parsePrograms(element.children);
      }
    });
  }
  
  // Start parsing from the body data
  if (data.value && data.value.body && data.value.body.data) {
    parsePrograms(data.value.body.data);
  }
  
  return {
    universities: Array.from(universities).sort(),
    programs: programs
  };
}

// Parse the data
console.log('Parsing university and program data...');
const result = extractUniversitiesAndPrograms(scrapedData);

console.log(`Found ${result.universities.length} universities`);
console.log(`Found ${result.programs.length} programs`);

// Create the final JSON structure
const output = {
  metadata: {
    scraped_date: new Date().toISOString(),
    total_universities: result.universities.length,
    total_programs: result.programs.length,
    source: "universityadmissions.se"
  },
  universities: result.universities.map((name, index) => ({
    id: index + 1,
    name: name,
    country: "Sweden", // All universities from this source are Swedish
    website: null, // Would need additional scraping
    country_code: "SE",
    state: null // Would need additional data
  })),
  programs: result.programs.map((program, index) => ({
    id: index + 1,
    ...program
  }))
};

// Write to file
fs.writeFileSync('university-programs-data.json', JSON.stringify(output, null, 2));
console.log('Data saved to university-programs-data.json');

// Display sample data
console.log('\nSample Universities:');
console.log(result.universities.slice(0, 5));

console.log('\nSample Programs:');
console.log(JSON.stringify(result.programs.slice(0, 2), null, 2));
