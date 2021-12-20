var Barcode = require('ti.barcode');

Barcode.allowRotation = true;
Barcode.displayedMessage = ' ';
Barcode.allowMenu = false;
Barcode.allowInstructions = false;
Barcode.useLED = true;

var isAndroid = Ti.Platform.osname === 'android';
var isiOS = !isAndroid;

const createBarcodeScanWindow = function(_args){
    var window = Ti.UI.createWindow({
        backgroundColor: 'transparent',
    });
    var scrollView = Ti.UI.createScrollView({
        contentWidth: 'auto',
        contentHeight: 'auto',
        top: 0,
        showVerticalScrollIndicator: true,
        layout: 'vertical'
    });
    
    /**
     * Create a chrome for the barcode scanner.
     */
    var overlay = Ti.UI.createView({
        backgroundColor: 'transparent',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    });
    
    var switchButton = Ti.UI.createButton({
        title: Barcode.useFrontCamera ? 'Back Camera' : 'Front Camera',
        textAlign: 'center',
        color: '#000',
        backgroundColor: '#fff',
        style: 0,
        font: {
            fontWeight: 'bold',
            fontSize: 16
        },
        borderColor: '#000',
        borderRadius: 10,
        borderWidth: 1,
        opacity: 0.5,
        width: 220,
        height: 30,
        bottom: 10
    });
    
    switchButton.addEventListener('click', function () {
        Barcode.useFrontCamera = !Barcode.useFrontCamera;
        switchButton.title = Barcode.useFrontCamera ? 'Back Camera' : 'Front Camera';
    });
    
    overlay.add(switchButton);
    
    var cancelButton = Ti.UI.createButton({
        title: 'Close',
        textAlign: 'center',
        color: '#000',
        backgroundColor: '#fff',
        style: 0,
        font: {
            fontWeight: 'bold',
            fontSize: 16
        },
        borderColor: '#000',
        borderRadius: 10,
        borderWidth: 1,
        opacity: 0.5,
        width: 220,
        height: 30,
        top: 20
    });
    cancelButton.addEventListener('click', function () {
        Barcode.cancel();
    });
    overlay.add(cancelButton);
        
    var cameraPermission = (callback) => {
        if (isAndroid) {
            if (Ti.Media.hasCameraPermissions()) {
                if (callback) {
                    callback(true);
                }
            } else {
                Ti.Media.requestCameraPermissions(function (e) {
                    if (e.success) {
                        if (callback) {
                            callback(true);
                        }
                    } else {
                        if (callback) {
                            callback(false);
                        }
                        alert('No camera permission'); // eslint-disable-line no-alert
                    }
                });
            }
        }
    
        if (isiOS) {
            if (callback) {
                callback(true);
            }
        }
    };
    
    /**
     * Now listen for various events from the Barcode module. This is the module's way of communicating with us.
     */
    
    var scannedBarcodes = {},
        scannedBarcodesCount = 0;
    var events = {},
        eventsCount = 0;
    window.setCallback = function setCallback(callback, flag){
        Ti.API.info("setCallback...");
        Ti.API.info(callback);
        Barcode.addEventListener('success', callback);
        events[eventsCount] = {
            type: 'success',
            listener: callback
        };
        return eventsCount++;        
    }
    window.cancel = function (){
        Barcode.cancel();
    }
    function reset() {
        scannedBarcodes = {};
        scannedBarcodesCount = 0;
        cancelButton.title = 'Close';
    }
    
    
    Barcode.addEventListener('cancel', function (e) {
        Ti.API.info('Cancel received');
        window.close();
    });

    /**
     * Finally, we'll add a couple labels to the window. When the user scans a barcode, we'll stick information about it in
     * to these labels.
     */
    window.addEventListener('open', function(e) {
        Ti.API.info('window open...');
        cameraPermission(function (re) {
            reset();
            // Note: while the simulator will NOT show a camera stream in the simulator, you may still call "Barcode.capture"
            // to test your barcode scanning overlay.
            Barcode.capture({
                animate: true,
                overlay: overlay,
                showCancel: false,
                showRectangle: false,
                keepOpen: true
                /* ,
                        acceptedFormats: [
                            Barcode.FORMAT_QR_CODE
                        ]*/
            });
        });
    });

    window.addEventListener('close', function(e) {
        Ti.API.info("window is closing....");
        for (let i = 0; i < eventsCount; i++) {
            Ti.API.info(events[i]);
            var event = events[i];
            Barcode.removeEventListener(event.type, event.listener);
        }
    });
    return window    
}
export { createBarcodeScanWindow };
