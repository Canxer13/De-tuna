import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column footer-logo">
          {/* Path gambar diubah */}
          <img src="/image/logo buat di footer.png" alt="De Tuna Resort Logo" />
          <p>
            De Tuna Resort is a tropical beachfront escape embracing Balinese
            luxury, soul, and warm hospitality for an unforgettable experience.
          </p>
          <h4>Media Sosial</h4>
          <div className="social-icons">
            {/* Ganti path image juga (asumsi di /image/) */}
            <a href="#">
              <img src="/image/ig.png" alt="Instagram" />
            </a>
            <a href="#">
              <img src="/image/fb.png" alt="Facebook" />
            </a>
            <a href="#">
              <img src="/image/yt.png" alt="YouTube" />
            </a>
            <a href="#">
              <img src="/image/tw.png" alt="Twitter" />
            </a>
          </div>
        </div>

        <div className="footer-column footer-links">
          <h4>Quick Links</h4>
          <ul>
            {/* Ganti <a> dengan <Link> */}
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/rooms">Rooms & Villas</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </div>

        <div className="footer-column footer-contact">
          <h4>Contact Us</h4>
          <ul>
            <li>📍 Jalan Pantai Indah No. 88, Bali, Indonesia</li>
            <li>📞 +62 812 3456 7890</li>
            <li>📧 info@detunaresort.com</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 De Tuna Resort. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
