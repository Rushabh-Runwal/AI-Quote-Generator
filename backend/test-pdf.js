const foxitService = require("./services/foxitService");
const quoteService = require("./services/quoteService");

async function testPDFGeneration() {
  console.log("Testing PDF Generation...");

  try {
    // Create a test quote
    const testQuote = await quoteService.generateQuote({
      selectedServices: ["contract_review", "legal_consultation"],
      state: "CA",
      clientInfo: {
        name: "Test User",
        email: "test@example.com",
        phone: "+1-555-0123",
      },
    });

    console.log("Test quote generated:", testQuote.quoteId);

    // Generate PDF
    const document = await foxitService.generateQuotePDF({
      quote: testQuote,
      userDescription: "Test legal consultation for contract review",
    });

    console.log("PDF generated successfully:", document);
  } catch (error) {
    console.error("PDF generation failed:", error.message);
    console.error("Stack:", error.stack);
  }
}

testPDFGeneration();
