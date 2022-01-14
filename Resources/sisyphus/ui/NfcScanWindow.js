//import { nfc } from '../nfc'
var nfc = require('ti.nfc');
var nfcAdapter = null;
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
    
    var success_callback = function (global_id) {
        if (nfc.tagDataValue === null) {
            alert('Tag is blank.');
        } else {
            _args.success(global_id);
        }
    };
    win.addEventListener('open', function(e) {
        Ti.API.info('NFC Scan window open...');
        setupNfc(win);
        //nfc.setupNfc(success_callback, win);
        //nfc.adapter.enableForegroundDispatch(nfc.dispatchFilter);
    });
    
    return win;
}
function setupNfc(win) {
    Ti.API.info('setupNfc foreground with win... ');
	// Create the NFC adapter to be associated with this activity. 
	// There should only be ONE adapter created per activity.
	var nfcAdapter = nfc.createNfcAdapter({
		onNdefDiscovered: handleDiscovery,
		onTagDiscovered: handleDiscovery,
		onTechDiscovered: handleDiscovery
	});
	
	// It's possible that the device does not support NFC. Check it here
	// before we go any further.
	if (!nfcAdapter.isEnabled()) {
		alert('NFC is not enabled on this device');
		return;
	}
	Ti.API.info("nfcAdapter...");
    Ti.API.info(nfcAdapter);
	// All tag scans are received by the activity as a new intent. Each
	// scan intent needs to be passed to the nfc adapter for processing.
	var act = Ti.Android.currentActivity;
    Ti.API.info('act...');
    Ti.API.info(act);
    var act = win.activity;
    Ti.API.info('act...');
    Ti.API.info(act);
	act.addEventListener('newintent', function(e) {
        Ti.API.info("newintent...")
		nfcAdapter.onNewIntent(e.intent);
	});    
	act.addEventListener('resume', function(e) {
        Ti.API.info("resume...")
        nfcAdapter.enableForegroundDispatch(dispatchFilter);
	});
	act.addEventListener('pause', function(e) {
        Ti.API.info("pause...")
		nfcAdapter.disableForegroundDispatch();
	});

	var dispatchFilter = nfc.createNfcForegroundDispatchFilter({
		intentFilters: [
			// The discovery could be restricted to only text with
			// { action: nfc.ACTION_NDEF_DISCOVERED, mimeType: 'text/plain' },
			{ action: nfc.ACTION_NDEF_DISCOVERED, mimeType: '*/*' },
			// The discovery could be restricted by host with
			//{ action: nfc.ACTION_NDEF_DISCOVERED, scheme: 'http', host: 'www.appcelerator.com' }
			{ action: nfc.ACTION_NDEF_DISCOVERED, scheme: 'http' }
		],
		// The techList can be specified to filter TECH_DISCOVERED messages by technology
		techLists: [
			[ "android.nfc.tech.NfcF" ],
			[ "android.nfc.tech.Ndef" ],
			[ "android.nfc.tech.MifareClassic" ],
			[ "android.nfc.tech.NfcA" ]
		]
	});
	var textRecord = nfc.createNdefRecordText({
		text: "NDEF Push Sample"
	});
	var msg = nfc.createNdefMessage({
		records: [ textRecord ]
	});
	nfcAdapter.setNdefPushMessage(msg);

}

function handleDiscovery(e) {
    Ti.API.info('handleDiscovery...');
    Ti.API.info(e)
    // Add rows for the message, tag, and each of the records

	var data = [];
	//data.push(Alloy.createController('rowMessage', { action: e.action }).getView());
	//data.push(Alloy.createController('rowTag', { tag: e.tag }).getView());
	if (e.messages) {
		var message = e.messages[0];
		if (message.records) {
			var i, len;
			for (i=0, len=message.records.length; i<len; i++) {
                alert('TECH DISCOVERED:: ' + message.records[0].getPayload());
				//data.push(Alloy.createController('rowRecord', { record: message.records[i] }).getView());
			}
		}
	}
	//$.instructions.zIndex = -10000;
	//$.records.setData(data);
};

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
    
    var success_callback = function () {
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
    var nfc = require('ti.nfc');
    var si = _args.si
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

    var success_callback = function () {
        si.nfc.onReadFelica({onsuccess: function() {
                if (si.nfc.tagDataValue === null) {
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
        Ti.API.info('ScanFelica window open...');
        Ti.API.info(nfc)
        nfc.setupFelica(success_callback, win);
        nfc.adapter.enableForegroundDispatch(nfc.dispatchFilter);
    });

    return win;
}
export {createNfcScanWindow, createNfcWriteWindow, createScanFelicaWindow};