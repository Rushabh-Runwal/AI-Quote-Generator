import React, { useState } from "react";
import { FaRobot, FaLightbulb, FaChevronRight } from "react-icons/fa";

const AIDescriptionForm = ({ onSubmit, loading = false }) => {
  const [description, setDescription] = useState("");
  const [wordCount, setWordCount] = useState(0);

  const handleDescriptionChange = (e) => {
    const text = e.target.value;
    setDescription(text);
    setWordCount(
      text
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (description.trim().length < 10) {
      alert(
        "Please provide a more detailed description of your legal needs (at least 10 characters)."
      );
      return;
    }
    onSubmit(description.trim());
  };

  const examples = [
    "I need help starting a small consulting business in Texas. I want to protect my business name and need contracts for my clients.",
    "My neighbor is threatening to sue me over a property line dispute. I need legal advice on my rights and options.",
    "I want to create a will that includes my house, savings, and ensures my children are taken care of.",
    "Someone is using my creative work without permission. I need help protecting my intellectual property.",
    "I'm getting divorced and need help with asset division and child custody arrangements.",
  ];

  return (
    <div className="ai-form-container">
      <div className="ai-header">
        <FaRobot size={32} color="#2a4d8f" />
        <div>
          <h2>Describe Your Legal Needs</h2>
          <p>
            Tell us about your situation and our AI will recommend the right
            legal services for you.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="ai-form">
        <div className="description-input-container">
          <label htmlFor="legal-description">
            What legal help do you need? <span className="required">*</span>
          </label>
          <textarea
            id="legal-description"
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Describe your legal situation in detail. Include what you want to accomplish, any deadlines, and specific concerns you have..."
            rows={6}
            maxLength={1000}
            required
          />
          <div className="input-footer">
            <span className={`word-count ${wordCount > 250 ? "warning" : ""}`}>
              {wordCount} words{" "}
              {wordCount > 50 ? "✓" : "(minimum 10-15 words recommended)"}
            </span>
            <span className="char-count">
              {description.length}/1000 characters
            </span>
          </div>
        </div>

        <div className="examples-section">
          <div className="examples-header">
            <FaLightbulb size={16} color="#f59e0b" />
            <span>Example descriptions:</span>
          </div>
          <div className="examples-grid">
            {examples.map((example, index) => (
              <div
                key={index}
                className="example-item"
                onClick={() => setDescription(example)}
              >
                <span className="example-text">{example}</span>
                <FaChevronRight size={12} />
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || description.trim().length < 10}
          className="ai-submit-btn"
        >
          {loading && <span className="loader" />}
          {loading ? "Analyzing Your Needs..." : "Get AI-Powered Quote"}
          {!loading && <FaRobot style={{ marginLeft: "8px" }} />}
        </button>
      </form>

      <style jsx>{`
        .ai-form-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border-radius: 16px;
          border: 2px solid #e2e8f0;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .ai-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e2e8f0;
        }

        .ai-header h2 {
          margin: 0;
          color: #1e293b;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .ai-header p {
          margin: 0.5rem 0 0 0;
          color: #64748b;
          font-size: 0.95rem;
        }

        .ai-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .description-input-container {
          position: relative;
        }

        .description-input-container label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #374151;
          font-size: 1rem;
        }

        .required {
          color: #ef4444;
        }

        .description-input-container textarea {
          width: 100%;
          padding: 1rem;
          border: 2px solid #d1d5db;
          border-radius: 12px;
          font-size: 1rem;
          line-height: 1.5;
          resize: vertical;
          min-height: 120px;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .description-input-container textarea:focus {
          outline: none;
          border-color: #2a4d8f;
          box-shadow: 0 0 0 3px rgba(42, 77, 143, 0.1);
        }

        .input-footer {
          display: flex;
          justify-content: space-between;
          margin-top: 0.5rem;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .word-count.warning {
          color: #f59e0b;
        }

        .examples-section {
          margin-top: 1rem;
        }

        .examples-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          font-weight: 600;
          color: #374151;
          font-size: 0.95rem;
        }

        .examples-grid {
          display: grid;
          gap: 0.75rem;
        }

        .example-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.875rem;
          line-height: 1.4;
        }

        .example-item:hover {
          border-color: #2a4d8f;
          background: #f8fafc;
          transform: translateX(4px);
        }

        .example-text {
          flex: 1;
          color: #4b5563;
        }

        .ai-submit-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          background: linear-gradient(135deg, #2a4d8f 0%, #1e3a8a 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 1rem;
        }

        .ai-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(42, 77, 143, 0.3);
        }

        .ai-submit-btn:disabled {
          background: #9ca3af;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .loader {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 768px) {
          .ai-form-container {
            padding: 1.5rem;
            margin: 1rem;
          }

          .ai-header {
            flex-direction: column;
            text-align: center;
          }

          .examples-grid {
            gap: 0.5rem;
          }

          .example-item {
            padding: 0.5rem 0.75rem;
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AIDescriptionForm;
