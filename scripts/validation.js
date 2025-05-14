const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "form__submit_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

const showInputError = (formEl, inputEl, errorMessage) => {
  const errorMessageEl = document.querySelector(`#${inputEl.id}-error`);
  inputEl.classList.add(settings.inputErrorClass);
  errorMessageEl.textContent = errorMessage;
};

const hideInputError = (formEl, inputEl) => {
  const errorMessageEl = document.querySelector(`#${inputEl.id}-error`);
  inputEl.classList.remove(settings.inputErrorClass);
  errorMessageEl.textContent = "";
};

const hasInvalidInput = (inputs) =>
  inputs.some((inputEl) => !inputEl.validity.valid);

const toggleButtonState = (inputs, button) => {
  if (hasInvalidInput(inputs)) {
    button.disabled = true;
    button.classList.add(settings.inactiveButtonClass);
  } else {
    button.disabled = false;
    button.classList.remove(settings.inactiveButtonClass);
  }
};

const setEventListeners = (formEl) => {
  const inputs = Array.from(formEl.querySelectorAll(settings.inputSelector));
  const button = formEl.querySelector(settings.submitButtonSelector);

  toggleButtonState(inputs, button);

  inputs.forEach((inputEl) => {
    inputEl.addEventListener("input", () => {
      if (!inputEl.validity.valid) {
        showInputError(formEl, inputEl, inputEl.validationMessage);
      } else {
        hideInputError(formEl, inputEl);
      }
      toggleButtonState(inputs, button);
    });
  });
};

const enableValidation = (settings) => {
  const forms = document.querySelectorAll(settings.formSelector);
  forms.forEach((formEl) => {
    formEl.addEventListener("submit", (e) => e.preventDefault());
    setEventListeners(formEl);
  });
};

enableValidation(settings);
