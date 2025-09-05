const fs = require("fs-extra");
const path = require("path");
const csv = require("csv-writer").createObjectCsvWriter;

class PDFStorageService {
  constructor() {
    this.storageDir = path.join(__dirname, "..", "storage");
    this.pdfsDir = path.join(this.storageDir, "pdfs");
    this.userDataDir = path.join(this.storageDir, "users");
    this.spreadsheetPath = path.join(this.storageDir, "quote_records.csv");

    // Initialize storage directories
    this.initializeStorage();
  }

  async initializeStorage() {
    try {
      // Create storage directories
      await fs.ensureDir(this.storageDir);
      await fs.ensureDir(this.pdfsDir);
      await fs.ensureDir(this.userDataDir);

      // Initialize CSV file if it doesn't exist
      await this.initializeSpreadsheet();

      console.log("PDF Storage Service initialized successfully");
    } catch (error) {
      console.error("Failed to initialize PDF storage:", error);
    }
  }

  async initializeSpreadsheet() {
    try {
      const spreadsheetExists = await fs.pathExists(this.spreadsheetPath);

      if (!spreadsheetExists) {
        // Create CSV header
        const csvWriter = csv({
          path: this.spreadsheetPath,
          header: [
            { id: "quoteId", title: "Quote ID" },
            { id: "timestamp", title: "Created At" },
            { id: "clientName", title: "Client Name" },
            { id: "clientEmail", title: "Client Email" },
            { id: "clientPhone", title: "Client Phone" },
            { id: "clientAddress", title: "Client Address" },
            { id: "services", title: "Services" },
            { id: "totalAmount", title: "Total Amount" },
            { id: "state", title: "State" },
            { id: "taxAmount", title: "Tax Amount" },
            { id: "pdfPath", title: "PDF File Path" },
            { id: "originalSize", title: "Original PDF Size (bytes)" },
            { id: "compressedSize", title: "Compressed PDF Size (bytes)" },
            { id: "compressionRatio", title: "Compression Ratio (%)" },
            { id: "aiInsights", title: "AI Insights Used" },
            { id: "userDescription", title: "User Description" },
          ],
        });

        // Write empty file with headers
        await csvWriter.writeRecords([]);
        console.log("Spreadsheet initialized with headers");
      }
    } catch (error) {
      console.error("Error initializing spreadsheet:", error);
      throw error;
    }
  }

  // Save PDF and user data
  async savePDFWithUserData(pdfData) {
    try {
      console.log("=== SAVING PDF WITH USER DATA ===");
      console.log("Quote ID:", pdfData.quote.quoteId);
      console.log("Client:", pdfData.quote.clientInfo.name);

      const timestamp = new Date().toISOString();
      const quoteId = pdfData.quote.quoteId;

      // Create user-specific directory
      const userDir = path.join(
        this.userDataDir,
        this.sanitizeFilename(pdfData.quote.clientInfo.email)
      );
      await fs.ensureDir(userDir);

      // Save PDF file (compressed version if available)
      const pdfBuffer = pdfData.compressedBuffer || pdfData.originalBuffer;
      const pdfFilename = `quote_${quoteId}_${timestamp.split("T")[0]}.pdf`;
      const pdfPath = path.join(this.pdfsDir, pdfFilename);

      await fs.writeFile(pdfPath, pdfBuffer);
      console.log("PDF saved to:", pdfPath);

      // Save user data as JSON
      const userDataFilename = `user_data_${quoteId}.json`;
      const userDataPath = path.join(userDir, userDataFilename);

      const userData = {
        quoteId: quoteId,
        timestamp: timestamp,
        quote: pdfData.quote,
        aiInsights: pdfData.aiInsights,
        userDescription: pdfData.userDescription,
        pdfInfo: {
          filename: pdfFilename,
          path: pdfPath,
          originalSize: pdfData.originalSize,
          compressedSize: pdfData.compressedSize || pdfData.originalSize,
          compressionRatio: pdfData.compressionRatio || 0,
        },
      };

      await fs.writeJson(userDataPath, userData, { spaces: 2 });
      console.log("User data saved to:", userDataPath);

      // Add record to spreadsheet
      await this.addToSpreadsheet(userData);

      return {
        quoteId: quoteId,
        pdfPath: pdfPath,
        userDataPath: userDataPath,
        timestamp: timestamp,
        success: true,
      };
    } catch (error) {
      console.error("Error saving PDF with user data:", error);
      throw new Error(`Failed to save PDF and user data: ${error.message}`);
    }
  }

  // Add record to CSV spreadsheet
  async addToSpreadsheet(userData) {
    try {
      const csvWriter = csv({
        path: this.spreadsheetPath,
        header: [
          { id: "quoteId", title: "Quote ID" },
          { id: "timestamp", title: "Created At" },
          { id: "clientName", title: "Client Name" },
          { id: "clientEmail", title: "Client Email" },
          { id: "clientPhone", title: "Client Phone" },
          { id: "clientAddress", title: "Client Address" },
          { id: "services", title: "Services" },
          { id: "totalAmount", title: "Total Amount" },
          { id: "state", title: "State" },
          { id: "taxAmount", title: "Tax Amount" },
          { id: "pdfPath", title: "PDF File Path" },
          { id: "originalSize", title: "Original PDF Size (bytes)" },
          { id: "compressedSize", title: "Compressed PDF Size (bytes)" },
          { id: "compressionRatio", title: "Compression Ratio (%)" },
          { id: "aiInsights", title: "AI Insights Used" },
          { id: "userDescription", title: "User Description" },
        ],
        append: true, // Append to existing file
      });

      const record = {
        quoteId: userData.quoteId,
        timestamp: userData.timestamp,
        clientName: userData.quote.clientInfo.name,
        clientEmail: userData.quote.clientInfo.email,
        clientPhone: userData.quote.clientInfo.phone || "",
        clientAddress: `${userData.quote.clientInfo.address}, ${userData.quote.clientInfo.city}, ${userData.quote.clientInfo.state} ${userData.quote.clientInfo.zipCode}`,
        services: userData.quote.services.map((s) => s.name).join("; "),
        totalAmount: userData.quote.pricing.totalAmount,
        state: userData.quote.clientInfo.state,
        taxAmount: userData.quote.pricing.tax,
        pdfPath: userData.pdfInfo.path,
        originalSize: userData.pdfInfo.originalSize,
        compressedSize: userData.pdfInfo.compressedSize,
        compressionRatio: userData.pdfInfo.compressionRatio,
        aiInsights: userData.aiInsights ? "Yes" : "No",
        userDescription: userData.userDescription || "",
      };

      await csvWriter.writeRecords([record]);
      console.log("Record added to spreadsheet");
    } catch (error) {
      console.error("Error adding to spreadsheet:", error);
      throw error;
    }
  }

  // Retrieve user's quotes
  async getUserQuotes(userEmail) {
    try {
      const userDir = path.join(
        this.userDataDir,
        this.sanitizeFilename(userEmail)
      );
      const userExists = await fs.pathExists(userDir);

      if (!userExists) {
        return [];
      }

      const files = await fs.readdir(userDir);
      const quotes = [];

      for (const file of files) {
        if (file.endsWith(".json")) {
          const filePath = path.join(userDir, file);
          const userData = await fs.readJson(filePath);
          quotes.push(userData);
        }
      }

      // Sort by timestamp (newest first)
      quotes.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      return quotes;
    } catch (error) {
      console.error("Error retrieving user quotes:", error);
      throw new Error(`Failed to retrieve user quotes: ${error.message}`);
    }
  }

  // Get storage statistics
  async getStorageStats() {
    try {
      const stats = {
        totalQuotes: 0,
        totalPDFSize: 0,
        totalCompressedSize: 0,
        totalUsers: 0,
        storageDirectory: this.storageDir,
      };

      // Count PDF files and calculate sizes
      const pdfFiles = await fs.readdir(this.pdfsDir);
      stats.totalQuotes = pdfFiles.filter((f) => f.endsWith(".pdf")).length;

      for (const file of pdfFiles) {
        if (file.endsWith(".pdf")) {
          const filePath = path.join(this.pdfsDir, file);
          const fileStats = await fs.stat(filePath);
          stats.totalPDFSize += fileStats.size;
        }
      }

      // Count unique users
      const userDirs = await fs.readdir(this.userDataDir);
      stats.totalUsers = userDirs.length;

      // Calculate total compressed size from spreadsheet
      const spreadsheetExists = await fs.pathExists(this.spreadsheetPath);
      if (spreadsheetExists) {
        const csvContent = await fs.readFile(this.spreadsheetPath, "utf8");
        const lines = csvContent.split("\n").slice(1); // Skip header

        for (const line of lines) {
          if (line.trim()) {
            const columns = line.split(",");
            if (columns.length > 12 && columns[12]) {
              stats.totalCompressedSize += parseInt(columns[12]) || 0;
            }
          }
        }
      }

      stats.compressionSavings = stats.totalPDFSize - stats.totalCompressedSize;
      stats.compressionRatio =
        stats.totalPDFSize > 0
          ? ((stats.compressionSavings / stats.totalPDFSize) * 100).toFixed(2)
          : 0;

      return stats;
    } catch (error) {
      console.error("Error getting storage stats:", error);
      throw new Error(`Failed to get storage statistics: ${error.message}`);
    }
  }

  // Utility function to sanitize filenames
  sanitizeFilename(filename) {
    return filename.replace(/[^a-z0-9@.-]/gi, "_").toLowerCase();
  }
}

module.exports = new PDFStorageService();
