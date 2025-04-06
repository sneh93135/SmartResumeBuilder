require("dotenv").config();
const axios = require("axios");
const fs = require("fs");

const jobTitle = "AI Engineer ";
const jobDescription = `This is a full-time on-site role for an AI Engineer at AGIL f(x) located in Gandhinagar, Gujarat, India. The AI Engineer will be responsible for tasks such as pattern recognition, working with neural networks, software development, and natural language processing (NLP) to develop and implement AI solutions for our clients.

  Qualifications

Pattern Recognition and Neural Networks expertise
Strong background in Computer Science and Software Development
Experience in Natural Language Processing (NLP)
Excellent problem-solving and analytical skills
Knowledge of AI technologies and frameworks
Bachelor's or Master's degree in Computer Science, AI, or related field

`;

async function generateStructuredResume(title, description) {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "google/gemini-pro",
        messages: [
          {
            role: "system",
            content: `You are an expert AI that creates professional resumes in clean structured JSON format. Don't return text. Only return pure JSON format with the following fields:

{
  "name": "string",
  "title": "string",
  "contact": {
    "phone": "string",
    "email": "string",
    "portfolio": "string"
  },
  "summary": "string",
  "skills": {
    "frontend": [],
    "uiux": [],
    "responsive": [],
    "api": [],
    "versionControl": [],
    "collaboration": []
  },
  "experience": [
    {
      "company": "string",
      "location": "string",
      "role": "string",
      "startDate": "string",
      "endDate": "string",
      "responsibilities": []
    }
  ],
  "education": {
    "university": "string",
    "location": "string",
    "degree": "string",
    "graduationDate": "string",
    "relevantCoursework": []
  },
  "projects": [
    {
      "name": "string",
      "description": "string"
    }
  ],
  "certifications": [],
  "references": "string"
}
`
          },
          {
            role: "user",
            content: `Job Title: ${title}\n\nJob Description: ${description}`
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost",
          "X-Title": "ResumeJsonGenerator"
        }
      }
    );

    const aiReply = response.data.choices[0].message.content;

    // Convert to JSON and save
    fs.writeFileSync("resume.json", aiReply, "utf-8");

    console.log("✅ Structured resume saved to resume.json!");
  } catch (err) {
    console.error("❌ Error:", err.response?.data || err.message);
  }
}

generateStructuredResume(jobTitle, jobDescription);
