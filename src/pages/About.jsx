import React from "react";
import "./About.css";
// (Kode dari about.html)

const About = () => {
  return (
    <>
      {/* ABOUT SECTION */}
      <section className="about-section">
        <div className="about-content">
          <div className="about-text">
            <h2>ABOUT US</h2>
            <p>
              Located in the heart of Bali’s tropical paradise, De Tuna Resort
              provides a tranquil and luxurious escape surrounded by lush
              greenery and scenic ocean views. We combine Balinese warmth with
              modern comfort to ensure every guest experiences true relaxation
              and hospitality.
            </p>
          </div>
          <div className="about-image">
            <img src="/image/about us atas.png" alt="Resort View" />
          </div>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="who-section">
        <div className="who-container">
          <img
            src="/image/about us tengah.png"
            alt="Resort Pool"
            className="who-img"
          />
          <div className="who-box">
            <h3>Who We Are</h3>
            <p>
              At De Tuna Resort, we are committed to redefining personalized
              hospitality. Blending our spirit with local Balinese culture, we
              proudly welcome everyone to enjoy a truly relaxing and authentic
              experience.
            </p>
            <p>
              Beyond accommodation and relaxation, we offer an unforgettable
              journey — where relaxation, culture, and hospitality merge for a
              perfect harmony.
            </p>
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="what-section">
        <h2>What We Do</h2>
        <div className="what-cards">
          <div className="card">
            <img src="/image/what we do 1.png" alt="Accommodation" />
            <h4>ACCOMMODATION</h4>
            <p>
              Experience modern comfort with Balinese charm in our private
              villas designed for relaxation and privacy.
            </p>
          </div>
          <div className="card">
            <img src="/image/what we do 2.png" alt="Restaurant" />
            <h4>RESTAURANT</h4>
            <p>
              Our beachfront restaurant serves unique fusion cuisine prepared
              with fresh local ingredients and global flavors.
            </p>
          </div>
          <div className="card">
            <img src="/image/what we do 3.png" alt="Wellness" />
            <h4>WELLNESS & SPA</h4>
            <p>
              Rejuvenate your body and mind with our signature spa treatments
              inspired by traditional Balinese techniques.
            </p>
          </div>
        </div>
      </section>

      {/* OUR TEAM */}
      <section className="team-section">
        <div className="team-container">
          <div className="team-text">
            <h2>Our Team</h2>
            <p>
              At De Tuna Resort, our dedicated team embodies the heart of true
              hospitality. Committed to excellence, every member ensures that
              our guests enjoy comfort and personalized service throughout their
              stay. Together, we make every experience feel like home where
              every detail is handled with genuine warmth.
            </p>
          </div>
          <div className="team-image">
            <img src="/image/about us bawah.png" alt="Our Team" />
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
