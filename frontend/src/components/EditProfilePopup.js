import { useContext, useState, useEffect } from "react";
import PopupWithForm from "./PopupWithForm";
import CurrentUserContext from "../contexts/CurrentUserContext";

const EditFrofilePopup = ({ isOpen, onUpdateUser, onClose }) => {
  const currentUser = useContext(CurrentUserContext);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, isOpen]);

  const handleSumbit = (evt) => {
    evt.preventDefault();
    onUpdateUser({
      name,
      about: description,
    });
  };

  const hadleChangeName = (evt) => {
    setName(evt.target.value);
  };

  const hadleChangeAbout = (evt) => {
    setDescription(evt.target.value);
  };

  return (
    <PopupWithForm
      name="edit-profle"
      title="Редактировать профиль"
      isOpen={isOpen}
      onClose={onClose}
      buttonText="Сохранить"
      onSubmit={handleSumbit}
    >
      <input
        id="name-input"
        className="popup__input popup__input_el_name"
        name="name"
        type="text"
        placeholder="Введите имя"
        minLength="2"
        maxLength="40"
        value={name || ""}
        onChange={hadleChangeName}
        required
      />
      <span id="name-input-error" className="popup__input-error" />
      <input
        id="descr-input"
        className="popup__input popup__input_el_descr"
        name="about"
        type="text"
        placeholder="О себе"
        minLength="2"
        maxLength="200"
        value={description || ""}
        onChange={hadleChangeAbout}
        required
      />
      <span
        id="descr-input-error"
        className="popup__input-error popup__input-error_active"
      />
    </PopupWithForm>
  );
};

export default EditFrofilePopup;
