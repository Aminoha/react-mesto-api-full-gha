import { useContext } from "react";
import CurrentUserContext from "../contexts/CurrentUserContext";

const Card = ({ card, onCardClick, onCardLike, onCardDelete }) => {
  const currentUser = useContext(CurrentUserContext);

  const handleClick = () => {
    onCardClick(card);
  };

  const handleLikeClick = () => {
    onCardLike(card);
  };

  const handleDeleteClick = () => {
    onCardDelete(card);
  };

  const isOwn = card.owner._id === currentUser._id;
  const cardDeleteButtonVisabilityAttribute = {
    visibility: isOwn ? "visible" : "hidden",
  };

  // Определяем, есть ли у карточки лайк, поставленный текущим пользователем
  const isLiked = card.likes.some((like) => like._id === currentUser._id);

  // Создаём переменную, которую после зададим в `className` для кнопки лайка
  const cardLikeButtonClassName = `elements__icon ${
    isLiked ? "elements__icon_active" : ""
  }`;

  return (
    <li className="elements__item">
      <article className="elements__card">
        <button
          type="button"
          className="elements__delete"
          name="trash"
          style={cardDeleteButtonVisabilityAttribute}
          onClick={handleDeleteClick}
        />
        <img
          className="elements__img"
          src={card.link}
          alt={card.name}
          onClick={handleClick}
        />
        <div className="elements__group">
          <h2 className="elements__name">{card.name}</h2>
          <div className="elements__like">
            <button
              type="button"
              className={cardLikeButtonClassName}
              name="like"
              onClick={handleLikeClick}
            />
            <p className="elements__count">{card.likes.length}</p>
          </div>
        </div>
      </article>
    </li>
  );
};

export default Card;
