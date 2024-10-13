import React, { lazy, Suspense, useState, useEffect }  from "react";
import { Route, useHistory, Switch, BrowserRouter } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import { CurrentUserContext } from "shared-context";

import "./index.css";

const Register = lazy(() => import('auth/Register').catch(() => {
  return { default: () => <div className='error'>Component is not available!</div> };
 })
 ); 

const Login = lazy(() => import('auth/Login').catch(() => {
  return { default: () => <div className='error'>Component is not available!</div> };
 })
 ); 

const InfoTooltip = lazy(() => import('auth/InfoTooltip').catch(() => {
  return { default: () => <div className='error'>Component is not available!</div> };
 })
 ); 

const ImagePopup = lazy(() => import('feed/ImagePopup').catch(() => {
  return { default: () => <div className='error'>Component is not available!</div> };
 })
 ); 

const AddPlacePopup = lazy(() => import('feed/AddPlacePopup').catch(() => {
  return { default: () => <div className='error'>Component is not available!</div> };
 })
 );

const EditAvatarPopup = lazy(() => import('feed/EditAvatarPopup').catch(() => {
  return { default: () => <div className='error'>Component is not available!</div> };
 })
 );

const EditProfilePopup = lazy(() => import('feed/EditProfilePopup').catch(() => {
  return { default: () => <div className='error'>Component is not available!</div> };
 })
 );

const Main = lazy(() => import('feed/Main').catch(() => {
  return { default: () => <div className='error'>Component is not available!</div> };
 })
 );

const PopupWithForm = lazy(() => import('feed/PopupWithForm').catch(() => {
  return { default: () => <div className='error'>Component is not available!</div> };
 })
 );

const App = () => {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
  React.useState(true);
const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
  React.useState(false);
const [selectedCard, setSelectedCard] = React.useState(null);
const [cards, setCards] = React.useState([]);

const [isLoggedIn, setIsLoggedIn] = React.useState(false);
//В компоненты добавлены новые стейт-переменные: email — в компонент App
const [email, setEmail] = React.useState("");

// В корневом компоненте App создана стейт-переменная currentUser. Она используется в качестве значения для провайдера контекста.
const [currentUser, setCurrentUser] = React.useState({});


const [isInfoToolTipOpen, setIsInfoToolTipOpen] = React.useState(false);
const [tooltipStatus, setTooltipStatus] = React.useState("");

  const history = useHistory();

  const handleUpdateAvatar = event => { 
    setCurrentUser(event.detail);
    closeAllPopups();
  }

  useEffect(() => {
    addEventListener("avatar-update", handleUpdateAvatar); 
    return () => removeEventListener("avatar-update", handleUpdateAvatar) 
  }, []);


  const handleAddPlaceSubmit = event => { 
    setCards([event.detail, ...cards]);
    closeAllPopups();
  }

  useEffect(() => {
    addEventListener("add-place", handleAddPlaceSubmit); 
    return () => removeEventListener("add-place", handleAddPlaceSubmit) 
  }, []);

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  const handleEditProfileClick = event => { 
    setIsEditProfilePopupOpen(true);
  }

  useEffect(() => {
    addEventListener("edit-profile", handleEditProfileClick); 
    return () => removeEventListener("edit-profile", handleEditProfileClick) 
  }, []);

  const handleEditAvatarClick = event => { 
    setIsEditAvatarPopupOpen(true);
  }

  useEffect(() => {
    addEventListener("edit-avatar", handleEditAvatarClick); 
    return () => removeEventListener("edit-avatar", handleEditAvatarClick) 
  }, []);

  const handleCardClick = event => { 
    setSelectedCard(event.detail);
  }

  useEffect(() => {
    addEventListener("card-click", handleCardClick); 
    return () => removeEventListener("card-click", handleCardClick) 
  }, []);

  const handleCardLike = event => {
    setCards((cards) =>
      cards.map((c) => (c._id === event.detail.card._id ? event.detail.res : c)))
  }

  useEffect(() => {
    addEventListener("card-like", handleCardLike); 
    return () => removeEventListener("card-like", handleCardLike) 
  }, []);

  const handleCardDelete = event => { 
    setCards((cards) => cards.filter((c) => c._id !== event.detail.card._id));
  }

  useEffect(() => {
    addEventListener("card-delete", handleCardDelete); 
    return () => removeEventListener("card-delete", handleCardDelete) 
  }, []);

  const handleUpdateUser = event => { 
    setCurrentUser(event.detail);
    closeAllPopups();
  }

  useEffect(() => {
    addEventListener("user-update", handleUpdateUser); 
    return () => removeEventListener("user-update", handleUpdateUser) 
  }, []);

  function onSignOut() {
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    history.push("/signin");
  }

  const handleRegister = event => { 
    try {
      setTooltipStatus("success");
      setIsInfoToolTipOpen(true);
      history.push("/signin");
    } catch (error) {
      setTooltipStatus("fail");
      setIsInfoToolTipOpen(true);
    }
  }

  useEffect(() => {
    addEventListener("register", handleRegister); 
    return () => removeEventListener("register", handleRegister) 
  }, []);

  const handleLogin = event => {
    try {
      setIsLoggedIn(true);
      setEmail(event.detail.email);
      history.push("/");
    } catch (error) {
      setTooltipStatus("fail");
      setIsInfoToolTipOpen(true);
    }    
  }

  useEffect(() => {
    addEventListener("login", handleLogin); 
    return () => removeEventListener("login", handleLogin) 
  }, []);

  function closeAllPopups() {
     setIsEditProfilePopupOpen(false);
     setIsAddPlacePopupOpen(false);
     setIsEditAvatarPopupOpen(false);
    setIsInfoToolTipOpen(false);
    setSelectedCard(null);
  }

  <div className="container">
   <CurrentUserContext.Provider value={currentUser}>
      <div className="page__content">
        <Header email={email} onSignOut={onSignOut} />
        <Switch>
          <ProtectedRoute
            exact
            path="/"
            component={Main}
            cards={cards}
            onAddPlace={handleAddPlaceClick}
            loggedIn={isLoggedIn}
          />
          <Route path="/signup">
            <Suspense>
              <Register />
            </Suspense>
          </Route>
          <Route path="/signin">
            <Suspense>
              <Login />
            </Suspense>
          </Route>
        </Switch>
        <Footer />
        <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
          />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
        />
        <PopupWithForm title="Вы уверены?" name="remove-card" buttonText="Да" />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
        /> 
        <ImagePopup card={selectedCard} onClose={closeAllPopups} /> 
        <InfoTooltip
          isOpen={isInfoToolTipOpen}
          onClose={closeAllPopups}
          status={tooltipStatus}
        /> 
      </div>
    </CurrentUserContext.Provider>
  </div>
};
const rootElement = document.getElementById("app")
if (!rootElement) throw new Error("Failed to find the root element")

const root = ReactDOM.createRoot(rootElement)

root.render(<React.StrictMode>
  <BrowserRouter>
    <App />
  </BrowserRouter>
</React.StrictMode>)