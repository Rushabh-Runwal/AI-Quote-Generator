# Legal Quote System

A modern web application for generating legal service quotes with AI-powered recommendations and professional PDF reports.

## 🚀 Features

- **AI-Powered Quotes**: Describe your legal needs, get intelligent service recommendations
- **Manual Selection**: Choose from 10 legal services with transparent pricing
- **PDF Generation**: Professional quotes with Foxit API integration
- **State-Specific**: All 50 US states with accurate tax calculations
- **Real-time**: Instant quote generation and download

## 🛠️ Tech Stack

- **Frontend**: Next.js (React) - `http://localhost:3000`
- **Backend**: Node.js + Fastify - `http://localhost:4000`
- **AI**: Incredible AI for service recommendations
- **PDF**: Foxit Document Generation API
- **Styling**: Modern responsive design

## ⚡ Quick Start

### 1. Install Dependencies
```bash
# Backend
cd backend && npm install

# Frontend  
cd frontend && npm install
```

### 2. Configure Environment
```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your API keys (Foxit credentials included)
```

### 3. Start Services
```bash
# Backend (Terminal 1)
cd backend && npm start

# Frontend (Terminal 2)
cd frontend && npm run dev
```

### 4. Open Application
Visit: `http://localhost:3000`

## � Legal Services

| Service | Price | Description |
|---------|-------|-------------|
| Contract Review | $200 | Professional contract analysis |
| Will Preparation | $300 | Estate planning documents |
| Business Formation | $500 | LLC, corporation setup |
| Trademark Filing | $400 | Brand protection |
| Legal Consultation | $150 | General legal advice |
| Property Law | $350 | Real estate matters |
| Family Law | $300 | Divorce, custody issues |
| Employment Law | $250 | Workplace disputes |
| Personal Injury | $400 | Accident claims |
| Criminal Defense | $500 | Legal representation |

## 🤖 How It Works

### AI Mode
1. Describe your legal situation (e.g., "Starting a business in California")
2. AI analyzes and recommends appropriate services
3. Generate quote with pricing and PDF download

### Manual Mode
1. Select specific services from the grid
2. Enter client information and state
3. Get instant quote with PDF download

## 🔧 API Endpoints

- `POST /api/quotes/ai-quote-with-pdf` - AI-powered quote generation
- `POST /api/quotes/quote-with-pdf` - Manual quote generation
- `GET /api/quotes/config` - Available services and states
- `GET /health` - System health check

## 📁 Project Structure

```
├── backend/
│   ├── server.js              # Main server
│   ├── routes/quotes.js       # API endpoints
│   ├── services/
│   │   ├── AiService.js       # AI integration
│   │   ├── foxitService.js    # PDF generation
│   │   └── quoteService.js    # Quote logic
│   └── templates/             # PDF templates
├── frontend/
│   ├── pages/index.js         # Main app
│   ├── components/            # React components
│   └── services.js            # Constants
└── .vscode/tasks.json         # VS Code tasks
```

## ⚙️ Configuration

### Environment Variables
```bash
# Required for PDF generation
FOXIT_DOCGEN_CLIENT_ID=foxit_siYoCZf5d0uS5-rW
FOXIT_DOCGEN_CLIENT_SECRET=uVxYHD7ecN-BJRNWLXAtYtVyxbuMpqCC

# Optional for enhanced AI features
# OPENAI_API_KEY=your_key_here

# Server settings
PORT=4000
NODE_ENV=development
```

## 🧪 Testing

### Manual Test
1. Visit `http://localhost:3000`
2. Try both AI and Manual modes
3. Generate and download PDF quotes

### API Test
```bash
curl -X POST http://localhost:4000/api/quotes/quote-with-pdf \
  -H "Content-Type: application/json" \
  -d '{
    "selectedServices": ["business_formation", "trademark_filing"],
    "state": "CA",
    "clientInfo": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "555-1234"
    }
  }'
```

## 🔒 Security

- Environment variables for sensitive data
- Input validation and sanitization
- CORS configuration
- File upload limits
- Comprehensive error handling

## 📈 Current Status

✅ **Production Ready**
- Frontend: Complete dual-mode interface
- Backend: All APIs functional
- PDF Generation: Working with Foxit
- AI Integration: Incredible AI service
- State Calculations: All 50 states
- Error Handling: Comprehensive
- Documentation: Complete

## 🚀 Deployment

The application is ready for deployment to any cloud platform (Vercel, Netlify, AWS, etc.). 

**Repository**: https://github.com/Rushabh-Runwal/QUOTE_GENERATOR

---

**Built with ❤️ for modern legal practices**
