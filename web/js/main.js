window.onload  = function () {
    AppJS.init();
};


let AppJS = {
    params: {
        imgW: 100,
        imgH: 100,
        ctxL: 0,
        ctxT: 0,
        ctxLOld: 0,
        ctxTOld: 0,
    },

    init: function () {
        AppJS.ready();
    },

    ready: function () {
        AppJS.renderCanvas();
        AppJS.handlers();
    },

    handlers: function () {
        let photoBorder             = document.getElementById('photoBorder');
        let plus                    = document.querySelector('.js-plus');
        let minus                   = document.querySelector('.js-minus');
        let clockwise               = document.querySelector('.js-clockwise');
        let anticlockwise           = document.querySelector('.js-anticlockwise');
        let save                    = document.querySelector('.js-save');
        photoBorder.onmousedown     = function (e){ AppJS.startMoving(e, this); };
        plus.onclick                = function () { AppJS.scaling('plus'); };
        minus.onclick               = function () { AppJS.scaling('minus'); };
        clockwise.onclick           = function () { AppJS.rotating('clockwise'); };
        anticlockwise.onclick       = function () { AppJS.rotating('anticlockwise'); };
        save.onclick                = function () { AppJS.saveImg(photoBorder); };
    },

    saveImg: function (canvas) {
        let data = canvas.toDataURL('image/jpeg');
        console.log(data);
    },

    scaling: function (sign) {
        if (sign === 'plus') {
            AppJS.params.imgW += 10;
            AppJS.params.imgH += 10;
        } else if (sign === 'minus') {
            AppJS.params.imgW -= 10;
            AppJS.params.imgH -= 10;
        }
        AppJS.renderCanvas();
    },

    rotating: function (sign) {
        if (sign === 'clockwise') {
            AppJS.renderCanvas(false, 45);
        } else if (sign === 'anticlockwise') {
            AppJS.renderCanvas(false, -90);
        }
    },

    startMoving: function (e, border) {
        let dragStartObj = {
            x: e.offsetX,
            y: e.offsetY,
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

        let translateX = left - startL;
        let translateY = top  - startT;

        AppJS.params.ctxL = translateX;
        AppJS.params.ctxT = translateY;

        AppJS.renderCanvas('translate', false);
    },

    renderCanvas: function (translate, rotateA) {
        let photoBorder = document.getElementById('photoBorder');
        let ctx = photoBorder.getContext('2d');

        let rectW = AppJS.params.imgW;
        let rectH = AppJS.params.imgH;

        let rectL = AppJS.params.ctxL - rectW / 2;
        let rectT = AppJS.params.ctxT - rectH / 2;

        // if (translate === 'translate') {
        //     ctx.translate(AppJS.params.ctxL, AppJS.params.ctxT);
        // }

        if (rotateA !== false) {
            ctx.rotate(rotateA * Math.PI / 180);
        }

        let photo = new Image();

        photo.onload = function() {
            ctx.clearRect(0, 0, photoBorder.width, photoBorder.height);
            ctx.drawImage(photo, rectL, rectT, rectW, rectH);
        };

        photo.src = "img/1.jpg";


        // ctx.fillStyle = 'red';
        // ctx.fillRect(rectL, rectT, rectW, rectH);
        // ctx.fillRect(photoBorder.width / 2 - rectW / 2, photoBorder.height / 2 - rectH / 2, rectW, rectH);
    },
};


