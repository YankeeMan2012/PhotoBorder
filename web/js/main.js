window.onload  = function () {
    AppJS.init();
};

let AppJS = {
    params: {
        imgSrc: 'img/emptyImg.jpg',
        imgW: 500,
        imgH: 500,
        imgL: 0,
        imgT: 0,
    },

    init: function () {
        AppJS.ready();
    },

    ready: function () {
        AppJS.handlers();
        AppJS.renderCanvas('init');
    },

    handlers: function () {
        let canvas                  = document.getElementById('photoBorder');
        let plus                    = document.querySelector('.js-plus');
        let minus                   = document.querySelector('.js-minus');
        let clockwise               = document.querySelector('.js-clockwise');
        let anticlockwise           = document.querySelector('.js-anticlockwise');
        let photo                   = document.querySelector('.js-file');
        canvas.onmousedown          = function (e){ AppJS.startMoving(e, this); };
        plus.onclick                = function () { AppJS.scaling('plus'); };
        minus.onclick               = function () { AppJS.scaling('minus'); };
        clockwise.onclick           = function () { AppJS.rotating('clockwise'); };
        anticlockwise.onclick       = function () { AppJS.rotating('anticlockwise'); };
        photo.onchange              = function (e){ AppJS.loadImg(e, this); };
    },

    loadImg: function (e, file) {
        let reader = new FileReader();
        reader.onload = function(event) {
            AppJS.params.imgSrc = event.target.result;
            AppJS.renderCanvas('init');
        };
        reader.readAsDataURL(file.files[0]);
    },

    saveImg: function (canvas) {
        let saveBtn = document.querySelector('.js-save');
        let imgUrl = canvas.toDataURL('image/png');
        saveBtn.setAttribute('href', imgUrl);
    },

    scaling: function (sign) {
        let oldWidth = AppJS.params.imgW;
        let oldHeight = AppJS.params.imgH;
        if (sign === 'plus') {
            AppJS.params.imgW += 20;
            AppJS.params.imgL -= 10;
            AppJS.params.imgH = AppJS.params.imgW * oldHeight / oldWidth;
            AppJS.params.imgT -= (AppJS.params.imgH - oldHeight) / 2;
        } else if (sign === 'minus') {
            AppJS.params.imgW -= 20;
            AppJS.params.imgL += 10;
            AppJS.params.imgH = AppJS.params.imgW * oldHeight / oldWidth;
            AppJS.params.imgT -= (AppJS.params.imgH - oldHeight) / 2;
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

        // if (rotateA !== false) {
        //     ctx.rotate(rotateA * Math.PI / 180);
        // }

        let photo = new Image();
        let border = new Image();
        photo.src = AppJS.params.imgSrc;
        border.src = "img/border.png";

        photo.onload = function() {
            ctx.clearRect(0, 0, cW, cH);
            ctx.fillStyle = '#fff';
            ctx.fillRect(20, 20, cW - 40, cH - 40);
            if (isInit === 'init') {
                AppJS.calcParams(photo, cW, cH, ctx, canvas);
                let border = new Image();
                border.onload = function() { ctx.drawImage(border, 0, 0, cW, cH); };
            } else {
                ctx.drawImage(photo, rectL, rectT, AppJS.params.imgW, AppJS.params.imgH);
            }
        };
        border.onload = function() { ctx.drawImage(border, 0, 0, cW, cH); };
        AppJS.saveImg(canvas);
    },

    calcParams: function (photo, cW, cH, ctx, canvas) {
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
        AppJS.params.imgL = canvas.width / 2 - AppJS.params.imgW / 2;
        AppJS.params.imgT = canvas.height / 2 - AppJS.params.imgH / 2;
        ctx.drawImage(photo, AppJS.params.imgL, AppJS.params.imgT, AppJS.params.imgW, AppJS.params.imgH);
    },
};


