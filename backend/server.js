const fastify = require("fastify")({
  logger: true,
  requestTimeout: 30000,
});
const path = require("path");
const fs = require("fs-extra");

// Load environment variables
require("dotenv").config();

// Register plugins
async function registerPlugins() {
  // CORS plugin
  await fastify.register(require("@fastify/cors"), {
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  });

  // Static files plugin for serving generated PDFs
  await fastify.register(require("@fastify/static"), {
    root: path.join(__dirname, "generated"),
    prefix: "/downloads/",
  });

  // Multipart plugin for file uploads
  await fastify.register(require("@fastify/multipart"), {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    },
  });
}

// Import routes
const quotesRoutes = require("./routes/quotes");

// Register routes
async function registerRoutes() {
  await fastify.register(quotesRoutes, { prefix: "/api/quotes" });
}

// Health check endpoint
fastify.get("/health", async (request, reply) => {
  return {
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "legal-quote-backend",
  };
});

// Root endpoint
fastify.get("/", async (request, reply) => {
  return {
    message: "Legal Quote Backend API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      quotes: "/api/quotes",
      aiQuote: "/api/quotes/ai-quote-with-pdf",
      manualQuote: "/api/quotes/quote-with-pdf",
    },
  };
});

// Error handler
fastify.setErrorHandler(async (error, request, reply) => {
  fastify.log.error(error);

  // Handle specific error types
  if (error.validation) {
    return reply.status(400).send({
      error: "Validation Error",
      message: error.message,
      details: error.validation,
    });
  }

  if (error.statusCode === 413) {
    return reply.status(413).send({
      error: "Payload Too Large",
      message: "Request payload exceeds maximum allowed size",
    });
  }

  return reply.status(error.statusCode || 500).send({
    error: error.name || "Internal Server Error",
    message: error.message || "An unexpected error occurred",
    timestamp: new Date().toISOString(),
  });
});

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  try {
    await fastify.close();
    process.exit(0);
  } catch (err) {
    fastify.log.error("Error during shutdown:", err);
    process.exit(1);
  }
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Start server
const start = async () => {
  try {
    // Ensure generated directory exists
    await fs.ensureDir(path.join(__dirname, "generated"));

    // Register plugins and routes
    await registerPlugins();
    await registerRoutes();

    // Start the server
    const port = process.env.PORT || 4000;
    const host = process.env.HOST || "localhost";

    await fastify.listen({ port, host });
  } catch (err) {
    fastify.log.error("Error starting server:", err);
    process.exit(1);
  }
};

start();
