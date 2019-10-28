'use strict';

/* backend.js /* */

(function () {
  var SUCCESS_STATUS = 200;
  var ANSWER_TIMEOUT = 10000;

  var operatorType = '';
  var exchangeData = function (URL, onSuccess, onError, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_STATUS) {
        onSuccess(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения!');
    });
    xhr.addEventListener('time', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + ' мс.');
    });

    xhr.timeout = ANSWER_TIMEOUT;
    switch (operatorType) {
      case 'load':
        xhr.open('GET', URL);
        xhr.send();
        break;
      case 'save':
        xhr.open('POST', URL);
        xhr.send(data);
        break;
      default:
        onError('Не определен тип операции');
    }
  };

  var onDataLoad = function (URL, onLoad, onError) {
    operatorType = 'load';
    exchangeData(URL, onLoad, onError);
  };

  var onDataSave = function (URL, onSave, onError, data) {
    operatorType = 'save';
    exchangeData(URL, onSave, onError, data);
  };

  window.backend = {
    onDataLoad: onDataLoad,
    onDataSave: onDataSave
  };
})();
