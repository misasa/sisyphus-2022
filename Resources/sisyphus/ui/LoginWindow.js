import {ui} from './ui'
const   createLoginWindow = function(_args) {
        var si = _args.si;
        var $$ = ui.properties; 
        var isDone = null;
        var win = Ti.UI.createWindow({
            title : 'Account setting',
//            backgroundColor : '#ffffff'
        });

        win.buttons = {};
        win.buttons.Close = ui.createImageButtonView('/images/glyphicons-208-remove-2.png', {
            width : 60,
            height : 60,
            imgDimensions : 15,
            onclick : function(e) { win.close() }
        });
        win.buttons.Close.left = 0;

        win.buttons.Save = ui.createImageButtonView('/images/glyphicons-415-disk-save.png', {
            right : 0,
            width : 60,
            height : 60,
            imgDimensions : 15,
            onclick : function(e) { win.save() }
        });
        win.buttons.Save.right = 0;

        win.buttons.FelicaLogin = ui.createImageButtonView('/images/189-plant.png', {
            width : 60,
            height : 60,
            imgDimensions : 15,
            onclick: function(e){ win.clickFelicaLoginButton() }
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

        var viewBody = Ti.UI.createView({
            height : '100%',
            layout : 'vertical'
        });


        var activityIndicator = Ti.UI.createActivityIndicator({
            style : Ti.UI.ActivityIndicatorStyle.BIG,
        });

        // var textUsername = Ti.UI.createTextField(si.combine($$.TextField, {
        //     value : Ti.App.Properties.getString('username'),
        //     //top : '5%',
        //     hintText : 'user name'
        // }));

        var server = ui.createScanInput(si.combine($$.TextField, {
            value: Ti.App.Properties.getString('server'),
            keyboardType : Ti.UI.KEYBOARD_URL,
            hintText : 'input URI',
            width : '100%',
        }));


        var username = ui.createScanInput(si.combine($$.TextField, {
//            width : '100%',
            width : '100%',
            value : Ti.App.Properties.getString('username'),
            keyboardType : Ti.UI.KEYBOARD_DEFAULT,
            hintText : 'input user name'
        }));


        var password = ui.createScanInput(si.combine($$.TextField, {
//            width : '100%',
            value : Ti.App.Properties.getString('password'),
            passwordMask : true,
            width : '100%',
            //top : '30%',
            hintText : 'input password'
        }));

        var loginTypeInfo = Ti.UI.createTextField({
            value : function(){
                        var staffId = Ti.App.Properties.getString('staffId') || '';
                        var loginType = '';
                        if(staffId.length > 0) {
                            loginType = 'IC Card';
                        } else {
                            loginType = 'Account';
                        }
                        return loginType;
                    }(),
            passwordMask : false,
            width : '100%',
            enabled: false
        });

        var loginUserInfo = Ti.UI.createTextField({
            value : Ti.App.Properties.getString('loginUsername'),
            passwordMask : false,
            width : '100%',
            enabled: false
        });

        win.save = function(){
            isDone = false;
            Ti.API.info('click');
            password.blur();
            if (server.input.value == '' || username.input.value == '' || password.input.value == '') {
                ui.myAlert({message: 'Input URL, Username, and Password'});
                return;
            }

            var server_old = Ti.App.Properties.getString('server');
            var token_old = Ti.App.Properties.getString('token');
            Ti.App.Properties.setString('server',server.input.value);
            Ti.App.Properties.setString('token', '');

            activityIndicator.show();
            si.model.medusa.getAccountInfo({
                username : username.input.value,
                password : password.input.value,
                onsuccess : function(response) {
                    Ti.App.Properties.setString('username', username.input.value);
                    Ti.App.Properties.setString('password', password.input.value);
                    Ti.App.Properties.setString('cardId', '');
                    Ti.App.Properties.setString('staffId', '');
                    Ti.App.Properties.setString('loginUsername', response.username);
                    si.app.clearData();
                    if (response.box_global_id){
                        Ti.App.Properties.setString('current_box_global_id', response.box_global_id);
                    } else {
                        Ti.App.Properties.setString('current_box_global_id', null);
                    }
                    activityIndicator.hide();
                    //ui.alert_simple('Login successful.');
                    win.close();
                    isDone = true;
                    _args.onsuccess();
                },
                onerror : function(e) {
                    activityIndicator.hide();
                    isDone = true;
                    Ti.App.Properties.setString('server', server_old);
                    Ti.App.Properties.setString('token', token_old);

                    var _message = 'Login failed';
                    //ui.myAlert({message:'Login failed'});
                    ui.showErrorDialog(_message);
                }
            });
        };

        win.clickFelicaLoginButton = function () {
            if (!si.config.Medusa.debug) {
                var _win = null;
                var staffId = "";
                var cardId = "";
                _win = si.nfc.createScanFelicaWindow({
                    onsuccess : function() {
                        if (si.nfc.tagDataValue) {
                            staffId = readFelicaData();
                            cardId = si.nfc.scannedTag.getId()
                            felicaLogin(cardId, staffId);
                            _win.close();
                        } else {
                            alert('si.nfc.tagDataValue is null');
                            _win.close();
                        }
                    },
                    cancel : function() { _win.close(); },
                    onerror : function() { _win.close(); },
                });
                si.app.tabGroup.activeTab.open(
                    _win, {animated: true}
                );
            } else {
                setTimeout(function() {
                    loadParent(si.config.debug.parent_global_id);
                }, 1000);
            }
        };

        var readFelicaData = function() {
            Ti.API.info('readFelicaData...');

            var data = si.nfc.tagDataValue;

            // read staffId
            var staffId = "";

            try {
                for(var i = 15; i <= 22; i++) {
                    staffId += String.fromCharCode(data[i]);
                }
            } catch(e) {
                alert('Felica data is Invalid.');
                staffId = "";
            }

            return staffId;
        };

        var felicaLogin = function(cardId, staffId) {
            isDone = false;
            Ti.API.info('Login by Felica');

            if (cardId === '' || staffId === '') {
                ui.myAlert({message: 'Invalid IC Card'});
                return;
            }

            var server = Ti.App.Properties.getString('server');

            activityIndicator.show();
            si.model.medusa.getToken({
                card_id : cardId,
                staff_id : staffId,
                onsuccess : function(response) {
                    Ti.App.Properties.setString('cardId', cardId);
                    Ti.App.Properties.setString('staffId', staffId);
                    Ti.App.Properties.setString('token', response.token);
                    si.model.medusa.getAccountInfo({
                        onsuccess : function(response) {
                            Ti.App.Properties.setString('loginUsername', response.username);
                            si.app.clearData();
                            if (response.box_global_id){
                                Ti.App.Properties.setString('current_box_global_id', response.box_global_id);
                            } else {
                                Ti.App.Properties.setString('current_box_global_id', null);
                            }
                            activityIndicator.hide();
                            win.close();
                            isDone = true;
                            _args.onsuccess();
                        },
                        onerror : function(e) {
                            felicaLoginFail(e);
                        }
                    });
                },
                onerror : function(e) {
                    felicaLoginFail(e);
                }
            });
        };

        var felicaLoginFail = function(e) {
            activityIndicator.hide();
            isDone = true;
            var _message = 'IC Card Login failed';
            ui.showErrorDialog(_message);
        };

        var table = Ti.UI.createScrollView({
            contentWidth: 'auto',
            contentHeight: 'auto',
            showVerticalScrollIndicator: true,
            height : Ti.UI.SIZE,
            width : Ti.UI.FILL,
            layout : 'vertical'
        });
        table.add(ui.createInputRow("URL", server, {}));
        table.add(ui.createInputRow("LoginUsername", loginUserInfo, {}));
        table.add(ui.createInputRow("LoginType", loginTypeInfo, {}));
        table.add(ui.createInputRow("Username", username, {}));
        table.add(ui.createInputRow("Password", password, {}));

        win.add(viewBase);
        viewBase.add(viewHeader);
        viewBase.add(viewBody);
        viewHeader.add(viewHeaderLeft);
        viewHeaderLeft.add(win.buttons.Close);        
        viewHeader.add(viewHeaderRight);
        if (!si.nfc.isEnabled()) {
            win.buttons.FelicaLogin.setEnabled(false);
        }
        viewHeaderRight.add(win.buttons.FelicaLogin);
        viewHeaderRight.add(win.buttons.Save);
        viewBody.add(table);
        win.add(activityIndicator);
        win.isDone = isDone; 

        win.username = username;
        win.password = password;
        win.save_button = win.buttons.Save;
        win.activityIndicator = activityIndicator;

        return win;
    };
export {createLoginWindow};
