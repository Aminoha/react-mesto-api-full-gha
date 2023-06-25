import { useState, useEffect } from "react";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import PopupWithForm from "./PopupWithForm";
import ImagePopup from "./ImagePopup";
import api from "../utils/api";
import CurrentUserContext from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import InfoTooltip from "./InfoTooltip";
import { getContent, authorize, register } from "../utils/auth";

const App = () => {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [isOpenInfoTooltip, setIsOpenInfoTooltip] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formValue, setFormValue] = useState({
    email: "",
    password: "",
  });
  const [isRegister, setIsRegister] = useState({
    status: "",
    message: "",
  });
  const navigate = useNavigate();

  const handleRegister = (evt) => {
    evt.preventDefault();
    const { password, email } = formValue;
    register(password, email)
      .then(() => {
        setFormValue({ email: "", password: "" });
        setIsOpenInfoTooltip(true);
        setIsRegister({
          status: true,
          message: "Вы успешно зарегистрировались!",
        });
        navigate("/sign-in", { replace: true });
      })
      .catch((err) => {
        setIsOpenInfoTooltip(true);
        setIsRegister({
          status: false,
          message: "Что-то пошло не так! Попробуйте ещё раз.",
        });
        console.log(err);
      });
  };

  const handleLogin = (evt) => {
    evt.preventDefault();
    const { password, email } = formValue;
    authorize(password, email)
      .then((data) => {
        setFormValue({ email: "", password: "" });
        setIsLoggedIn(true);
        console.log(data);
        api.setToken(data._id)
        localStorage.setItem("jwt", data._id)
        navigate("/", { replace: true });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const signOut = () => {
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    api.setToken(null)
    navigate("/sign-in", { replace: true });
  };

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormValue({
      ...formValue,
      [name]: value,
    });
  };

  useEffect(() => {
    tokenCheck();
  }, []);

  const tokenCheck = () => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      getContent(jwt)
        .then((res) => {
          api.setToken(jwt);
          setIsLoggedIn(true);
          navigate("/", { replace: true });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      Promise.all([api.getUserInfo(), api.getCardList()])
        .then(([user, cards]) => {
          setCurrentUser(user.data);
          setCards(cards.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [isLoggedIn]);

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  };

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  };

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setIsImagePopupOpen(true);
  };

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsImagePopupOpen(false);
    setIsOpenInfoTooltip(false);
  };

  const handleUpdateUser = (items) => {
    api
      .setUserInfo(items)
      .then((user) => {
        setCurrentUser(user.data);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUpdateAvatar = (item) => {
    api
      .setUserAvatar(item)
      .then((user) => {
        setCurrentUser(user.data);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCardLike = (card) => {
    const isLiked = card.likes.some((like) => like === currentUser._id);
    if (!isLiked) {
      api
        .putLike(card._id)
        .then((newCard) => {
          const newCards = cards.map((item) =>
            item._id === card._id ? newCard.data : item
          );
          setCards(newCards);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      api
        .deleteLike(card._id)
        .then((newCard) => {
          // Формируем новый массив на основе имеющегося, подставляя в него новую карточку
          const newCards = cards.map((item) =>
            item._id === card._id ? newCard.data : item
          );
          setCards(newCards);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleCardDelete = (card) => {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((cards) => cards.filter((item) => item._id !== card._id));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAddPlaceSubmit = (items) => {
    api
      .addCard(items)
      .then((newCard) => {
        setCards([newCard.data, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header onSignOut={signOut} />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute
                element={Main}
                isLoggedIn={isLoggedIn}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick}
                cards={cards}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
              />
            }
          />
          <Route
            path="/sign-up"
            element={
              <Register
                handleChange={handleChange}
                onRegister={handleRegister}
                title="Регистрация"
                buttonText="Зарегиситрироватья"
                formValue={formValue}
              />
            }
          />
          <Route
            path="/sign-in"
            element={
              <Login
                title="Вход"
                buttonText="Войти"
                onLogin={handleLogin}
                handleChange={handleChange}
                formValue={formValue}
              />
            }
          />
          <Route
            path="/*"
            element={
              isLoggedIn ? (
                <Navigate to="/" replace />
              ) : (
                <Navigate to="/sign-in" replace />
              )
            }
          />
        </Routes>
        {isLoggedIn && <Footer />}
        <InfoTooltip
          isRegister={isRegister}
          isOpen={isOpenInfoTooltip}
          onClose={closeAllPopups}
          alt={"Статус"}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />
        <PopupWithForm name="delete" title="Вы уверены?" buttonText="Да" />
        <ImagePopup
          card={selectedCard}
          onClose={closeAllPopups}
          isOpen={isImagePopupOpen}
        />
      </div>
    </CurrentUserContext.Provider>
  );
};

export default App;
