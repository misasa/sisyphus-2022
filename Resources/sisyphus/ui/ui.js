Ti.API.info("ui.js...");
import {si} from '../sisyphus'
import { createBarcodeScanWindow } from './BarcodeScanWindow';
var ui = {};

ui.theme = {
    textColor : '#000000',
    grayTextColor : '#888888',
    headerColor : '#333333',
    lightBlue : '#006cb1',
    darkBlue : '#93caed',
    fontFamily : 'Droid Sans'
};

ui.properties = {
    platformWidth : Ti.Platform.displayCaps.platformWidth,
    platformHeight : Ti.Platform.displayCaps.platformHeight,
    iPhoneStatusBarHeight : 20,
    iPhoneNavBarHeight : 44,
    iPhoneTabBarHeight : 49,
    Busion : {
        backgroundImage : 'images/button_bg.png',
        height : 50,
        width : 250,
        color : '#000',
        font : {
            fontSize : 18,
            fontWeight : 'bold'
        }
    },
    Label : {
        color : ui.theme.textColor,
        font : {
            fontFamily : ui.theme.fontFamily,
            fontSize : 12
        },
        height : 'auto'
    },
    Window : {
        backgroundImage : 'images/ruff.png',
        navBarHidden : true,
        softInputMode : (Ti.UI.Android) ? Ti.UI.Android.SOFT_INPUT_ADJUST_RESIZE : ''
    },
    TableView : {
        backgroundImage : 'images/ruff.png',
        separatorStyle : (Ti.Platform.name == 'iPhone OS') ? Ti.UI.iPhone.TableViewSeparatorStyle.NONE : ''
    },
    TableViewRow : {
        selectedBackgroundColor : ui.theme.darkBlue, //I know, this is dumb, but it's currently inconsistent x-platform
        backgroundSelectedColor : ui.theme.darkBlue,
        className : 'tvRow'
    },
    TextField : {
        width : '90%',
        autocapitalization : Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
        borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        paddingLeft : 5, // pad left by 20 pixels
        paddingRight : 5, // pad right by 20 pixels
//            color : '#000000'
    },
    TextArea : {
        borderRadius : 10,
        backgroundColor : '#efefef',
        backgroundGradient : {
            type : 'linear',
            colors : [{
                color : '#efefef',
                position : 0.0
            }, {
                color : '#cdcdcd',
                position : 0.50
            }, {
                color : '#efefef',
                position : 1.0
            }]
        }
    },
    NormalButton : {
        width : '90%',
        height : '15%'
    },
    ToolBarButton : {
        height : 90,
        width : Ti.UI.SIZE
    },
    RightBottomButton : {
        width : '40%',
        height : 80,
        right : '2%',
        bottom : '2%',
        // backgroundColor : 'white',
        // borderColor : 'black',
        // borderWidth : 1,
        // borderRadius : 10
    },

    LeftBottomButton : {
        width : '40%',
        height : 80,
        left : '2%',
        bottom : '2%',
        // backgroundColor : 'white',
        // borderColor : 'black',
        // borderWidth : 1,
        // borderRadius : 10
    },


    animationDuration : 500,
    stretch : {
        top : 0,
        bottom : 0,
        left : 0,
        right : 0
    },
    variableTopRightButton : {
        top : 5,
        right : 5,
        height : 30,
        width : si.os({
            iphone : 60,
            android : 'auto'
        }),
        color : '#ffffff',
        font : {
            fontSize : 12,
            fontWeight : 'bold'
        },
        backgroundImage : 'images/button_bg_black.png'
    },
    topRightButton : {
        top : 5,
        right : 5,
        height : 30,
        width : 38
    },
    headerText : {
        top : 8,
        height : 'auto',
        textAlign : 'center',
        color : ui.theme.headerColor,
        font : {
            fontFamily : ui.theme.fontFamily,
            fontSize : 18,
            fontWeight : 'bold'
        }
    },
    headerView : {
        backgroundImage : 'images/header_bg.png',
        height : 40
    },
    boldHeaderText : {
        height : 'auto',
        color : ui.theme.grayTextColor,
        font : {
            fontFamily : ui.theme.fontFamily,
            fontSize : 30,
            fontWeight : 'bold'
        }
    },
    smallText : {
        //color : ui.theme.grayTextColor,
        font : {
            fontFamily : ui.theme.fontFamily,
            fontSize : 20
        },
        height : 'auto'
    },
    logText : {
        color : ui.theme.grayTextColor,
        font : {
            fontFamily : ui.theme.fontFamily,
            fontSize : 20
        },
        height : 'auto'
    },
    spacerRow : {
        backgroundImage : 'images/spacer_row.png',
        height : 36,
        className : 'spacerRow'
    },
    small_label : {
        text : ' ',
        color : '#111',
        textAlign : 'left',
        height : 'auto',
        font : {
            fontWeight : 'bold',
            fontSize : 13
        }
    },
    medium_label : {
        text : ' ',
        color : '#111',
        textAlign : 'left',
        height : 'auto',
        font : {
            fontWeight : 'bold',
            fontSize : 16
        }
    },
    large_label : {
        text : ' ',
        color : '#111',
        textAlign : 'left',
        height : 'auto',
        font : {
            fontWeight : 'bold',
            fontSize : 36
        }
    },
    avatar_medium : {
        image : '',
        backgroundColor : '#000000',
        width : 90,
        height : 90
    },
};
var $$ = ui.properties; 

//(function() {
    ui.myAlert = function(_args){
        var dialog = Ti.UI.createAlertDialog({
            message: _args.message,
            title: _args.title || '',
            //ok: 'OK'
        });
        //si.sound_attention.play();
        si.sound_reminder.play();      
        dialog.show();
    };

    ui.alert_simple = function(message){
        var dialog = Ti.UI.createAlertDialog({
            message: message,
            title: '',
            //ok: 'OK'
        });
        //si.sound_attention.play();
        si.sound_reminder.play();      
        dialog.show();
    };

    ui.showErrorDialog = function(message){
        var dialog = Ti.UI.createAlertDialog({
            message: message,
            title: '',
            //ok: 'OK'
        });
        si.sound_mailerror.play();
        dialog.show();
    };


    ui.alert_no_parent = function(){
        ui.myAlert({message:'Load parent first', title:''});
    };

    ui.error_print = function(e){
        //ui.myAlert({message: e.message, title:''});
        si.sound_error.play();
        var dialog = Ti.UI.createAlertDialog({
            message: e.error,
            title: 'No label created',
            //ok: 'OK'
        });
        dialog.show();
    }

    ui.createInputRow = function(_title, _input, opts){
        var _row = Ti.UI.createView({
             layout : 'vertical',
             height : Ti.UI.SIZE,
        });
        var _label = Ti.UI.createLabel({left: 5, text:_title});
        _row.add(_label);
        _row.add(_input);
        return _row;
    };

    ui.createInputTableRow = function(_title, _input, opts){
        var _row = Ti.UI.createTableViewRow({
             layout : 'vertical',
             height : Ti.UI.SIZE,
        });
        var _label = Ti.UI.createLabel({left: 5, text:_title});
        _row.add(_label);
        _row.add(_input);
        return _row;
    };

    ui.createPickerInput = function(_data, _id){
        var picker = Ti.UI.createPicker({
            width: Ti.UI.FILL,
            //color: 'red'
        });
        var data = [Ti.UI.createPickerRow({title: '', id: null})];
        picker.value = null;
        picker.add(data);
        var selected_id;
        if (_data){
            for(var i=0; i<_data.length; i++){
                var _obj = _data[i];
                var row = Ti.UI.createPickerRow(_obj);
                picker.add(row);
                if (_obj.id == _id){
                    Ti.API.info("find default selection!");
                    Ti.API.info(_obj);
                    selected_id = i + 1;
                }
            }
        }

        picker.selectionIndicator = true;
        if (selected_id){
            picker.setSelectedRow(0, selected_id,false);
            picker.value = _id;
        }


        picker.addEventListener('change', function(e){
            picker.value = e.row.id;
        });

        return picker;  
    };

    ui.createInputPrint = function(opts){
        var view = Ti.UI.createView({
            height : Ti.UI.SIZE,
            //backgroundColor : 'red',
            layout : 'horizontal'
        });

        var imgDimensions = 30;
        var text = Ti.UI.createTextField(opts);


        var imageButtonView = Ti.UI.createView({
            width : 60,
            height : 60
        });
        var imageView = Ti.UI.createImageView({
            image : '/images/glyphicons-16-print.png',
            width : imgDimensions,
            height : imgDimensions            
        });


        var button = Ti.UI.createButton({
            title : '',
            width : 60,
            height : 60
        });

        button.addEventListener('click', function(e) {
            if (!Ti.App.Properties.getBool('printLabel')){
                ui.alert_simple('Turn label on');
                return;
            }
 
            var string = 'hello world';
            if (text.value == '') {
                string = 'print test';
            } else {
                string = text.value;
            }
            ui.android.printLabel(string, string);
        });
        imageView.addEventListener('click', function(e) {
            button.fireEvent('click', e);
        });


        var view_left = Ti.UI.createView({
            height : Ti.UI.SIZE,
            width : '90%',
            left : 0,
            //backgroundColor : 'orange',
            //layout : 'vertical'
        });
        var view_right = Ti.UI.createView({
            height : Ti.UI.SIZE,
            width : '10%',
            left : 0,
            //backgroundColor : 'yellow',
            layout : 'horizontal'
        });

        view.add(view_left);
        view.add(view_right);
        view_left.add(text);
        view_right.add(imageButtonView);
        imageButtonView.add(button);
        imageButtonView.add(imageView);
        //view_right.add(button);
        //view_right.add(imageView);

        view.set_value = function(value){
            text.value = value;
        }
        view.input = text;

        return view;
    }

    ui.createScanInput = function(opts){
        var view = Ti.UI.createView({
            height : Ti.UI.SIZE,
            width : Ti.UI.SIZE,
        });

        var text = Ti.UI.createTextField(opts);


        var imageButton = ui.createImageButtonView('/images/glyphicons-259-qrcode.png', {
            width : 90,
            height : 90,
            imgDimensions : 30,
        });
        imageButton.button.addEventListener('click', function(e) {
            if (!si.config.Medusa.debug) {
                var _win = null;
                if (Ti.App.Properties.getInt('tagReader') === 1) {
                    _win = si.nfc.createScanWindow({
                        success : function() {
                            if (si.nfc.tagDataValue) {
                                text.value = si.nfc.tagDataValue;
                            }
                            _win.close();
                        },
                        cancel : function() { _win.close(); },
                        error : function() { _win.close(); }
                    });
                } else {
                    _win = createBarcodeScanWindow();
                    _win.setCallback(
                        function(e){
                            Ti.API.info("callback@ScanInput");
                            Ti.API.info(e);
                            if (e && e.result) {
                                text.value = e.result
                            }
                            _win.cancel();
                        }
                    );
                }
                _win.open();                
            }
        });


        var view_left = Ti.UI.createView({
            height : Ti.UI.SIZE,
            width : Ti.UI.SIZE,
            right : imageButton.width,
        });
        var view_right = Ti.UI.createView({
            height : Ti.UI.SIZE,
            width : Ti.UI.SIZE,
            right : 0,
        });

        view.add(view_left);
        view.add(view_right);
        view_left.add(text);
        view_right.add(imageButton);

        view.set_value = function(value){
            text.value = value;
        }
        view.input = text;

        return view;
    }

    ui.createMyImageView = function(opts){
        if ( typeof opts == 'undefined') {
            opts = {};
        };
        if (!('width' in opts)) {
            opts.width = '100%';
        }
        if (!('height' in opts)) {
            opts.height = '100%';
        }

        var view = Ti.UI.createView({
            width : opts.width,
            height : Ti.UI.SIZE,
            layout : 'horizontal',
            //backgroundColor : 'yellow'        
        });

        var optionDialog = Ti.UI.createOptionDialog({
            options : ['Add snap shot', 'Add local file'],
            //cancel : 2,
            title : ''
        });
        optionDialog.addEventListener('click', function(e) {
            switch (e.index) {
                case 0:
                    Ti.Media.showCamera({
                        success : function(event) {
                            if (event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
                                view.set_image(event.media);
                            }
                        },
                        cancel : function() {
                        },
                        error : function(error) {
                        },
                        saveToPhotoGallery : true,
                        allowEditing : true,
                        mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO]
                    });
                    break;
                case 1:
                    Ti.Media.openPhotoGallery({
                        success : function(event) {
                            if (event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
                                view.set_image(event.media);
                            }
                        },
                        cancel : function() {
                        },
                        error : function(error) {
                        },
                        allowEditing : true,
                        mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO]
                    });
                    break;
                default:
                    break;
            };
        });

        if (!opts.image){
            var selectPhotoView = ui.createImageButtonView('/images/glyphicons-63-paperclip.png', {
                width : 90,
                height : 90,
                imgDimensions : 30
            });

            selectPhotoView.button.addEventListener('click', function(e) {
                //optionDialog.show();
                    Ti.Media.openPhotoGallery({
                        success : function(event) {
                            if (event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
                                view.set_image(event.media);
                            }
                        },
                        cancel : function() {
                        },
                        error : function(error) {
                        },
                        allowEditing : true,
                        mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO]
                    });
            });

            var takePhotoView = ui.createImageButtonView('/images/glyphicons-12-camera.png', {
                width : 90,
                height : 90,
                imgDimensions : 30
            });

            takePhotoView.button.addEventListener('click', function(e) {
                    Ti.Media.showCamera({
                        success : function(event) {
                            if (event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
                                view.set_image(event.media);
                            }
                        },
                        cancel : function() {
                        },
                        error : function(error) {
                        },
                        saveToPhotoGallery : true,
                        allowEditing : true,
                        mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO]
                    });
            });

            view.add(takePhotoView);
            view.add(selectPhotoView);
        } else {
            view.set_image(opts.image);
        }

        view.set_image = function(_image){
            Ti.API.info("set_image...");
            Ti.API.info(_image);
            view.removeAllChildren();
            // var flame = Ti.UI.createView({
            //     height : '95%',
            //     width : '95%',
            //     backgroundColor : 'black'
            // });
            var imageView = Ti.UI.createImageView({
                height : 90,
                //center : { x: '50%', y : '50%'},
                image : _image
            });
            imageView.addEventListener('click', function(e) {
                //optionDialog.show();
                var w = ui.createImageWindow(_image);
                w.open({
                      modal : true
                });                
            });
            //view.add(flame);
            //flame.add(imageView);
            view.add(imageView);
            view.add(takePhotoView);
            view.add(selectPhotoView);

            view.image = _image;
        };

        view.showCamera = function() {
	    optionDialog.fireEvent('click', { index: 0 });
        };

        return view;
    };

    ui.createImageWindow = function(_image, opts){
        var win = Ti.UI.createWindow({
            title : 'Image',
            backgroundColor : 'black',
            barColor : '#336699',
            orientationModes : [Ti.UI.PORTRAIT],
            backButtonTitle : 'Back',
            //layout : 'vertical'
        });
        Ti.API.info(_image);
        var imageView = Ti.UI.createImageView({
            image : _image
        });
        win.add(imageView);
        return win;
    };

    ui.createButton = function(_opts){
        var _button = Ti.UI.createButton(_opts);
        if ('onclick' in _opts){
            _button.addEventListener('click', function(e){
                _opts.onclick();
            });            
        }
        return _button;
    }

    ui.createImageButtonView = function(_image, opts) {
        if ( typeof opts == 'undefined') {
            opts = {};
        };
        if (!('width' in opts)) {
            opts.width = '100%';
        }
        if (!('height' in opts)) {
            opts.height = '100%';
        }
        if (!('imgDimensions' in opts)) {
            opts.imgDimensions = 45;
        }


        var view = Ti.UI.createView({
            width: opts.width,
            height: opts.height,
            //backgroundColor : 'red'
        });
        //return view;
        var button = Ti.UI.createButton({
            title : '',
            //image: _image,
            backgroundColor : 'white',
            opacity: '0.1',
            width : opts.width,
            height : opts.height,
        });
        if ('onclick' in opts){
            button.addEventListener('click', function(e){
                opts.onclick();
            });            
        }
        //view.add(button);
        var imageView = Ti.UI.createImageView({
            image : _image,
            //backgroundColor : 'blue',
            width : opts.imgDimensions,
            height : opts.imgDimensions            
        });
        imageView.addEventListener('click', function(e) {
            Ti.API.info('image clicked');
            if (button.enabled){
                button.fireEvent('click', e);
            }
        });
        view.add(imageView);
        view.add(button);
        var self = view;
        self.button = button;
        self.imageView = imageView;
        self.setEnabled = function(value) {
            //self.button.setEnabled(value);
            self.button.enabled = true;
            //self.imageView.setTouchEnabled(value);
            self.imageView.touchEnabled = true;
        };
        return self;
    };

    ui.createInputOrScanWindow = function(opts){
        if ( typeof opts === 'undefined') {
            opts = {};
        }

        var win = Ti.UI.createWindow({
            title : opts.title || 'ScanInput',
//            backgroundColor : 'white'
        });

       var viewBase = Ti.UI.createView({
//            backgroundColor : 'white',
            top : 0,
            width : '100%',
            height : '100%',
            layout : 'vertical'
        });

        var viewHeader = Ti.UI.createView({
//            backgroundColor : 'white',
            height : '25%'
        });

        var viewBody = Ti.UI.createView({
//            backgroundColor : 'white',
            top : 0,
            top : 0,
            height : '85%'
        });


        var scan_input = ui.createScanInput(si.combine($$.TextField, {
            value : opts.value || '',
            keyboardType : opts.keyboardType || Ti.UI.KEYBOARD_DEFAULT,
            hintText : opts.hintText || ''
        }));

        var cancel_button = Ti.UI.createButton(si.combine($$.LeftBottomButton, {
            top : 0,
            title : 'Cancel',
        }));

        cancel_button.addEventListener('click', function() {
            win.close();
        });


        var save_button = Ti.UI.createButton(si.combine($$.RightBottomButton, {
            top : 0,
            title : 'OK',
        }));

        save_button.addEventListener('click', function() {
            opts.save(scan_input.input.value);
        });

        win.save_button = save_button;

        win.add(viewBase);
        viewBase.add(viewHeader);
        viewBase.add(viewBody);

        viewHeader.add(scan_input);
        viewBody.add(cancel_button);
        viewBody.add(save_button);

        win.set_value = function(value) {
            scan_input.set_value(value);
        }
        win.input = scan_input.input;

        return win;        
    };

    ui.createViewParent = function(_record, opts) {
        if ( typeof opts === 'undefined') {
            opts = {};
        }
        if (!('width' in opts)) {
            opts.width = '100%';
        }
        if (!('height' in opts)) {
            opts.height = '100%';
        }
        if (!('imgDimensions' in opts)) {
            opts.imgDimensions = 100;
        }

        var spacing = 0;
        var nameHeight = 90;
        var metaHeight = 14;
        var view = Ti.UI.createView({
            width : opts.width,
            height : opts.height,
            //layout : 'horizontal',
//            backgroundColor: 'white'
        });
        // var left = Ti.UI.createView({
        //     width : '70%',
        //     height : Ti.UI.SIZE,
        //     //layout : 'vertical',
        //     backgroundColor: 'yellow'
        // });

        // var right = Ti.UI.createView({
        //     width : '30%',
        //     height : Ti.UI.SIZE,
        //     backgroundColor: 'blue'
        // });
        //view.add(left);
        //view.add(right);
        var image_path;
        var imageView = Ti.UI.createImageView({
//            top : spacing,
//            left : spacing,
            right : 0,
            height : opts.imgDimensions,
//            width : opts.imgDimensions,
            //backgroundColor : '#000000',
            image : null
        });
        imageView.addEventListener('click', function(e) {
            //optionDialog.show();
            if (image_path){
                var w = ui.createImageWindow(image_path);
                w.open({
                      modal : true
                });
            }
        });

        view.add(imageView);
        //right.add(imageView);

        var avatarOffset = spacing * 2 + opts.imgDimensions;

        var labelMeta = Ti.UI.createLabel(si.combine($$.smallText, {
            text : '',
            top : spacing,
            //left : avatarOffset,
            left : spacing,
            right : spacing,
            height : 'auto',
            textAlign : 'left'
        }));
        //left.add(labelMeta);
        view.add(labelMeta);
        var labelName = Ti.UI.createLabel(si.combine($$.boldHeaderText, {
            text : '',
            top : metaHeight + 10,
            left : spacing,
            height : nameHeight
        }));
        //left.add(labelName);
        view.add(labelName);

        var update = function(_record) {
            if (_record == null) {
                labelMeta.text = '';
                labelName.text = '';
                imageView.image = '';
                return;
            }
            labelMeta.text = _record.global_id;
            labelName.text = _record.name;
            //!!!!!!!!!画像のパスの取得は要検討!!!!!!!!!!!!!!!!!!!!!!
            if (_record.image_path) {
                //Ti.API.info("image_path");
                //Ti.API.info(_record);
                //Ti.API.info(_record.image_path);
                //var _path = Ti.App.Properties.getString('server') + '/' + _record.image_path;
                var _url = si.imageURL(_record.image_path);
                //Ti.API.info(_url);
                imageView.image = si.imageURL(_record.thumbnail_path);
                image_path = si.imageURL(_record.original_path);
            } else {
                imageView.image = '';
                image_path = null;
            }
        };

        var self = view;
        self.imageView = imageView;
        self.labelMeta = labelMeta;
        self.labelName = labelName;
        self.update = update;
        self.update(_record);
        return self;
    };

    ui.android = {};

    ui.android.printServerURL = function(){
        var printServer = Ti.App.Properties.getString('printServer');
        var url = printServer;
        if (printServer.match(/^\w+:\/\//) == null) {
            url = 'http://' + url;
        }

        if (printServer.match(/\/$/) == null) {
            url = url + '/';
        }

        return url;
    };

    ui.android.printLabel = function(_global_id, _name,_args) {
        if (!Ti.App.Properties.getBool('printLabel')){
            return;
        }
        Ti.API.info('printLabel in ');
        var client = Ti.Network.createHTTPClient({
            onload : function(e) {
                Ti.API.info('print global_id : ' + _global_id + ' name : ' + _name);
                Ti.API.info('onload'); 
                _args.onsuccess(e);
            },
            onerror : function(e) {
                Ti.API.info('onerror');
                //ui.alert_simple('print error : ' + e.error);
                _args.onerror(e);
            },
            timeout : Ti.App.Properties.getInt('printTimeout') * 1000 // in milliseconds
        });
        //Ti.API.info(client);
        //var printServer = Ti.App.Properties.getString('printServer');
        var formatArchiveUrl = Ti.App.Properties.getString('printFormatUrl');
        var printerName = Ti.App.Properties.getString('printerName');
        var templateName = Ti.App.Properties.getString('templateName');
        var myAppDir = Ti.Filesystem.getFile(Ti.Filesystem.externalStorageDirectory);
        var sdcardDir = myAppDir.getParent();
        //Ti.API.info('sdcardDir : ' + sdcardDir.nativePath);
        //var url = 'http://localhost:8080/Format/Print?';
        //var url = printServer;
        var url = ui.android.printServerURL();
        url += 'Format/Print?';
        url += '__format_archive_url=' + formatArchiveUrl;
        url += '&__format_id_number=1';
        url += '&UID=' + _global_id;
//        url += '&UID_QRCODE=' + _global_id;
        url += '&NAME=' + encodeURIComponent(_name);
        if (printerName != null && printerName != '') {
          url += '&printer=' + encodeURIComponent(printerName);
        }
        if (templateName != null && templateName != '') {
          url += '&template=' + encodeURIComponent(templateName);
        }
        url += '&SET=1';
//        url += '&(発行枚数)=1';
        Ti.API.info('url:' + url);

        client.open('GET', url);
        client.send();
    };

    ui.android.testPrintLabel = function(_global_id, _name, _print_server, _print_format_url, _printer_name, _template_name, _timeout, _args) {
        if (!Ti.App.Properties.getBool('printLabel')){
            return;
        }
        Ti.API.info('testPrintLabel in ');
        var client = Ti.Network.createHTTPClient({
            onload : function(e) {
                Ti.API.info('print global_id : ' + _global_id + ' name : ' + _name);
                Ti.API.info('onload'); 
                _args.onsuccess(e);
            },
            onerror : function(e) {
                Ti.API.info('onerror');
                _args.onerror(e);
            },
            timeout : _timeout * 1000 // in milliseconds
        });
        var url = _print_server;
        if (_print_server.match(/^\w+:\/\//) == null) {
            url = 'http://' + url;
        }

        if (_print_server.match(/\/$/) == null) {
            url = url + '/';
        }
        url += 'Format/Print?';
        url += '__format_archive_url=' + _print_format_url;
        url += '&__format_id_number=1';
        url += '&UID=' + _global_id;
        url += '&NAME=' + _name;
        if (_printer_name != null && _printer_name != '') {
           url += '&printer=' + _printer_name;
        }
        if (_template_name != null && _template_name != '') {
           url += '&template=' + _template_name;
        }
        url += '&SET=1';
        Ti.API.info('url:' + url);

        client.open('GET', url);
        client.send();
    };

//})();
export {ui};