const foxitService = require("./foxitService");
const pdfStorageService = require("./pdfStorageService");
const asyncPDFCompressionService = require("./asyncPDFCompressionService");

class EnhancedPDFService {
  constructor() {
    this.foxitService = foxitService;
    this.storageService = pdfStorageService;
    this.compressionService = asyncPDFCompressionService;
  }

  // Generate PDF immediately, then compress and store asynchronously
  async generateCompressAndStorePDF({
    quote,
    aiInsights = null,
    userDescription = null,
  }) {
    try {
      console.log("=== ENHANCED PDF WORKFLOW STARTING ===");
      console.log("Quote ID:", quote.quoteId);
      console.log("Client:", quote.clientInfo.name);

      // Step 1: Generate PDF using existing Foxit service
      console.log("Step 1: Generating PDF...");
      const pdfResult = await this.foxitService.generateQuotePDF({
        quote,
        aiInsights,
        userDescription,
      });

      const originalPdfBuffer = pdfResult.buffer;
      const originalSize = originalPdfBuffer.length;
      console.log("PDF generated. Size:", originalSize, "bytes");

      // Store original PDF immediately (for immediate download)
      console.log("Step 2: Storing original PDF for immediate access...");
      const immediateStorageData = {
        quote: quote,
        aiInsights: aiInsights,
        userDescription: userDescription,
        originalBuffer: originalPdfBuffer,
        compressedBuffer: null,
        originalSize: originalSize,
        compressedSize: originalSize,
        compressionRatio: 0,
      };

      const immediateStorageResult =
        await this.storageService.savePDFWithUserData(immediateStorageData);
      console.log("Original PDF stored at:", immediateStorageResult.pdfPath);

      // Return PDF immediately to user
      const response = {
        success: true,
        quoteId: quote.quoteId,
        pdf: {
          originalSize: originalSize,
          compressedSize: originalSize, // Will be updated when compression completes
          compressionRatio: 0,
          savedAt: immediateStorageResult.pdfPath,
        },
        storage: immediateStorageResult,
        pdfBuffer: originalPdfBuffer,
        compressionStatus: "PENDING", // Indicates compression is happening in background
      };

      // Step 3: Start async compression and storage (don't wait for it)
      console.log("Step 3: Starting compression workflow...");
      const filename = `quote_${quote.quoteId}_${
        new Date().toISOString().split("T")[0]
      }.pdf`;

      // Fire and forget - don't await this
      this.compressionService
        .compressAndStorePDFAsync(
          originalPdfBuffer,
          filename,
          quote,
          aiInsights,
          userDescription,
          this.storageService
        )
        .then((compressionResult) => {
          console.log("Quote ID:", quote.quoteId);
          console.log("Compression successful:", compressionResult.success);
          console.log(
            "Final compressed size:",
            compressionResult.compressedSize,
            "bytes"
          );
          console.log(
            "Compression ratio:",
            compressionResult.compressionRatio + "%"
          );
          if (compressionResult.fallback) {
            console.log(
              "Note: Used fallback storage due to compression failure"
            );
          }
        })
        .catch((compressionError) => {
          console.error("=== ASYNC COMPRESSION FAILED ===");
          console.error("Quote ID:", quote.quoteId);
          console.error("Compression error:", compressionError.message);
          console.log("Original PDF is still available for download");
        });

      return response;
    } catch (error) {
      console.error("Enhanced PDF Workflow Error:", error);
      throw new Error(`Enhanced PDF workflow failed: ${error.message}`);
    }
  }
}

module.exports = new EnhancedPDFService();
