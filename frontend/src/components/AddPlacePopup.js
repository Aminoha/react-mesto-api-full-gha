import { useState, useEffect } from "react";
import PopupWithForm from "./PopupWithForm";

const AddPlacePopup = ({ onAddPlace, isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");

  useEffect(() => {
    setName("");
    setLink("");
  }, [isOpen]);

  const handleSumbit = (evt) => {
    evt.preventDefault();
    onAddPlace({
      name,
      link,
    });
  };

  const hadleChangeName = (evt) => {
    setName(evt.target.value);
  };

  const hadleChangeLink = (evt) => {
    setLink(evt.target.value);
  };

  return (
    <PopupWithForm
      name="add-card"
      title="Новое место"
      isOpen={isOpen}
      onClose={onClose}
      buttonText="Создать"
      onSubmit={handleSumbit}
    >
      <input
        id="title-input"
        className="popup__input popup__input_el_name"
        name="name"
        value={name}
        type="text"
        placeholder="Название"
        minLength="2"
        maxLength="30"
        onChange={hadleChangeName}
        required
      />
      <span id="title-input-error" className="popup__input-error" />
      <input
        id="url-input"
        className="popup__input popup__input_el_descr"
        type="url"
        name="link"
        value={link}
        placeholder="Ссылка на картинку"
        onChange={hadleChangeLink}
        required
      />
      <span id="url-input-error" className="popup__input-error" />
    </PopupWithForm>
  );
};

export default AddPlacePopup;
