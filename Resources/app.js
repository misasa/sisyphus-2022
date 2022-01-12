import {si} from './sisyphus/sisyphus'
import {model} from './sisyphus/model/medusa'
si.model = model;
Ti.API.info("loading...")
Ti.API.info(si.nfc)
import {createInfoWindow} from './sisyphus/ui/InfoWindow'
import {createSettingsWindow} from './sisyphus/ui/SettingsWindow'
import {createAddChildWindow} from './sisyphus/ui/android/AddChildWindow'

//Set Default Value
if (Ti.App.Properties.getString('current_global_id') == null) {
    Ti.App.Properties.setString('current_global_id', Ti.App.Properties.getString('current_box_global_id'));
}
if (Ti.App.Properties.getString('server') == null) {
    Ti.App.Properties.setString('server', si.config.Medusa.defaultServer);
}
if (Ti.App.Properties.getString('username') == null) {
    Ti.App.Properties.setString('username', si.config.Medusa.defaultUsername);
}
if (Ti.App.Properties.getString('password') == null) {
    Ti.App.Properties.setString('password', si.config.Medusa.defaultPassword);
}

if (Ti.App.Properties.getInt('globalId') == null) {
    Ti.App.Properties.setInt('globalId', si.config.Medusa.globalId);
}
if (Ti.App.Properties.getBool('printLabel') == null) {
    Ti.App.Properties.setBool('printLabel', si.config.Medusa.printLabel);
}
if (Ti.App.Properties.getString('printServer') == null) {
    Ti.App.Properties.setString('printServer', si.config.Medusa.defaultPrintServer);
}
if (Ti.App.Properties.getString('printFormatUrl') == null) {
    Ti.App.Properties.setString('printFormatUrl', si.config.Medusa.defaultPrintFormatUrl);
}
if (Ti.App.Properties.getString('printTimeout') == null) {
    Ti.App.Properties.setString('printTimeout', si.config.Medusa.printTimeout);
}
if (Ti.App.Properties.getInt('facing') == null) {
    Ti.App.Properties.setInt('facing', si.config.Medusa.facing);
}
if (Ti.App.Properties.getInt('tagReader') == null) {
    Ti.App.Properties.setInt('tagReader', si.config.Medusa.tagReader);
}
if (Ti.App.Properties.getInt('tagWriter') == null) {
    Ti.App.Properties.setInt('tagWriter', si.config.Medusa.tagWriter);
}
if (Ti.App.Properties.getInt('newStone') == null) {
    Ti.App.Properties.setInt('newStone', si.config.Medusa.newStone);
}

Ti.App.Properties.setBool('NfcEnabled', true);

var tabGroup = Ti.UI.createTabGroup({
	height : 300
});
	
var tabMain = Ti.UI.createTab({
	title : 'Dashboard',
	window : createAddChildWindow(si)
});
tabGroup.addTab(tabMain);

var tabSettings = Ti.UI.createTab({
	title : 'Settings',
	window : createSettingsWindow(si)
});
tabGroup.addTab(tabSettings);

var tabHelp = Ti.UI.createTab({
	title : 'About',
	window : createInfoWindow(si)
});
tabGroup.addTab(tabHelp);

tabGroup.addEventListener('open', function(e) {
	Ti.API.info('window open...');
});
si.app.tabGroup = tabGroup;
si.app.tabGroup.open();
