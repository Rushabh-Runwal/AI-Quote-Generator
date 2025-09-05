// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const API_ENDPOINTS = {
  AI_QUOTE_WITH_PDF: `${API_BASE_URL}/api/quotes/ai-quote-with-pdf`,
  QUOTE_WITH_PDF: `${API_BASE_URL}/api/quotes/quote-with-pdf`,
  BASE_URL: API_BASE_URL,
  HEALTH: `${API_BASE_URL}/health`,
};

console.log('🌍 API Configuration:', {
  baseUrl: API_BASE_URL,
  environment: process.env.NODE_ENV
});
