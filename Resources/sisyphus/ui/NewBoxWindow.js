import { ui } from './ui';
//(function() {
    const createNewBoxWindow = function(_args) {
        var si = _args.si;
        var $$ = ui.properties;
        var win = Ti.UI.createWindow({
            title : 'New box',
//            backgroundColor : 'black'
        });

        win.buttons = {};
        win.buttons.Close = ui.createImageButtonView('/images/glyphicons-208-remove-2.png', {
            width : 90,
            height : 90,
            imgDimensions : 30,
            onclick : function(e) { win.close() }
        });
        win.buttons.Close.left = 0;

        win.buttons.Save = ui.createImageButtonView('/images/glyphicons-415-disk-save.png', {
            right : 0,
            width : 90,
            height : 90,
            imgDimensions : 30,
            onclick : function(e) { win.save() }
        });
        win.buttons.Save.right = 0;


        win.fields = {};
        win.fields.name = Ti.UI.createTextField(si.combine($$.TextField, {
            value : '',
            width : '100%',
            keyboardType : Ti.UI.KEYBOARD_DEFAULT,
            hintText : 'input name'
        }));
        win.fields.ID = ui.createScanInput(si.combine($$.TextField, {
            value : '',
            width : '100%',
            keyboardType : Ti.UI.KEYBOARD_DEFAULT,
            hintText : 'input ID'
        }));
        win.fields.box_type = ui.createPickerInput(si.app.box_types(), {hintText:''});

        var viewBase = Ti.UI.createView({
            width : '100%',
            height : '100%',
            layout : 'vertical'
        });

        var viewBody = Ti.UI.createView({
            height : '100%',
            layout : 'vertical'
        });


        var viewHeader = Ti.UI.createView({
            height : Ti.UI.SIZE,
            width : Ti.UI.FILL,
            //layout : 'vertical'
        });

        var viewHeaderLeft = Ti.UI.createView({
            width : Ti.UI.SIZE,
            height : Ti.UI.SIZE,
            left : 0,
            top : 0,
            //backgroundColor : 'yellow',
            layout : 'horizontal'
        });

        var viewHeaderRight = Ti.UI.createView({
            width : Ti.UI.SIZE,
            height : Ti.UI.SIZE,
            right : 0,
            top : 0,
            //backgroundColor : 'yellow',
            layout : 'horizontal'
        });

        var viewButton = Ti.UI.createView({
        //    backgroundColor : 'black',
            height : Ti.UI.SIZE,
            width : '100%',
        });

        var activityIndicator = Ti.UI.createActivityIndicator({
            style : Ti.UI.ActivityIndicatorStyle.BIG,
        });

        var text = Ti.UI.createTextField(si.combine($$.TextField, {
            value : '',
            width : '100%',
            keyboardType : Ti.UI.KEYBOARD_DEFAULT,
            hintText : 'input name'
        }));

        var button = Ti.UI.createButton(si.combine($$.RightBottomButton, {
            title : 'OK',
            top : 0
        }));

        button.addEventListener('click', function() {
            win.save();
        });

        var cancel_button = Ti.UI.createButton(si.combine($$.LeftBottomButton, {
            top : 0,
            title : 'Cancel',
        }));

        cancel_button.addEventListener('click', function() {
            win.close();
        });

        var scan_input = ui.createScanInput(si.combine($$.TextField, {
            value : '',
            width : '100%',
            keyboardType : Ti.UI.KEYBOARD_DEFAULT,
            hintText : 'input ID'
        }));


        var myImageView = ui.createMyImageView({
            width : Ti.UI.SIZE
        });

        var table = Ti.UI.createScrollView({
            contentWidth: 'auto',
            contentHeight: 'auto',
            showVerticalScrollIndicator: true,
            height : Ti.UI.SIZE,
            width : Ti.UI.FILL,
            layout : 'vertical'
        });

        if (Ti.App.Properties.getInt('globalId') == 1){
            table.add(ui.createInputRow("ID", win.fields.ID, {}));
        }
        table.add(ui.createInputRow("Name", win.fields.name, {}));
        table.add(ui.createInputRow("Physical form", win.fields.box_type, {}));

        viewBase.add(viewBody);
        viewBody.add(viewHeader);
        viewHeader.add(viewHeaderLeft);
        viewHeaderLeft.add(win.buttons.Close);        
        viewHeader.add(viewHeaderRight);
        viewHeaderRight.add(myImageView);
        viewHeaderRight.add(win.buttons.Save);

        // viewBody.add(Ti.UI.createLabel({left: 5, text : 'Name'}));
        // viewBody.add(text);
        // if (!Ti.App.Properties.getBool('printLabel')){
        //     viewBody.add(Ti.UI.createLabel({left: 5, text : 'ID'}));
        //     viewBody.add(scan_input);
        // }
        // viewBody.add(viewButton);
        // viewButton.add(button);
        // viewButton.add(cancel_button);


        viewBody.add(table);
        win.add(viewBase);
        win.add(activityIndicator);
        win.name_field = win.fields.name;
        win.save_button = win.buttons.Save;
        win.global_id = win.fields.ID.input;

        win.set_image = function(_image) {
            myImageView.set_image(_image);
        };
        win.set_global_id = function(gid) {
            win.fields.ID.set_value(gid);
        }

        win.save = function(){
            if (win.fields.name.value == '') {
                ui.alert_simple('Input name of new box');
                return;
            }
            win.buttons.Save.setEnabled(false);
            var params = {};
            params['name'] = win.fields.name.value;
            if (win.global_id.value){
                Ti.API.info("global_id:" + win.global_id.value);
                params['global_id'] = win.global_id.value;
            } else {
                Ti.API.info("no global_id");
            }
            if (win.fields.box_type.value){
                params['box_type_id'] = win.fields.box_type.value;
            }

            activityIndicator.show();
            si.model.medusa.createNewBox({
                args : params,
                username : Ti.App.Properties.getString('username'),
                password : Ti.App.Properties.getString('password'),
                onsuccess : function(_record) {
                    activityIndicator.hide();
                    //ui.android.printLabel(_record.global_id, _record.name);
                    if (myImageView.image){
                        si.model.medusa.uploadImage({
                            record : _record,
                            data : myImageView.image,
                            username : Ti.App.Properties.getString('username'),
                            password : Ti.App.Properties.getString('password'),
                            onsuccess : (function(_image) {
                                activityIndicator.hide();
                                _record.image = _image
                                _args.onsuccess(_record);
                            }),
                            onerror : (function(e) {
                                activityIndicator.hide();
                                ui.alert_simple('Upload image failed');
                                //ui.alert_simple('error : ' + e.error);
                            }),
                        });            
                    } else {
                        activityIndicator.hide();
                        _args.onsuccess(_record);
                    }
                    win.close();
                },
                onerror : function(e) {
                    activityIndicator.hide();
                    var _message = 'No box created'
                    ui.showErrorDialog(_message);                    
                    //ui.alert_simple('error : ' + e.error);
                    win.buttons.Save.setEnabled(true);
               },
            });            
        };

        return win;



    };
//})();
export { createNewBoxWindow };
