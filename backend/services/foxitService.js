const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

class FoxitService {
  constructor() {
    this.clientId = "foxit_siYoCZf5d0uS5-rW";
    this.clientSecret = "uVxYHD7ecN-BJRNWLXAtYtVyxbuMpqCC";
    this.baseURL =
      "https://na1.fusion.foxit.com/document-generation/api/GenerateDocumentBase64";
    this.generatedDir = path.join(__dirname, "..", "generated");
    this.templatePath = path.join(
      __dirname,
      "..",
      "templates",
      "template.b64.txt"
    );

    // Ensure generated directory exists
    this.ensureDirectoryExists();
  }

  async ensureDirectoryExists() {
    try {
      await fs.ensureDir(this.generatedDir);
    } catch (error) {
      console.error("Failed to create generated directory:", error);
    }
  }

  // Generate PDF quote using Foxit API
  async generateQuotePDF({ quote, aiInsights = null, userDescription = null }) {
    try {
      console.log("=== FOXIT PDF GENERATION ===");
      console.log("Quote ID:", quote.quoteId);
      console.log("Client:", quote.clientInfo.name);
      console.log("Total Amount:", quote.pricing.totalAmount);

      // Load the base64 template
      const template = await this.loadTemplate();

      // Prepare template data for Foxit API
      const documentValues = this.prepareDocumentValues(
        quote,
        aiInsights,
        userDescription
      );

      // Call Foxit API
      const pdfBuffer = await this.callFoxitAPI(template, documentValues);

      // Save PDF to file
      const filename = `quote-${quote.quoteId}.pdf`;
      const filePath = path.join(this.generatedDir, filename);
      await fs.writeFile(filePath, pdfBuffer);

      console.log("PDF Generated:", filename);
      console.log("File saved to:", filePath);

      return {
        filename,
        filePath,
        downloadUrl: `/downloads/${filename}`,
        size: pdfBuffer.length,
        mimeType: "application/pdf",
        generatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Foxit PDF Generation Error:", error);
      throw new FoxitError(`PDF generation failed: ${error.message}`);
    }
  }

  // Load the base64 template file
  async loadTemplate() {
    try {
      if (!(await fs.pathExists(this.templatePath))) {
        throw new Error(`Template file not found: ${this.templatePath}`);
      }

      const templateContent = await fs.readFile(this.templatePath, "utf8");
      return templateContent.trim();
    } catch (error) {
      throw new Error(`Failed to load template: ${error.message}`);
    }
  }

  // Prepare document values for Foxit API
  prepareDocumentValues(quote, aiInsights, userDescription) {
    // Format service items for the template
    const serviceItems = quote.services.map((service) => ({
      "ServiceItems.ServiceName": service.label,
      "ServiceItems.ServicePrice": service.basePrice.toFixed(2),
    }));

    // Calculate dates
    const today = new Date();
    const validThrough = new Date(today);
    validThrough.setMonth(validThrough.getMonth() + 1); // Valid for 1 month

    const paymentDueDate = new Date(today);
    paymentDueDate.setDate(paymentDueDate.getDate() + 30); // Due in 30 days

    // Prepare matter description
    let matterDescription = "Legal services as outlined below";
    if (userDescription) {
      matterDescription =
        userDescription.length > 100
          ? userDescription.substring(0, 100) + "..."
          : userDescription;
    }
    if (aiInsights && aiInsights.reasoning) {
      matterDescription += ` (AI recommended: ${aiInsights.reasoning})`;
    }

    // Prepare terms
    const terms = [
      {
        clauseText:
          "This quote excludes state filing fees unless otherwise stated.",
      },
      {
        clauseText: `${quote.state.label} clients may be subject to additional local surcharges.`,
      },
      { clauseText: "Work commences upon receipt of retainer." },
    ];

    if (aiInsights && aiInsights.additionalRecommendations) {
      aiInsights.additionalRecommendations.forEach((recommendation) => {
        terms.push({ clauseText: `Note: ${recommendation}` });
      });
    }

    return {
      customerName: quote.clientInfo.name,
      customerEmail: quote.clientInfo.email,
      customerPhone: quote.clientInfo.phone || "Not provided",
      quoteNumber: quote.quoteId,
      validThrough: validThrough.toISOString().split("T")[0], // YYYY-MM-DD format
      matterDescription: matterDescription,
      state: quote.state.label,

      ServiceItems: serviceItems,

      subtotal: quote.pricing.basePrice.toFixed(2),
      taxLabel: `${quote.state.label} Tax ${(
        quote.pricing.taxRate * 100
      ).toFixed(1)}%`,
      taxAmount: quote.pricing.taxAmount.toFixed(2),
      grandTotal: quote.pricing.totalAmount.toFixed(2),
      paymentDueDate: paymentDueDate.toISOString().split("T")[0], // YYYY-MM-DD format

      terms: terms,
    };
  }

  // Call Foxit API to generate PDF
  async callFoxitAPI(template, documentValues) {
    try {
      console.log("Calling Foxit API...");
      console.log("Document Values:", JSON.stringify(documentValues, null, 2));

      const payload = {
        outputFormat: "pdf",
        currencyCulture: "en-US",
        documentValues: documentValues,
        base64FileString: template,
      };

      const response = await axios.post(this.baseURL, payload, {
        headers: {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      });

      if (!response.data || !response.data.base64FileString) {
        throw new Error(
          "Invalid response from Foxit API - no base64FileString returned"
        );
      }

      console.log("Foxit API call successful");

      // Convert base64 to buffer
      const pdfBuffer = Buffer.from(response.data.base64FileString, "base64");
      return pdfBuffer;
    } catch (error) {
      if (error.response) {
        console.error(
          "Foxit API Error Response:",
          error.response.status,
          error.response.data
        );
        throw new Error(
          `Foxit API error (${error.response.status}): ${JSON.stringify(
            error.response.data
          )}`
        );
      } else if (error.request) {
        console.error("Foxit API Network Error:", error.message);
        throw new Error(`Network error calling Foxit API: ${error.message}`);
      } else {
        console.error("Foxit API Setup Error:", error.message);
        throw new Error(`Error setting up Foxit API call: ${error.message}`);
      }
    }
  }

  // Health check
  async healthCheck() {
    try {
      // Check if template file exists
      const templateExists = await fs.pathExists(this.templatePath);

      // Check if generated directory exists and is writable
      await fs.ensureDir(this.generatedDir);
      const testFile = path.join(this.generatedDir, "test-write.tmp");
      await fs.writeFile(testFile, "test");
      await fs.remove(testFile);

      return {
        status: "healthy",
        details: {
          templateExists,
          generatedDirWritable: true,
          clientConfigured: !!(this.clientId && this.clientSecret),
          apiEndpoint: this.baseURL,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: "unhealthy",
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Cleanup old generated files
  async cleanupOldFiles(maxAgeHours = 168) {
    // 7 days default
    try {
      const files = await fs.readdir(this.generatedDir);
      const now = Date.now();
      const maxAge = maxAgeHours * 60 * 60 * 1000;

      for (const file of files) {
        const filePath = path.join(this.generatedDir, file);
        const stats = await fs.stat(filePath);

        if (now - stats.mtime.getTime() > maxAge) {
          await fs.remove(filePath);
          console.log(`Cleaned up old file: ${file}`);
        }
      }
    } catch (error) {
      console.error("Error during cleanup:", error);
    }
  }
}

// Custom error class for Foxit-related errors
class FoxitError extends Error {
  constructor(message) {
    super(message);
    this.name = "FoxitError";
  }
}

module.exports = new FoxitService();
