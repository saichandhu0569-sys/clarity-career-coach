# Backend Setup Guide for Resume Analyzer

## Quick Start

### 1. Create Backend Directory
```bash
mkdir backend
cd backend
npm init -y
```

### 2. Install Dependencies
```bash
npm install express pg multer pdf-parse @google/generative-ai dotenv cors
npm install -D nodemon @types/node
```

### 3. Create Environment File (.env)
```env
PORT=3001
DB_USER=your_postgres_user
DB_HOST=localhost
DB_DATABASE=resume_analyzer
DB_PASSWORD=your_postgres_password
DB_PORT=5432
GOOGLE_API_KEY=AIzaSyCMfxt1QEWTn925MzvjeP_lj2yhGyRFEdM
```

### 4. Sample Server Code (server.js)
```javascript
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Configure PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Configure Google Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Middleware
app.use(cors({
  origin: 'http://localhost:8080', // Your frontend URL
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'Resume Analyzer Backend is running' 
  });
});

// Upload and analyze resume
app.post('/api/resumes/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Extract text from PDF
    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;

    // Analyze with Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `
      You are an expert technical recruiter and career coach. Analyze the following resume text and extract the information into a valid JSON object. The JSON object must conform to the following structure, and all fields must be populated. Do not include any text or markdown formatting before or after the JSON object.

      Resume Text:
      """
      ${resumeText}
      """

      JSON Structure:
      {
        "name": "string | null",
        "email": "string | null", 
        "phone": "string | null",
        "linkedin_url": "string | null",
        "portfolio_url": "string | null",
        "summary": "string | null",
        "work_experience": [{ "role": "string", "company": "string", "duration": "string", "description": ["string"] }],
        "education": [{ "degree": "string", "institution": "string", "graduation_year": "string" }],
        "technical_skills": ["string"],
        "soft_skills": ["string"],
        "projects": [{ "name": "string", "description": "string", "technologies": ["string"] }],
        "certifications": [{ "name": "string", "issuer": "string", "date": "string" }],
        "resume_rating": "number (1-10)",
        "improvement_areas": "string",
        "upskill_suggestions": ["string"]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysisText = response.text();
    
    // Parse JSON response
    let analysisData;
    try {
      analysisData = JSON.parse(analysisText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return res.status(500).json({ error: 'Failed to parse AI response' });
    }

    // Save to database
    const query = `
      INSERT INTO resumes (
        file_name, name, email, phone, linkedin_url, portfolio_url, summary,
        work_experience, education, technical_skills, soft_skills, projects,
        certifications, resume_rating, improvement_areas, upskill_suggestions
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *
    `;

    const values = [
      req.file.originalname,
      analysisData.name,
      analysisData.email,
      analysisData.phone,
      analysisData.linkedin_url,
      analysisData.portfolio_url,
      analysisData.summary,
      JSON.stringify(analysisData.work_experience),
      JSON.stringify(analysisData.education),
      JSON.stringify(analysisData.technical_skills),
      JSON.stringify(analysisData.soft_skills),
      JSON.stringify(analysisData.projects),
      JSON.stringify(analysisData.certifications),
      analysisData.resume_rating,
      analysisData.improvement_areas,
      JSON.stringify(analysisData.upskill_suggestions)
    ];

    const dbResult = await pool.query(query, values);
    const savedResume = dbResult.rows[0];

    // Format response to match frontend interface
    const formattedResponse = {
      ...savedResume,
      work_experience: JSON.parse(savedResume.work_experience || '[]'),
      education: JSON.parse(savedResume.education || '[]'),
      technical_skills: JSON.parse(savedResume.technical_skills || '[]'),
      soft_skills: JSON.parse(savedResume.soft_skills || '[]'),
      projects: JSON.parse(savedResume.projects || '[]'),
      certifications: JSON.parse(savedResume.certifications || '[]'),
      upskill_suggestions: JSON.parse(savedResume.upskill_suggestions || '[]')
    };

    res.json(formattedResponse);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all resumes
app.get('/api/resumes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM resumes ORDER BY uploaded_at DESC');
    
    const formattedResumes = result.rows.map(resume => ({
      ...resume,
      work_experience: JSON.parse(resume.work_experience || '[]'),
      education: JSON.parse(resume.education || '[]'),
      technical_skills: JSON.parse(resume.technical_skills || '[]'),
      soft_skills: JSON.parse(resume.soft_skills || '[]'),
      projects: JSON.parse(resume.projects || '[]'),
      certifications: JSON.parse(resume.certifications || '[]'),
      upskill_suggestions: JSON.parse(resume.upskill_suggestions || '[]')
    }));

    res.json(formattedResumes);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get specific resume
app.get('/api/resumes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM resumes WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    const resume = result.rows[0];
    const formattedResume = {
      ...resume,
      work_experience: JSON.parse(resume.work_experience || '[]'),
      education: JSON.parse(resume.education || '[]'),
      technical_skills: JSON.parse(resume.technical_skills || '[]'),
      soft_skills: JSON.parse(resume.soft_skills || '[]'),
      projects: JSON.parse(resume.projects || '[]'),
      certifications: JSON.parse(resume.certifications || '[]'),
      upskill_suggestions: JSON.parse(resume.upskill_suggestions || '[]')
    };

    res.json(formattedResume);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### 5. Database Schema (database.sql)
```sql
CREATE TABLE resumes (
    id SERIAL PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    linkedin_url VARCHAR(255),
    portfolio_url VARCHAR(255),
    summary TEXT,
    work_experience JSONB,
    education JSONB,
    technical_skills JSONB,
    soft_skills JSONB,
    projects JSONB,
    certifications JSONB,
    resume_rating INTEGER,
    improvement_areas TEXT,
    upskill_suggestions JSONB
);
```

### 6. Package.json Scripts
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### 7. Start the Server
```bash
npm run dev
```

## Frontend Integration

The frontend is already configured to connect to your backend at `http://localhost:3001`. Once your backend is running:

1. The status indicator will show "Connected"
2. Real PDF analysis will be enabled
3. Historical data will load from your database
4. Toast notifications will confirm successful operations

## Testing

1. Start PostgreSQL database
2. Create the database table using the schema above
3. Start your backend server (`npm run dev`)
4. The frontend will automatically detect the connection
5. Upload a PDF to test the full flow

## Production Deployment

- Set environment variables for production
- Use a production PostgreSQL database
- Configure CORS for your production frontend URL
- Add proper error handling and logging
- Consider rate limiting and authentication