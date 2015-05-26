(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                    callback(currTime + timeToCall);
                },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

// Things to do!
// 1. maybe make use of firing events, especially when animation is complete
// 2. clean up code some.  Don't really like where the _updatePagination is being called
// 3. add high DPI canvas so images look nice on retinas, etc.
// 4. move easing function into this file in order to avoid deps
// 5. maybe do some rounding or more/less precision in the decimals since some easing funcs cause images to get out of alignment
// 6. eventually add ability to pass in an options obj
//   possible options...
//     1. pagination = true/false
//     2. starting index
//     3. viewing window size (how many imgs to show at once)
//     4. auto play (loop through on an interval)
//     5. pass in ease function (need to figure out what is all compatible)

function CarouselTrack(elementId) {
    this._images = [];

    this._currentPos = 0;
    this._isAnimating = false;

    this._animRequestId = 0;
    this._maxFrames = 60;

    this._init(elementId);
}

CarouselTrack.prototype._init = function(elementId) {
    this._rootElement = document.getElementById(elementId);
    this._imgElements = this._rootElement.getElementsByTagName('img');
    this._totalImages = this._imgElements.length;

    this._generateDOM();

    var maxWidth = 0;
    var maxHeight = 0;

    for (var i = 0; i < this._totalImages; i++) {
        var curImage = this._imgElements[i];

        if (curImage.width >= maxWidth) {
            maxWidth = curImage.width;
        }

        if (curImage.height >= maxHeight) {
            maxHeight = curImage.height;
        }
    }

    this._maxImageWidth = maxWidth;
    this._maxImageHeight = maxHeight;

    this._canvas.width = this._maxImageWidth;
    this._canvas.height = this._maxImageHeight;

    this._frameValues = [];
    for (var i = 0; i < this._maxFrames; i++) {
        this._frameValues[i] = Ease.inOutQuad(i, 0, 1, this._maxFrames);
    }

    for (var i = 0; i < this._totalImages; i++) {
        var image = new Image();
        image.src = this._imgElements[i].src;

        this._images.push({
            'val': image,
            'x': (i * this._maxImageWidth),
            'y': 0
        });

        this._imgElements[i].style.display = 'none';
    }

    this._addEventListeners();
};

CarouselTrack.prototype._generateDOM = function() {
    // create

    var ul = document.createElement('ul');
    var li1 = document.createElement('li');
    var li2 = document.createElement('li');
    var li3 = document.createElement('li');

    this._backwardButton = document.createElement('button');
    this._backwardButton.className = 'carousel-backward';

    this._canvas = document.createElement('canvas');
    this._ctx = this._canvas.getContext('2d');

    this._forwardButton = document.createElement('button');
    this._forwardButton.className = 'carousel-forward';

    var paginationList = document.createElement('ul');
    paginationList.className = 'pagination';

    this._paginationListButtons = [];

    for (var i = 0; i < this._totalImages; i++) {
        var li = document.createElement('li');
        li.setAttribute('data-index', i);

        this._paginationListButtons.push(li);
        paginationList.appendChild(li);
    }

    // append
    li1.appendChild(this._backwardButton);
    li2.appendChild(this._canvas);
    li3.appendChild(this._forwardButton);

    ul.appendChild(li1);
    ul.appendChild(li2);
    ul.appendChild(li3);

    this._rootElement.appendChild(ul);
    this._rootElement.appendChild(paginationList);
};

CarouselTrack.prototype._addEventListeners = function() {
    var that = this;
    this._forwardButton.addEventListener('click', function() {
        if (!that._isAnimating) {
            that.forward();
        }
    });

    this._backwardButton.addEventListener('click', function() {
        if (!that._isAnimating) {
            that.backward();
        }
    });

    for (var i = 0; i < this._paginationListButtons.length; i++) {
        this._paginationListButtons[i].addEventListener('click', function(e) {
            if (!that._isAnimating) {
                var pos = e.target.getAttribute('data-index');
                that._gotoIndex(parseInt(pos), 0);

                that._updatePagination(pos);
            }
        });
    }
};

CarouselTrack.prototype._updatePagination = function(pos) {
    this._paginationListButtons[pos].className = 'carousel-index-selected';
    for (var i = 0; i < this._paginationListButtons.length; i++) {
        if (i != pos) {
            this._paginationListButtons[i].className = '';
        }
    }
};

CarouselTrack.prototype.forward = function() {
    var forwardPos = (this._currentPos + 1) % this._totalImages;

    this._gotoIndex(forwardPos, 0);

    this._updatePagination(forwardPos);
};

CarouselTrack.prototype.backward = function() {
    var backwardPos = (this._currentPos - 1 < 0) ? this._totalImages - 1 : this._currentPos - 1;

    this._gotoIndex(backwardPos, 0);

    this._updatePagination(backwardPos);
};

CarouselTrack.prototype._gotoIndex = function(pos, frame) {
    if (frame >= this._maxFrames) {
        window.cancelAnimationFrame(this._animRequestId);
        this._currentPos = pos;
        this._isAnimating = false;

        return;
    }

    for (var i = 0; i < this._totalImages; i++) {
        this._images[i].x = this._images[i].x + (((i - pos) * this._maxImageWidth) - this._images[i].x) * this._frameValues[frame];
    }

    this._render();

    var that = this;
    this._animRequestId = window.requestAnimationFrame(function() {
        that._isAnimating = true;
        that._gotoIndex(pos, frame + 1);
    });
};

CarouselTrack.prototype._render = function() {
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    for (var i = 0; i < this._images.length; i++) {
        var image = this._images[i];
        this._ctx.drawImage(
            image.val, ((this._canvas.width / 2) - (image.val.width / 2)) + image.x, ((this._canvas.height / 2) - (image.val.height / 2)) + image.y
        );
    }
};

CarouselTrack.prototype.run = function() {
    this._render();

    this._updatePagination(0);
};