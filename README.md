# Legal Quote System

A comprehensive web application for generating legal service quotes with AI-powered recommendations and PDF report generation.

## 🎯 What This Application Does

This application provides an intelligent legal services quotation system with two main features:

### 1. **AI-Powered Quote Generation**
- Users describe their legal needs in plain English (250+ words recommended)
- OpenAI API analyzes the description and recommends appropriate legal services
- Generates detailed quotes with state-specific pricing and terms
- Creates professional PDF reports with AI insights

### 2. **Manual Service Selection**
- Users manually select from predefined legal services
- Instant quote generation with pricing calculations
- State-specific tax calculations and terms & conditions
- Professional PDF quote generation

## 🏗️ Architecture

### Frontend (Next.js)
- **Location**: `/frontend/`
- **Port**: `http://localhost:3000`
- **Features**:
  - Responsive React-based UI
  - Two-mode selection (AI vs Manual)
  - Client information collection
  - State selection with tax calculations
  - Real-time quote display
  - PDF download functionality

### Backend (Fastify/Node.js)
- **Location**: `/backend/`
- **Port**: `http://localhost:4000`
- **Features**:
  - RESTful API with comprehensive error handling
  - OpenAI integration for AI analysis
  - Foxit PDF generation service
  - Quote management and storage
  - Health monitoring endpoints

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Optional: OpenAI API key for AI features
- Optional: Foxit API key for enhanced PDF generation

### Installation

1. **Clone and install dependencies**:
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

2. **Configure environment variables**:
   ```bash
   # Backend
   cd backend
   cp .env.example .env
   # Edit .env with your API keys
   
   # Frontend (optional)
   cd ../frontend
   cp .env.example .env.local
   # Edit .env.local if needed
   ```

3. **Start the services**:
   ```bash
   # Use VS Code tasks or terminal commands
   # Backend: "Start Backend Server" task
   # Frontend: "Start Frontend (Next.js)" task
   ```

## 📋 Available Services

The system supports the following legal services:

1. **Contract Review** - $200
2. **Will Preparation** - $300  
3. **Business Formation** - $500
4. **Trademark Filing** - $400
5. **Legal Consultation** - $150
6. **Property Law** - $350
7. **Family Law** - $300
8. **Employment Law** - $250
9. **Personal Injury** - $400
10. **Criminal Defense** - $500

## 🌍 Supported States

All 50 US states plus "Other" with accurate tax rates for each jurisdiction.

## 🤖 AI Features

When OpenAI API key is configured:

- **Intelligent Service Recommendation**: Analyzes user descriptions to recommend appropriate legal services
- **Confidence Scoring**: Provides confidence levels for recommendations
- **Additional Insights**: Offers extra considerations and recommendations
- **Urgency Assessment**: Evaluates the urgency level of legal needs
- **Complexity Analysis**: Assesses the complexity of the legal situation

## 📄 PDF Generation

The system generates professional PDF quotes containing:

- Client information and contact details
- Selected services with descriptions and pricing
- State-specific tax calculations
- Terms and conditions based on jurisdiction
- AI insights (when available)
- Quote expiration dates
- Professional formatting

## 🔧 API Endpoints

### Core Endpoints
- `POST /api/quotes/ai-quote-with-pdf` - AI-powered quote generation
- `POST /api/quotes/quote-with-pdf` - Manual quote generation
- `GET /api/quotes/health` - Service health check
- `GET /downloads/:filename` - PDF download

### Health & Configuration
- `GET /health` - Overall system health
- `GET /api/quotes/config` - Available services and states

## 💻 Development

### Backend Structure
```
backend/
├── server.js              # Main server file
├── routes/
│   └── quotes.js          # Quote API routes
├── services/
│   ├── quoteService.js    # Quote generation logic
│   ├── openaiService.js   # AI analysis service
│   └── foxitService.js    # PDF generation service
├── generated/             # Generated PDF storage
└── package.json
```

### Frontend Structure
```
frontend/
├── pages/
│   ├── index.js           # Main application page
│   ├── _app.js           # Next.js app wrapper
│   ├── about.js          # About page
│   └── contact.js        # Contact page
├── components/
│   ├── AIDescriptionForm.js    # AI input form
│   ├── AIQuoteResults.js       # AI results display
│   ├── ServiceCard.js          # Service selection cards
│   └── Navbar.js              # Navigation component
├── services.js           # Shared constants
└── package.json
```

## 🔒 Security Features

- Input validation and sanitization
- Rate limiting and timeout handling
- Error handling with appropriate HTTP status codes
- CORS configuration for frontend integration
- File upload size limits
- Graceful degradation when services are unavailable

## 📁 Git Configuration

The project includes comprehensive `.gitignore` files for:

### Root Level
- Node.js dependencies and logs
- Environment variables (.env files)
- IDE and OS files
- Build outputs and cache files

### Backend
- Generated PDF files (`/generated/*.pdf`)
- API keys and sensitive configuration
- Logs and runtime data
- Database files (if used)

### Frontend
- Next.js build outputs (`.next/`, `out/`)
- Environment variables
- Testing artifacts
- PWA and build cache files

**Important**: 
- The `/backend/generated/` directory exists for PDF storage but PDF files are gitignored
- Copy `.env.example` to `.env` and configure your API keys
- Never commit API keys or sensitive data to the repository

## 📊 Quote Pricing Logic

- **Base Pricing**: Each service has a defined base price
- **Complexity Discount**: 10% discount for selecting multiple services (4+)
- **State Taxes**: Accurate tax rates for all US states
- **Total Calculation**: Base price + taxes = final quote

## 🎨 UI Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Mode Toggle**: Easy switching between AI and manual modes
- **Real-time Validation**: Form validation with helpful error messages
- **Professional Styling**: Clean, modern interface
- **Loading States**: Clear feedback during processing
- **Error Handling**: User-friendly error messages

## 🚨 Error Handling

The system includes comprehensive error handling:

- **AI Service Unavailable**: Graceful fallback to manual selection
- **PDF Generation Errors**: Continues with quote generation
- **Network Issues**: Retry mechanisms and user feedback
- **Validation Errors**: Clear validation messages
- **Service Health**: Monitoring and status reporting

## 🔧 Configuration

### Environment Variables

```bash
# API Keys (Optional)
OPENAI_API_KEY=your-openai-api-key
FOXIT_API_KEY=your-foxit-api-key

# Server Configuration
PORT=4000
HOST=localhost
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000
```

## 🎉 Current Status

✅ **Backend**: Fully functional with all endpoints working  
✅ **Frontend**: Complete UI with both AI and manual modes  
✅ **PDF Generation**: Working with mock generation  
✅ **Quote Calculation**: Accurate pricing with state taxes  
✅ **Error Handling**: Comprehensive error management  
✅ **Health Monitoring**: Service health checks implemented  

🔧 **Future Enhancements**:
- Add OpenAI API key for AI features
- Integrate real Foxit PDF generation
- Add user authentication
- Implement quote history and management
- Add payment processing integration

## 📱 Usage Examples

### Manual Quote
1. Visit `http://localhost:3000`
2. Select "Manual Selection" mode
3. Choose legal services from the grid
4. Enter client information and state
5. Click "Get Professional Quote"
6. Download the generated PDF

### AI-Powered Quote (when OpenAI configured)
1. Select "AI-Powered Quote" mode
2. Describe legal needs in detail
3. Enter client information and state  
4. Click "Get AI-Powered Quote"
5. Review AI recommendations and download PDF

---

**Ready to use!** Both frontend and backend are running and fully functional.

A professional legal services quotation generator with AI-powered service categorization and integrated PDF generation using Foxit APIs.

## 🏗️ Architecture

- **Frontend**: Next.js 14 (React) - http://localhost:3000
- **Backend**: Node.js with Fastify - http://localhost:4000
- **AI Integration**: OpenAI GPT-4o-mini for service categorization and report generation
- **PDF Generation**: Foxit Document Generation API & PDF Services API
- **Template System**: Base64-encoded Word documents (.docx)

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Foxit API credentials (client_id, client_secret)
- OpenAI API key

### Environment Setup
1. Set up your API credentials in environment variables:
   ```bash
   export FOXIT_CLIENT_ID="your_client_id"
   export FOXIT_CLIENT_SECRET="your_client_secret"
   export OPENAI_API_KEY="your_openai_api_key"
   ```

2. Or update `backend/.env` file:
   ```properties
   FOXIT_DOCGEN_CLIENT_ID=your_foxit_client_id
   FOXIT_DOCGEN_CLIENT_SECRET=your_foxit_client_secret
   OPENAI_API_KEY=your_openai_api_key
   ```

### Development
1. **Start both frontend and backend**:
   ```bash
   # Use VS Code Command Palette (Cmd+Shift+P)
   # Run Task: "Start Full Development Environment"
   ```

2. **Or start individually**:
   ```bash
   # Backend (Terminal 1)
   cd backend && npm start
   
   # Frontend (Terminal 2)
   cd frontend && npm run dev
   ```

3. **Open the application**: http://localhost:3000

## 🛠️ VS Code Tasks Available

- **Start Full Development Environment** - Runs both frontend and backend
- **Start Backend Server** - Runs Node.js/Fastify server (port 4000)
- **Start Frontend (Next.js)** - Runs Next.js dev server (port 3000)
- **Test Foxit API** - Direct API testing script
- **Build Frontend** - Production build of Next.js app
- **Clean Generated Files** - Removes generated PDF files

## 🤖 AI-Powered Features

### Smart Service Categorization ✨
- **Natural Language Input**: Users describe their legal needs in plain English (250+ words recommended)
- **AI Analysis**: OpenAI GPT-4o-mini analyzes descriptions and maps them to appropriate legal services
- **Confidence Scoring**: Each recommendation includes confidence levels (High/Medium/Low)
- **Reasoning**: AI explains why specific services were recommended

### Enhanced Reporting 📊
- **Executive Summary**: AI-generated overview of legal needs and scope
- **Service Breakdown**: Detailed analysis of each recommended service
- **State-Specific Terms**: Automatically generated terms and conditions based on client's state
- **Legal Considerations**: Compliance notes, risks, and professional recommendations
- **Timeline & Next Steps**: Project timeline and actionable next steps

### Dual Mode Operation 🎯
- **AI Mode**: Describe needs → AI categorizes → Generate enhanced quote
- **Manual Mode**: Traditional service selection for precise control
- **Seamless Switching**: Toggle between modes while maintaining client information

## 📊 Features

### Current Implementation ✅
- **AI Service Categorization**: Natural language processing for service recommendations
- **Enhanced Legal Reports**: Comprehensive AI-generated legal analysis and reporting
- **State-Specific Terms**: Automatically generated terms and conditions per state
- **Dual Interface**: Both AI-powered and manual service selection modes
- **Legal Services Selection**: Multiple service types (contracts, litigation, etc.)
- **State-based Pricing**: Tax calculations per state
- **Client Information**: Name, email, phone collection
- **PDF Generation**: Foxit Document Generation API integration
- **Secure Downloads**: PDF file generation and download
- **Professional UI**: Clean, responsive design with mode switching
- **Real-time Quotes**: Instant pricing calculation

### API Endpoints
- `POST /api/quotes/ai-quote-with-pdf` - **NEW**: AI-powered quote generation
- `POST /api/quotes/generate-pdf` - Generate PDF only
- `POST /api/quotes/quote-with-pdf` - Full quote with PDF generation
- `GET /api/quotes/download/:filename` - Download generated PDF

## 🔧 Technical Details

### AI Integration
- **Model**: OpenAI GPT-4o-mini for optimal cost/performance
- **Service Categorization**: Natural language → Legal service mapping
- **Report Generation**: Detailed legal analysis and recommendations
- **State-Specific Terms**: Jurisdiction-aware terms and conditions generation
- **Confidence Scoring**: 0.5-1.0 confidence levels for service recommendations

### Foxit Integration
- **API Host**: https://na1.fusion.foxit.com
- **Document Generation**: `/document-generation/api/GenerateDocumentBase64`
- **Authentication**: Direct headers (client_id, client_secret)
- **Template**: Base64-encoded Word document (175,804 characters)
- **Output**: High-quality PDF (typical size: ~109KB)

### File Structure
```
├── backend/
│   ├── config/services.js          # Service definitions
│   ├── routes/quotes.js            # API endpoints (including AI)
│   ├── services/
│   │   ├── foxitService.js         # Foxit API integration
│   │   ├── openaiService.js        # 🆕 OpenAI integration
│   │   └── quoteService.js         # Quote logic (enhanced)
│   ├── templates/quotation/        # Word templates
│   ├── generated/                  # PDF output directory
│   └── b64.txt                     # Base64 template
├── frontend/
│   ├── components/
│   │   ├── AIDescriptionForm.js    # 🆕 AI input form
│   │   ├── AIQuoteResults.js       # 🆕 Enhanced results display
│   │   └── ...                     # Other React components
│   ├── pages/
│   │   └── index.js                # 🆕 Dual-mode interface
│   └── public/                     # Static assets
└── .vscode/
    ├── tasks.json                  # VS Code tasks
    └── launch.json                 # Debug configurations
```

## 🧪 Testing

### AI Quote Testing
```bash
# Test AI-powered quote generation
curl -X POST http://localhost:4000/api/quotes/ai-quote-with-pdf \
  -H "Content-Type: application/json" \
  -d '{
    "userDescription": "I need help starting a consulting business in California. I want to protect my business name and need client contracts.",
    "state": "CA",
    "clientInfo": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "555-1234"
    }
  }'
```

### Manual Testing
1. Fill out client information on http://localhost:3000
2. **AI Mode**: Describe legal needs in the text area
3. **Manual Mode**: Select specific services
4. Choose state for tax calculations
5. Generate quote and download PDF

## 🐛 Troubleshooting

### Common Issues
- **OpenAI API errors**: Verify `OPENAI_API_KEY` is set correctly
- **Port 4000 in use**: Backend already running, use existing instance
- **AI categorization fails**: Ensure description is detailed enough (10+ characters minimum)
- **PDF generation fails**: Check Foxit API credentials
- **Frontend build errors**: Ensure all new components are properly imported

### Debug Mode
Use VS Code debugger:
1. Set breakpoints in backend code (including AI service)
2. Run "Debug Backend" launch configuration
3. Test AI endpoints from frontend or curl

## 📈 Success Metrics
- ✅ **AI Service Categorization**: Working with GPT-4o-mini
- ✅ **Enhanced Legal Reports**: Comprehensive AI-generated analysis
- ✅ **State-Specific Terms**: Automated jurisdiction-aware content
- ✅ **Dual Mode Interface**: Seamless switching between AI and manual modes
- ✅ **Foxit Document Generation API**: Working (109KB PDFs)
- ✅ **Frontend-Backend Integration**: Functional with AI endpoints
- ✅ **PDF Download**: Operational for both modes
- ✅ **Error Handling**: Comprehensive for both AI and traditional flows

## 🎯 Usage Examples

### AI Mode Examples:
- "I want to start a food truck business in Texas and need help with permits and contracts"
- "My landlord is trying to evict me unfairly and I need legal advice on my rights"
- "I need to create a will that includes my house and ensures my children inherit everything"
- "Someone stole my app idea and is selling it - I need intellectual property protection"

### Manual Mode:
- Traditional service selection for users who know exactly what they need
- Quick quotes for repeat clients
- Specific service combinations

---

**Status**: ✅ **PRODUCTION READY WITH AI** - Advanced AI-powered legal service categorization and enhanced reporting complete!
