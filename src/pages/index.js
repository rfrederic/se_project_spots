import "./index.css";

import {
  enableValidation,
  resetValidation,
  disableButton,
  settings,
} from "../scripts/validation.js";

import { initialCards } from "../scripts/cards.js";

const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileForm = document.forms.editProfileForm;
const editProfileNameInput = editProfileForm?.elements["profile-name-input"];
const editProfileDescriptionInput =
  editProfileForm?.elements["profile-description-input"];
const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");

const newPostBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostForm = document.forms.newPostForm;
const cardSubmitBtn = newPostForm?.querySelector(".modal__submit-btn");
const newPostImageInput = document.querySelector("#card-image-input");
const newPostCaptionInput = document.querySelector("#card-caption-input");

const previewModal = document.querySelector("#preview-modal");
const previewImageEl = previewModal?.querySelector(".modal__image");
const previewCaptionEl = previewModal?.querySelector(".modal__caption");

const cardTemplate = document
  .querySelector("#card-template")
  ?.content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

const closeButtons = document.querySelectorAll(".modal__close-btn");

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscClose);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscClose);
}

function getCardElement(data) {
  if (!cardTemplate) return;

  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  const cardlikeBtnEl = cardElement.querySelector(".card__like-btn");
  cardlikeBtnEl.addEventListener("click", () => {
    cardlikeBtnEl.classList.toggle("card__like-btn_active");
  });

  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-btn");
  cardDeleteBtnEl.addEventListener("click", () => {
    cardElement.remove();
  });

  cardImageEl.addEventListener("click", () => {
    if (previewImageEl && previewCaptionEl) {
      previewImageEl.src = data.link;
      previewImageEl.alt = data.name;
      previewCaptionEl.textContent = data.name;
      openModal(previewModal);
    }
  });

  return cardElement;
}

editProfileBtn?.addEventListener("click", function () {
  if (editProfileForm && profileNameEl && profileDescriptionEl) {
    editProfileNameInput.value = profileNameEl.textContent;
    editProfileDescriptionInput.value = profileDescriptionEl.textContent;
    resetValidation(editProfileForm, settings);
    openModal(editProfileModal);
  }
});

newPostBtn?.addEventListener("click", function () {
  openModal(newPostModal);
});

closeButtons.forEach((button) => {
  const modal = button.closest(".modal");
  button.addEventListener("click", () => {
    if (modal) closeModal(modal);
  });
});

editProfileForm?.addEventListener("submit", function (evt) {
  evt.preventDefault();
  if (profileNameEl && profileDescriptionEl) {
    profileNameEl.textContent = editProfileNameInput.value;
    profileDescriptionEl.textContent = editProfileDescriptionInput.value;
    closeModal(editProfileModal);
  }
});

newPostForm?.addEventListener("submit", function (evt) {
  evt.preventDefault();

  const inputValues = {
    name: newPostCaptionInput.value,
    link: newPostImageInput.value,
  };

  const cardElement = getCardElement(inputValues);
  if (cardElement && cardsList) {
    cardsList.prepend(cardElement);
  }

  newPostForm.reset();
  closeModal(newPostModal);
  disableButton(cardSubmitBtn, settings);
});

initialCards.forEach((item) => {
  const cardElement = getCardElement(item);
  if (cardElement && cardsList) {
    cardsList.append(cardElement);
  }
});

function handleEscClose(event) {
  if (event.key === "Escape") {
    const openedModal = document.querySelector(".modal_is-opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

const modals = document.querySelectorAll(".modal");

modals.forEach((modal) => {
  modal.addEventListener("mousedown", (evt) => {
    if (evt.target === modal) {
      closeModal(modal);
    }
  });
});

enableValidation(settings);
