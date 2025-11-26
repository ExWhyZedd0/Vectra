import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "../assets/Vectra-Logo.svg";
import "./navbar.css";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav>
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
          <NavLink to="/news">News</NavLink>
        </li>
        <li>
          <NavLink to="/market">Market</NavLink>
        </li>
        <li>
          <NavLink to="/about">About Us</NavLink>
        </li>
      </ul>
    </nav>
  );
};
