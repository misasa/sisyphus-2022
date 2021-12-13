    import {ui} from './ui'
    var PER_PAGE = 25;

    const createSearchWindow = function(_args) {
        var si = _args.si;
        var isDone = null;
        var page = 1;
        var onSearchFlag = false;

        var SEARCH_TYPE = {
            SEARCH: 'Search',
            HISTORY: 'History',
        }

        var win = Ti.UI.createWindow({
            title : _args.type,
        });

        win.condition = "";

        win.addEventListener('open', function(e) {
            Ti.API.info('opened');
        });

        var condition = Ti.UI.createTextField({
            borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
            text: win.condition,
            top: 10,
            width: '60%',
            layout : 'horizontal'
        });
        condition.addEventListener('blur', function (e){
           onSearchFlag = true;
           page = 1;
           win.condition = condition.value;
           win.load();
        });
        var timeout_id = null;
        condition.addEventListener('change', function (e){
           if (timeout_id !== null) {
               clearTimeout(timeout_id);
               timeout_id = null;
           }
           timeout_id = setTimeout(function() {
               onSearchFlag = true;
               page = 1;
               win.condition = condition.value;
               win.load();
           }, 1000);
        });

        win.dialogs = {};
        win.dialogs.historyClearedAlert = Ti.UI.createAlertDialog({
            title: 'Cleared.',
            ok: 'OK'
        });

        win.dialogs.historyClearedAlert.addEventListener('click', function(e){
            win.close();
        });

        win.dialogs.historyClearConfirm = Ti.UI.createOptionDialog({
            title: 'Are you sure you want to clear histories?',
            options: ['OK', 'Cancel'],
            cancel: 1
        });

        win.dialogs.historyClearConfirm.addEventListener('click', function(e){
            if (e.index === 0) {
                try {
                    si.sqlite.sisyphus.open();
                    si.sqlite.sisyphus.db.execute('delete from histories');
                    si.sqlite.sisyphus.close();
                    win.dialogs.historyClearedAlert.show();
                } catch (e) {
                    alert(e.message);
                }
            }
        });

        win.buttons = {};
        win.buttons.Close = ui.createImageButtonView('/images/glyphicons-208-remove-2.png', {
            width : 70,
            height : 70,
            imgDimensions : 15,
            layout : 'horizontal',
            onclick : function(e) { win.close() }
        });
        win.buttons.Close.left = 0;

        win.buttons.HistoryClear = Ti.UI.createButton({
            title: 'Clear',
            width: 300,
            height: 90,
            bottom: 0,
            right: 0
        });

        win.buttons.HistoryClear.addEventListener('click',function(e)
        {
            win.dialogs.historyClearConfirm.show();
        });

        win.buttons.Search = ui.createImageButtonView('/images/glyphicons-28-search.png', {
            right : 0,
            width : 70,
            height : 70,
            imgDimensions : 15,
            layout : 'horizontal',
            onclick : function(e) {
                onSearchFlag = true;
                page = 1;
                win.condition = condition.value;
                win.load();
            }
        });
        win.buttons.Search.right = 0;

        win.buttons.More = Ti.UI.createButton({
            title: 'more',
            width: '75%',
            height: 100,
            bottom: 0
        });

        win.buttons.More.addEventListener('click',function(e)
        {
            page++;
            condition.text = win.condition;
            win.load();
        });

        var viewBase = Ti.UI.createView({
            top : 0,
            width : '100%',
            height : '100%',
            layout : 'vertical'
        });

        var viewHeader = Ti.UI.createView({
            height : Ti.UI.SIZE,
            width : Ti.UI.FILL,
        });

        var viewBody = Ti.UI.createScrollView({
            showVerticalScrollIndicator: true,
            showHorizontalScrollIndicator: true,
            height : '100%',
            layout : 'vertical'
        });

        var activityIndicator = Ti.UI.createActivityIndicator({
            style : Ti.UI.ActivityIndicatorStyle.BIG,
        });

        win.load = function(){
            if(_args.type === 'History') {
                win.loadHistory();
            } else {
                win.search();
            }
        };

        win.bind = function(response){
            var loadDataSet = [];

            if (response.length < PER_PAGE) {
                win.buttons.More.enabled = false;
            }
            if (response.length <= 0) {
                if (page > 1) {
                    alert('There are no more records.');
                }
                page--;
            } else {
                for (var i = 0; i < response.length; i++) {
                    var data = response[i];
                    var name = data.name || '[no name]';
                    var record_type = data.datum_attributes.physical_form_name || data.datum_attributes.box_type_name || '';
                    var loadData = {
                        global_id: data.global_id,
                        name: { text: name },
                        global_id_text: { text: data.global_id },
                        record_type: { text: record_type },
                        picture: { image: si.imageURL(data.datum_attributes.primary_file_thumbnail_path) }
                    };
                    loadDataSet.push(loadData);
                }
                try {
                    section.appendItems(loadDataSet);
                } catch (e) {
                    alert(e.message);
                }
            }
        };

        win.loadHistory = function() {
            var isDone = false;
            win.buttons.More.enabled = true;
            Ti.API.info('click');

            try {
                si.sqlite.sisyphus.open();
                var histories = si.sqlite.sisyphus.db.execute(
                    'select * from histories order by loaded_at desc limit ? offset ?',
                    PER_PAGE,
                    PER_PAGE * (page - 1)
                );
                var records = [];
                for (var i = 1; histories.isValidRow(); i++) {
                    var global_id = histories.fieldByName('global_id');
                    var name = histories.fieldByName('name');
                    var physical_form_name = histories.fieldByName('physical_form_name');
                    var box_type_name = histories.fieldByName('box_type_name');
                    var thumbnail_path = histories.fieldByName('thumbnail_path');
                    var record = {
                        global_id: global_id,
                        name: name,
                        datum_attributes: {
                            physical_form_name: physical_form_name,
                            box_type_name: box_type_name,
                            primary_file_thumbnail_path: thumbnail_path
                        }
                    };
                    records.push(record);
                    histories.next();
                }
                win.bind(records);
            } catch (e) {
                alert(e.message);
                page--;
            }
            si.sqlite.sisyphus.close();
            isDone = true;
        };

        win.search = function(){
            var isDone = false;
            win.buttons.More.enabled = true;
            Ti.API.info('click');

            activityIndicator.show();
            si.model.medusa.getRecords({
                query: { name_cont: win.condition, datum_type_in: ["Specimen", "Box"] },
                page: page,
                per_page: PER_PAGE,
                onsuccess : function(response) {
                    if (onSearchFlag) {
                        sections = [];
                        section.setItems([]);
                        sections.push(section);
                        listView.sections = sections;                        
                        onSearchFlag = false;
                    }
                    win.bind(response);
                    activityIndicator.hide();
                    isDone = true;
                },
                onerror : function(e) {
                    page--;
                    alert('search onerror');
                    activityIndicator.hide();
                    isDone = true;
                    ui.showErrorDialog(_message);
                }
            });
        };

        // template
        var recordTemplate = {
            childTemplates: [
                {
                    type: 'Ti.UI.Label',
                    bindId: 'name',
                    properties: {
                        color: 'gray',
                        font: { fontFamily:'Arial', fontSize: '20dp', fontWeight:'bold' },
                        left: '0dp', top: '0dp',
                    }
                },
                {
                    type: 'Ti.UI.Label',
                    bindId: 'global_id_text',
                    properties: {
                        color: 'gray',
                        font: { fontFamily:'Arial', fontSize: '14dp' },
                        left: '0dp', top: '25dp',
                    }
                },
                {
                    type: 'Ti.UI.Label',
                    bindId: 'record_type',
                    properties: {
                        color: 'gray',
                        font: { fontFamily:'Arial', fontSize: '10dp' },
                        left: '0dp', top: '44dp',
                    }
                },
                {
                    type: 'Ti.UI.ImageView',
                    bindId: 'picture',
                    properties: {
                        background: 'white',
                        right: '10dp', top: 0,
                        height: 120
                    }
                }
            ]
        };

        var listView = Ti.UI.createListView({
            templates: { 'template': recordTemplate },
            defaultItemTemplate: 'template'
        });

        listView.addEventListener('itemclick', function(e){
            var item = section.getItemAt(e.itemIndex);
            _args.onsuccess(item);
            win.close();
        });

        var sections = [];
        var section = Ti.UI.createListSection({ headerTitle: 'Records', footerView: win.buttons.More});
        section.setItems([]);
        sections.push(section);
        listView.sections = sections;
        win.load();

        //TODO: layout
        win.add(viewBase);
        viewBase.add(viewHeader);
        viewHeader.add(win.buttons.Close);
        if (_args.type === 'History') {
            viewHeader.add(win.buttons.HistoryClear);
        } else {
            viewHeader.add(condition);
            viewHeader.add(win.buttons.Search);
        }
        viewBase.add(viewBody);
        viewBody.add(listView);
        win.add(activityIndicator);
        win.isDone = isDone;
        win.search_button = win.buttons.Search;
        win.activityIndicator = activityIndicator;

        return win;
    };
export {createSearchWindow};
