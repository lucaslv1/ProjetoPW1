import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/utfpr-logo.png";
import AuthService from "../services/auth.service";

const NavBar = (props) => {

  const onClickLogout = () => {
    AuthService.logout();
    window.location.reload();
  };

  return (
    <div className="bg-white shadow-sm mb-2">
      <div className="container">
        <nav className="navbar navbar-light navbar-expand">
          <Link to="/" className="navbar-brand">
            <img src={logo} width="60" alt="UTFPR" />
          </Link>
          <ul className="navbar-nav me-auto mb-2 mb-md-0 ">
            <li className="nav-item">
              <NavLink to="/" className={(navData) =>
                  navData.isActive ? "nav-link active" : "nav-link"
                }>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/accounts" className={(navData) =>
                  navData.isActive ? "nav-link active" : "nav-link"
                }>
                Contas
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/transactions" className={(navData) =>
                  navData.isActive ? "nav-link active" : "nav-link"
                }>
                Transações
              </NavLink>
            </li>
            <li className="nav-item">
              <button className="btn btn-light" onClick={onClickLogout}>
                &times; Sair
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};
export default NavBar;
