import { ui } from './ui'
//(function() {
    const createEditWindow = function(_args) {
        var si = _args.si;
        var $$ = ui.properties;
        var _obj = _args.obj;
        var _className = _obj._className;
        var title = _className;

        var win = Ti.UI.createWindow({
            title : title,
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
        //p_params = Ti.App.Properties.getObject("stone_params", {});

        p_params = _args.obj;
        Ti.API.info(p_params);

        win.fields = {};
        win.fields.name = Ti.UI.createTextField(si.combine($$.TextField, {
            value : p_params['name'],
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
        win.fields.classification = ui.createPickerInput(si.app.classifications(), p_params["classification_id"]);
        win.fields.physical_form = ui.createPickerInput(si.app.physical_forms(), p_params["physical_form_id"]);
        win.fields.box_type = ui.createPickerInput(si.app.box_types(), p_params["box_type_id"]);
        win.fields.group = ui.createPickerInput(si.app.groups(), p_params["group_id"]);

        win.fields.quantity = Ti.UI.createTextField({
            value : p_params['quantity'],
            width : Ti.UI.FILL,
            keyboardType : Ti.UI.KEYBOARD_NUMBER_PAD,
            hintText : 'input quantity'            
        });

        win.fields.quantity_unit = Ti.UI.createTextField({
            value : p_params['quantity_unit'],
            width : Ti.UI.FILL,
            keyboardType : Ti.UI.KEYBOARD_DEFAULT,
            hintText : 'input quantity unit'            
        });

        win.fields.description = Ti.UI.createTextArea({
            value : p_params['description'],
            width : Ti.UI.FILL,
            hintText : 'input description'
        });


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

        var activityIndicator = Ti.UI.createActivityIndicator({
            style : Ti.UI.ActivityIndicatorStyle.BIG,
        });


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

        // if (!Ti.App.Properties.getBool('printLabel')){
        //     table.add(ui.createInputRow("ID", win.fields.ID, {}));
        // }
        table.add(ui.createInputRow("Name", win.fields.name, {}));
        if (_className === "Specimen" || _className === "Stone"){
            table.add(ui.createInputRow("Classification", win.fields.classification, {}));
            table.add(ui.createInputRow("Physical form", win.fields.physical_form, {}));
            table.add(ui.createInputRow("Quantity", win.fields.quantity, {}));
            table.add(ui.createInputRow("Quantity unit", win.fields.quantity_unit, {}));
            table.add(ui.createInputRow("Description", win.fields.description, {}));
        } else {
            table.add(ui.createInputRow("Physical form", win.fields.box_type, {}));            
        }
        //Ti.API.info(Ti.App.Properties.getObject('account', {}));
        Ti.API.info(si.app.account());
        if (si.app.account().administrator || si.app.account().id === _obj.user_id){
            table.add(ui.createInputRow("Group", win.fields.group, {}));
        }

        viewBase.add(viewBody);
        viewBody.add(viewHeader);
        viewHeader.add(viewHeaderLeft);
        viewHeaderLeft.add(win.buttons.Close);
        viewHeader.add(viewHeaderRight);
        viewHeaderRight.add(myImageView);
        viewHeaderRight.add(win.buttons.Save);

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
                ui.alert_simple('Input name of new stone');
                return;
            }
            var params = {};
            params['name'] = win.fields.name.value;
            if (win.global_id.value){
                Ti.API.info("global_id:" + win.global_id.value);
                params['global_id'] = win.global_id.value;
            } else {
                Ti.API.info("no global_id");
            }

            if (win.fields.classification.value){
                params['classification_id'] = win.fields.classification.value;
            }
            if (win.fields.physical_form.value){
                params['physical_form_id'] = win.fields.physical_form.value;
            }
            if (win.fields.quantity.value){
                params['quantity'] = win.fields.quantity.value;
            }

            if (win.fields.quantity_unit.value){
                params['quantity_unit'] = win.fields.quantity_unit.value;
            }
            if (win.fields.description.value){
                params['description'] = win.fields.description.value;
            }

            if (win.fields.box_type.value){
                params['box_type_id'] = win.fields.box_type.value;
            }

            if (win.fields.group.value){
                params['group_id'] = win.fields.group.value;
            }
            params._className = _className;
            params.id = _obj.id
            activityIndicator.show();
            si.model.medusa.update(_className, {
                args : params,
                username : Ti.App.Properties.getString('username'),
                password : Ti.App.Properties.getString('password'),
                onsuccess : function(_record) {
                    activityIndicator.hide();
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
                    var _message = 'Update record failed'
                    ui.showErrorDialog(_message);
                    //ui.alert_simple('error : ' + e.error);
               },
            });
        };


        function findIndex(id, data) {
            //Ti.API.info('findIndex: ' + target);
            //var x;
            //for (i in data) {
            Ti.API.info(id);
            for(var i=0; i<data.length; i++){    
                var x = data[i];
                Ti.API.info(x);
                if (x.id == id) {
                    //Ti.API.info(x);
                    //Ti.API.info(i);
                    //Ti.API.info(i+1);
                    return i + 1;
                }
            }
            return null;
        }

        return win;
    };
//})();
export { createEditWindow };
