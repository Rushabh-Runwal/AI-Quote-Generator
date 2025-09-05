import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement actual form submission
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="hero-section">
          <h1>Contact Us</h1>
          <p className="subtitle">
            Get in touch with our legal experts. We're here to help you with all
            your legal service needs.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "3rem",
            marginBottom: "3rem",
          }}
        >
          <div>
            <h2 style={{ color: "#2a4d8f", marginBottom: "2rem" }}>
              Get In Touch
            </h2>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <FaPhone
                size={20}
                color="#2a4d8f"
                style={{ marginRight: "1rem" }}
              />
              <div>
                <div style={{ fontWeight: "600" }}>Phone</div>
                <div style={{ color: "#6b7280" }}>+1 (555) 123-4567</div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <FaEnvelope
                size={20}
                color="#2a4d8f"
                style={{ marginRight: "1rem" }}
              />
              <div>
                <div style={{ fontWeight: "600" }}>Email</div>
                <div style={{ color: "#6b7280" }}>
                  contact@legalquotepro.com
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <FaMapMarkerAlt
                size={20}
                color="#2a4d8f"
                style={{ marginRight: "1rem" }}
              />
              <div>
                <div style={{ fontWeight: "600" }}>Address</div>
                <div style={{ color: "#6b7280" }}>
                  123 Legal Street
                  <br />
                  New York, NY 10001
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <FaClock
                size={20}
                color="#2a4d8f"
                style={{ marginRight: "1rem" }}
              />
              <div>
                <div style={{ fontWeight: "600" }}>Business Hours</div>
                <div style={{ color: "#6b7280" }}>
                  Mon-Fri: 9AM-6PM EST
                  <br />
                  Sat-Sun: 10AM-4PM EST
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 style={{ color: "#2a4d8f", marginBottom: "2rem" }}>
              Send Message
            </h2>
            {submitted ? (
              <div className="result">
                <h3 style={{ color: "#059669", marginBottom: "1rem" }}>
                  Thank you!
                </h3>
                <p>
                  Your message has been sent successfully. We'll get back to you
                  within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <label htmlFor="name">Full Name *</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

                <label htmlFor="email">Email Address *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <label htmlFor="subject">Subject *</label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />

                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  required
                />

                <button type="submit">Send Message</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
