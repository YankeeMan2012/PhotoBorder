window.onload  = function () {
    AppJS.init();
};


let AppJS = {
    params: {
        imgW: 100,
        imgH: 100,
        imgL: 0,
        imgT: 0,
        imgA: 0,
    },

    init: function () {
        AppJS.ready();
    },

    ready: function () {
        AppJS.renderCanvas();
        AppJS.handlers();
    },

    handlers: function () {
        let photoBorder     = document.getElementById('photoBorder');
        let plus            = document.querySelector('.js-plus');
        let minus           = document.querySelector('.js-minus');
        let clockwise       = document.querySelector('.js-clockwise');
        let anticlockwise   = document.querySelector('.js-anticlockwise');
        photoBorder.onmousedown     = function (e){ AppJS.startMoving(e, this); };
        plus.onclick                = function () { AppJS.scaling('plus'); };
        minus.onclick               = function () { AppJS.scaling('minus'); };
        clockwise.onclick           = function () { AppJS.rotating('clockwise'); };
        anticlockwise.onclick       = function () { AppJS.rotating('anticlockwise'); };
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
            AppJS.params.imgA += 1;
        } else if (sign === 'anticlockwise') {
            AppJS.params.imgA -= 1;
        }
        AppJS.renderCanvas(false, 'rotate');
    },

    startMoving: function (e, border) {
        let dragStartObj = {
            x: e.offsetX,
            y: e.offsetY,
            imgL: AppJS.params.imgL,
            imgT: AppJS.params.imgT,
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
        let imgStartL = start.imgL;
        let imgStartT = start.imgT;

        let left = e.offsetX;
        let top  = e.offsetY;

        let translateX = left - startL;
        let translateY = top  - startT;

        console.log(imgStartL, imgStartT);

        // AppJS.params.imgL = imgStartL + translateX;
        // AppJS.params.imgT = imgStartT + translateY;
        // console.log(translateX, translateY);

        // AppJS.params.imgOldL = translateX;
        // AppJS.params.imgOldT = translateY;

        AppJS.params.imgL = AppJS.params.X - AppJS.params.imgL;
        AppJS.params.imgT = AppJS.params.Y - AppJS.params.imgT;

        AppJS.params.X = translateX;
        AppJS.params.Y = translateY;

        AppJS.renderCanvas('translate', false);
    },

    renderCanvas: function (translate, rotate) {
        let photoBorder = document.getElementById('photoBorder');
        let ctx = photoBorder.getContext('2d');

        let rectW = AppJS.params.imgW;
        let rectH = AppJS.params.imgH;

        // let rectL = AppJS.params.imgL - rectW / 2;
        // let rectT = AppJS.params.imgT - rectH / 2;

        ctx.clearRect(0, 0, photoBorder.width, photoBorder.height);

        if (translate === 'translate') {
            ctx.translate(AppJS.params.imgL, AppJS.params.imgT);
        }

        if (rotate === 'rotate') {
            ctx.rotate(AppJS.params.imgA * Math.PI / 180);
        }

        ctx.fillStyle = 'red';
        // ctx.fillRect(rectL, rectT, rectW, rectH);
        ctx.fillRect(photoBorder.width / 2 - rectW / 2, photoBorder.height / 2 - rectH / 2, rectW, rectH);
    },
};

