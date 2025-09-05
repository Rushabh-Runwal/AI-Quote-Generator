import React, { useState } from "react";
import { SERVICES, STATES } from "../services";
import ServiceCard from "../components/ServiceCard";
import AIDescriptionForm from "../components/AIDescriptionForm";
import AIQuoteResults from "../components/AIQuoteResults";
import Navbar from "../components/Navbar";
import { API_ENDPOINTS } from "../config/api";
import {
  FaFileContract,
  FaGavel,
  FaBuilding,
  FaTrademark,
  FaUserTie,
  FaShieldAlt,
  FaClock,
  FaDownload,
  FaRobot,
  FaList,
  FaHome,
  FaHeart,
  FaBriefcase,
  FaUserShield,
  FaBalanceScale,
} from "react-icons/fa";

export default function Home() {
  // Mode selection
  const [isAIMode, setIsAIMode] = useState(true);

  // Traditional mode state
  const [selectedServices, setSelectedServices] = useState([]);
  const [state, setState] = useState("");
  const [clientInfo, setClientInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // AI mode state
  const [aiQuote, setAiQuote] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);
  const [aiDocument, setAiDocument] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const icons = [
    <FaFileContract key={0} size={32} color="#2a4d8f" />, // Contract Review
    <FaGavel key={1} size={32} color="#2a4d8f" />, // Will Preparation
    <FaBuilding key={2} size={32} color="#2a4d8f" />, // Business Formation
    <FaTrademark key={3} size={32} color="#2a4d8f" />, // Trademark Filing
    <FaUserTie key={4} size={32} color="#2a4d8f" />, // Legal Consultation
    <FaHome key={5} size={32} color="#2a4d8f" />, // Property Law
    <FaHeart key={6} size={32} color="#2a4d8f" />, // Family Law
    <FaBriefcase key={7} size={32} color="#2a4d8f" />, // Employment Law
    <FaUserShield key={8} size={32} color="#2a4d8f" />, // Personal Injury
    <FaBalanceScale key={9} size={32} color="#2a4d8f" />, // Criminal Defense
  ];

  // AI Mode Handlers
  const handleAISubmit = async (userDescription) => {
    setAiLoading(true);
    setAiError("");
    setAiQuote(null);
    setAiInsights(null);
    setAiDocument(null);

    try {
      if (!state) {
        throw new Error("Please select your state before submitting.");
      }
      if (!clientInfo.name || !clientInfo.email) {
        throw new Error(
          "Please provide your name and email before submitting."
        );
      }

      const response = await fetch(API_ENDPOINTS.AI_QUOTE_WITH_PDF, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userDescription,
          state,
          clientInfo,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate AI quote");
      }

      const data = await response.json();
      setAiQuote(data.quote);
      setAiInsights(data.aiInsights);
      setAiDocument(data.document);
    } catch (err) {
      setAiError(err.message || "Something went wrong with AI analysis.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleAIDownloadPDF = async () => {
    console.log("handleAIDownloadPDF called");
    if (!aiDocument) {
      alert("No PDF available. Please generate a quote first.");
      return;
    }
    console.log("Downloading AI PDF from:", aiDocument);
    try {
      const response = await fetch(
        `${API_ENDPOINTS.DOWNLOAD_PDF}${aiDocument.downloadUrl}`
      );

      if (!response.ok) {
        throw new Error("Failed to download PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = aiDocument.filename || `ai-quote-${aiQuote.quoteId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      alert("Failed to download PDF: " + error.message);
    }
  };

  // Traditional Mode Handlers
  const handleServiceClick = (value) => {
    setSelectedServices((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setQuote(null);
    try {
      if (!selectedServices.length || !state)
        throw new Error("Please select at least one service and a state.");
      if (!clientInfo.name || !clientInfo.email)
        throw new Error("Please provide your name and email.");

      const response = await fetch(API_ENDPOINTS.QUOTE_WITH_PDF, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedServices,
          state,
          clientInfo,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate quote");
      }

      const data = await response.json();
      setQuote({
        ...data.quote,
        document: data.document,
      });
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!quote || !quote.document) {
      alert("No PDF available. Please generate a quote first.");
      return;
    }
    try {
      const response = await fetch(
        `${API_ENDPOINTS.BASE_URL}${quote.document.downloadUrl}`
      );

      if (!response.ok) {
        throw new Error("Failed to download PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = quote.document.filename || `quote-${quote.quoteId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      alert("Failed to download PDF: " + error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="hero-section">
          <h1>Professional Legal Services</h1>
          <p className="subtitle">
            Get instant quotes for professional legal services with AI-powered
            recommendations.
          </p>
        </div>

        <div className="feature-grid">
          <div className="feature-card">
            <FaRobot size={32} color="#2a4d8f" />
            <h3>AI-Powered Analysis</h3>
            <p>
              Describe your needs and let AI recommend the perfect legal
              services.
            </p>
          </div>
          <div className="feature-card">
            <FaClock size={32} color="#2a4d8f" />
            <h3>Instant Quotes</h3>
            <p>
              Get accurate pricing with detailed reports and state-specific
              terms.
            </p>
          </div>
          <div className="feature-card">
            <FaDownload size={32} color="#2a4d8f" />
            <h3>Professional PDFs</h3>
            <p>Download comprehensive legal quotes with enhanced reporting.</p>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="mode-toggle-section">
          <h2>Choose Your Quote Method</h2>
          <div className="mode-toggle">
            <button
              type="button"
              className={`mode-btn ${isAIMode ? "active" : ""}`}
              onClick={() => setIsAIMode(true)}
            >
              <FaRobot />
              AI-Powered Quote
              <span className="mode-description">
                Describe your needs in plain English
              </span>
            </button>
            <button
              type="button"
              className={`mode-btn ${!isAIMode ? "active" : ""}`}
              onClick={() => setIsAIMode(false)}
            >
              <FaList />
              Manual Selection
              <span className="mode-description">
                Choose from predefined services
              </span>
            </button>
          </div>
        </div>

        {/* Client Information Section (Common for both modes) */}
        <div className="client-info-section">
          <h2 style={{ color: "#2a4d8f", marginBottom: "1rem" }}>
            Your Information
          </h2>
          <div className="client-info-grid">
            <div>
              <label htmlFor="name">Full Name *</label>
              <input
                id="name"
                type="text"
                value={clientInfo.name}
                onChange={(e) =>
                  setClientInfo({ ...clientInfo, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label htmlFor="email">Email Address *</label>
              <input
                id="email"
                type="email"
                value={clientInfo.email}
                onChange={(e) =>
                  setClientInfo({ ...clientInfo, email: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                type="tel"
                value={clientInfo.phone}
                onChange={(e) =>
                  setClientInfo({ ...clientInfo, phone: e.target.value })
                }
              />
            </div>
          </div>

          <div className="state-selection">
            <label htmlFor="state">Select State *</label>
            <select
              id="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            >
              <option value="">-- Choose your state --</option>
              {STATES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* AI Mode Content */}
        {isAIMode && (
          <div className="ai-mode-content">
            {!aiQuote && (
              <AIDescriptionForm
                onSubmit={handleAISubmit}
                loading={aiLoading}
              />
            )}

            {aiError && <div className="result error-message">{aiError}</div>}

            {aiQuote && (
              <AIQuoteResults
                quote={aiQuote}
                document={aiDocument}
                aiInsights={aiInsights}
                onDownloadPDF={handleAIDownloadPDF}
              />
            )}
          </div>
        )}

        {/* Traditional Mode Content */}
        {!isAIMode && (
          <div className="traditional-mode-content">
            <form onSubmit={handleSubmit}>
              <label>Select Legal Services *</label>
              <div className="services-grid">
                {SERVICES.map((s, i) => (
                  <ServiceCard
                    key={s.value}
                    label={s.label}
                    price={s.basePrice}
                    icon={icons[i]}
                    selected={selectedServices.includes(s.value)}
                    onClick={() => handleServiceClick(s.value)}
                  />
                ))}
              </div>

              <button type="submit" disabled={loading}>
                {loading && (
                  <span className="loader" style={{ marginRight: 8 }} />
                )}
                {loading ? "Generating Quote..." : "Get Professional Quote"}
              </button>
            </form>

            {error && <div className="result error-message">{error}</div>}

            {quote && (
              <div className="result">
                <h3 style={{ marginBottom: "1rem", color: "#2a4d8f" }}>
                  Quote #{quote.quoteId}
                </h3>
                <div className="result-item">
                  <span>Client:</span>
                  <span>{quote.clientInfo.name}</span>
                </div>
                <div className="result-item">
                  <span>Email:</span>
                  <span>{quote.clientInfo.email}</span>
                </div>
                <div className="result-item">
                  <span>Services:</span>
                  <span>{quote.services.map((s) => s.label).join(", ")}</span>
                </div>
                <div className="result-item">
                  <span>State:</span>
                  <span>{quote.state.label}</span>
                </div>
                <div className="result-item">
                  <span>Base Price:</span>
                  <span>${quote.pricing.basePrice}</span>
                </div>
                <div className="result-item">
                  <span>
                    Tax ({(quote.pricing.taxRate * 100).toFixed(2)}%):
                  </span>
                  <span>${quote.pricing.taxAmount}</span>
                </div>
                <div className="result-item">
                  <span>Total:</span>
                  <span>${quote.pricing.totalAmount}</span>
                </div>
                {quote.document && (
                  <>
                    <div className="result-item">
                      <span>PDF Status:</span>
                      <span style={{ color: "#059669", fontWeight: "600" }}>
                        ✓ {quote.document.status} ({quote.document.filename})
                      </span>
                    </div>
                    <button
                      onClick={handleDownloadPDF}
                      style={{ marginTop: "1rem", background: "#059669" }}
                    >
                      <FaDownload style={{ marginRight: "8px" }} />
                      Download PDF Quote (
                      {Math.round(quote.document.compressedSize / 1024)}KB)
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .mode-toggle-section {
          text-align: center;
          margin: 3rem 0;
        }

        .mode-toggle-section h2 {
          color: #2a4d8f;
          margin-bottom: 2rem;
        }

        .mode-toggle {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .mode-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1.5rem 2rem;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 200px;
          color: #2a4d8f;
        }

        .mode-btn:hover {
          border-color: #2a4d8f;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(42, 77, 143, 0.15);
        }

        .mode-btn.active {
          border-color: #2a4d8f;
          background: linear-gradient(135deg, #2a4d8f 0%, #1e3a8a 100%);
          color: white;
        }

        .mode-btn .mode-description {
          font-size: 0.875rem;
          opacity: 0.8;
        }

        .client-info-section {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          margin-bottom: 2rem;
        }

        .client-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .state-selection {
          margin-top: 1rem;
        }

        .ai-mode-content,
        .traditional-mode-content {
          margin-top: 2rem;
        }

        @media (max-width: 768px) {
          .mode-toggle {
            flex-direction: column;
            align-items: center;
          }

          .mode-btn {
            width: 100%;
            max-width: 300px;
          }

          .client-info-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
