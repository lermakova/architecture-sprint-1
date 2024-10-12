import React from 'react';
import Card from './Card';
import { CurrentUserContext } from 'shared-context';
import '../blocks/profile/profile.css';
import '../blocks/places/places.css';

function Main({ cards, onAddPlace }) {
  const currentUser = React.useContext(CurrentUserContext);

  const imageStyle = { backgroundImage: `url(${currentUser.avatar})` };

  function onEditAvatar() {
    dispatchEvent(new CustomEvent("edit-avatar") );
  }

  function onEditProfile() {
    dispatchEvent(new CustomEvent("edit-profile") );
  }

  return (
    <main className="content">
      <section className="profile page__section">
        <div className="profile__image" onClick={onEditAvatar} style={imageStyle}></div>
        <div className="profile__info">
          <h1 className="profile__title">{currentUser.name}</h1>
          <button className="profile__edit-button" type="button" onClick={onEditProfile}></button>
          <p className="profile__description">{currentUser.about}</p>
        </div>
        <button className="profile__add-button" type="button" onClick={onAddPlace}></button>
      </section>
      <section className="places page__section">
        <ul className="places__list">
          {cards.map((card) => (
            <Card
              key={card._id}
              card={card}
              currentUser={currentUser}
            />
          ))}
        </ul>
      </section>
    </main>
  );
}

export default Main;
