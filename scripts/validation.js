const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__submit-btn_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

const showInputError = (formEl, inputEl, errorMessage, config) => {
  const errorMessageEl = formEl.querySelector(`#${inputEl.id}-error`);
  inputEl.classList.add(config.inputErrorClass);
  errorMessageEl.textContent = errorMessage;
  errorMessageEl.classList.add(config.errorClass);
};

const hideInputError = (formEl, inputEl, config) => {
  const errorMessageEl = formEl.querySelector(`#${inputEl.id}-error`);
  inputEl.classList.remove(config.inputErrorClass);
  errorMessageEl.textContent = "";
  errorMessageEl.classList.remove(config.errorClass);
};

const disableButton = (buttonElement, config) => {
  buttonElement.disabled = true;
  buttonElement.classList.add(config.inactiveButtonClass);
};

const enableButton = (buttonElement, config) => {
  buttonElement.disabled = false;
  buttonElement.classList.remove(config.inactiveButtonClass);
};

const hasInvalidInput = (inputs) =>
  inputs.some((inputEl) => !inputEl.validity.valid);

const toggleButtonState = (inputs, button, config) => {
  if (hasInvalidInput(inputs)) {
    disableButton(button, config);
  } else {
    enableButton(button, config);
  }
};

const setEventListeners = (formEl, config) => {
  const inputs = Array.from(formEl.querySelectorAll(config.inputSelector));
  const button = formEl.querySelector(config.submitButtonSelector);

  toggleButtonState(inputs, button, config);

  inputs.forEach((inputEl) => {
    inputEl.addEventListener("input", () => {
      if (!inputEl.validity.valid) {
        showInputError(formEl, inputEl, inputEl.validationMessage, config);
      } else {
        hideInputError(formEl, inputEl, config);
      }
      toggleButtonState(inputs, button, config);
    });
  });
};

const enableValidation = (config) => {
  const forms = document.querySelectorAll(config.formSelector);
  forms.forEach((formEl) => {
    formEl.addEventListener("submit", (e) => e.preventDefault());
    setEventListeners(formEl, config);
  });
};

const resetValidation = (formEl, config) => {
  const inputList = Array.from(formEl.querySelectorAll(config.inputSelector));
  inputList.forEach((inputEl) => {
    hideInputError(formEl, inputEl, config);
  });

  const button = formEl.querySelector(config.submitButtonSelector);
  if (button) {
    disableButton(button, config);
  }
};

enableValidation(settings);
