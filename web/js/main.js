window.onload  = function () {
    AppJS.init();
};

var AppJS = {
    params: {
        imgSrc: 'img/emptyImg.jpg',
        imgW: 500,
        imgH: 500,
        imgL: 0,
        imgT: 0,
        sizeOld: 50,
        borderSrc: "img/borders/border.png"
    },

    init: function () {
        AppJS.ready();
    },

    ready: function () {
        AppJS.handlers();
        AppJS.renderCanvas('init');
        $(".sizePoint").slider({
            value: 50,
            step: 5,
            slide: function(event, ui) {
                AppJS.scaling(ui.value);
            },
            change: function(event, ui) {
                AppJS.saveImg();
            }
        });
    },

    handlers: function () {
        var canvas                  = document.getElementById('photoBorder');
        var plus                    = document.querySelector('.js-plus');
        var minus                   = document.querySelector('.js-minus');
        var clockwise               = document.querySelector('.js-clockwise');
        var anticlockwise           = document.querySelector('.js-anticlockwise');
        var photo                   = document.querySelector('.js-file');
        canvas.onmousedown          = function (e){ AppJS.startMoving(e, this); };
        photo.onchange              = function (e){ AppJS.loadImg(e, this); };
        $('.borderItem').on('click', function () { AppJS.choiceBorder($(this)); });
        $('.reset').on('click',     function () { AppJS.defaultState(); });
        $('[name="orientation"]').on('click', function () { AppJS.orientation(this.value); });
    },

    orientation: function (val) {
        var photo = $('#photoBorder');
        if (val === 'vertical') {
            photo.attr({'width': 1000, 'height': 1500});
            photo.css('margin-left', '-700px');
        } else {
            photo.attr({'width': 1500, 'height': 1000});
            photo.css('margin-left', '-1000px');
        }
        $(".sizePoint").slider("value", [50]);
        AppJS.renderCanvas('init');
        AppJS.saveImg();
    },

    defaultState: function () {
        $(".sizePoint").slider("value", [50]);
        AppJS.params.imgSrc = 'img/emptyImg.jpg';
        AppJS.params.imgW = 500;
        AppJS.params.imgH = 500;
        AppJS.params.imgL = 0;
        AppJS.params.imgT = 0;
        AppJS.params.sizeOld = 50;
        $('[name="orientation"]:first-child').click();
        $('.borderItem:first-child').click();
        AppJS.renderCanvas('init');
        AppJS.saveImg();
    },

    choiceBorder: function (border) {
        border.siblings('.checked').removeClass('checked');
        border.addClass('checked');
        var borderSrc = border.attr('data-img');
        AppJS.params.borderSrc = borderSrc;
        AppJS.renderCanvas('init');
        AppJS.saveImg();
    },

    loadImg: function (e, file) {
        var reader = new FileReader();
        reader.onload = function(event) {
            AppJS.params.imgSrc = event.target.result;
            AppJS.renderCanvas('init');
        };
        reader.readAsDataURL(file.files[0]);
    },

    saveImg: function () {
        var canvas = document.getElementById('photoBorder');
        var saveBtn = document.querySelector('.js-save');
        var imgUrl = canvas.toDataURL('image/jpeg');
        saveBtn.setAttribute('href', imgUrl);
    },

    scaling: function (val) {
        var oldWidth = AppJS.params.imgW;
        var oldHeight = AppJS.params.imgH;
        if (val > AppJS.params.sizeOld) {
            AppJS.params.imgW += 30;
            AppJS.params.imgL -= 15;
            AppJS.params.imgH = AppJS.params.imgW * oldHeight / oldWidth;
            AppJS.params.imgT -= (AppJS.params.imgH - oldHeight) / 2;
        } else {
            AppJS.params.imgW -= 30;
            AppJS.params.imgL += 15;
            AppJS.params.imgH = AppJS.params.imgW * oldHeight / oldWidth;
            AppJS.params.imgT -= (AppJS.params.imgH - oldHeight) / 2;
        }
        AppJS.params.sizeOld = val;
        AppJS.renderCanvas();
    },

    startMoving: function (e, border) {
        var dragStartObj = {
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
        AppJS.saveImg();
    },

    moving: function (e, start) {
        var startL = start.x;
        var startT = start.y;
        var left = e.offsetX;
        var top  = e.offsetY;
        var imgStartL = start.imgLStart;
        var imgStartT = start.imgTStart;
        var translateX = left - startL;
        var translateY = top  - startT;
        AppJS.params.imgL = translateX + imgStartL;
        AppJS.params.imgT = translateY + imgStartT;
        AppJS.renderCanvas();
    },

    renderCanvas: function (isInit) {
        var canvas = document.getElementById('photoBorder');
        var ctx = canvas.getContext('2d');
        var cW = canvas.width;
        var cH = canvas.height;
        var rectL = AppJS.params.imgL;
        var rectT = AppJS.params.imgT;

        var photo = new Image();
        var border = new Image();
        photo.src = AppJS.params.imgSrc;
        border.src = AppJS.params.borderSrc;

        photo.onload = function() {
            ctx.clearRect(0, 0, cW, cH);
            ctx.fillStyle = '#fff';
            ctx.fillRect(20, 20, cW - 40, cH - 40);
            if (isInit === 'init') {
                AppJS.calcParams(photo, cW, cH, ctx, canvas);
                var border = new Image();
                border.onload = function() { ctx.drawImage(border, 0, 0, cW, cH); };
            } else {
                ctx.drawImage(photo, rectL, rectT, AppJS.params.imgW, AppJS.params.imgH);
            }

        };
        border.onload = function() { ctx.drawImage(border, 0, 0, cW, cH); };
    },

    calcParams: function (photo, cW, cH, ctx, canvas) {
        var width =  photo.width;
        var height = photo.height;
        var wProp = width  / cW;
        var hProp = height / cH;
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


