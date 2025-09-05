const { v4: uuidv4 } = require("uuid");

// Available legal services
const SERVICES = [
  {
    label: "Contract Review",
    value: "contract_review",
    basePrice: 200,
    description: "Professional review of legal contracts and agreements",
    category: "contract",
  },
  {
    label: "Will Preparation",
    value: "will_preparation",
    basePrice: 300,
    description: "Preparation of wills and estate planning documents",
    category: "estate",
  },
  {
    label: "Business Formation",
    value: "business_formation",
    basePrice: 500,
    description: "Legal assistance with forming business entities",
    category: "business",
  },
  {
    label: "Trademark Filing",
    value: "trademark_filing",
    basePrice: 400,
    description: "Filing and protection of trademark applications",
    category: "intellectual_property",
  },
  {
    label: "Legal Consultation",
    value: "legal_consultation",
    basePrice: 150,
    description: "General legal advice and consultation services",
    category: "consultation",
  },
  {
    label: "Property Law",
    value: "property_law",
    basePrice: 350,
    description: "Real estate and property-related legal services",
    category: "property",
  },
  {
    label: "Family Law",
    value: "family_law",
    basePrice: 300,
    description: "Divorce, custody, and family-related legal matters",
    category: "family",
  },
  {
    label: "Employment Law",
    value: "employment_law",
    basePrice: 250,
    description: "Workplace disputes and employment-related issues",
    category: "employment",
  },
  {
    label: "Personal Injury",
    value: "personal_injury",
    basePrice: 400,
    description: "Personal injury claims and compensation",
    category: "injury",
  },
  {
    label: "Criminal Defense",
    value: "criminal_defense",
    basePrice: 500,
    description: "Criminal law defense and representation",
    category: "criminal",
  },
];

// US States with tax rates
const STATES = [
  { label: "California", value: "CA", tax: 0.0825 },
  { label: "New York", value: "NY", tax: 0.08875 },
  { label: "Texas", value: "TX", tax: 0.0625 },
  { label: "Florida", value: "FL", tax: 0.06 },
  { label: "Illinois", value: "IL", tax: 0.0625 },
  { label: "Pennsylvania", value: "PA", tax: 0.06 },
  { label: "Ohio", value: "OH", tax: 0.055 },
  { label: "Georgia", value: "GA", tax: 0.04 },
  { label: "North Carolina", value: "NC", tax: 0.0475 },
  { label: "Michigan", value: "MI", tax: 0.06 },
  { label: "New Jersey", value: "NJ", tax: 0.0663 },
  { label: "Virginia", value: "VA", tax: 0.053 },
  { label: "Washington", value: "WA", tax: 0.065 },
  { label: "Arizona", value: "AZ", tax: 0.056 },
  { label: "Massachusetts", value: "MA", tax: 0.0625 },
  { label: "Tennessee", value: "TN", tax: 0.07 },
  { label: "Indiana", value: "IN", tax: 0.07 },
  { label: "Missouri", value: "MO", tax: 0.0423 },
  { label: "Maryland", value: "MD", tax: 0.06 },
  { label: "Wisconsin", value: "WI", tax: 0.05 },
  { label: "Colorado", value: "CO", tax: 0.029 },
  { label: "Minnesota", value: "MN", tax: 0.0688 },
  { label: "South Carolina", value: "SC", tax: 0.06 },
  { label: "Alabama", value: "AL", tax: 0.04 },
  { label: "Louisiana", value: "LA", tax: 0.0445 },
  { label: "Kentucky", value: "KY", tax: 0.06 },
  { label: "Oregon", value: "OR", tax: 0.0 },
  { label: "Oklahoma", value: "OK", tax: 0.045 },
  { label: "Connecticut", value: "CT", tax: 0.0635 },
  { label: "Utah", value: "UT", tax: 0.0485 },
  { label: "Iowa", value: "IA", tax: 0.06 },
  { label: "Nevada", value: "NV", tax: 0.0685 },
  { label: "Arkansas", value: "AR", tax: 0.065 },
  { label: "Mississippi", value: "MS", tax: 0.07 },
  { label: "Kansas", value: "KS", tax: 0.065 },
  { label: "New Mexico", value: "NM", tax: 0.05125 },
  { label: "Nebraska", value: "NE", tax: 0.055 },
  { label: "West Virginia", value: "WV", tax: 0.06 },
  { label: "Idaho", value: "ID", tax: 0.06 },
  { label: "Hawaii", value: "HI", tax: 0.04 },
  { label: "New Hampshire", value: "NH", tax: 0.0 },
  { label: "Maine", value: "ME", tax: 0.055 },
  { label: "Montana", value: "MT", tax: 0.0 },
  { label: "Rhode Island", value: "RI", tax: 0.07 },
  { label: "Delaware", value: "DE", tax: 0.0 },
  { label: "South Dakota", value: "SD", tax: 0.045 },
  { label: "North Dakota", value: "ND", tax: 0.05 },
  { label: "Alaska", value: "AK", tax: 0.0 },
  { label: "Vermont", value: "VT", tax: 0.06 },
  { label: "Wyoming", value: "WY", tax: 0.04 },
  { label: "Other", value: "OTHER", tax: 0.05 },
];

// In-memory storage for quotes (in production, use a database)
const quotes = new Map();

class QuoteService {
  constructor() {
    this.services = SERVICES;
    this.states = STATES;
  }

  // Generate a comprehensive quote
  async generateQuote({
    selectedServices,
    state,
    clientInfo,
    isAIGenerated = false,
  }) {
    try {
      // Validate inputs
      this.validateQuoteRequest(selectedServices, state, clientInfo);

      // Find selected services
      const services = this.getServicesByValues(selectedServices);
      if (services.length === 0) {
        throw new ValidationError(
          "No valid services found for the provided service codes"
        );
      }

      // Find state information
      const stateInfo = this.getStateByValue(state);
      if (!stateInfo) {
        throw new ValidationError(`Invalid state code: ${state}`);
      }

      // Calculate pricing
      const pricing = this.calculatePricing(services, stateInfo);

      // Generate unique quote ID
      const quoteId = this.generateQuoteId();

      // Create quote object
      const quote = {
        quoteId,
        timestamp: new Date().toISOString(),
        clientInfo: {
          name: clientInfo.name.trim(),
          email: clientInfo.email.trim().toLowerCase(),
          phone: clientInfo.phone ? clientInfo.phone.trim() : null,
        },
        services: services.map((service) => ({
          label: service.label,
          value: service.value,
          basePrice: service.basePrice,
          description: service.description,
          category: service.category,
        })),
        state: {
          label: stateInfo.label,
          value: stateInfo.value,
          taxRate: stateInfo.tax,
        },
        pricing,
        metadata: {
          isAIGenerated,
          version: "1.0",
          currency: "USD",
        },
        status: "generated",
      };

      // Store quote (in production, save to database)
      quotes.set(quoteId, quote);

      return quote;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new Error(`Quote generation failed: ${error.message}`);
    }
  }

  // Get quote by ID
  async getQuoteById(quoteId) {
    return quotes.get(quoteId) || null;
  }

  // Calculate pricing with taxes and fees
  calculatePricing(services, stateInfo) {
    const basePrice = services.reduce(
      (total, service) => total + service.basePrice,
      0
    );

    // Apply complexity multiplier for multiple services
    const complexityMultiplier = services.length > 3 ? 0.9 : 1.0; // 10% discount for complex cases
    const adjustedBasePrice = Math.round(basePrice * complexityMultiplier);

    // Calculate tax
    const taxAmount = Math.round(adjustedBasePrice * stateInfo.tax * 100) / 100;

    // Total amount
    const totalAmount = adjustedBasePrice + taxAmount;

    return {
      basePrice: adjustedBasePrice,
      taxRate: stateInfo.tax,
      taxAmount,
      totalAmount: Math.round(totalAmount * 100) / 100,
      breakdown: {
        originalBasePrice: basePrice,
        complexityDiscount: basePrice - adjustedBasePrice,
        appliedMultiplier: complexityMultiplier,
      },
    };
  }

  // Validation helper
  validateQuoteRequest(selectedServices, state, clientInfo) {
    if (!Array.isArray(selectedServices) || selectedServices.length === 0) {
      throw new ValidationError("At least one service must be selected");
    }

    if (selectedServices.length > 10) {
      throw new ValidationError(
        "Maximum of 10 services can be selected at once"
      );
    }

    if (!state || typeof state !== "string") {
      throw new ValidationError("State must be provided");
    }

    if (!clientInfo || typeof clientInfo !== "object") {
      throw new ValidationError("Client information is required");
    }

    if (!clientInfo.name || clientInfo.name.trim().length === 0) {
      throw new ValidationError("Client name is required");
    }

    if (!clientInfo.email || !this.isValidEmail(clientInfo.email)) {
      throw new ValidationError("Valid email address is required");
    }
  }

  // Email validation
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Get services by values
  getServicesByValues(values) {
    return this.services.filter((service) => values.includes(service.value));
  }

  // Get service by value
  getServiceByValue(value) {
    return this.services.find((service) => service.value === value);
  }

  // Get state by value
  getStateByValue(value) {
    return this.states.find((state) => state.value === value);
  }

  // Generate unique quote ID
  generateQuoteId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `QT-${timestamp}-${random}`.toUpperCase();
  }

  // Get available services
  getAvailableServices() {
    return this.services.map((service) => ({
      label: service.label,
      value: service.value,
      basePrice: service.basePrice,
      description: service.description,
      category: service.category,
    }));
  }

  // Get available states
  getAvailableStates() {
    return this.states.map((state) => ({
      label: state.label,
      value: state.value,
      taxRate: state.tax,
    }));
  }

  // Get services by category
  getServicesByCategory(category) {
    return this.services.filter((service) => service.category === category);
  }

  // Health check
  async healthCheck() {
    try {
      // Check if service data is loaded
      const servicesCount = this.services.length;
      const statesCount = this.states.length;
      const quotesCount = quotes.size;

      return {
        status: "healthy",
        details: {
          servicesLoaded: servicesCount,
          statesLoaded: statesCount,
          quotesInMemory: quotesCount,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      return {
        status: "unhealthy",
        error: error.message,
      };
    }
  }

  // Get quote statistics
  getQuoteStatistics() {
    const allQuotes = Array.from(quotes.values());

    if (allQuotes.length === 0) {
      return {
        totalQuotes: 0,
        averageValue: 0,
        mostPopularServices: [],
        aiGeneratedRatio: 0,
      };
    }

    const totalValue = allQuotes.reduce(
      (sum, quote) => sum + quote.pricing.totalAmount,
      0
    );
    const averageValue = totalValue / allQuotes.length;

    const aiGenerated = allQuotes.filter(
      (quote) => quote.metadata.isAIGenerated
    ).length;
    const aiGeneratedRatio = aiGenerated / allQuotes.length;

    // Count service popularity
    const serviceCounts = {};
    allQuotes.forEach((quote) => {
      quote.services.forEach((service) => {
        serviceCounts[service.value] = (serviceCounts[service.value] || 0) + 1;
      });
    });

    const mostPopularServices = Object.entries(serviceCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([service, count]) => ({
        service: this.getServiceByValue(service)?.label || service,
        count,
      }));

    return {
      totalQuotes: allQuotes.length,
      averageValue: Math.round(averageValue * 100) / 100,
      mostPopularServices,
      aiGeneratedRatio: Math.round(aiGeneratedRatio * 100) / 100,
    };
  }
}

// Custom error class for validation errors
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

module.exports = new QuoteService();
