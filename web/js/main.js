window.onload  = function () {
    AppJS.init();
};

let AppJS = {
    params: {
        imgW: 500,
        imgH: 500,
        imgL: 0,
        imgT: 0,
    },

    init: function () {
        AppJS.ready();
    },

    ready: function () {
        AppJS.initParams();
        AppJS.handlers();
        AppJS.renderCanvas('init');
    },

    handlers: function () {
        let canvas                  = document.getElementById('photoBorder');
        let plus                    = document.querySelector('.js-plus');
        let minus                   = document.querySelector('.js-minus');
        let clockwise               = document.querySelector('.js-clockwise');
        let anticlockwise           = document.querySelector('.js-anticlockwise');
        canvas.onmousedown          = function (e){ AppJS.startMoving(e, this); };
        plus.onclick                = function () { AppJS.scaling('plus'); };
        minus.onclick               = function () { AppJS.scaling('minus'); };
        clockwise.onclick           = function () { AppJS.rotating('clockwise'); };
        anticlockwise.onclick       = function () { AppJS.rotating('anticlockwise'); };
    },

    initParams: function () {
        let canvas = document.getElementById('photoBorder');
        AppJS.params.imgL = canvas.width / 2 - AppJS.params.imgW / 2;
        AppJS.params.imgT = canvas.height / 2 - AppJS.params.imgH / 2;
    },

    saveImg: function (canvas) {
        let saveBtn = document.querySelector('.js-save');
        let imgUrl = canvas.toDataURL('image/png');
        saveBtn.setAttribute('href', imgUrl);
    },

    scaling: function (sign) {
        if (sign === 'plus') {
            AppJS.params.imgW += 10;
            AppJS.params.imgH += 10;
            AppJS.params.imgL -= 5;
            AppJS.params.imgT -= 5;
        } else if (sign === 'minus') {
            AppJS.params.imgW -= 10;
            AppJS.params.imgH -= 10;
            AppJS.params.imgL += 5;
            AppJS.params.imgT += 5;
        }
        AppJS.renderCanvas();
    },

    rotating: function (sign) {
        if (sign === 'clockwise') {
            AppJS.renderCanvas('noCalcParam', 90);
        } else if (sign === 'anticlockwise') {
            AppJS.renderCanvas('noCalcParam', -90);
        }
    },

    startMoving: function (e, border) {
        let dragStartObj = {
            x: e.offsetX,
            y: e.offsetY,
            imgLStart: AppJS.params.imgL,
            imgTStart: AppJS.params.imgT,
        };
        border.onmousemove = function (e) {
            AppJS.moving(e, dragStartObj);
        };
        border.onmouseup = function (e) {
            AppJS.endMoving(e, border);
        };
    },

    endMoving: function (e, border) {
        border.onmousemove = null;
    },

    moving: function (e, start) {
        let startL = start.x;
        let startT = start.y;
        let left = e.offsetX;
        let top  = e.offsetY;
        let imgStartL = start.imgLStart;
        let imgStartT = start.imgTStart;

        let translateX = left - startL;
        let translateY = top  - startT;

        AppJS.params.imgL = translateX + imgStartL;
        AppJS.params.imgT = translateY + imgStartT;

        AppJS.renderCanvas();
    },

    renderCanvas: function (isInit, rotateA) {
        let canvas = document.getElementById('photoBorder');
        let ctx = canvas.getContext('2d');

        let cW = canvas.width;
        let cH = canvas.height;

        let rectL = AppJS.params.imgL;
        let rectT = AppJS.params.imgT;

        if (rotateA !== false) {
            ctx.rotate(rotateA * Math.PI / 180);
        }

        let photo = new Image();
        photo.onload = function() {
            ctx.clearRect(0, 0, cW, cH);
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, cW, cH);

            if (isInit === 'init') {
                AppJS.calcParams(photo, cW, cH);
            }

            ctx.drawImage(photo, rectL, rectT, AppJS.params.imgW, AppJS.params.imgH);
        };

        photo.src = "img/1.jpg";

        AppJS.saveImg(canvas);
    },

    calcParams: function (photo, cW, cH) {
        let width =  photo.width;
        let height = photo.height;

        let wProp = width  / cW;
        let hProp = height / cH;

        if (wProp > hProp) {
            AppJS.params.imgW = cW;
            AppJS.params.imgH = height * cW / width;
        } else {
            AppJS.params.imgW = width * cH / height;
            AppJS.params.imgH = cH;
        }
    },
};


