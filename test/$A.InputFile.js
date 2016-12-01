$A.InputFile = {
    fileAccept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, .pdf, .docx',
    obj:{},
    fileField: undefined,
    change: function(fileField, files) {     // Функция для события выбора файлов
        $A.InputFile.fileField = $(fileField);
        if (/^image\//.test(files[0].type)) {    // Если картинка
            if($A.InputFile.fileField.attr('data-crop-img')) $A.InputFile.cropWithJcrop(files[0]);
            else $A.InputFile.cropWithCanvas (files[0]); // Сжимаем картинку чтоб большая сторона была не больше 1600пх
        } else {
            $A.InputFile.obj[$A.InputFile.fileField[0].name] = files[0];
            if(files[0].type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')      $A.InputFile.showFilePreview('doc', files[0].name);
            else if(files[0].type == 'application/pdf')                                                         $A.InputFile.showFilePreview('pdf', files[0].name);
            else if(files[0].type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')       $A.InputFile.showFilePreview('xls', files[0].name);
        }
    },
    cropWithCanvas: function (fileImg) {
        var img = new Image();
        var reader = new FileReader();
        var canvas = document.createElement('canvas');
        var max = 1600;
        reader.onload = function(e) { img.src = e.target.result; };
        reader.readAsDataURL(fileImg);
        img.onload = function () {
            var width =  img.width;
            var height = img.height;
            if(     img.width >max && img.height<max){width=max; height=max*img.height/img.width;}
            else if(img.height>max && img.width <max){height=max; width=max*img.width/img.height;}
            else if(img.height>max && img.width >max){
                if(img.width>img.height){width=max; height=max*img.height/img.width;}
                else if(img.height>img.width){height=max; width=max*img.width/img.height;}
            }
            canvas.width  = width;
            canvas.height  = height;
            var ctx = canvas.getContext('2d');
            if(fileImg.type !== 'image/png'){
                ctx.fillStyle = "rgb(255, 255, 255)";
                ctx.fillRect(0, 0, width, height);
            }
            ctx.drawImage(img, 0, 0, width, height);
            $A.InputFile.saveImg(canvas, fileImg);
        }
    },
    cropWithJcrop: function(fileImg) {
        var img = new Image();
        var reader = new FileReader();
        var cutSize = $A.InputFile.fileField.attr('data-crop-img');
        var aspectRadio = $A.InputFile.fileField.attr('data-aspect-radio') ? $A.InputFile.fileField.attr('aspect-radio') : 1;
        
        img.id = 'targetCrop';
        reader.onload = function(e) { img.src = e.target.result;};
        reader.readAsDataURL(fileImg);
        $('#preloader').show();
        img.onload = function() {
            var getCropParam = function(c) {cropParam = {x: c.x, y: c.y, w: c.w, h: c.h};};
            var cropParam = {x: 0, y: 0, w: 200, h:200};
            $A.ModalBox({
                title: 'Обрезка изображения',
                content: img.outerHTML,
                classModal: 'jcrop',
                iconClass: 'icon-camera',
                classOk: 'js-okJcropModal'
            });
            $('.js-okJcropModal').click(function() {
                var canvas = document.createElement('canvas');
                canvas.width  = cutSize*aspectRadio;
                canvas.height = cutSize;

                canvas.getContext('2d').drawImage(
                    img,
                    -cropParam.x*cutSize*aspectRadio/cropParam.w,
                    -cropParam.y*cutSize/cropParam.h,
                    viewImgW*cutSize*aspectRadio/cropParam.w,
                    viewImgH*cutSize/cropParam.h
                );
                $A.InputFile.saveImg(canvas, fileImg);
                $A.InputFile.fileField.val('');
                $A.closeModal();
            });
            var targetCrop = $('#targetCrop');
            var viewImgW = targetCrop.width();
            var viewImgH = targetCrop.height();
            targetCrop.Jcrop({  setSelect: [0, 0, 200, 200],  onChange: getCropParam,  aspectRatio: aspectRadio, bgColor: ''});
            $('#preloader').hide();
        }
    },
    saveImg: function (canvas, fileImg) {
        var data = canvas.toDataURL(fileImg.type);
        var aBase64 = data.split(',');
        var sData = atob(aBase64[1]);
        var aBufferView = new Uint8Array(sData.length);
        for (var i = 0; i < aBufferView.length; i++) { aBufferView[i] = sData.charCodeAt(i); }
        $A.InputFile.obj[$A.InputFile.fileField[0].name] = new Blob([aBufferView], {type : fileImg.type});
        $A.InputFile.showPreview(data);
    },
    showPreview: function(data) {
        var label = $A.InputFile.fileField.parent();
        label.find('.preview').remove();
        label.before('<div class="preview"><img src="' + data + '"><i class="icon icon-trash js-delPreview"></i></div>');
        if($A.InputFile.fileField.hasClass('js-addNextFileField')){
            var widgetIndex = $A.InputFile.fileField.closest('.widget').index();
            var fieldIndex = $A.InputFile.fileField.closest('.widget').find('.fileField:last').index() + 1;
            $('<div class="fileField"><label><input name="w[' + widgetIndex + '][wGallery][' + fieldIndex + ']" type="file" class="js-addNextFileField" accept="image/jpeg, image/png"></label></div>').insertAfter($A.InputFile.fileField.closest('.fileField'));
        }
    },
    showFilePreview: function(format, fileName) {
        var label = $A.InputFile.fileField.parent();
        label.find('.preview').remove();
        label.before('<div class="preview"><img src="/img/admin/' + format + '.png"><p>' + fileName + '</p><i class="icon icon-trash js-delPreview"></i></div>');
        if($A.InputFile.fileField.hasClass('js-addNextFileField')){
            var widgetIndex = $A.InputFile.fileField.closest('.widget').index();
            var fieldIndex = $A.InputFile.fileField.closest('.widget').find('.fileField:last').index() + 1;
            $('<div class="fileField file">' +
                '<label>' +
                    '<input name="w[' + widgetIndex + '][wFiles][' + fieldIndex + ']" type="file" class="js-addNextFileField" accept="' + $A.InputFile.fileAccept + '">' +
                '</label>' +
            '</div>').insertAfter($A.InputFile.fileField.closest('.fileField'));
        }
    },
    delPreview: function(el) {
        var input = $(el).siblings('label').find('input:file');
        var arrStr = '';
        input.val('');
        if( !!input.attr('data-img-src') ) {
            if(input.attr('name').slice(0, 2) == 'w[') arrStr = '[]';
            $('<input type="hidden" name="removeImg' + arrStr +'" value="' + input.attr('data-img-src') + '">').insertAfter(input);
            input.removeAttr('data-img-src');
        }else if( !!input.attr('data-file-src') ) {
            if(input.attr('name').slice(0, 2) == 'w[') arrStr = '[]';
            $('<input type="hidden" name="removeFile' + arrStr +'" value="' + input.attr('data-file-src') + '">').insertAfter(input);
            input.removeAttr('data-file-src');
        }
        $(el).remove(); $A.InputFile.obj = {};
    },
    buildField: function(el) {
        var random = (Math.random() * 100000).toFixed(0);
        if( $(el).attr('data-img-src') ){
            $('<div class="preview"><img src="' + $(el).attr('data-img-src') + '?v=' + random + '"><i class="icon icon-trash js-delPreview"></i></div>').insertBefore($(el).parent());
        } else if( $(el).attr('data-file-src') ){
            $('<div class="preview">' +
                '<img src="/img/admin/' + $(el).attr('data-file-src').replace(/(\/.+\.)/, '') + '.png">' +
                '<p>' + $(el).attr('data-file-src').replace(/(\/.+\/)/, '') + '</p>' +
                '<i class="icon icon-trash js-delPreview"></i>' +
            '</div>').insertBefore($(el).parent());
        }

        if($(el).closest('.fileField').hasClass('file')){ $(el).attr('accept', $A.InputFile.fileAccept); }
        else { $(el).attr('accept', 'image/jpeg, image/png'); }
        $(el).addClass('initialized');
    }
};
