'use strict';

(function () {
  var PIN_MIN_POSITION_LEFT = 18;
  var PIN_MAX_POSITION_RIGHT = 470;
  var PIN_WIDTH = 18;
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var MAXIMUM_PERCENT = 100;
  var MINIMUN_SCALE_PERCENT = 25;
  var SCALE_STEP = 25;
  var MAXIMUM_HASHTAG_COUNT = 5;
  var MAXIMUM_HASHTAG_LENGTH = 20;
  var MAXIMUM_BLUR = 3;
  var MAXIMUM_BRIGHTNESS = 3;

  var effectsFormElement = document.querySelector('.img-upload__form');
  var buttonUploadFileElement = effectsFormElement.querySelector('#upload-file');
  var effectsSectionElement = effectsFormElement.querySelector('.img-upload__overlay');
  var buttonEffectsFormCloseElement = effectsSectionElement.querySelector('#upload-cancel');
  var previewContainerElement = document.querySelector('.img-upload__preview');
  var previewImageElement = previewContainerElement.querySelector('.img-upload__preview img');

  var buttonZoomInElement = document.querySelector('.scale__control--bigger');
  var buttonZoomOutElement = document.querySelector('.scale__control--smaller');
  var zoomControlElement = document.querySelector('.scale__control--value');

  var effectLevelContainerElement = document.querySelector('.effect-level');
  var effectsLevelElement = effectLevelContainerElement.querySelector('.effect-level__value');
  var effectsPinElement = effectLevelContainerElement.querySelector('.effect-level__pin');
  var effectsDepthElement = effectLevelContainerElement.querySelector('.effect-level__depth');
  var effectsControlContainerElement = document.querySelector('.effects__list');

  var onUploadFormClose = function () {
    effectsFormElement.reset();
    effectsSectionElement.classList.add('hidden');
    buttonUploadFileElement.value = '';
    onEffectSelect();
    document.removeEventListener('keydown', onEscEffectsFormClose);
  };

  var onEscEffectsFormClose = function (evt) {
    if (evt.keyCode === window.common.Keycode.ESC && !effectsSectionElement.classList.contains('hidden')) {
      if (evt.target.classList.contains('text__hashtags')) {
        return;
      }
      if (evt.target.classList.contains('text__description')) {
        return;
      }
      onUploadFormClose();
    }
  };

  var onUploadSuccess = function () {
    onUploadFormClose();
    window.common.onSuccessModalShow();
  };

  buttonUploadFileElement.addEventListener('change', function () {
    var file = buttonUploadFileElement.files[0];
    var fileName = file.name.toLowerCase();
    var matches = FILE_TYPES.some(function (item) {
      return fileName.endsWith(item);
    });
    if (matches) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        previewImageElement.src = reader.result;
      });
      reader.readAsDataURL(file);
    }
    zoomControlElement.value = MAXIMUM_PERCENT + '%';
    onScaleChange(MAXIMUM_PERCENT);
    effectsSectionElement.classList.remove('hidden');
    document.addEventListener('keydown', onEscEffectsFormClose);
    buttonEffectsFormCloseElement.addEventListener('click', onUploadFormClose);
  });

  effectsFormElement.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.onDataSave('https://js.dump.academy/kekstagram', onUploadSuccess, window.common.onErrorModalShow, new FormData(effectsFormElement)
    );
  });

  var onEffectsApply = function () {
    var effectDecimal = effectsPinElement.offsetLeft / (PIN_MAX_POSITION_RIGHT - PIN_MIN_POSITION_LEFT);
    var effectPercent = Math.round(effectDecimal * MAXIMUM_PERCENT);
    effectsLevelElement.value = effectPercent;
    effectsDepthElement.style.width = effectPercent + '%';
    var checkedElement = effectsControlContainerElement.querySelector('.effects__radio:checked');
    previewImageElement.classList = '';

    effectLevelContainerElement.classList.remove('visually-hidden');
    previewImageElement.style.filter = '';
    previewImageElement.classList.add('effects__preview--' + checkedElement.value);
    switch (checkedElement.value) {
      case 'chrome':
        previewImageElement.style.filter = 'grayscale(' + effectDecimal + ')';
        break;
      case 'sepia':
        previewImageElement.style.filter = 'sepia(' + effectDecimal + ')';
        break;
      case 'marvin':
        previewImageElement.style.filter = 'invert(' + effectPercent + '%)';
        break;
      case 'phobos':
        previewImageElement.style.filter = 'blur(' + (effectDecimal * MAXIMUM_BLUR) + 'px)';
        break;
      case 'heat':
        previewImageElement.style.filter = 'brightness(' + (effectDecimal * MAXIMUM_BRIGHTNESS) + ')';
        break;
      case 'none':
        effectLevelContainerElement.classList.add('visually-hidden');
    }
  };

  var onEffectSelect = function () {
    effectsPinElement.style.left = PIN_MAX_POSITION_RIGHT - PIN_WIDTH + 'px';
    onEffectsApply();
  };

  onEffectSelect();

  var onScaleChange = function (percent) {
    previewImageElement.style.transform = 'scale(' + percent / MAXIMUM_PERCENT + ')';
  };

  var onZoomInClick = function () {
    var scaleValue = parseInt(zoomControlElement.value, 10);
    scaleValue = (scaleValue + SCALE_STEP >= MAXIMUM_PERCENT) ? MAXIMUM_PERCENT : (scaleValue + SCALE_STEP);
    zoomControlElement.value = scaleValue + '%';
    onScaleChange(scaleValue);
  };

  var onZoomOutClick = function () {
    var scaleValue = parseInt(zoomControlElement.value, 10);
    scaleValue = (scaleValue - SCALE_STEP <= MINIMUN_SCALE_PERCENT) ? MINIMUN_SCALE_PERCENT : (scaleValue - SCALE_STEP);
    zoomControlElement.value = scaleValue + '%';
    onScaleChange(scaleValue);
  };

  var onEnterZoomInPressed = function (evt) {
    if (evt.keyCode === window.common.Keycode.ENTER) {
      evt.preventDefault();
      onZoomInClick();
    }
  };

  var onEnterZoomOutPressed = function (evt) {
    if (evt.keyCode === window.common.Keycode.ENTER) {
      evt.preventDefault();
      onZoomOutClick();
    }
  };

  buttonZoomInElement.addEventListener('click', onZoomInClick);
  buttonZoomOutElement.addEventListener('click', onZoomOutClick);
  buttonZoomInElement.addEventListener('keydown', onEnterZoomInPressed);
  buttonZoomOutElement.addEventListener('keydown', onEnterZoomOutPressed);

  effectsPinElement.addEventListener('mousedown', function (evtMousedown) {
    evtMousedown.preventDefault();
    var startPositionX = evtMousedown.clientX;
    var onPinMouseMove = function (evtMousemove) {
      evtMousemove.preventDefault();
      var shiftX = startPositionX - evtMousemove.clientX;
      startPositionX = evtMousemove.clientX;

      var currentPinX = effectsPinElement.offsetLeft + effectsPinElement.offsetWidth / 2;
      if (currentPinX - shiftX >= (PIN_MIN_POSITION_LEFT - PIN_WIDTH / 2) && currentPinX - shiftX <= PIN_MAX_POSITION_RIGHT - PIN_WIDTH / 2) {
        effectsPinElement.style.left = effectsPinElement.offsetLeft - shiftX + 'px';
      }
      onEffectsApply();
    };

    var onPinMouseUp = function (evtMouseup) {
      evtMouseup.preventDefault();

      document.removeEventListener('mousemove', onPinMouseMove);
      document.removeEventListener('mouseup', onPinMouseUp);
    };

    document.addEventListener('mousemove', onPinMouseMove);
    document.addEventListener('mouseup', onPinMouseUp);
  });

  effectsControlContainerElement.addEventListener('change', onEffectSelect);

  var getValidateMessage = function (array) {
    var lowerCaseArray = array.map(function (item) {
      return item.toLowerCase();
    });
    if (array.length > MAXIMUM_HASHTAG_COUNT) {
      return 'Хеш-тегов не должно быть больше 5-ти. ';
    }
    for (var j = 0; j < lowerCaseArray.length; j++) {
      if (lowerCaseArray.lastIndexOf(lowerCaseArray[j]) !== j && lowerCaseArray.lastIndexOf(lowerCaseArray[j]) !== -1) {
        return 'Не должно быть повторяющихся хеш-тегов, таких как ' + array[j];
      }
    }
    for (var i = 0; i < array.length; i++) {
      var currentItem = array[i];
      if (currentItem.length === 1 && currentItem === '#') {
        return 'Хеш-тег не должен состоять из одного символа "#".';
      }
      if (currentItem.length > MAXIMUM_HASHTAG_LENGTH) {
        return 'Хеш-тег не доджен быть длинее 20 символов.';
      }
      if (currentItem[0] !== '#') {
        return ('Хеш-тег "' + currentItem + '" должен начинаться с символа "#". ');
      }
    }
    return '';
  };

  var hashtagsInputElement = document.querySelector('.text__hashtags');
  hashtagsInputElement.addEventListener('invalid', function () {
    hashtagsInputElement.style.outline = '3px solid red';
  });

  hashtagsInputElement.addEventListener('change', function () {
    hashtagsInputElement.setCustomValidity('');
    hashtagsInputElement.style.outline = '';
    if (hashtagsInputElement.value) {
      var hashtags = hashtagsInputElement.value.trim().split(/\s+/);
      hashtagsInputElement.setCustomValidity(getValidateMessage(hashtags));
    }
  });
})();
