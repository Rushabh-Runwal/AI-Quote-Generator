const axios = require("axios");

class IncredibleAIService {
  constructor() {
    this.baseURL = "https://api.incredible.one/v1";
  }

  // Incredible API doesn't require initialization
  initializeClient() {
    return true;
  }

  // Analyze user description and recommend legal services
  async analyzeUserDescription(userDescription) {
    try {
      const prompt = this.buildAnalysisPrompt(userDescription);

      const response = await axios.post(
        `${this.baseURL}/chat-completion`,
        {
          model: "small-1",
          messages: [
            {
              role: "system",
              content:
                "You are a legal services AI assistant that analyzes client descriptions and recommends appropriate legal services. You must respond with valid JSON only.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          stream: false,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 30000,
        }
      );
      console.log(
        "Incredible AI Response:",
        response.data?.result?.response?.[0]?.content
      );
      const content = response.data?.result?.response?.[0]?.content;

      // Extract JSON from markdown code blocks if present
      let jsonContent = content;
      if (content.includes("```json")) {
        const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          jsonContent = jsonMatch[1];
        }
      } else if (content.includes("```")) {
        const codeMatch = content.match(/```\s*([\s\S]*?)\s*```/);
        if (codeMatch) {
          jsonContent = codeMatch[1];
        }
      }

      const analysis = JSON.parse(jsonContent);
      return {
        recommendedServices: analysis.recommended_services || [],
        reasoning: analysis.reasoning || "AI analysis completed",
        confidence: analysis.confidence || 0.8,
        additionalRecommendations: analysis.additional_recommendations || [],
        urgency: analysis.urgency || "normal",
        estimatedComplexity: analysis.estimated_complexity || "medium",
      };
    } catch (error) {
      console.error("Incredible AI Analysis Error:", error);
      throw new IncredibleAIError(`AI analysis failed: ${error.message}`);
    }
  }

  // Build the analysis prompt
  buildAnalysisPrompt(userDescription) {
    const availableServices = [
      "contract_review",
      "will_preparation",
      "business_formation",
      "trademark_filing",
      "legal_consultation",
      "property_law",
      "family_law",
      "employment_law",
      "personal_injury",
      "criminal_defense",
    ];

    return `
You are a legal services AI assistant. Analyze this legal need and recommend appropriate services.

User Request: "${userDescription}"

Available Services:
- contract_review: Professional review of legal contracts and agreements
- will_preparation: Preparation of wills and estate planning documents  
- business_formation: Legal assistance with forming business entities
- trademark_filing: Filing and protection of trademark applications
- legal_consultation: General legal advice and consultation services
- property_law: Real estate and property-related legal services
- family_law: Divorce, custody, and family-related legal matters
- employment_law: Workplace disputes and employment-related issues
- personal_injury: Personal injury claims and compensation
- criminal_defense: Criminal law defense and representation

Respond ONLY with valid JSON in this format (no markdown, no explanations):
{
  "recommended_services": ["service1", "service2"],
  "reasoning": "Brief explanation of why these services were recommended"
}

Recommend 1-3 most appropriate services from the list above.`;
  }
}

// Custom error class for Incredible AI-related errors
class IncredibleAIError extends Error {
  constructor(message) {
    super(message);
    this.name = "IncredibleAIError";
  }
}

module.exports = new IncredibleAIService();
