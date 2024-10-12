import React from 'react';
import api from '../utils/api';
import { CurrentUserContext } from 'shared-context';
import '../blocks/card/card.css';


function Card({ card }) {
  const cardStyle = { backgroundImage: `url(${card.link})` };

  function onCardClick() {
    dispatchEvent(new CustomEvent("card-click", {
      detail: card
  }));
  }

  function onCardLike() {
    dispatchEvent(new CustomEvent("card-like", {
      detail: { res: api
        .changeLikeCardStatus(card._id, !isLiked),
      card: card }
  }));
  }

  function onCardDelete() {
    dispatchEvent(new CustomEvent("card-delete", {
      detail: { res: api
        .removeCard(card._id),
      card: card}
  }));
  }

  function handleClick() {
    onCardClick();
  }

  function handleLikeClick() {
    onCardLike();
  }

  function handleDeleteClick() {
    onCardDelete(card);
  }

  const currentUser = React.useContext(CurrentUserContext);
  const isLiked = card.likes.some(i => i._id === currentUser._id);
  const cardLikeButtonClassName = `card__like-button ${isLiked && 'card__like-button_is-active'}`;

  const isOwn = card.owner._id === currentUser._id;
  const cardDeleteButtonClassName = (
    `card__delete-button ${isOwn ? 'card__delete-button_visible' : 'card__delete-button_hidden'}`
  );

  return (
    <li className="places__item card">
      <div className="card__image" style={cardStyle} onClick={handleClick}>
      </div>
      <button type="button" className={cardDeleteButtonClassName} onClick={handleDeleteClick}></button>
      <div className="card__description">
        <h2 className="card__title">
          {card.name}
        </h2>
        <div className="card__likes">
          <button type="button" className={cardLikeButtonClassName} onClick={handleLikeClick}></button>
          <p className="card__like-count">{card.likes.length}</p>
        </div>
      </div>
    </li>
  );
}

export default Card;
