'use strict';

(function () {
  var COMMENTS_LOAD_STEP = 5;
  var bigPictureElement = document.querySelector('.big-picture');
  var comments;
  var commentsContainerElement = document.querySelector('.social__comments');
  var buttonCommentsLoadElement = document.querySelector('.comments-loader');

  var fillCommentSection = function (commentList) {
    commentList.forEach(function (item) {
      var htmlContent = '<li class="social__comment"><img class="social__picture" src="';
      htmlContent += item.avatar + '" alt="' + item.name + '" width="35" height="35"><p class="social__text">';
      htmlContent += item.message + '</p></li>';
      commentsContainerElement.insertAdjacentHTML('beforeend', htmlContent);
    });
  };
  var fillPreview = function (arrayItem) {
    bigPictureElement.querySelector('.big-picture__img img').src = arrayItem.url;
    bigPictureElement.querySelector('.likes-count').textContent = arrayItem.likes;
    bigPictureElement.querySelector('.comments-count').textContent = arrayItem.comments.length;
    commentsContainerElement.innerHTML = '';
    comments = arrayItem.comments;
    fillCommentSection(comments.slice(0, COMMENTS_LOAD_STEP));
    buttonCommentsLoadElement.classList.toggle('hidden', comments.length <= COMMENTS_LOAD_STEP);
    bigPictureElement.querySelector('.social__caption').textContent = arrayItem.description;
    document.addEventListener('keydown', onEscBigPictureClose);
    bigPictureElement.classList.remove('hidden');
  };
  var buttonBigPictureClose = bigPictureElement.querySelector('.big-picture__cancel');
  var onBigPictureClose = function () {
    bigPictureElement.classList.add('hidden');
    document.body.classList.remove('modal-open');
    document.removeEventListener('keydown', onEscBigPictureClose);
  };
  var onEscBigPictureClose = function (evt) {
    if (evt.keyCode === window.common.Keycode.ESC) {
      onBigPictureClose();
    }
  };
  buttonBigPictureClose.addEventListener('click', onBigPictureClose);

  document.querySelector('.social__comment-count').classList.add('visually-hidden');
  var onButtonCommentsLoadClick = function () {
    var commentElements = bigPictureElement.querySelectorAll('.social__comment');
    var additionCommentCount = (commentElements.length + COMMENTS_LOAD_STEP <= comments.length) ? COMMENTS_LOAD_STEP : comments.length - commentElements.length;
    fillCommentSection(comments.slice(commentElements.length, commentElements.length + additionCommentCount));
    buttonCommentsLoadElement.classList.toggle('hidden', commentElements.length + additionCommentCount === comments.length);
  };
  buttonCommentsLoadElement.addEventListener('click', onButtonCommentsLoadClick);

  window.preview = {
    fillPreview: fillPreview
  };
})();
