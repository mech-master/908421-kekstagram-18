'use strict';

(function () {
  var PIN_MIN_POSITION_LEFT = 18;
  var PIN_MAX_POSITION_RIGHT = 470;
  var PIN_WIDTH = 18;
  var FILTERS = [
    'chrome',
    'sepia',
    'marvin',
    'phobos',
    'heat'
  ];
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var MAXIMUM_PERCENT = 100;
  var MINIMUN_SCALE_PERCENT = 25;
  var SCALE_STEP = 25;
  var MAXIMUM_HASHTAG_COUNT = 5;
  var MAXIMUM_HASHTAG_LENGTH = 20;

  var effectsFormElement = document.querySelector('.img-upload__form');
  var buttonUploadFileElement = effectsFormElement.querySelector('#upload-file');
  var effectsSectionElement = effectsFormElement.querySelector('.img-upload__overlay');
  var buttonEffectsFormCloseElement = effectsSectionElement.querySelector('#upload-cancel');
  var previewContainerElement = document.querySelector('.img-upload__preview');
  var previewImageElement = previewContainerElement.querySelector('.img-upload__preview img');
  var defaulImageLink = '';

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
    if (!defaulImageLink) {
      defaulImageLink = previewImageElement.src;
    }
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
    var effectPercent = effectsPinElement.offsetLeft / (PIN_MAX_POSITION_RIGHT - PIN_MIN_POSITION_LEFT);
    effectsLevelElement.value = Math.round(effectPercent * MAXIMUM_PERCENT);
    effectsDepthElement.style.width = Math.round(effectPercent * MAXIMUM_PERCENT) + '%';
    var checkedElement = effectsControlContainerElement.querySelector('.effects__radio:checked');
    FILTERS.forEach(function (item) {
      if (previewImageElement.classList.contains('effects__preview--' + item)) {
        previewImageElement.classList.remove('effects__preview--' + item);
      }
    });
    switch (checkedElement.value) {
      case 'chrome':
        effectLevelContainerElement.classList.remove('visually-hidden');
        previewImageElement.classList.add('effects__preview--chrome');
        previewImageElement.style.filter = 'grayscale(' + effectPercent + ')';
        break;
      case 'sepia':
        effectLevelContainerElement.classList.remove('visually-hidden');
        previewImageElement.classList.add('effects__preview--sepia');
        previewImageElement.style.filter = 'sepia(' + effectPercent + ')';
        break;
      case 'marvin':
        effectLevelContainerElement.classList.remove('visually-hidden');
        previewImageElement.classList.add('effects__preview--marvin');
        previewImageElement.style.filter = 'invert(' + (effectPercent * MAXIMUM_PERCENT) + '%)';
        break;
      case 'phobos':
        effectLevelContainerElement.classList.remove('visually-hidden');
        previewImageElement.classList.add('effects__preview--phobos');
        previewImageElement.style.filter = 'blur(' + (effectPercent * 3) + 'px)';
        break;
      case 'heat':
        effectLevelContainerElement.classList.remove('visually-hidden');
        previewImageElement.classList.add('effects__preview--phobos');
        previewImageElement.style.filter = 'brightness(' + (effectPercent * 3) + ')';
        break;
      default:
        effectLevelContainerElement.classList.add('visually-hidden');
        previewImageElement.style.filter = '';
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
    var scaleValue = parseInt(zoomControlElement.value.substr(0, zoomControlElement.value.length - 1), 10);
    scaleValue = (scaleValue + SCALE_STEP >= MAXIMUM_PERCENT) ? MAXIMUM_PERCENT : (scaleValue + SCALE_STEP);
    zoomControlElement.value = scaleValue + '%';
    onScaleChange(scaleValue);
  };

  var onZoomOutClick = function () {
    var scaleValue = parseInt(zoomControlElement.value.substr(0, zoomControlElement.value.length - 1), 10);
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
    };

    var onPinMouseUp = function (evtMouseup) {
      evtMouseup.preventDefault();

      onEffectsApply();

      document.removeEventListener('mousemove', onPinMouseMove);
      document.removeEventListener('mouseup', onPinMouseUp);
    };

    document.addEventListener('mousemove', onPinMouseMove);
    document.addEventListener('mouseup', onPinMouseUp);
  });

  effectsControlContainerElement.addEventListener('change', onEffectSelect);

  var getValidateMessage = function (array) {
    var message = '';
    var lowerCaseArray = array.slice();
    lowerCaseArray.forEach(function (item, index, arrayCopy) {
      arrayCopy[index] = item.toLowerCase();
    });
    if (array.length > MAXIMUM_HASHTAG_COUNT) {
      return 'Хеш-тегов не должно быть больше 5-ти. ';
    }
    for (var j = 0; j < lowerCaseArray.length; j++) {
      if (lowerCaseArray.indexOf(lowerCaseArray[j]) !== j) {
        return 'Не должно быть повторяющихся хеш-тегов, таких как ' + array[j];
      }
    }
    for (var i = 0; i < array.length; i++) {
      if (array[i] === '') {
        return 'Не должно быть пустых хеш-тегов';
      }
      if (array[i].length === 1 && array[i] === '#') {
        return 'Хеш-тег не должен состоять из одного символа "#".';
      }
      if (array[i].length > MAXIMUM_HASHTAG_LENGTH) {
        return 'Хеш-тег не доджен быть длинее 20 символов.';
      }
      if (array[i][0] !== '#') {
        return ('Хеш-тег "' + array[i] + '" должен начинаться с символа "#". ');
      }
    }
    return message;
  };

  var hashtagsInputElement = document.querySelector('.text__hashtags');
  hashtagsInputElement.addEventListener('invalid', function () {
    hashtagsInputElement.style.outline = '3px solid red';
  });

  hashtagsInputElement.addEventListener('change', function () {
    hashtagsInputElement.setCustomValidity('');
    hashtagsInputElement.style.outline = '';
    if (hashtagsInputElement.value) {
      var hashtags = hashtagsInputElement.value.split(' ');
      hashtagsInputElement.setCustomValidity(getValidateMessage(hashtags));
    }
  });
})();
