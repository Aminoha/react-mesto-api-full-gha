import { useRef, useEffect } from "react";
import PopupWithForm from "./PopupWithForm";

const EditAvatarPopup = ({ onUpdateAvatar, isOpen, onClose }) => {
  const refInput = useRef(null);

  const handleSumbit = (event) => {
    event.preventDefault();
    onUpdateAvatar({
      avatar: refInput.current.value,
    });
  };

  useEffect(() => {
    refInput.current.value = "";
  }, [isOpen]);

  return (
    <PopupWithForm
      name="update-avatar"
      title="Обновить аватар"
      isOpen={isOpen}
      onClose={onClose}
      buttonText="Сохранить"
      onSubmit={handleSumbit}
    >
      <input
        id="avatar-input"
        className="popup__input popup__input_el_descr"
        type="url"
        name="avatar"
        ref={refInput}
        placeholder="Ссылка на картинку"
        required
      />
      <span id="avatar-input-error" className="popup__input-error" />
    </PopupWithForm>
  );
};

export default EditAvatarPopup;
