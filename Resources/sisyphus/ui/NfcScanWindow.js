import { nfc } from '../nfc'
import { ui } from './ui';
const createNfcScanWindow = function(_args){
    var win = Ti.UI.createWindow({
        title: 'Scan NFC Tag'
    });
    
    win.buttons = {};
    win.buttons.Close = ui.createImageButtonView('/images/glyphicons-208-remove-2.png', {
        width: 90,
        height: 90,
        imgDimensions: 30,
        onclick: function() { win.close(); }
    });
    win.buttons.Close.top = 0;
    win.buttons.Close.left = 0;
    win.add(win.buttons.Close);
    
    success_callback = function (global_id) {
        if (nfc.tagDataValue === null) {
            alert('Tag is blank.');
        } else {
            _args.success(global_id);
        }
    };
    win.addEventListener('open', function(e) {
        Ti.API.info('window open...');
        nfc.setupNfc(success_callback, win);
        nfc.adapter.enableForegroundDispatch(nfc.dispatchFilter);
    });
    
    return win;
}

const createNfcWriteWindow = function(value, _args) {
    var win = Ti.UI.createWindow({
       title: 'Write Window' 
    });
    
    win.buttons = {};
    win.buttons.Close = ui.createImageButtonView('/images/glyphicons-208-remove-2.png', {
        width: 90,
        height: 90,
        imgDimensions: 30,
        onclick: function() { win.close(); }
    });
    win.buttons.Close.top = 0;
    win.buttons.Close.left = 0;
    win.add(win.buttons.Close);
    
    success_callback = function () {
        nfc.onWrite(value, {onsuccess: function() {
            _args.onsuccess();
            win.close();
        }, onerror: function() {
            _args.onerror();
            win.close();
        }});
    };
    win.addEventListener('open', function (e) {
        Ti.API.info('window open...');
        nfc.setupNfc(success_callback, win);
        nfc.adapter.enableForegroundDispatch(nfc.dispatchFilter);
    });
    
    return win;
}

const createScanFelicaWindow = function(_args){
    var win = Ti.UI.createWindow({
        title: 'Scan Felica Card'
    });

    win.buttons = {};
    win.buttons.Close = ui.createImageButtonView('/images/glyphicons-208-remove-2.png', {
        width: 90,
        height: 90,
        imgDimensions: 30,
        onclick: function() { win.close(); }
    });
    win.buttons.Close.top = 0;
    win.buttons.Close.left = 0;
    win.add(win.buttons.Close);

    success_callback = function () {
        nfc.onReadFelica({onsuccess: function() {
                if (nfc.tagDataValue === null) {
                    alert('Tag is blank.');
                } else {
                    _args.onsuccess();
                }
            }, onerror: function() {
                _args.onerror();
            }
        });
    };
    win.addEventListener('open', function(e) {
        Ti.API.info('window open...');
        nfc.setupFelica(success_callback, win);
        nfc.adapter.enableForegroundDispatch(nfc.dispatchFilter);
    });

    return win;
}
export {createNfcScanWindow, createNfcWriteWindow, createScanFelicaWindow};