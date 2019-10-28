'use strict';

(function () {
  var RANDOM_GALLERY_COUNT = 10;
  var DEBOUNCE_DELAY = 500;

  var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');

  var pictureContainerElement = document.querySelector('.pictures');
  var picturesDocumentFragment = new DocumentFragment();

  var filterContainerElement = document.querySelector('.img-filters');
  var incomingData;

  var getRandomValue = function (minValue, maxValue) {
    var difference = maxValue - minValue;
    return (minValue + Math.round(Math.random() * difference));
  };

  var shuffleArray = function (array) {
    var arrayCopy = array.slice();
    var j;
    var temp;
    for (var i = arrayCopy.length - 1; i > 0; i--) {
      j = getRandomValue(0, i);
      temp = arrayCopy[j];
      arrayCopy[j] = arrayCopy[i];
      arrayCopy[i] = temp;
    }
    return arrayCopy;
  };

  var setHandlerPictureClick = function (galleryItem, arrayItem) {
    galleryItem.addEventListener('click', function (evt) {
      evt.preventDefault();
      document.body.classList.add('modal-open');
      window.preview.fillPreview(arrayItem);
    });
    galleryItem.addEventListener('click', function (evt) {
      if (evt.keyCode === window.common.Keycode.ENTER) {
        galleryItem.click();
      }
    });
  };

  var fillGallery = function (data) {
    pictureContainerElement.querySelectorAll('.picture').forEach(function (item) {
      item.remove();
    });
    data.forEach(function (item) {
      var newPictureElement = pictureTemplate.cloneNode(true);
      newPictureElement.querySelector('.picture__img').src = item.url;
      newPictureElement.querySelector('.picture__likes').textContent = item.likes;
      newPictureElement.querySelector('.picture__comments').textContent = item.comments.length;
      setHandlerPictureClick(newPictureElement, item);
      picturesDocumentFragment.appendChild(newPictureElement);
    });
    pictureContainerElement.appendChild(picturesDocumentFragment);
  };

  var onDataLoad = function (data) {
    incomingData = data;
    fillGallery(data);
    filterContainerElement.classList.remove('img-filters--inactive');
  };

  var onGalleryFilter = function (idName) {
    var newGallery = shuffleArray(incomingData.slice());
    switch (idName) {
      case 'filter-random':
        newGallery.length = RANDOM_GALLERY_COUNT;
        fillGallery(newGallery);
        break;
      case 'filter-discussed':
        newGallery.sort(function (left, right) {
          return right.comments.length - left.comments.length;
        });
        fillGallery(newGallery);
        break;
      default:
        fillGallery(incomingData);
    }
  };

  var lastTimer;
  var onFilterClick = function (evt) {
    if (evt.target.classList.contains('img-filters__button')) {
      if (lastTimer) {
        window.clearTimeout(lastTimer);
      }

      lastTimer = window.setTimeout(function () {
        filterContainerElement.querySelector('.img-filters__button--active').classList.remove('img-filters__button--active');
        evt.target.classList.add('img-filters__button--active');
        onGalleryFilter(evt.target.id);
      }, DEBOUNCE_DELAY);
    }
  };

  filterContainerElement.addEventListener('click', onFilterClick);

  window.backend.onDataLoad('https://js.dump.academy/kekstagram/data', onDataLoad, window.common.onErrorModalShow);
})();
