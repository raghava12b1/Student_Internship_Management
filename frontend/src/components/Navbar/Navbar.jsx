import { useState } from "react";
import "./Navbar.css";
import { NavLink, Link } from "react-router-dom";

import logo from "../../assets/images/aditya-logo.jpg";
import portalLogo from "../../assets/images/SIMS.svg";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">

      <div className="container">

        <div className="navbar-content">

          {/* =================================================
              LOGO SECTION
          ================================================= */}

          <div className="logo-section">

            <Link
              to="/"
              onClick={closeMenu}
              className="logo-link"
            >

              <img
                src={logo}
                alt="Aditya University"
                className="logo-image"
              />

            </Link>


            <div className="logo-divider"></div>


            <div className="portal-text">

              <div className="SIMSSVG">

                <img
                  src={portalLogo}
                  alt="Aditya University Student Internship Management Portal"
                  className="portal-logo"
                />

              </div>

            </div>

          </div>


          {/* =================================================
              MOBILE MENU BUTTON
          ================================================= */}

          <button
            className={`menu-icon ${
              menuOpen ? "menu-open" : ""
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >

            <span></span>
            <span></span>
            <span></span>

          </button>


          {/* =================================================
              NAVIGATION
          ================================================= */}

          <ul
            className={`nav-links ${
              menuOpen ? "active" : ""
            }`}
          >

            {/* HOME */}

            <li>

              <NavLink
                to="/"
                end
                onClick={closeMenu}
                className={({ isActive }) =>
                  isActive ? "nav-active" : ""
                }
              >
                <span>Home</span>
              </NavLink>

            </li>


            {/* DEVELOPERS */}

            <li>

              <NavLink
                to="/developers"
                onClick={closeMenu}
                className={({ isActive }) =>
                  isActive ? "nav-active" : ""
                }
              >
                <span>Developers</span>
              </NavLink>

            </li>


            {/* ABOUT */}

            <li>

              <NavLink
                to="/about"
                onClick={closeMenu}
                className={({ isActive }) =>
                  isActive ? "nav-active" : ""
                }
              >
                <span>About</span>
              </NavLink>

            </li>


            {/* CONTACT */}

            <li>

              <NavLink
                to="/contact"
                onClick={closeMenu}
                className={({ isActive }) =>
                  isActive ? "nav-active" : ""
                }
              >
                <span>Contact</span>
              </NavLink>

            </li>

          </ul>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;