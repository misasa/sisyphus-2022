var nfc = {};
nfc.module = require('ti.nfc');
nfc.adapter = null;
nfc.dispatchFilter = null;
nfc.tagDataValue = "";
nfc.scannedTag = null;

// Force the default message into the data area
nfc.onClear = function (e) {
    nfc.tagDataValue = "This application will only push or receive NFC data when it is in the foreground."
}
nfc.onClear();

nfc.isEnabled = function() {
    nfc.adapter = nfc.module.createNfcAdapter();
    return nfc.adapter.isEnabled();
}

nfc.setupNfc = function (success_callback, win) {
    Ti.API.info("nfc.setupNfc...")
    if (success_callback == undefined) { success_callback = function() {}; }
    
    nfc.adapter = nfc.module.createNfcAdapter({
        onNdefDiscovered: handleDiscovery,// priority: high
        onTechDiscovered: handleDiscovery,// priority: middle
        onTagDiscovered: handleDiscovery  // priority: low
    });
    
    function handleDiscovery(e) {
        nfc.tagDataValue = null;
        if (e.messages !== undefined) {
            if (e.messages[0] !== undefined) {
                if (e.messages[0].records[0] !== undefined){
                    nfc.tagDataValue = e.messages[0].records[0].text;
                }
            }
        }
        nfc.scannedTag = e.tag;
        if (typeof(success_callback) === 'function') {
            success_callback(nfc.tagDataValue);
        }
    }
    
    if (!nfc.adapter.isEnabled()) {
        alert('NFC is not enabled on this device.');
        return;
    }
    
    var act = win.activity;
    act.addEventListener('newintent', function(e) {
        nfc.adapter.onNewIntent(e.intent);
    });
    act.addEventListener('resume', function(e) {
        nfc.adapter.enableForegroundDispatch(nfc.dispatchFilter);
    });
    act.addEventListener('pause', function(e) {
        nfc.adapter.disableForegroundDispatch();
    });
    
    nfc.dispatchFilter = nfc.module.createNfcForegroundDispatchFilter({
        intentFilters: [
            { action: nfc.module.ACTION_NDEF_DISCOVERED, mimeType: '*/*' },
            { action: nfc.module.ACTION_TECH_DISCOVERED, mimeType: '*/*' }
        ],
        techLists: [
            [ "android.nfc.tech.Ndef" ],
            [ "android.nfc.tech.NdefFormatable" ]
        ]
    });
    
    // Set the default Ndef message to send when tapped
    // Only works if onPushMessage is null
    var textRecord = nfc.module.createNdefRecordText({
        text: "NDEF Push Sample"
    });
    var msg = nfc.module.createNdefMessage({
        records: [textRecord]
    });
    nfc.adapter.setNdefPushMessage(msg);
}

nfc.setupFelica = function (success_callback, win) {
    if (success_callback == undefined) { success_callback = function() {}; }

    nfc.adapter = nfc.module.createNfcAdapter({
        onTechDiscovered: handleDiscovery,
        onTagDiscovered: handleDiscovery
    });

    function handleDiscovery(e) {
        nfc.scannedTag = e.tag;
        if (typeof(success_callback) === 'function') {
            success_callback(nfc.tagDataValue);
        }
    }

    if (!nfc.adapter.isEnabled()) {
        alert('NFC is not enabled on this device.');
        return;
    }

    var act = win.activity;
    act.addEventListener('newintent', function(e) {
        nfc.adapter.onNewIntent(e.intent);
    });
    act.addEventListener('resume', function(e) {
        nfc.adapter.enableForegroundDispatch(nfc.dispatchFilter);
    });
    act.addEventListener('pause', function(e) {
        nfc.adapter.disableForegroundDispatch();
    });

    nfc.dispatchFilter = nfc.module.createNfcForegroundDispatchFilter({
        intentFilters: [
            { action: nfc.module.ACTION_TECH_DISCOVERED, mimeType: '*/*' }
        ],
        techLists: [
            [ "android.nfc.tech.NfcF" ]
        ]
    });
}

nfc.onWrite = function (global_id, _args) {
    if (global_id == undefined) { global_id = Ti.App.Properties.getString('current_global_id'); }

    for (var i = 0; i < nfc.scannedTag.techList.length; i++) {
        if(nfc.scannedTag.techList[i] === 'android.nfc.tech.Ndef') {
            nfc.writeNdef(global_id, _args);
            return;
        }
    }
    nfc.formatNdef(global_id, _args);
}

nfc.formatNdef = function(global_id, _args) {
    var tech = nfc.module.createTagTechnologyNdefFormatable({
        tag: nfc.scannedTag
    });
    if (!tech.isValid()) {
        alert("Failed to create Ndef tag type.");
        return;
    }

    try {
        tech.connect();

        // Create a new message to write to the tag
        var textRecord = nfc.module.createNdefRecordText({
            text: global_id
        });
        var msg = nfc.module.createNdefMessage({
            records: [textRecord]
        });
        tech.format(msg);
        alert("Tag successfully formatted.");
        _args.onsuccess();
        nfc.onClear();
    } catch (e) {
        _args.onerror();
    } finally {
        if (tech.isConnected()) {
            tech.close();
        }
    }
}

nfc.writeNdef = function (global_id, _args) {
    var tech = nfc.module.createTagTechnologyNdef({
        tag: nfc.scannedTag
    });
    if (!tech.isValid()) {
      alert("Failed to create Ndef tag type.");
      return;
    }

    try {
        tech.connect();
        if (!tech.isWritable()) {
            alert("Tag is not writable.");
        } else {
            // Create a new message to write to the tag
            var textRecord = nfc.module.createNdefRecordText({
                text: global_id
            });
            var msg = nfc.module.createNdefMessage({
                records: [textRecord]
            });
            
            // For good measure, confirm that the message is not too big
            var blob = msg.toByte();
            if (blob.length > tech.getMaxSize()) {
                _args.onerror();
            } else {
                tech.writeNdefMessage(msg);
                alert("Tag successfully updated.");
                _args.onsuccess();
                nfc.onClear();
            }
        }
    } catch (e) {
        _args.onerror();
    } finally {
        if (tech.isConnected()) {
            tech.close();
        }
    }
}

nfc.onReadFelica = function (_args) {

    var tech = nfc.module.createTagTechnologyNfcF({
        tag: nfc.scannedTag
    });

    if (!tech.isValid()) {
      alert("Failed to create NfcF tag type.");
      _args.onerror();
    }

    try {
        tech.connect();

        if (!tech.isConnected()) {
            throw new Error("Tag is not connected.");
        } else {

            if (!tech.isValid()) {
                throw new Error("Invalid Felica.");
            }

            var idm = nfc.scannedTag.getId();

            var command = nfc.readWithoutEncryption(idm);

            var response = tech.transceive(command);

            if (response[10] != 0x00) {
                throw new Error("This card is out of the target.");
            } else {
                nfc.tagDataValue = response;
                _args.onsuccess();
            }
        }
    } catch (e) {
        alert("Tag connection error: " + e.message);
        _args.onerror();
    } finally {
        if (tech.isConnected()) {
            tech.close();
        }
    }
}

nfc.readWithoutEncryption = function (idm) {
    var r = new RegExp(".{1,"+2+"}","g");
    var idms = idm.match(r);

    var serviceCode = "100B";
    var blockSize = 1;
    var commandSize = 16;

    var commandAry = Ti.createBuffer({length:commandSize});
    commandAry[0] = commandSize;  // データサイズ

    commandAry[1] = 0x06;  // コマンドコード（Read Without Encryption）

    // IDm（8バイトを分割）
    for (var i = 0; i < idms.length; i++) {
        commandAry[i + 2] = parseInt(idms[i], 16);
    }

    commandAry[10] = 1;         // サービス数
    commandAry[11] = 0x0B;      // サービスコード（0x100B）の下位2ビット
    commandAry[12] = 0x10;      // サービスコード（0x100B）の上位2ビット
    commandAry[13] = blockSize; // ブロックサイズ（読み込むブロック数）

    // 職員ID
    commandAry[14] = 0x80;      // ブロックリストエレメント：2バイト（1b） アクセスモード 000b
    commandAry[15] = 0x00;      // ブロック番号（0）

    return commandAry;
}

export { nfc };