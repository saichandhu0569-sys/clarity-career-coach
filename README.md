# Resume Analyzer - AI-Powered Resume Analysis Tool

![Resume Analyzer](src/assets/resume-analyzer-hero.jpg)

A modern, full-stack web application that analyzes resumes using AI to provide detailed insights, ratings, and improvement suggestions. Built with React, TypeScript, and designed to integrate with a Node.js backend using Google Gemini LLM.

## 🌟 Features

### 📄 Live Resume Analysis (Tab 1)
- **Drag & Drop PDF Upload**: Intuitive file upload with visual feedback
- **AI-Powered Analysis**: Extracts structured data using Google Gemini LLM
- **Comprehensive Data Extraction**:
  - Personal Details (Name, Email, Phone, LinkedIn, Portfolio)
  - Work Experience with detailed descriptions
  - Education history
  - Technical and Soft Skills categorization
  - Projects and Certifications
- **AI-Generated Insights**:
  - Resume rating (1-10 scale)
  - Specific improvement areas
  - Personalized upskilling suggestions
- **Beautiful Results Display**: Clean, organized UI with progress indicators

### 📊 Historical Viewer (Tab 2)
- **Resume History Table**: View all previously analyzed resumes
- **Detailed Modal View**: Click "Details" to see full analysis
- **Smart Data Display**: Shows key metrics and timestamps
- **Responsive Design**: Works perfectly on all device sizes

## 🚀 Live Demo

This is the **frontend implementation** ready for backend integration. The app currently shows mock data to demonstrate the full UI/UX experience.

## 🛠 Technology Stack

### Frontend (Implemented)
- **React 18** with TypeScript
- **Tailwind CSS** with custom design system
- **Shadcn/UI** components
- **React Router** for navigation
- **React Dropzone** for file uploads
- **Lucide React** for icons

### Backend (Integration Ready)
- **Node.js** with Express.js
- **PostgreSQL** database
- **Google Gemini LLM** integration
- **PDF parsing** with pdf-parse
- **Multer** for file uploads

## 🎨 Design System

The application features a modern, professional design system with:
- **Purple gradient theme** with elegant shadows
- **Semantic color tokens** for consistent theming
- **Smooth animations** and transitions
- **Responsive layouts** for all screen sizes
- **Dark/Light mode support** built-in

## 📦 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd resume-analyzer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:8080
   ```

## 🔗 Backend Integration

### API Endpoints Required

The frontend expects these endpoints from your Node.js backend:

#### 1. Upload & Analyze Resume
```http
POST /api/resumes/upload
Content-Type: multipart/form-data

# Body: PDF file in 'resume' field
# Response: ResumeData JSON object
```

#### 2. Get All Resumes
```http
GET /api/resumes
# Response: Array of ResumeData objects
```

#### 3. Get Specific Resume
```http
GET /api/resumes/:id
# Response: Single ResumeData object
```

### Google Gemini Integration

Your backend should use this API key for Google Gemini:
```
AIzaSyCMfxt1QEWTn925MzvjeP_lj2yhGyRFEdM
```

### Database Schema

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

### Sample Backend Implementation

```javascript
// Backend route example
app.post('/api/resumes/upload', upload.single('resume'), async (req, res) => {
  try {
    const pdfText = await extractTextFromPDF(req.file.buffer);
    const analysis = await analyzeWithGemini(pdfText);
    const savedResume = await saveToDatabase(analysis);
    res.json(savedResume);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## 🎯 Current Implementation Status

### ✅ Completed Features
- [x] Complete React frontend with TypeScript
- [x] Professional UI/UX design
- [x] File upload with drag & drop
- [x] Two-tab navigation (Analysis + History)
- [x] Detailed resume display components
- [x] Historical data table with modal
- [x] Responsive design system
- [x] Mock data integration
- [x] Progress indicators and loading states
- [x] Error handling UI

### 🔄 Backend Integration Needed
- [ ] Node.js/Express server setup
- [ ] PostgreSQL database configuration
- [ ] Google Gemini LLM integration
- [ ] PDF parsing implementation
- [ ] REST API endpoints
- [ ] File upload handling
- [ ] Data persistence

## 📱 Screenshots

The application includes these main views:
1. **Upload Interface**: Drag & drop PDF upload with progress
2. **Analysis Results**: Comprehensive resume breakdown
3. **History Table**: List of all analyzed resumes
4. **Details Modal**: Full resume analysis popup

## 🚀 Deployment

### Frontend Deployment
The React app can be deployed to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static hosting service

### Backend Deployment
Deploy your Node.js backend to:
- Heroku
- AWS EC2/Lambda
- DigitalOcean
- Railway

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn/UI](https://ui.shadcn.com/)
- [Google Gemini API](https://ai.google.dev/)

## 📞 Support

For questions or support, please open an issue in the GitHub repository.

---

**Note**: This frontend is production-ready and designed to integrate seamlessly with the Node.js backend described in the assignment. The mock data demonstrates all features and can be easily replaced with real API calls.