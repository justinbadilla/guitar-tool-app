import "./Footer.css";
import { FaGithub, FaLinkedin } from "react-icons/fa";

/**
 * Footer
 *
 * copyright, tech stack credit, and links to external profiles (Rendered once at the bottom of the Home page)
 */
function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="site-footer">
            <div className="footer-content">
                <p className="footer-line">
                    © {year} Justin Badilla. All rights reserved.
                </p>

                <p className="footer-line footer-tech">
                    Made with React, TypeScript, Spring Boot &amp; PostgreSQL
                </p>

                <div className="footer-links">
                    <a href="https://github.com/justinbadilla" target="_blank" rel="noopener noreferrer" className="footer-icon-link">
                        <FaGithub size={20} />
                    </a>
                    <a href="https://www.linkedin.com/in/justin-badilla-ab2504427/" target="_blank" rel="noopener noreferrer" className="footer-icon-link">
                        <FaLinkedin size={20} />
                    </a>
                </div>

                <p className="footer-disclaimer">
                    This is a portfolio demo project showcasing full-stack development.
                    Account registration is real and functional, but this is not a commercial product
                </p>
            </div>
        </footer>
    );
}

export default Footer;