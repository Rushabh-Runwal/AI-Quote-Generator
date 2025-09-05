import React from "react";
import Navbar from "../components/Navbar";
import { FaShieldAlt, FaUsers, FaAward, FaClock } from "react-icons/fa";

export default function About() {
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="hero-section">
          <h1>About LegalQuote Pro</h1>
          <p className="subtitle">
            Your trusted partner for transparent legal service pricing and
            professional document generation.
          </p>
        </div>

        <div className="feature-grid">
          <div className="feature-card">
            <FaShieldAlt size={48} color="#2a4d8f" />
            <h3>Secure & Confidential</h3>
            <p>
              We prioritize your privacy with enterprise-grade security measures
              and strict confidentiality protocols.
            </p>
          </div>
          <div className="feature-card">
            <FaUsers size={48} color="#2a4d8f" />
            <h3>Expert Team</h3>
            <p>
              Our team consists of experienced legal professionals committed to
              providing accurate and reliable services.
            </p>
          </div>
          <div className="feature-card">
            <FaAward size={48} color="#2a4d8f" />
            <h3>Quality Assured</h3>
            <p>
              All our documents and services meet the highest professional
              standards and legal requirements.
            </p>
          </div>
          <div className="feature-card">
            <FaClock size={48} color="#2a4d8f" />
            <h3>Quick Turnaround</h3>
            <p>
              Get instant quotes and receive your professional legal documents
              in minutes, not days.
            </p>
          </div>
        </div>

        <div style={{ marginTop: "3rem", textAlign: "center" }}>
          <h2 style={{ color: "#2a4d8f", marginBottom: "1rem" }}>
            Our Mission
          </h2>
          <p
            style={{
              fontSize: "1.1rem",
              lineHeight: "1.6",
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            We believe that legal services should be accessible, transparent,
            and efficient. Our platform combines cutting-edge technology with
            legal expertise to provide instant, accurate quotations and
            professional documentation for all your legal needs. Whether you're
            starting a business, protecting your assets, or need legal
            consultation, we're here to make the process simple and
            straightforward.
          </p>
        </div>
      </div>
    </>
  );
}
