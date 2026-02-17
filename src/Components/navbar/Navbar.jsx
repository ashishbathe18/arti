import { NavLink } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  FaHome,
  FaInfoCircle,
  FaBoxOpen,
  FaImages,
  FaBlog,
  FaEnvelope,
} from "react-icons/fa";
import trimurathi from "../../assets/Logo/trimurti.png";
import "./Navbar.css";

const Navbar = () => {
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const domainName = import.meta.env.VITE_DOMAIN_NAME;

  const [categories, setCategories] = useState([]);
  const [showProducts, setShowProducts] = useState(false);

  const navbarTogglerRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE}/categories`, {
        params: { domainName },
      });
      setCategories(res.data?.data || []);
    } catch (error) {
      console.error("Navbar category fetch error:", error);
    }
  };

  const closeNavbar = () => {
    if (window.innerWidth < 992 && navbarTogglerRef.current) {
      navbarTogglerRef.current.click();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowProducts(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg fixed-top custom-navbar">
      <div className="container position-relative">

        {/* LOGO */}
        <NavLink
          className="navbar-brand"
          to="/"
          onClick={closeNavbar}
        >
          <img
            src={trimurathi}
            alt="Company Logo"
            className="navbar-logo rounded-circle"
          />
        </NavLink>

        {/* TOGGLER */}
        <button
          ref={navbarTogglerRef}
          className="navbar-toggler ms-auto d-lg-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* MENU */}
        <div
          className="collapse navbar-collapse justify-content-center"
          id="navbarNav"
        >
          <ul className="navbar-nav align-items-center">

            <li className="nav-item">
              <NavLink className="nav-link" to="/" end onClick={closeNavbar}>
                <FaHome /> Home
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/about" onClick={closeNavbar}>
                <FaInfoCircle /> About
              </NavLink>
            </li>

            {/* PRODUCTS */}
            <li
              className="nav-item product-nav"
              ref={dropdownRef}
              onMouseEnter={() =>
                window.innerWidth >= 992 && setShowProducts(true)
              }
              onMouseLeave={() =>
                window.innerWidth >= 992 && setShowProducts(false)
              }
            >
              <span
                className="nav-link product-trigger"
                onClick={() =>
                  window.innerWidth < 992 &&
                  setShowProducts(!showProducts)
                }
              >
                <FaBoxOpen /> Products ▾
              </span>

              {showProducts && (
                <div className="product-float-card">
                  {categories.map((cat) => (
                    <NavLink
                      key={cat._id}
                      to={`/product/${
                        cat.slug ||
                        cat.name.toLowerCase().replace(/\s+/g, "-")
                      }`}
                      className="product-float-item"
                      onClick={() => {
                        setShowProducts(false);
                        closeNavbar();
                      }}
                    >
                      {cat.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/gallery" onClick={closeNavbar}>
                <FaImages /> Gallery
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/blog" onClick={closeNavbar}>
                <FaBlog /> Blog
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/contact" onClick={closeNavbar}>
                <FaEnvelope /> Contact
              </NavLink>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
