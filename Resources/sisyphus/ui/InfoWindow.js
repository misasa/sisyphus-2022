    const createInfoWindow = function(si){
        var win = Ti.UI.createWindow({
            title : 'Info',
            //backgroundColor : 'white',
            barColor : '#336699',
            orientationModes : [Ti.UI.PORTRAIT],
            backButtonTitle : 'Back',
            //layout : 'vertical'
        });

        var image_view = Ti.UI.createImageView({
            width : '30%',
            //top: 0,
            //height : '30%',
            //backgroundColor : 'blue',
            //image : '/images/kiriko-0-transparent.png'
            //image : '/images/kiriko-0-inverse.png'
            image : '/images/kiriko-0-transparent-gray-2.png'
        });

        var info_view = Ti.UI.createView({
            width : '70%',
            height : Ti.UI.SIZE,
            layout : 'vertical',
            //top : '10%',
            //backgroundColor : 'blue'
        });

        var image_and_info = Ti.UI.createView({
            top : '10%',
            width : '98%',
            height : Ti.UI.SIZE,
            layout : 'horizontal',
            //backgroundColor : 'yellow'
        });

        var footer = Ti.UI.createView({
            width : '98%',
            height : Ti.UI.SIZE,
            layout : 'vertical',
            bottom : '2%',
            //backgroundColor : 'orange',
            layout : 'vertical'
        });
        var label_copyright = Ti.UI.createLabel({
            //font : font,
            height : Ti.UI.SIZE,
            //top : '45%',
            font : {fontWeight : 'bold',fontSize : 36},
            textAlign : 'left',
            text : "\u00A9 2012-2022 Institute for Planetary Materials, Okayama University"
        });

        var label_version = Ti.UI.createLabel({
            //font : font,
            height : Ti.UI.SIZE,
            //top : '45%',
            font : {fontWeight : 'bold', fontSize : 36},
            textAlign : 'left',
            text : 'Sisyphus for Medusa' + ' ' + Ti.App.version 
        });

        var label_known_problems = Ti.UI.createLabel({
            //font : font,
            height : Ti.UI.SIZE,
            //top : '45%',
            font : {fontWeight : 'bold', fontSize : 24},
            textAlign : 'left',
            text : 'Known problems:\nLogin by NFC is not work supprted.\nRead and write label by NFC are not supported.' 
        });

        var buttonClearData = Ti.UI.createButton({
            title : 'Clear data',
            font : {fontSize:36},
            borderRadius : 10,
            width : '100%',
            height : Ti.UI.SIZE
        });
        buttonClearData.addEventListener('click', function(e) {
            si.app.clearData();
            //Ti.Platform.openURL('http://dream.misasa.okayama-u.ac.jp/Archives/client-Android-2022.apk');
        });

        var buttonUpdate = Ti.UI.createButton({
            title : 'Update',
            //backgroundImage: '/images/glyphicons-415-disk-save.png',
            font : {fontSize:36},
            borderRadius : 10,
            width : '100%',
            height : Ti.UI.SIZE
        });
        buttonUpdate.addEventListener('click', function(e) {
            Ti.Platform.openURL('http://dream.misasa.okayama-u.ac.jp/Archives/client-Android-2022.apk');
        });

        var buttonHelp = Ti.UI.createButton({
            title : 'Help',
            font : {fontSize:36},
            borderRadius : 10,
            width : '100%',
            height : Ti.UI.SIZE
        });
        buttonHelp.addEventListener('click', function(e) {
            Ti.Platform.openURL('http://dream.misasa.okayama-u.ac.jp/documentation/');
        });
        //var webview = Ti.UI.createWebView({url: 'http://dream.misasa.okayama-u.ac.jp/documentation/'});
        image_and_info.add(image_view);
        image_and_info.add(info_view);        
        info_view.add(label_version);
        info_view.add(label_copyright);
        info_view.add(label_known_problems);        
//        footer.add(buttonClearData);
        footer.add(buttonUpdate);
        footer.add(buttonHelp);
        //info_view.add(label_publisher);
        //win.add(info_view);
        //win.add(image_view);
        win.add(image_and_info);
        win.add(footer);
        return win;
    }
export { createInfoWindow };
