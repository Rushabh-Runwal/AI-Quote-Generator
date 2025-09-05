const axios = require("axios");
const FormData = require("form-data");

class AsyncPDFCompressionService {
  constructor() {
    this.clientId = "foxit_NikiMXznAdFUerSO";
    this.clientSecret = "s6Kw12ti5WLM2XcK-w3rOZoACpRKZz5T";
    this.uploadURL =
      "https://na1.fusion.foxit.com/pdf-services/api/documents/upload";
    this.compressURL =
      "https://na1.fusion.foxit.com/pdf-services/api/documents/modify/pdf-compress";
    this.taskStatusURL = "https://na1.fusion.foxit.com/pdf-services/api/tasks";
    this.downloadURL =
      "https://na1.fusion.foxit.com/pdf-services/api/documents";
  }

  // Step 1: Upload PDF file to Foxit cloud storage
  async uploadPDF(pdfBuffer, filename) {
    try {
      console.log("=== UPLOADING PDF TO FOXIT ===");
      console.log("File size:", pdfBuffer.length, "bytes");
      console.log("Filename:", filename);

      // Create form data for multipart upload
      const formData = new FormData();
      formData.append("file", pdfBuffer, {
        filename: filename,
        contentType: "application/pdf",
      });

      const headers = {
        ...formData.getHeaders(),
        client_id: this.clientId,
        client_secret: this.clientSecret,
      };

      const response = await axios.post(this.uploadURL, formData, {
        headers,
        timeout: 60000,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      if (!response.data || !response.data.documentId) {
        throw new Error(
          "Invalid response from Foxit Upload API - no documentId returned"
        );
      }

      console.log(
        "PDF uploaded successfully. Document ID:",
        response.data.documentId
      );
      return response.data.documentId;
    } catch (error) {
      console.error("Upload error:", error.response?.data || error.message);
      throw new Error(`Failed to upload PDF: ${error.message}`);
    }
  }

  // Step 2: Start compression task
  async startCompression(documentId, compressionLevel = "MEDIUM") {
    try {
      console.log("=== STARTING PDF COMPRESSION ===");
      console.log("Document ID:", documentId);
      console.log("Compression Level:", compressionLevel);

      const payload = {
        documentId: documentId,
        compressionLevel: compressionLevel, // LOW, MEDIUM, HIGH
      };

      const response = await axios.post(this.compressURL, payload, {
        headers: {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          "Content-Type": "application/json",
        },
        timeout: 120000,
      });

      if (!response.data || !response.data.taskId) {
        throw new Error(
          "Invalid response from Foxit Compression API - no taskId returned"
        );
      }

      console.log(
        "PDF compression task started. Task ID:",
        response.data.taskId
      );
      return response.data.taskId;
    } catch (error) {
      console.error(
        "Compression error:",
        error.response?.data || error.message
      );
      throw new Error(`Failed to start compression: ${error.message}`);
    }
  }

  // Step 3: Check task status
  async checkTaskStatus(taskId) {
    try {
      console.log("=== CHECKING TASK STATUS ===");
      console.log("Task ID:", taskId);

      const response = await axios.get(`${this.taskStatusURL}/${taskId}`, {
        headers: {
          client_id: this.clientId,
          client_secret: this.clientSecret,
        },
        timeout: 30000,
      });

      if (!response.data) {
        throw new Error("No data received from Foxit Task Status API");
      }

      console.log("Task Status:", response.data.status);
      console.log("Task Progress:", response.data.progress || 0, "%");

      return {
        taskId: response.data.taskId,
        status: response.data.status,
        progress: response.data.progress || 0,
        resultDocumentId: response.data.resultDocumentId,
        error: response.data.error,
      };
    } catch (error) {
      console.error(
        "Status check error:",
        error.response?.data || error.message
      );
      throw new Error(`Failed to check task status: ${error.message}`);
    }
  }

  // Step 4: Download compressed PDF
  async downloadCompressedPDF(documentId, filename = null) {
    try {
      console.log("=== DOWNLOADING COMPRESSED PDF ===");
      console.log("Document ID:", documentId);

      const downloadUrl = filename
        ? `${this.downloadURL}/${documentId}/download?filename=${filename}`
        : `${this.downloadURL}/${documentId}/download`;

      const response = await axios.get(downloadUrl, {
        headers: {
          client_id: this.clientId,
          client_secret: this.clientSecret,
        },
        responseType: "arraybuffer",
        timeout: 60000,
      });

      if (!response.data) {
        throw new Error("No data received from Foxit Download API");
      }

      console.log(
        "Compressed PDF downloaded successfully. Size:",
        response.data.byteLength,
        "bytes"
      );
      return Buffer.from(response.data);
    } catch (error) {
      console.error("Download error:", error.response?.data || error.message);
      throw new Error(`Failed to download compressed PDF: ${error.message}`);
    }
  }

  // Wait for task completion with polling
  async waitForTaskCompletion(
    taskId,
    maxWaitTimeMs = 60000,
    pollIntervalMs = 5000
  ) {
    const startTime = Date.now();

    console.log(
      `Waiting for task ${taskId} to complete (max ${maxWaitTimeMs / 1000}s)`
    );

    while (Date.now() - startTime < maxWaitTimeMs) {
      try {
        const taskStatus = await this.checkTaskStatus(taskId);
        console.log("Task state:", taskStatus.status);
        if (
          taskStatus.status === "COMPLETED" ||
          taskStatus.status === "SUCCESS"
        ) {
          console.log("Task completed successfully!");
          return taskStatus;
        } else if (
          taskStatus.status === "FAILED" ||
          taskStatus.status === "ERROR"
        ) {
          const errorMsg = taskStatus.error?.message || "Unknown error";
          throw new Error(`Task failed: ${errorMsg}`);
        } else if (
          taskStatus.status === "PROCESSING" ||
          taskStatus.status === "IN_PROGRESS"
        ) {
          console.log(
            `Task still processing (${taskStatus.progress}%), waiting ${
              pollIntervalMs / 1000
            }s...`
          );
          await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
        } else {
          console.log(
            `Task status: ${taskStatus.status}, waiting ${
              pollIntervalMs / 1000
            }s...`
          );
          await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
        }
      } catch (error) {
        console.error("Error checking task status:", error.message);
        await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
      }
    }

    throw new Error(
      `Task ${taskId} did not complete within ${maxWaitTimeMs / 1000} seconds`
    );
  }

  // Complete async compression workflow
  async compressAndStorePDFAsync(
    pdfBuffer,
    filename,
    quote,
    aiInsights,
    userDescription,
    storageService
  ) {
    try {
      console.log("=== STARTING ASYNC COMPRESSION WORKFLOW ===");
      console.log("Original PDF size:", pdfBuffer.length, "bytes");
      // Step 1: Upload PDF
      const documentId = await this.uploadPDF(pdfBuffer, filename);
      console.log("Uploaded Document ID:", documentId);
      // Step 2: Start compression
      const taskId = await this.startCompression(documentId, "MEDIUM");
      console.log("Started Compression Task ID:", taskId);
      // Step 3: Wait for completion
      const completedTask = await this.waitForTaskCompletion(taskId);
      console.log("Compression Task Completed:", completedTask);
      // Step 4: Download compressed PDF
      const resultDocumentId = completedTask.resultDocumentId || documentId;
      const compressedBuffer = await this.downloadCompressedPDF(
        resultDocumentId,
        filename
      );
      console.log("Downloaded Compressed PDF Buffer");
      // Calculate compression ratio
      const compressionRatio = (
        ((pdfBuffer.length - compressedBuffer.length) / pdfBuffer.length) *
        100
      ).toFixed(2);

      console.log("=== COMPRESSION COMPLETED ===");
      console.log("Original size:", pdfBuffer.length, "bytes");
      console.log("Compressed size:", compressedBuffer.length, "bytes");
      console.log("Compression ratio:", compressionRatio + "%");
      console.log(
        "Savings:",
        pdfBuffer.length - compressedBuffer.length,
        "bytes"
      );

      // Store the compressed PDF
      const storageData = {
        quote: quote,
        aiInsights: aiInsights,
        userDescription: userDescription,
        originalBuffer: pdfBuffer,
        compressedBuffer: compressedBuffer,
        originalSize: pdfBuffer.length,
        compressedSize: compressedBuffer.length,
        compressionRatio: parseFloat(compressionRatio),
      };

      const storageResult = await storageService.savePDFWithUserData(
        storageData
      );

      console.log(
        "Compressed PDF stored successfully at:",
        storageResult.pdfPath
      );

      return {
        success: true,
        originalSize: pdfBuffer.length,
        compressedSize: compressedBuffer.length,
        compressionRatio: parseFloat(compressionRatio),
        storedAt: storageResult.pdfPath,
        taskId: taskId,
        documentId: resultDocumentId,
      };
    } catch (error) {
      console.error("Async compression workflow failed:", error.message);

      // Fallback: Store original PDF if compression fails
      try {
        console.log("Falling back to storing original PDF...");
        const fallbackStorageData = {
          quote: quote,
          aiInsights: aiInsights,
          userDescription: userDescription,
          originalBuffer: pdfBuffer,
          compressedBuffer: null,
          originalSize: pdfBuffer.length,
          compressedSize: pdfBuffer.length,
          compressionRatio: 0,
        };

        const fallbackResult = await storageService.savePDFWithUserData(
          fallbackStorageData
        );
        console.log(
          "Original PDF stored as fallback at:",
          fallbackResult.pdfPath
        );

        return {
          success: true,
          originalSize: pdfBuffer.length,
          compressedSize: pdfBuffer.length,
          compressionRatio: 0,
          storedAt: fallbackResult.pdfPath,
          error: error.message,
          fallback: true,
        };
      } catch (fallbackError) {
        console.error("Fallback storage also failed:", fallbackError.message);
        throw new Error(
          `Both compression and fallback storage failed: ${error.message}`
        );
      }
    }
  }
}

module.exports = new AsyncPDFCompressionService();
