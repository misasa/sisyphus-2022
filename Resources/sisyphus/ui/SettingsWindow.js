 import {createLoginWindow} from './LoginWindow'
 import {createLabelPrintSettingWindow} from './LabelPrintSettingWindow'
 import { createBarcodeScanWindow } from './BarcodeScanWindow';
 import {ui} from './ui'
 const createSettingsWindow = function(si) {
	    var win = Ti.UI.createWindow({
	    	title: 'Settings',
	    	//backgroundColor:'#ffffff',
	    	barColor:'#336699'});
	    var font = {fontSize: 20};
		var data = [
//			{title:'----', hasChild:false, target:'Server', header:'Medusa server', font: font},
			{title:'----', hasChild:false, target:'LogIn', header:'Account', font: font},
			{title:'----', hasChild:false, target:'GlobalID', header:'Manual ID on new stone', font: font},
			{title: '----', hasChild: false, target: 'NewStone', header: 'Open camera on new stone', font: font},
			{title:'----', hasChild:false, target:'PrintLabel', header:'Label', font: font},			
			//{title:'----', hasChild:false, target:'PrintServer', header:'print server', font: font},
			//{title:'----', hasChild:false, target:'PrintFormatUrl', header:'print format url', font: font},
			{title:'----', hasChild:false, target:'ScanToLoad', header:'Home', font: font},
			{title:'----', hasChild:false, target:'BarcodeReader', header: 'Barcode tag', font: font},
			//{title:'----', hasChild:false, target:'ScanCamera', header: 'Barcode reader', font: font}
			{title: '----', hasChild: false, target: 'TagReader', header: 'Read', font: font},
		        {title: '----', hasChild: false, target: 'TagWriter', header: 'Write', font: font}
//			{title: '----', hasChild: false, target: 'NewStone', header: 'New stone', font: font}
		];
		var index_medusa_server = findIndex('Server');
		var index_account = findIndex('LogIn');
		var index_global_id = findIndex('GlobalID');
		var index_print_server = findIndex('PrintServer');
		var index_print_format_url = findIndex('PrintFormatUrl');
		var index_printer_name = findIndex('PrinterName');
		var index_template_name = findIndex('TemplateName');
		var index_home = findIndex('ScanToLoad');
		var index_print_label = findIndex('PrintLabel');
		var index_scan_camera = findIndex('ScanCamera');
		var index_barcode_reader = findIndex('BarcodeReader');		
		var index_tag_reader = findIndex('TagReader');
		var index_tag_writer = findIndex('TagWriter');
		var index_new_stone = findIndex('NewStone');

		var tableViewOptions = {
				data:data,
				backgroundColor:'transparent',
				rowBackgroundColor:'white'
		};


        var optionDialogForGlobalId = Ti.UI.createOptionDialog({
            options : ['no', 'yes'],
            //cancel : 2,
            selectedIndex: Ti.App.Properties.getInt('globalId'),
            title : 'Manual ID on new stone'

        });
        optionDialogForGlobalId.addEventListener('click', function(e) {
            switch (e.index) {
                case 0:
		    Ti.App.Properties.setInt('globalId',e.index);        
                    break;
                case 1:
		    Ti.App.Properties.setInt('globalId',e.index);                
                    break;
                default:
                    break;
            };
            label_global_id.text = globalIdInfo();
        });

        var optionDialogForPrintLabel = Ti.UI.createOptionDialog({
            options : ['enable', 'disable', 'cancel'],
            cancel : 2,
            title : 'Print Label'
        });
        optionDialogForPrintLabel.addEventListener('click', function(e) {
            switch (e.index) {
                case 0:
					Ti.App.Properties.setInt('printLabel',1);        
                    break;
                case 1:
					Ti.App.Properties.setInt('printLabel',0);                
                    break;
                default:
                    break;
            };
            updatePrintLabelRow();
			//tableView.data[4].rows[0].title = ScanCameraInfo();
        });

        var optionDialogForBarcodeReader = Ti.UI.createOptionDialog({
            options : ['Rear camera', 'Front camera'],
            //cancel : 2,
            selectedIndex: Ti.App.Properties.getInt('facing'),
            title : 'Barcode tag'

        });

        // var optionDialogForScanCamera = Ti.UI.createOptionDialog({
        //     options : ['Rear camera', 'Front camera'],
        //     //cancel : 2,
        //     title : 'Barcode reader setting'
        // });
        optionDialogForBarcodeReader.addEventListener('click', function(e) {
            switch (e.index) {
                case 0:
					Ti.App.Properties.setInt('facing',e.index);        
                    break;
                case 1:
					Ti.App.Properties.setInt('facing',e.index);                
                    break;
                default:
                    break;
            };
            //updateScanCameraRow();
			//tableView.data[4].rows[0].title = ScanCameraInfo();
			label_barcode_reader.text = ScanCameraInfo();
        });

        var optionsForTagReader = ['Barcode tag'];
        if (si.nfc.isEnabled()) {
            optionsForTagReader.push('NFC tag');
        }
        var optionDialogForTagReader = Ti.UI.createOptionDialog({
            options : optionsForTagReader,
            selectedIndex: Ti.App.Properties.getInt('tagReader'),
            title : 'Read'
        });
        optionDialogForTagReader.addEventListener('click', function(e) {
            switch (e.index) {
                case 0:
                case 1:
                    Ti.App.Properties.setInt('tagReader', e.index);
                    break;
                default:
                    break;
            };
            label_tag_reader.text = TagReaderInfo();
        });
        
        var optionsForTagWriter = ['Barcode tag'];
        if (si.nfc.isEnabled()) {
            optionsForTagWriter.push('NFC tag');
        }
        var optionDialogForTagWriter = Ti.UI.createOptionDialog({
            options : optionsForTagWriter,
            selectedIndex: Ti.App.Properties.getInt('tagWriter'),
            title : 'Write'
        });
        optionDialogForTagWriter.addEventListener('click', function(e) {
            switch (e.index) {
                case 0:
                case 1:
                    Ti.App.Properties.setInt('tagWriter', e.index);
                    break;
                default:
                    break;
            };
            label_tag_writer.text = TagWriterInfo();
        });
        var optionDialogForNewStone = Ti.UI.createOptionDialog({
            options : ['no', 'yes'],
            selectedIndex: Ti.App.Properties.getInt('newStone'),
            title : 'Open camera on new stone'
        });
        optionDialogForNewStone.addEventListener('click', function(e) {
            switch (e.index) {
                case 0:
                case 1:
	            Ti.App.Properties.setInt('newStone', e.index);
                    break;
                default:
                    break;
            };
	    label_new_stone.text = NewStoneInfo();
        });

		var tableView = Ti.UI.createTableView(tableViewOptions);
		tableView.addEventListener('click', function(e){
			var rowNum = e.index;
			switch(e.rowData.target){
				case 'Server':
					var windowServerSetting = ui.createServerSettingWindow();
					si.app.tabGroup.activeTab.open(windowServerSetting,{animated:true});
					break;
				case 'LogIn':
					var windowLogin = createLoginWindow({
						si: si,
						onsuccess : function(){
                                                    ui.myAlert({message: 'Login successful with ' + Ti.App.Properties.getString('loginUsername')});
						}
					});
					si.app.tabGroup.activeTab.open(windowLogin,{animated:true});
					break;
				case 'PrintServer':
					var windowPrintServerSetting = ui.createPrintServerSettingWindow();
					si.app.tabGroup.activeTab.open(
						windowPrintServerSetting,
						{animated:true}
					);
					break;
				case 'PrintFormatUrl':
					var windowsPrintFormatUrlSetting = ui.createPrintFormatUrlSettingWindow();
					si.app.tabGroup.activeTab.open(windowsPrintFormatUrlSetting,{animated:true});
					break;
				case 'PrinterName':
					var windowsPrinterNameSetting = ui.createPrinterNameSettingWindow();
					si.app.tabGroup.activeTab.open(windowsPrinterNameSetting,{animated:true});
					break;
				case 'TemplateName':
					var windowsTemplateNameSetting = ui.createTemplateNameSettingWindow();
					si.app.tabGroup.activeTab.open(windowsTemplateNameSetting,{animated:true});
					break;
				case 'ScanToLoad':
					// var w = ui.createInputOrScanWindow({
                    // title: 'Home setting',
                    // value: Ti.App.Properties.getString('current_box_global_id'),
                    // save : function(value) {
                        // ar global_id = value;
                        // Ti.App.Properties.setString('current_box_global_id',global_id);
                        // w.close();
                        // updateHomeRow();
                        // }
                    // });
					// si.app.tabGroup.activeTab.open(
					    // w,{animated:true}
					// );
					scanAndLoadDefaultBox();
					break;
				case 'ScanCamera':
					if (Ti.Media.availableCameras.length > 1){
				    	optionDialogForScanCamera.show();
				    } else {
				    	ui.myAlert({message:'single camera'});
				    }
					break;
				case 'BarcodeReader':
					optionDialogForBarcodeReader.show();
					break;	
				case 'TagReader':
					optionDialogForTagReader.show();
					break;
				case 'TagWriter':
					optionDialogForTagWriter.show();
					break;
				case 'GlobalID':
					optionDialogForGlobalId.show();
					break;
				case 'PrintLabel':
					var windowLabelPrint = createLabelPrintSettingWindow({si:si});
					si.app.tabGroup.activeTab.open(windowLabelPrint,{animated:true});
					break;
				    // optionDialogForPrintLabel.show();
					// break;
				case 'NewStone':
					optionDialogForNewStone.show();
					break;
				default:
					break;
			}
		});
		var view_account = Ti.UI.createView({
			layout : 'vertical',
			height : Ti.UI.SIZE,
		});
		var label_server = Ti.UI.createLabel({
			left : 10,
			font : font,
			text : 'URL'
		});
		var label_account = Ti.UI.createLabel({
			left : 10,
			font : font,
			text : 'Username'
		});
		view_account.add(label_server);
		view_account.add(label_account);
		tableView.data[index_account].rows[0].add(view_account);

		var view_global_id = Ti.UI.createView({
			layout : 'vertical',
			height : Ti.UI.SIZE
		});
		var label_global_id = Ti.UI.createLabel({
			left : 10,
			font : font,
			text : 'GlobalID'
		});
		view_global_id.add(label_global_id);
		tableView.data[index_global_id].rows[0].add(view_global_id);

		var view_label_print_base = Ti.UI.createView({
			layout : 'vertical',
			//backgroundColor: 'yellow',
			height : Ti.UI.SIZE,
		});
		var label_print_status = Ti.UI.createLabel({
			left : 10,
			font : font,			
			text : null
		});
		var label_print_server = Ti.UI.createLabel({
			left : 10,
			font : font,			
			text : null
		});
		var label_template = Ti.UI.createLabel({
			left : 10,
			font : font,			
			text : null
		});
		var label_printer_name = Ti.UI.createLabel({
			left : 10,
			font : font,			
			text : null
		});
		var label_template_name = Ti.UI.createLabel({
			left : 10,
			font : font,			
			text : null
		});
		var label_timeout = Ti.UI.createLabel({
			left : 10,
			font : font,
			text : null
		});
		var label_print_status_row = ui.createInputRow('Print label:', label_print_status);
		var label_print_server_row = ui.createInputRow('Print server:', label_print_server);
		var label_template_row = ui.createInputRow('Print format URL:', label_template);
		var label_printer_name_row = ui.createInputRow('Printer name:', label_printer_name);
		var label_template_name_row = ui.createInputRow('Template name:', label_template_name);
		var label_timeout_row = ui.createInputRow('Timeout[s]:', label_timeout);

		view_label_print_base.add(label_print_status_row);
		view_label_print_base.add(label_print_server_row);
		view_label_print_base.add(label_template_row);
		view_label_print_base.add(label_printer_name_row);
		view_label_print_base.add(label_template_name_row);
		view_label_print_base.add(label_timeout_row);
		tableView.data[index_print_label].rows[0].add(view_label_print_base);


		var view_barcode_reader_base = Ti.UI.createView({
			layout : 'vertical',
			//backgroundColor: 'yellow',
			height : Ti.UI.SIZE,
		});
		var label_barcode_reader = Ti.UI.createLabel({
			left : 10,
			font : font,			
			text : 'BarcodeReader'
		});
		view_barcode_reader_base.add(label_barcode_reader);
		tableView.data[index_barcode_reader].rows[0].add(view_barcode_reader_base);
		//tableView.data[index_account].rows[0].add(label2);		
		win.add(tableView);
		
		var view_tag_reader_base = Ti.UI.createView({
			layout : 'vertical',
			//backgroundColor: 'yellow',
			height: Ti.UI.SIZE,
		});
		var label_tag_reader = Ti.UI.createLabel({
			left : 10,
			font : font,
			text : 'TagReader'
		});
		view_tag_reader_base.add(label_tag_reader);
		tableView.data[index_tag_reader].rows[0].add(view_tag_reader_base);
		win.add(tableView);
		
		var view_tag_writer_base = Ti.UI.createView({
			layout : 'vertical',
			//backgroundColor: 'yellow',
			height : Ti.UI.SIZE,
		});
		var label_tag_writer = Ti.UI.createLabel({
			left : 10,
			font : font,
			text : 'TagWriter'
		});
		view_tag_writer_base.add(label_tag_writer);
		tableView.data[index_tag_writer].rows[0].add(view_tag_writer_base);
		win.add(tableView);

		var view_new_stone_base = Ti.UI.createView({
			layout : 'vertical',
			height : Ti.UI.SIZE,
		});
		var label_new_stone = Ti.UI.createLabel({
			left : 10,
			font : font,
			text : 'NewStone'
		});
		view_new_stone_base.add(label_new_stone);
		tableView.data[index_new_stone].rows[0].add(view_new_stone_base);
		win.add(tableView);

	    win.addEventListener('focus', function (e) {
	    	label_server.text = serverInfo();
	    	label_account.text = accountInfo();
	    	label_global_id.text = globalIdInfo();
	    	label_print_status.text = LabelPrintStatus();
	    	label_print_server.text = printServerInfo();
	    	label_template.text = printFormatUrlInfo();
	    	label_printer_name.text = printerNameInfo();
	    	label_template_name.text = templateNameInfo();
                label_timeout.text = printTimeoutInfo();
	    	label_barcode_reader.text = ScanCameraInfo();
                label_tag_reader.text = TagReaderInfo();
                label_tag_writer.text = TagWriterInfo();
	        label_new_stone.text = NewStoneInfo();
	    	//tableView.data[index_medusa_server].rows[0].title = serverInfo();
		   	//tableView.data[index_account].rows[0].title = accountInfo();
		   	//tableView.data[index_print_server].rows[0].title = printServerInfo();		   	
		   	//tableView.data[index_print_format_url].rows[0].title = printFormatUrlInfo();
		   	updateHomeRow();
		   	//updateScanCameraRow();
		   	//updatePrintLabelRow();
		});

		function findIndex(target) {
			//Ti.API.info('findIndex: ' + target);
			var i, x;
			for (i in data) {
				x = data[i];
				if (x.target == target) {
					return i;
				}
			}
		}

		function accountInfo(){
			var username = Ti.App.Properties.getString('loginUsername');
			if (username == null || username == ''){
				username = 'Click to login.';
			}
			return username;
		};

		function serverInfo(){
			return Ti.App.Properties.getString('server');
		}

		function globalIdInfo(){
			var globalId = Ti.App.Properties.getInt('globalId');
			if (globalId == 1){
				return 'yes';
			} else {
				return 'no';
			}
		};

		function printServerInfo(){
            var printServer = Ti.App.Properties.getString('printServer');
            return printServer;
		};

		function printFormatUrlInfo(){
            var printFormatUrl = Ti.App.Properties.getString('printFormatUrl');
            return printFormatUrl;
		};

		function printerNameInfo(){
			var printerName = Ti.App.Properties.getString('printerNameTitle');
			if (printerName == null || printerName == ''){
				printerName = 'default';
			}
			return printerName;
		};

		function templateNameInfo(){
			var templateName = Ti.App.Properties.getString('templateName');
			if (templateName == null || templateName == ''){
				templateName = 'default';
			}
			return templateName;
		};
		function printTimeoutInfo(){
                     var printTimeout = Ti.App.Properties.getString('printTimeout');
                     return printTimeout;
		};

		function ScanCameraInfo(){
			var facing = Ti.App.Properties.getInt('facing');
			if (facing == 1){
				return 'Front camera';
			} else {
				return 'Rear camera';
			}
		}
		
		function TagReaderInfo(){
			var tagReader = Ti.App.Properties.getInt('tagReader');
			if (tagReader == 1){
			    return 'NFC tag';
			} else {
			    return 'Barcode tag';
			}
		}
		
		function TagWriterInfo(){
			var tagWriter = Ti.App.Properties.getInt('tagWriter');
			if (tagWriter == 1){
				return 'NFC tag';
			} else {
				return 'Barcode tag';
			}
		}

	        function NewStoneInfo() {
		        var newStone = Ti.App.Properties.getInt('newStone');
		        if (newStone == 1) {
			        return 'yes';
			} else {
			        return 'no';
			}
		}

		function LabelPrintStatus(){
			if (Ti.App.Properties.getBool('printLabel')){
				return 'ON';
			} else {
				return 'OFF';
			}
		}

		function PrintLabelInfo(){
			if (Ti.App.Properties.getBool('printLabel')){
				return 'enabled';
			} else {
				return 'disabled';
			}
		}

		function updateScanCameraRow(){
			tableView.data[index_scan_camera].rows[0].title = ScanCameraInfo();
		}
		
		function updateTagReaderRow(){
			tableView.data[index_tag_reader].rows[0].title = TagReaderInfo();
		}
		
		function updateTagWriterRow(){
			tableView.data[index_tag_writer].rows[0].title = TagWriterInfo();
		}

		function updatePrintLabelRow(){
			tableView.data[index_print_label].rows[0].title = PrintLabelInfo();
		}

		function updateHomeRow(){
			Ti.API.info('updateHomeRow...');
			var index = index_home;
			var row = tableView.data[index].rows[0];
		    var global_id = Ti.App.Properties.getString('current_box_global_id');
		    if (global_id == '' || global_id !== null){
				si.model.medusa.getRecordFromGlobalId({
					global_id:global_id,
                 	username : Ti.App.Properties.getString('username'),
                 	password : Ti.App.Properties.getString('password'),
					onsuccess:function(response){
						Ti.API.info('success');
						row.title = response.name;
						row.target = 'ScanToLoad';
					},
					onerror:function(e){
						Ti.API.info('error');
						row.title = '';
						row.target = 'ScanToLoad';						
					}
				});
			} else {
				Ti.API.info('global_id is null ');
				var row = tableView.data[index].rows[0];
				row.title = '';
				row.target = 'ScanToLoad';
			}
		};

		function scanAndLoadDefaultBox(){
            if (!si.config.Medusa.debug){
                var _win = null;
                if (Ti.App.Properties.getInt('tagReader') === 1) {
                    _win = si.nfc.createScanWindow({
                        success: function() {
                            if (si.nfc.tagDataValue) {
                                Ti.App.Properties.setString('current_box_global_id', si.nfc.tagDataValue);
                                updateHomeRow();
                            }
                            _win.close();
                        },
                        cancel: function() { _win.close(); },
                        error: function() { _win.close(); }
                    });
                } else {
                    _win = createBarcodeScanWindow();
					_win.setCallback(
						function(e){
							Ti.API.info(e);
							if (e && e.result) {
                                var global_id = e.result;
                                Ti.App.Properties.setString('current_box_global_id',global_id);
	                            updateHomeRow();
							}
							_win.cancel();
						}
					);
                }
                si.app.tabGroup.activeTab.open(
                    _win,{animated:true}
                );                                
            } else {
                var global_id = si.config.debug.box_global_id;
                Ti.App.Properties.setString('current_box_global_id',global_id);
                updateHomeRow();
            }
	   	};
		return win;
	};

export {createSettingsWindow};