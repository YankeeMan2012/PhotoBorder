window.onload  = function () {
    AppJS.init();
};


let AppJS = {
    params: {
        imgW: 100,
        imgH: 100,
        imgL: 0,
        imgT: 0,
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
        photoBorder.onmousedown     = function (e){ AppJS.startMoving(e, this); };
        plus.onclick                = function () { AppJS.scaling('plus'); };
        minus.onclick               = function () { AppJS.scaling('minus'); };
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

        AppJS.params.imgL = imgStartL + translateX;
        AppJS.params.imgT = imgStartT + translateY;
        AppJS.renderCanvas();
    },

    renderCanvas: function () {
        let photoBorder = document.getElementById('photoBorder');
        let ctx = photoBorder.getContext('2d');

        let rectW = AppJS.params.imgW;
        let rectH = AppJS.params.imgH;

        let rectL = AppJS.params.imgL;
        let rectT = AppJS.params.imgT;

        ctx.clearRect(0, 0, photoBorder.width, photoBorder.height);

        ctx.fillStyle = 'red';
        ctx.fillRect(rectL - rectW / 2, rectT - rectH / 2, rectW, rectH);
    },
};

