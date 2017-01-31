$(document).ready(function() {
  var firstWordField = $('#firstWord');
  var backgroundField = $('#background');
  var canvas = document.getElementById('canvas');
  var memeProperties = {};

  firstWordField.on('input', function(event) {
    setFirstWord();
    repaint()
      .catch(alert);
  })

  backgroundField.on('input', function(event) {
    extractImageFile(event.target)
      .then(extractImageData)
      .then(setBackgroundImage)
      .then(repaint)
      .catch(alert);
  });

  setFirstWord();
  setBackgroundImage('./stylish-hijabi.jpg').then(repaint).catch(alert);

  function extractImageFile(field) {
    var file = field.files[0];

    if (file.type.match('image.*')) {
      return Promise.resolve(file);
    } else {
      return Promise.reject("Please upload an image.");
    }

  }

  function extractImageData(file) {
    return new Promise(function(resolve, reject) {
      var fileTracker = new FileReader();
      fileTracker.onload = function() {
        resolve(this.result);
      };
      fileTracker.onerror = function() {
        return reject('An error occured while reading the file');
      };
      fileTracker.onabort = function() {
        return reject('The file upload was aborted.')
      }
      fileTracker.readAsDataURL(file);
    });
  }

  function setBackgroundImage(imageData) {
    return new Promise(function(resolve, reject) {
      var image = new Image();
      image.onload = function() {
        memeProperties.backgroundImage = image;
        resolve();
      };
      image.src = imageData;
    });
  }

  function setFirstWord() {
    memeProperties.firstWord = firstWordField[0].value;
  }

  function repaint() {
    if (!memeProperties.backgroundImage.complete) {
      return Promise.resolve();
    }

    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(memeProperties.backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '40px Georgia';
    ctx.fillText(memeProperties.firstWord, 10, 150);
    ctx.fillText('Make America Great', 10, 350);

    return Promise.resolve();
  }
});