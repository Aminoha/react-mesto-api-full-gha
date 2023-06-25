import React, { useContext } from "react";
import { Link, Route, Routes } from "react-router-dom";
import CurrentUserContext from '../contexts/CurrentUserContext';

const Header = ({ onSignOut }) => {
const currentUser = useContext(CurrentUserContext)

  return (
    <header className="header">
      <div className="logo" />
      <Routes>
        <Route
          path="/sign-up"
          element={
            <Link className="header__link" to="/sign-in">
              Войти
            </Link>
          }
        />
        <Route
          path="/sign-in"
          element={
            <Link className="header__link" to="/sign-up">
              Регистрация
            </Link>
          }
        />
        <Route
          path="/"
          element={
            <div className="header__user-info">
              <p className="header__user-email">{currentUser.email}</p>
              <button className="header__button-logout" onClick={onSignOut}>
                Выйти
              </button>
            </div>
          }
        />
      </Routes>
    </header>
  );
};

export default Header;
