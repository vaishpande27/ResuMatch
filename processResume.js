const fs = require('fs-extra');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const natural = require('natural');
const cosineSimilarity = require('cosine-similarity');

// Define important keywords (More job-related terms)
const importantKeywords = [
    "JavaScript", "Python", "Java", "Node.js", "React", "Machine Learning", 
    "Deep Learning", "SQL", "MongoDB", "AWS", "Docker", "Kubernetes",
    "Data Science", "TensorFlow", "NLP", "Flask", "Django", "Spring Boot"
];

// Function to Extract Text from Resume
async function extractText(filePath) {
    const fileExt = filePath.split('.').pop();

    if (fileExt === "pdf") {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);
        return data.text;
    } else if (fileExt === "docx") {
        const { value } = await mammoth.extractRawText({ path: filePath });
        return value;
    } else {
        throw new Error("Unsupported file type");
    }
}

// Function to Count Word Frequency
function countWordFrequency(text) {
    const tokenizer = new natural.WordTokenizer();
    const words = tokenizer.tokenize(text.toLowerCase());
    
    return words.reduce((freq, word) => {
        freq[word] = (freq[word] || 0) + 1;
        return freq;
    }, {});
}

// Function to Calculate Score with More Weight
function calculateScore(jobDescription, resumeText) {
    const tokenizer = new natural.WordTokenizer();
    
    const jobTokens = tokenizer.tokenize(jobDescription.toLowerCase());
    const resumeTokens = tokenizer.tokenize(resumeText.toLowerCase());

    const uniqueTokens = Array.from(new Set([...jobTokens, ...resumeTokens]));

    let jobVector = uniqueTokens.map(word => jobTokens.includes(word) ? 1 : 0);
    let resumeVector = uniqueTokens.map(word => resumeTokens.includes(word) ? 1 : 0);

    let score = cosineSimilarity(jobVector, resumeVector) * 100;

    // **Keyword Boosting:** Increase score for matching important keywords
    let matchedKeywords = importantKeywords.filter(word => resumeText.toLowerCase().includes(word.toLowerCase()));
    let boost = matchedKeywords.length * 5; // Increase 5% per matching keyword

    // **Word Frequency Bonus:** Increase score based on keyword frequency in the resume
    const resumeWordFreq = countWordFrequency(resumeText);
    matchedKeywords.forEach(word => {
        if (resumeWordFreq[word.toLowerCase()]) {
            boost += resumeWordFreq[word.toLowerCase()] * 0.5; // Increase 0.5% per repeated match
        }
    });

    // **Job Title Weight:** If job title is in the resume, give extra 10%
    let jobTitleWords = jobTokens.slice(0, 5); // Assume first few words are job titles
    let titleMatch = jobTitleWords.filter(word => resumeText.toLowerCase().includes(word.toLowerCase()));
    if (titleMatch.length > 0) {
        boost += 10;
    }

    score += boost;

    return Math.min(score.toFixed(2), 100); // Ensure score does not exceed 100%
}

// Main Function to Extract Text & Calculate Score
async function processResume(jobDescription, filePath) {
    try {
        const resumeText = await extractText(filePath);
        return calculateScore(jobDescription, resumeText);
    } catch (error) {
        console.error("Error processing resume:", error);
        return "Error processing resume";
    }
}

module.exports = processResume;
