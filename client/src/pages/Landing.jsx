import { Link } from "react-router-dom";
import "./Landing.css";

function Landing() {
  return (
    <div className="landing">

      <nav className="navbar">
        <h2>Kalavini</h2>

        <div>
          <Link to="/login" className="nav-btn">
            Login
          </Link>

          <Link to="/register" className="nav-btn primary">
            Get Started
          </Link>
        </div>
      </nav>

      <section className="hero">

        <h1>
          Teach what you know.
          <br />
          Learn what you love.
        </h1>

        <p>
          Kalavini is a hidden talent network where learners and mentors
          connect through skill exchange.
        </p>

        <div className="hero-buttons">
          <Link to="/register" className="hero-btn">
            Join Now
          </Link>

          <Link to="/login" className="hero-btn secondary">
            Login
          </Link>
        </div>

      </section>

      <section className="features">

        <div className="feature-card">
          <h3>🎓 Learn Skills</h3>
          <p>Discover people ready to teach what they know.</p>
        </div>

        <div className="feature-card">
          <h3>🤝 Skill Exchange</h3>
          <p>Exchange your knowledge instead of paying money.</p>
        </div>

        <div className="feature-card">
          <h3>🚀 Grow Together</h3>
          <p>Build connections with learners and mentors.</p>
        </div>

      </section>

      <footer>
        © 2026 Kalavini • Hidden Talent Network
      </footer>

    </div>
  );
}

export default Landing;