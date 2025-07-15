import "./index.css";
import Api from "../utils/Api.js";
import {
  enableValidation,
  resetValidation,
  disableButton,
  settings,
} from "../scripts/validation.js";

function renderLoading(isLoading, button, loadingText = "Saving...") {
  if (!button) return;
  if (isLoading) {
    button.dataset.originalText = button.textContent;
    button.textContent = loadingText;
    button.disabled = true;
  } else {
    button.textContent = button.dataset.originalText || "Save";
    button.disabled = false;
  }
}

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "c76bcf1f-2047-489a-a39d-061f6e490d9b",
    "Content-Type": "application/json",
  },
});

const profileAvatarImg = document.querySelector(".profile__avatar");
const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");

const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileForm = document.forms.editProfileForm;
const editProfileNameInput = editProfileForm.elements["profile-name-input"];
const editProfileDescriptionInput =
  editProfileForm.elements["profile-description-input"];

const avatarBtn = document.querySelector(".profile__avatar-btn");
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = document.forms.avatarProfileForm;
const avatarInput = avatarForm.elements["avatar"];

const deleteModal = document.querySelector("#delete-modal");
const deleteForm = document.forms.deleteProfileForm;
const cancelDeleteBtn = document.querySelector(
  ".modal__submit-btn_type_cancel"
);

const newPostBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostForm = document.forms.newPostForm;
const cardSubmitBtn = newPostForm.querySelector(".modal__submit-btn");
const newPostImageInput = document.querySelector("#card-image-input");
const newPostCaptionInput = document.querySelector("#card-caption-input");

const previewModal = document.querySelector("#preview-modal");
const previewImageEl = previewModal.querySelector(".modal__image");
const previewCaptionEl = previewModal.querySelector(".modal__caption");

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
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

function handleEscClose(event) {
  if (event.key === "Escape") {
    const openedModal = document.querySelector(".modal_is-opened");
    if (openedModal) closeModal(openedModal);
  }
}

closeButtons.forEach((button) => {
  const modal = button.closest(".modal");
  button.addEventListener("click", () => closeModal(modal));
});

const modals = document.querySelectorAll(".modal");
modals.forEach((modal) => {
  modal.addEventListener("mousedown", (evt) => {
    if (evt.target === modal) closeModal(modal);
  });
});

let selectedCard = null;
let selectedCardId = null;

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const likeBtn = cardElement.querySelector(".card__like-btn");
  const deleteBtn = cardElement.querySelector(".card__delete-btn");

  cardTitleEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  if (data.isLiked) likeBtn.classList.add("card__like-btn_active");

  likeBtn.addEventListener("click", () => {
    const hasLiked = data.isLiked;
    const request = hasLiked ? api.removeLike(data._id) : api.addLike(data._id);

    request
      .then((updatedCard) => {
        likeBtn.classList.toggle("card__like-btn_active");
      })
      .catch((err) => {
        console.error("Failed to toggle like:", err);
      });
  });

  deleteBtn.addEventListener("click", () => {
    selectedCard = cardElement;
    selectedCardId = data._id;
    openModal(deleteModal);
  });

  cardImageEl.addEventListener("click", () => {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewCaptionEl.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

deleteForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const deleteBtn = deleteForm.querySelector(".modal__submit-btn_type_delete");
  renderLoading(true, deleteBtn, "Deleting...");

  api
    .removeCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
      selectedCard = null;
      selectedCardId = null;
    })
    .catch(console.error)
    .finally(() => renderLoading(false, deleteBtn));
});

cancelDeleteBtn.addEventListener("click", () => {
  closeModal(deleteModal);
  selectedCard = null;
  selectedCardId = null;
});

editProfileForm.addEventListener("submit", function (evt) {
  evt.preventDefault();
  const saveBtn = editProfileForm.querySelector(".modal__submit-btn");
  renderLoading(true, saveBtn);

  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((userData) => {
      profileNameEl.textContent = userData.name;
      profileDescriptionEl.textContent = userData.about;
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => renderLoading(false, saveBtn));
});

newPostForm.addEventListener("submit", function (evt) {
  evt.preventDefault();
  const submitBtn = newPostForm.querySelector(".modal__submit-btn");
  renderLoading(true, submitBtn);

  api
    .addCard({
      name: newPostCaptionInput.value,
      link: newPostImageInput.value,
    })
    .then((cardData) => {
      const cardElement = getCardElement(cardData);
      if (cardElement) cardsList.prepend(cardElement);
      newPostForm.reset();
      closeModal(newPostModal);
      disableButton(submitBtn, settings);
    })
    .catch(console.error)
    .finally(() => renderLoading(false, submitBtn));
});

avatarForm.addEventListener("submit", function (evt) {
  evt.preventDefault();
  const submitBtn = avatarForm.querySelector(".modal__submit-btn");
  renderLoading(true, submitBtn);

  api
    .editAvatarInfo({ avatar: avatarInput.value })
    .then((userData) => {
      profileAvatarImg.src = userData.avatar;
      avatarForm.reset();
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => renderLoading(false, submitBtn));
});

editProfileBtn.addEventListener("click", function () {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  resetValidation(editProfileForm, settings);
  openModal(editProfileModal);
});

newPostBtn.addEventListener("click", () => openModal(newPostModal));
avatarBtn.addEventListener("click", () => {
  avatarForm.reset();
  openModal(avatarModal);
});

api
  .getUserInfo()
  .then((userData) => {
    api.userId = userData._id;
    profileNameEl.textContent = userData.name;
    profileDescriptionEl.textContent = userData.about;
    profileAvatarImg.src = userData.avatar;
    return api.getInitialCards();
  })
  .then((cards) => {
    cards.forEach((cardData) => {
      const card = getCardElement(cardData);
      cardsList.append(card);
    });
  })
  .catch(console.error);

enableValidation(settings);
