'use strict';

/* common.js /* */

(function () {
  var Keycode = {
    ENTER: 13,
    ESC: 27
  };

  var documentMainElement = document.querySelector('body main');

  var onErrorModalShow = function (message) {
    var errorTemplate = document.querySelector('#error').content.querySelector('.error');
    var errorModalElement = errorTemplate.cloneNode(true);
    var messageElement = errorModalElement.querySelector('.error__title');
    var errorButtonElements = errorModalElement.querySelectorAll('.error__button');
    messageElement.textContent = message;

    var onErrorModalClose = function () {
      errorModalElement.remove();
      document.removeEventListener('keydown', onEscErrorClose);
    };

    var onEscErrorClose = function (evt) {
      if (evt.keyCode === window.common.Keycode.ESC) {
        onErrorModalClose();
      }
    };

    var onEnterErrorClose = function (evt) {
      if (evt.keyCode === window.common.Keycode.ENTER) {
        onErrorModalClose();
      }
    };

    errorModalElement.addEventListener('click', onErrorModalClose);
    document.addEventListener('keydown', onEscErrorClose);
    errorButtonElements.forEach(function (item) {
      item.addEventListener('keydown', onEnterErrorClose);
    });
    documentMainElement.appendChild(errorModalElement);
    errorButtonElements[0].focus();
  };

  var onSuccessModalShow = function () {
    var successTemplate = document.querySelector('#success').content.querySelector('.success');
    var successModalElement = successTemplate.cloneNode(true);
    var successButtonElement = successModalElement.querySelector('.success__button');

    var onSuccessModalClose = function () {
      successModalElement.remove();
      document.removeEventListener('keydown', onEscSuccessClose);
    };

    var onEscSuccessClose = function (evt) {
      if (evt.keyCode === window.common.Keycode.ESC) {
        onSuccessModalClose();
      }
    };

    var onEnterSuccessClose = function (evt) {
      if (evt.keyCode === window.common.Keycode.ENTER) {
        onSuccessModalClose();
      }
    };

    successModalElement.addEventListener('click', onSuccessModalClose);
    document.addEventListener('keydown', onEscSuccessClose);
    successButtonElement.addEventListener('keydown', onEnterSuccessClose);

    documentMainElement.insertBefore(successModalElement, documentMainElement.firstChild);
    successButtonElement.focus();
  };

  window.common = {
    Keycode: Keycode,
    onErrorModalShow: onErrorModalShow,
    onSuccessModalShow: onSuccessModalShow
  };
})();
