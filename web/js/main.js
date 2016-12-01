window.onload  = function () {
    AppJS.init();
};


let AppJS = {
    init: function () {
        AppJS.ready();
    },

    ready: function () {
        AppJS.renderCanvas();
        AppJS.scaling();
        let photoBorder = document.getElementById('photoBorder');
        photoBorder.onmousedown = function (e) {
            AppJS.startMoving(e, this);
        }
    },

    scaling: function () {

    },

    startMoving: function (e, border) {
        console.log('Start');
        border.onmousemove = function (e) {
            AppJS.moving(e);
            console.log('Moving');
        };
        border.onmouseup = function (e) {
            AppJS.endMoving(e, border);
            console.log('End');
        };
    },

    endMoving: function (e, border) {
        border.onmousemove = null;
    },

    moving: function (e) {
        let left = e.offsetX;
        let top  = e.offsetY;
        console.log(e, left, top);

        AppJS.renderCanvas(left, top);
    },

    renderCanvas: function (left, top) {
        let photoBorder = document.getElementById('photoBorder');
        let ctx = photoBorder.getContext('2d');

        let rectH = 100;
        let rectW = 100;

        let rectL = left ? left : photoBorder.width  / 2;
        let rectT = top  ? top  : photoBorder.height / 2;

        ctx.clearRect(0, 0, photoBorder.width, photoBorder.height);

        ctx.fillStyle = 'red';
        ctx.fillRect(rectL - rectW / 2, rectT - rectH / 2, rectW, rectH);
    },
};

