const quoteService = require("../services/quoteService");
const aiService = require("../services/AiService");
const foxitService = require("../services/foxitService");

// Build Quote function - centralizes quote generation logic
async function buildQuote(
  servicesList,
  state,
  clientInfo,
  isAIGenerated = false
) {
  console.log("=== BUILD QUOTE FUNCTION ===");
  console.log("Services List:", servicesList);
  console.log("State:", state);
  console.log("Client Info:", clientInfo);
  console.log("Is AI Generated:", isAIGenerated);
  console.log("==============================");

  try {
    // Generate quote using the quote service
    const quote = await quoteService.generateQuote({
      selectedServices: servicesList,
      state,
      clientInfo,
      isAIGenerated,
    });

    console.log("Generated Quote ID:", quote.quoteId);
    console.log("Total Amount:", quote.pricing.totalAmount);
    console.log("Services Count:", quote.services.length);

    return quote;
  } catch (error) {
    console.error("Build Quote Error:", error);
    throw error;
  }
}

async function quotesRoutes(fastify, options) {
  // Schema definitions for validation
  const clientInfoSchema = {
    type: "object",
    required: ["name", "email"],
    properties: {
      name: { type: "string", minLength: 1, maxLength: 100 },
      email: { type: "string", format: "email", maxLength: 100 },
      phone: { type: "string", maxLength: 20 },
    },
  };

  const aiQuoteSchema = {
    body: {
      type: "object",
      required: ["userDescription", "state", "clientInfo"],
      properties: {
        userDescription: {
          type: "string",
          minLength: 10,
          maxLength: 2000,
          description: "Detailed description of legal needs",
        },
        state: {
          type: "string",
          pattern: "^[A-Z]{2}$|^OTHER$",
          description: "US state code (e.g., CA, NY) or OTHER",
        },
        clientInfo: clientInfoSchema,
      },
    },
  };

  const manualQuoteSchema = {
    body: {
      type: "object",
      required: ["selectedServices", "state", "clientInfo"],
      properties: {
        selectedServices: {
          type: "array",
          minItems: 1,
          maxItems: 10,
          items: { type: "string" },
          description: "Array of selected service identifiers",
        },
        state: {
          type: "string",
          pattern: "^[A-Z]{2}$|^OTHER$",
          description: "US state code (e.g., CA, NY) or OTHER",
        },
        clientInfo: clientInfoSchema,
      },
    },
  };

  // AI-powered quote generation with PDF
  fastify.post(
    "/ai-quote-with-pdf",
    { schema: aiQuoteSchema },
    async (request, reply) => {
      const startTime = Date.now();

      try {
        const { userDescription, state, clientInfo } = request.body;

        console.log("=== AI QUOTE REQUEST ===");
        console.log("User Description:", userDescription);
        console.log("State:", state);
        console.log("Client:", clientInfo.name);
        console.log("========================");

        // Step 1: Use Incredible AI to analyze description and recommend services
        console.log("Calling Incredible AI for service recommendations...");
        const aiAnalysis = await aiService.analyzeUserDescription(
          userDescription
        );

        console.log("AI Analysis Result:", {
          recommendedServices: aiAnalysis.recommendedServices,
          reasoning: aiAnalysis.reasoning,
        });

        if (
          !aiAnalysis.recommendedServices ||
          aiAnalysis.recommendedServices.length === 0
        ) {
          return reply.status(400).send({
            error: "No Services Recommended",
            message:
              "Could not determine appropriate legal services from your description. Please provide more specific details about your legal needs.",
          });
        }

        // Step 2: Build the quote using recommended services
        console.log("Building quote with AI-recommended services...");
        const quote = await buildQuote(
          aiAnalysis.recommendedServices,
          state,
          clientInfo,
          true // isAIGenerated = true
        );

        console.log("Quote built successfully, Quote ID:", quote.quoteId);

        // Step 3: Generate PDF with Foxit API
        console.log("Generating PDF with Foxit API...");
        const document = await foxitService.generateQuotePDF({
          quote,
          aiInsights: aiAnalysis,
          userDescription,
        });

        console.log("PDF generation completed:", document.filename);

        // For now, we'll skip PDF generation and just return the quote
        const processingTime = Date.now() - startTime;

        return reply.send({
          success: true,
          quote,
          document,
          aiInsights: {
            recommendedServices: aiAnalysis.recommendedServices,
            reasoning: aiAnalysis.reasoning,
            confidence: aiAnalysis.confidence,
            additionalRecommendations: aiAnalysis.additionalRecommendations,
          },
          processingTime,
          message:
            "Quote and PDF generated successfully using AI recommendations",
        });
      } catch (error) {
        if (error.name === "IncredibleAIError") {
          return reply.status(503).send({
            error: "AI Service Unavailable",
            message:
              "Our AI analysis service is temporarily unavailable. Please try manual service selection or try again later.",
          });
        }

        if (error.name === "FoxitError") {
          return reply.status(503).send({
            error: "PDF Generation Failed",
            message:
              "Quote generated successfully but PDF creation failed. Please contact support.",
          });
        }

        return reply.status(500).send({
          error: "Quote Generation Failed",
          message:
            error.message ||
            "An unexpected error occurred while generating your quote",
        });
      }
    }
  );

  // Manual service selection quote with PDF
  fastify.post(
    "/quote-with-pdf",
    { schema: manualQuoteSchema },
    async (request, reply) => {
      const startTime = Date.now();

      try {
        const { selectedServices, state, clientInfo } = request.body;

        console.log("=== MANUAL QUOTE REQUEST ===");
        console.log("Selected Services:", selectedServices);
        console.log("State:", state);
        console.log("Client:", clientInfo.name);
        console.log("============================");

        // Step 1: Build the quote using selected services
        console.log("Building quote with manually selected services...");
        const quote = await buildQuote(
          selectedServices,
          state,
          clientInfo,
          false // isAIGenerated = false
        );

        console.log("Quote built successfully, Quote ID:", quote.quoteId);

        // Step 2: Generate PDF with Foxit API
        console.log("Generating PDF with Foxit API...");
        const document = await foxitService.generateQuotePDF({
          quote,
          userDescription: null,
        });

        console.log("PDF generation completed:", document.filename);

        // For now, we'll skip PDF generation and just return the quote
        const processingTime = Date.now() - startTime;

        return reply.send({
          success: true,
          quote,
          document,
          processingTime,
          message:
            "Quote and PDF generated successfully with manual service selection",
        });
      } catch (error) {
        if (error.name === "ValidationError") {
          return reply.status(400).send({
            error: "Invalid Services",
            message: error.message,
          });
        }

        if (error.name === "FoxitError") {
          return reply.status(503).send({
            error: "PDF Generation Failed",
            message:
              "Quote generated successfully but PDF creation failed. Please contact support.",
          });
        }

        return reply.status(500).send({
          error: "Quote Generation Failed",
          message:
            error.message ||
            "An unexpected error occurred while generating your quote",
        });
      }
    }
  );

  // Get quote by ID (for future reference)
  fastify.get("/:quoteId", async (request, reply) => {
    try {
      const { quoteId } = request.params;
      const quote = await quoteService.getQuoteById(quoteId);

      if (!quote) {
        return reply.status(404).send({
          error: "Quote Not Found",
          message: `Quote with ID ${quoteId} was not found`,
        });
      }

      return reply.send({ quote });
    } catch (error) {
      fastify.log.error("Get Quote Error:", error);
      return reply.status(500).send({
        error: "Database Error",
        message: "Failed to retrieve quote",
      });
    }
  });

  // Get available services and states
  fastify.get("/config", async (request, reply) => {
    return reply.send({
      services: quoteService.getAvailableServices(),
      states: quoteService.getAvailableStates(),
      pricing: {
        baseTaxRate: 0.05,
        currency: "USD",
      },
    });
  });
}

module.exports = quotesRoutes;
