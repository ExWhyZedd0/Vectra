import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "../assets/Vectra-Logo.svg";
import "./navbar.css";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav>
      <div className="logo-menu">
      <Link to="/" className="title">
        <img src={Logo} alt="Vectra Logo" className="logo" />
        <p className="logo-text">Vec<span>tra</span></p>
      </Link>
        <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <ul className={menuOpen ? "open" : ""}>
          <li>
            <NavLink to="/market">Market</NavLink>
          </li>
          <li>
            <NavLink to="/news">News</NavLink>
          </li>
          <li>
            <NavLink to="/faq">FAQ</NavLink>
          </li>
          <li>
            <NavLink to="/about-us">About Us</NavLink>
          </li>
        </ul>
      </div>
      {/* <div className="login-signup">
        <ul className={menuOpen ? "open" : ""}>
          <li>
            <Navlink to="/login">Login</Navlink>
          </li>
          <li>
            <Navlink to="/signup">Sign Up</Navlink>
          </li>
        </ul>
      </div> */}
    </nav>
  );
};
