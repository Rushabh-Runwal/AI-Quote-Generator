import React, { useState } from "react";
import {
  FaDownload,
  FaRobot,
  FaCheckCircle,
  FaExclamationCircle,
  FaClock,
  FaMoneyBillWave,
  FaFileContract,
  FaChevronDown,
  FaChevronUp,
  FaBrain,
  FaGavel,
} from "react-icons/fa";

const AIQuoteResults = ({ quote, document, aiInsights, onDownloadPDF }) => {
  const [expandedSections, setExpandedSections] = useState({
    analysis: false,
    services: true, // Show services by default
    report: false,
    terms: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return "#059669";
    if (confidence >= 0.6) return "#f59e0b";
    return "#ef4444";
  };

  const getConfidenceText = (confidence) => {
    if (confidence >= 0.8) return "High Confidence";
    if (confidence >= 0.6) return "Medium Confidence";
    return "Low Confidence";
  };

  // Check if this is an AI-generated quote
  const isAIGenerated = quote?.metadata?.isAIGenerated || false;
  const hasAIAnalysis =
    quote?.aiAnalysis && Object.keys(quote.aiAnalysis).length > 0;

  return (
    <div className="ai-results-container">
      {/* Header Section */}
      <div className="results-header">
        <div className="header-content">
          <FaRobot size={32} color="white" />
          <div>
            <h3>
              {isAIGenerated ? "AI-Generated Legal Quote" : "Legal Quote"}
            </h3>
            <p>Quote #{quote.quoteId}</p>
          </div>
        </div>
        {isAIGenerated && (
          <div className="ai-badge">
            <FaBrain size={16} />
            <span>AI-Powered</span>
          </div>
        )}
      </div>

      {/* AI Analysis Section - Only show if AI analysis exists */}
      {hasAIAnalysis && (
        <div className="section-card">
          <div
            className="section-header clickable"
            onClick={() => toggleSection("analysis")}
          >
            <div className="section-title">
              <FaBrain size={20} color="#2a4d8f" />
              <span>AI Analysis of Your Legal Needs</span>
            </div>
            {expandedSections.analysis ? <FaChevronUp /> : <FaChevronDown />}
          </div>

          {expandedSections.analysis && (
            <div className="section-content">
              <div className="analysis-grid">
                <div className="analysis-item">
                  <strong>Original Request:</strong>
                  <p>"{quote.aiAnalysis.originalDescription}"</p>
                </div>
                <div className="analysis-item">
                  <strong>AI Summary:</strong>
                  <p>{quote.aiAnalysis.analysis.summary}</p>
                </div>
                <div className="analysis-metrics">
                  <div className="metric">
                    <span className="metric-label">Complexity:</span>
                    <span
                      className={`metric-value ${quote.aiAnalysis.analysis.complexity}`}
                    >
                      {quote.aiAnalysis.analysis.complexity?.toUpperCase()}
                    </span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Urgency:</span>
                    <span
                      className={`metric-value ${quote.aiAnalysis.analysis.urgency}`}
                    >
                      {quote.aiAnalysis.analysis.urgency?.toUpperCase()}
                    </span>
                  </div>
                </div>
                {quote.aiAnalysis.analysis.keyConsiderations && (
                  <div className="analysis-item">
                    <strong>Key Considerations:</strong>
                    <ul>
                      {quote.aiAnalysis.analysis.keyConsiderations.map(
                        (consideration, index) => (
                          <li key={index}>{consideration}</li>
                        )
                      )}
                    </ul>
                  </div>
                )}
                {quote.aiAnalysis.additionalRecommendations && (
                  <div className="analysis-item">
                    <strong>Additional Recommendations:</strong>
                    <p>{quote.aiAnalysis.additionalRecommendations}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Services Section */}
      <div className="section-card">
        <div
          className="section-header clickable"
          onClick={() => toggleSection("services")}
        >
          <div className="section-title">
            <FaFileContract size={20} color="#2a4d8f" />
            <span>
              {isAIGenerated ? "Recommended Services" : "Selected Services"}
            </span>
          </div>
          {expandedSections.services ? <FaChevronUp /> : <FaChevronDown />}
        </div>

        {expandedSections.services && (
          <div className="section-content">
            <div className="services-grid">
              {quote.services.map((service, index) => {
                // For AI quotes, try to find AI analysis data
                const aiService = hasAIAnalysis
                  ? quote.aiAnalysis.recommendedServices?.find(
                      (ai) => ai.value === service.value
                    )
                  : null;
                const confidence = aiService?.confidence || 0;

                return (
                  <div key={service.value || index} className="service-card">
                    <div className="service-header">
                      <h4>{service.label}</h4>
                      {hasAIAnalysis && aiService && (
                        <div
                          className="confidence-badge"
                          style={{
                            backgroundColor: getConfidenceColor(confidence),
                          }}
                        >
                          {Math.round(confidence * 100)}%
                        </div>
                      )}
                    </div>
                    <p className="service-description">{service.description}</p>
                    <div className="service-details">
                      <span className="service-price">
                        ${service.basePrice}
                      </span>
                      {service.estimatedTime && (
                        <span className="service-time">
                          {service.estimatedTime}
                        </span>
                      )}
                    </div>
                    {hasAIAnalysis && aiService?.reasoning && (
                      <div className="ai-reasoning">
                        <strong>Why recommended:</strong>
                        <p>{aiService.reasoning}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Pricing Summary */}
      <div className="pricing-section">
        <h4>
          <FaMoneyBillWave /> Pricing Breakdown
        </h4>
        <div className="pricing-grid">
          <div className="pricing-row">
            <span>Services Subtotal:</span>
            <span>${quote.pricing.basePrice}</span>
          </div>
          <div className="pricing-row">
            <span>State Fees ({quote.state.label}):</span>
            <span>${quote.pricing.stateAdditionalFees}</span>
          </div>
          <div className="pricing-row">
            <span>Tax ({(quote.pricing.taxRate * 100).toFixed(2)}%):</span>
            <span>${quote.pricing.taxAmount}</span>
          </div>
          <div className="pricing-row total">
            <span>Total Amount:</span>
            <span>${quote.pricing.totalAmount}</span>
          </div>
        </div>
      </div>

      {/* Enhanced Report Section - Only show if exists */}
      {quote.enhancedReport && (
        <div className="section-card">
          <div
            className="section-header clickable"
            onClick={() => toggleSection("report")}
          >
            <div className="section-title">
              <FaGavel size={20} color="#2a4d8f" />
              <span>Detailed Legal Report</span>
            </div>
            {expandedSections.report ? <FaChevronUp /> : <FaChevronDown />}
          </div>

          {expandedSections.report && (
            <div className="section-content">
              <div className="report-content">
                <div className="report-item">
                  <h5>Executive Summary</h5>
                  <p>{quote.enhancedReport.executiveSummary}</p>
                </div>

                {quote.enhancedReport.serviceBreakdown && (
                  <div className="report-item">
                    <h5>Service Breakdown</h5>
                    {quote.enhancedReport.serviceBreakdown.map(
                      (service, index) => (
                        <div key={index} className="service-breakdown">
                          <h6>{service.serviceName}</h6>
                          <p>
                            <strong>Scope:</strong> {service.scope}
                          </p>
                          <p>
                            <strong>Timeline:</strong> {service.timeline}
                          </p>
                          <p>
                            <strong>Cost:</strong> {service.cost}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                )}

                {quote.enhancedReport.nextSteps && (
                  <div className="report-item">
                    <h5>Next Steps</h5>
                    <ol>
                      {quote.enhancedReport.nextSteps.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* State Terms Section - Only show if exists */}
      {quote.stateTerms && (
        <div className="section-card">
          <div
            className="section-header clickable"
            onClick={() => toggleSection("terms")}
          >
            <div className="section-title">
              <FaExclamationCircle size={20} color="#f59e0b" />
              <span>State-Specific Terms & Conditions</span>
            </div>
            {expandedSections.terms ? <FaChevronUp /> : <FaChevronDown />}
          </div>

          {expandedSections.terms && (
            <div className="section-content">
              <div className="terms-content">
                <div className="terms-grid">
                  <div className="terms-item">
                    <h5>Jurisdiction</h5>
                    <p>{quote.stateTerms.jurisdiction}</p>
                  </div>
                  <div className="terms-item">
                    <h5>Client Rights</h5>
                    <p>{quote.stateTerms.clientRights}</p>
                  </div>
                  <div className="terms-item">
                    <h5>State Requirements</h5>
                    <p>{quote.stateTerms.stateRequirements}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PDF Download Section */}
      {document && (
        <div className="download-section">
          <div className="download-info">
            <FaCheckCircle size={20} color="#059669" />
            <div>
              <h4>Your Quote is Ready!</h4>
              <p>Professional PDF with all details included</p>
            </div>
          </div>
          <button onClick={onDownloadPDF} className="download-btn">
            <FaDownload />
            Download {isAIGenerated ? "AI Quote" : "Quote"} PDF
          </button>
        </div>
      )}

      <style jsx>{`
        .ai-results-container {
          max-width: 900px;
          margin: 2rem auto;
          padding: 0 1rem;
        }

        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: linear-gradient(135deg, #2a4d8f 0%, #1e3a8a 100%);
          color: white;
          border-radius: 12px;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .header-content h3 {
          margin: 0;
          font-size: 1.5rem;
        }

        .header-content p {
          margin: 0.25rem 0 0 0;
          opacity: 0.9;
        }

        .ai-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .section-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          margin-bottom: 1.5rem;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          background: #f8fafc;
          border-bottom: 1px solid #e5e7eb;
        }

        .section-header.clickable {
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .section-header.clickable:hover {
          background: #f1f5f9;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 600;
          color: #374151;
        }

        .section-content {
          padding: 1.5rem;
        }

        .analysis-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .analysis-item {
          border-left: 3px solid #2a4d8f;
          padding-left: 1rem;
        }

        .analysis-item strong {
          display: block;
          margin-bottom: 0.5rem;
          color: #374151;
        }

        .analysis-item p {
          color: #6b7280;
          margin: 0;
          line-height: 1.5;
        }

        .analysis-item ul {
          margin: 0.5rem 0 0 1rem;
          color: #6b7280;
        }

        .analysis-metrics {
          display: flex;
          gap: 2rem;
          margin: 1rem 0;
        }

        .metric {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .metric-label {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .metric-value {
          font-weight: 600;
          padding: 0.25rem 0.75rem;
          border-radius: 16px;
          font-size: 0.875rem;
        }

        .metric-value.low {
          background: #dcfce7;
          color: #059669;
        }

        .metric-value.medium {
          background: #fef3c7;
          color: #f59e0b;
        }

        .metric-value.high {
          background: #fee2e2;
          color: #ef4444;
        }

        .services-grid {
          display: grid;
          gap: 1rem;
        }

        .service-card {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 1rem;
          background: #fafafa;
        }

        .service-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.5rem;
        }

        .service-header h4 {
          margin: 0;
          color: #374151;
        }

        .confidence-badge {
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .service-description {
          color: #6b7280;
          margin: 0.5rem 0;
          font-size: 0.875rem;
        }

        .service-details {
          display: flex;
          justify-content: space-between;
          margin: 0.75rem 0;
          font-size: 0.875rem;
        }

        .service-price {
          font-weight: 600;
          color: #059669;
        }

        .service-time {
          color: #6b7280;
        }

        .ai-reasoning {
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid #e5e7eb;
        }

        .ai-reasoning strong {
          display: block;
          margin-bottom: 0.25rem;
          font-size: 0.875rem;
          color: #374151;
        }

        .ai-reasoning p {
          margin: 0;
          font-size: 0.875rem;
          color: #6b7280;
          font-style: italic;
        }

        .pricing-section {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .pricing-section h4 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0 0 1rem 0;
          color: #374151;
        }

        .pricing-grid {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .pricing-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
        }

        .pricing-row.total {
          border-top: 2px solid #e5e7eb;
          margin-top: 0.5rem;
          padding-top: 1rem;
          font-weight: 600;
          font-size: 1.125rem;
          color: #059669;
        }

        .report-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .report-item h5 {
          margin: 0 0 0.75rem 0;
          color: #374151;
          font-size: 1.125rem;
        }

        .report-item h6 {
          margin: 0 0 0.5rem 0;
          color: #2a4d8f;
        }

        .service-breakdown {
          background: #f8fafc;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        .terms-content {
          color: #374151;
        }

        .terms-grid {
          display: grid;
          gap: 1.5rem;
        }

        .terms-item h5 {
          margin: 0 0 0.5rem 0;
          color: #2a4d8f;
        }

        .download-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          color: white;
          padding: 1.5rem;
          border-radius: 12px;
          margin-top: 2rem;
        }

        .download-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .download-info h4 {
          margin: 0;
          font-size: 1.25rem;
        }

        .download-info p {
          margin: 0.25rem 0 0 0;
          opacity: 0.9;
          font-size: 0.875rem;
        }

        .download-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .download-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .ai-results-container {
            padding: 0 0.5rem;
          }

          .results-header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .analysis-metrics {
            flex-direction: column;
            gap: 1rem;
          }

          .download-section {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .section-content {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AIQuoteResults;
