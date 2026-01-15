import React, { useState } from "react";
import axios from "axios";
import "./Contact.css";

const Contact = () => {
  // State untuk Input Form
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    phone: "",
    comment: "",
  });

  const [loading, setLoading] = useState(false);

  // Handle Perubahan Input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Gabungkan Nama Depan & Belakang
    const fullName = `${formData.firstName} ${formData.lastName}`;

    // Gabungkan No HP ke dalam Pesan (Karena di DB tidak ada kolom phone)
    const finalMessage = `Phone: ${formData.phone || "-"}\n\nMessage:\n${
      formData.comment
    }`;

    const payload = {
      sender_name: fullName,
      sender_email: formData.email,
      subject: formData.subject || "No Subject",
      message_body: finalMessage,
    };

    try {
      await axios.post(
        "import.meta.env.VITE_API_BASE_URL/api/v1/contact-messages",
        payload
      );
      alert("Pesan berhasil dikirim! Terima kasih telah menghubungi kami.");

      // Reset Form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        phone: "",
        comment: "",
      });
    } catch (error) {
      console.error("Gagal kirim pesan:", error);
      alert("Gagal mengirim pesan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="contact-section">
        <div className="contact-container">
          <div className="contact-form">
            <h2>Contact Us</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-row">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                />
              </div>
              <div className="form-row">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Telephone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <textarea
                name="comment"
                placeholder="Comment"
                rows="5"
                required
                value={formData.comment}
                onChange={handleChange}
              ></textarea>

              <div className="recaptcha">
                <button
                  type="button"
                  disabled
                  style={{
                    cursor: "default",
                    background: "#f0f0f0",
                    color: "#888",
                  }}
                >
                  I'm Not Robot (Auto-Verified)
                </button>
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? "Sending..." : "Submit"}
              </button>
            </form>
          </div>

          <div className="contact-image">
            <img src="/image/contact us.png" alt="Beach View" />
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
