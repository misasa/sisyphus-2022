import { ui } from './ui'
//(function() {
    const createNewStoneWindow = function(_args) {
        var si = _args.si;
        var $$ = ui.properties;
        var win = Ti.UI.createWindow({
            title : 'New stone',
//            backgroundColor : 'black'
        });

        Ti.API.info("new stone...");
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
        var p_params = Ti.App.Properties.getObject("stone_params", {});
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
        win.fields.group = ui.createPickerInput(si.app.groups(), p_params["group_id"]);
        //Ti.API.info("seleting classification...");
        //win.fields.classification.setSelectedRow(0,findIndex(p_params["classification_id"], si.app.classifications()) || 0,false);
        //Ti.API.info("seleting physical_form...");
        //win.fields.physical_form.setSelectedRow(0,findIndex(p_params["physical_form_id"], si.app.physical_forms()) || 0,false);

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
        
         win.fields.age_min = Ti.UI.createTextField({
            value : p_params['age_min'],
            width : Ti.UI.FILL,
            keyboardType : Ti.UI.KEYBOARD_NUMBER_PAD,
            hintText : 'input age_min'            
        });
        
         win.fields.age_max = Ti.UI.createTextField({
            value : p_params['age_max'],
            width : Ti.UI.FILL,
            keyboardType : Ti.UI.KEYBOARD_NUMBER_PAD,
            hintText : 'input age_max'            
        });
        
        win.fields.age_unit = Ti.UI.createTextField({
            value : p_params['age_unit'],
            width : Ti.UI.FILL,
            keyboardType : Ti.UI.KEYBOARD_DEFAULT,
            hintText : 'input age unit'            
        });
        
        
        win.fields.absolute_age = Ti.UI.createTextField({
            value : p_params['absolute_age'],
            width : Ti.UI.FILL,
            keyboardType : Ti.UI.KEYBOARD_NUMBER_PAD,
            hintText : 'input absolute age'            
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

        win.addEventListener('open', function(e) {
            if (Ti.App.Properties.getInt('newStone') == 1) {
                myImageView.showCamera();
	    }
        });

        if (Ti.App.Properties.getInt('globalId') == 1){
            table.add(ui.createInputRow("ID", win.fields.ID, {}));
        }
        table.add(ui.createInputRow("Name", win.fields.name, {}));
        table.add(ui.createInputRow("Classification", win.fields.classification, {}));
        table.add(ui.createInputRow("Physical form", win.fields.physical_form, {}));
        table.add(ui.createInputRow("Quantity", win.fields.quantity, {}));
        table.add(ui.createInputRow("Quantity unit", win.fields.quantity_unit, {}));
        table.add(ui.createInputRow("Age minimum", win.fields.age_min, {}));
        table.add(ui.createInputRow("Age maximum", win.fields.age_max, {}));
        table.add(ui.createInputRow("Age unit", win.fields.age_unit, {}));
        table.add(ui.createInputRow("Absolute age", win.fields.absolute_age, {}));
        table.add(ui.createInputRow("Description", win.fields.description, {}));
        table.add(ui.createInputRow("Group", win.fields.group, {}));

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
	    win.buttons.Save.setEnabled(false);
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

            if (win.fields.age_min.value){
                params['age_min'] = win.fields.age_min.value;
            }

            if (win.fields.age_max.value){
                params['age_max'] = win.fields.age_max.value;
            }
            
            if (win.fields.age_unit.value){
                params['age_unit'] = win.fields.age_unit.value;
            }

            if (win.fields.absolute_age.value){
                params['abs_age'] = win.fields.absolute_age.value;
            }
            
            
            if (win.fields.description.value){
                params['description'] = win.fields.description.value;
            }

            if (win.fields.group.value){
                params['group_id'] = win.fields.group.value;
            }

            Ti.API.info(params);
            activityIndicator.show();
            si.model.medusa.createNewStone({
                args : params,
                username : Ti.App.Properties.getString('username'),
                password : Ti.App.Properties.getString('password'),
                onsuccess : function(_record) {
                    activityIndicator.hide();
                    Ti.API.info(params);
                    Ti.App.Properties.setObject("stone_params", params);

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
                    var _message = 'No stone created'
                    ui.showErrorDialog(_message);
                    //ui.alert_simple('error : ' + e.error);
                    win.buttons.Save.setEnabled(true);
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
export { createNewStoneWindow };
