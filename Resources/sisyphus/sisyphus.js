Ti.API.info('sisyphus.js...');
var si = {};
    si.app = {};

    si.app.log = {};
    si.app.log.list = [];
    si.app.log.clear = function(){
        si.app.log.list = [];
    }
    si.app.log.newObj = function(_level, _message){
        var _date = new Date();        
        var _obj = {level: _level, message: _message, data: _date };
        return _obj;
    };
    si.app.log.append = function(_log){
        si.app.log.list.push(_log);
        Ti.App.fireEvent('app:logged', _log);
    };
    si.app.log.info = function(_message){
        var _log = si.app.log.newObj('info', _message);
        si.app.log.append(_log);
    };
    si.app.log.error = function(_message){
        var _log = si.app.log.newObj('error', _message);
        si.app.log.append(_log);
    };
    si.app.log.warn = function(_message){
        var _log = si.app.log.newObj('warn', _message);
        si.app.log.append(_log);
    };
    si.app.log.fatal = function(_message){
        var _log = si.app.log.newObj('fatal', _message);
        si.app.log.append(_log);
    };

    si.app.is_network_available = function(){
        //Ti.API.info(Ti.Network.networkTypeName);
        if (Ti.Network.networkType == Ti.Network.NETWORK_NONE){
            return false;
        } else {
            return true;
        }
    };

    si.app.getUserName = function(){
        return Ti.App.Properties.getString('username');
    };

    si.app.getSiteName = function(){
        return Ti.App.Properties.getString('server');
    };


    si.app.getAccountInfo = function(_args){
        //Ti.API.info('si.app.getAccountInfo');
        var _message = 'account info getting...';
        si.model.medusa.getAccountInfo({
            username : Ti.App.Properties.getString('username'),
            password : Ti.App.Properties.getString('password'),
            onsuccess : function(response) {
                //si.app.log.info(_message + 'ok');
                _args.onsuccess(response);
            },
            onerror : function(e) {
                //si.app.log.error(_message + 'error ' + "[" + e.message + "]");
                _args.onerror(e);
            }
        });

    };


    si.app.clearData = function(){
        Ti.App.Properties.setString('current_global_id', null);        
        Ti.App.Properties.setString('current_box_global_id', null);
        Ti.App.Properties.setList("classifications", null);        
        Ti.App.Properties.setList("physical_forms", null);
        Ti.App.Properties.setList("box_types", null);
        Ti.App.Properties.setList("groups", null);                
    };

    si.app.account = function(){
        return Ti.App.Properties.getObject("account", {});
    };

    si.app.groups = function(){
        return Ti.App.Properties.getList("groups", null);
    };
    si.app.getGroups = function(){
        Ti.API.info('si.app.getGroups');
        var _message = 'groups getting...';
        si.model.medusa.getWithAuth({
            path : '/account/groups.json',
            username : Ti.App.Properties.getString('username'),
            password : Ti.App.Properties.getString('password'),
            onsuccess : function(_array) {
                si.app.log.info(_message + 'ok');
                for(var i=0; i<_array.length; i++){
                //    Ti.API.info("---");
                    var _obj = _array[i];
                    _obj.title = _obj.name;
                }
                Ti.App.Properties.setList("groups", _array);
            },
            onerror : function(e) {
                //si.app.log.error(_message + 'error ' + "[" + e.message + "]");
                //_args.onerror(e);
            }
        });
    };

    si.app.classifications = function(){
        return Ti.App.Properties.getList("classifications", null);
    };
    si.app.getClassifications = function(){
        Ti.API.info('si.app.getClassifications');
        var _message = 'classifications getting...';
        si.model.medusa.getWithAuth({
            path : '/classifications.json',
            username : Ti.App.Properties.getString('username'),
            password : Ti.App.Properties.getString('password'),
            onsuccess : function(_array) {
                si.app.log.info(_message + 'ok');
                for(var i=0; i<_array.length; i++){
                //    Ti.API.info("---");
                    var _obj = _array[i];
                    _obj.title = _obj.full_name;
                }
                Ti.App.Properties.setList("classifications", _array);
            },
            onerror : function(e) {
                //si.app.log.error(_message + 'error ' + "[" + e.message + "]");
                //_args.onerror(e);
            }
        });
    };

    si.app.physical_forms = function(){
        return Ti.App.Properties.getList("physical_forms", null);
    };
    si.app.getPhysicalForms = function(){
        Ti.API.info('si.app.getPhysicalforms');
        var _message = 'physical_forms getting...';
        si.model.medusa.getWithAuth({
            path : '/physical_forms.json',
            username : Ti.App.Properties.getString('username'),
            password : Ti.App.Properties.getString('password'),
            onsuccess : function(_array) {
                si.app.log.info(_message + 'ok');
                for(var i=0; i<_array.length; i++){
                    //Ti.API.info("---");
                    var _obj = _array[i];
                    _obj.title = _obj.name;
                }
                Ti.App.Properties.setList("physical_forms", _array);
            },
            onerror : function(e) {
                si.app.log.error(_message + 'error ' + "[" + e.message + "]");
                //_args.onerror(e);
            }
        });
    };

    si.app.box_types = function(){
        return Ti.App.Properties.getList("box_types", null);
    };
    si.app.getBoxTypes = function(){
        Ti.API.info('si.app.getBoxTypes');
        var _message = 'box_types getting...';
        si.model.medusa.getWithAuth({
            path : '/box_types.json',
            username : Ti.App.Properties.getString('username'),
            password : Ti.App.Properties.getString('password'),
            onsuccess : function(_array) {
                si.app.log.info(_message + 'ok');
                for(var i=0; i<_array.length; i++){
                    //Ti.API.info("---");
                    var _obj = _array[i];
                    _obj.title = _obj.name;
                }
                Ti.App.Properties.setList("box_types", _array);
            },
            onerror : function(e) {
                si.app.log.error(_message + 'error ' + "[" + e.message + "]");
                //_args.onerror(e);
            }
        });
    };

    si.app.printer_names = function(){
        return Ti.App.Properties.getList("printer_names", null);
    };
    si.app.getPrinterNames = function(){
        Ti.API.info('si.app.getPrinterNames');

        var client = Ti.Network.createHTTPClient();
        client.onload = function(){
            var data = [];
            var printers = JSON.parse(this.responseText);
            for(var i=0; i<printers.length; i++){
               var title = printers[i].nickname;
               if (title == null || title == '') {
                   title = printers[i].name;
               }
               data.push({"title":title,"id":i,"name":printers[i].name,"nickname":printers[i].nickname});
            }
            Ti.App.Properties.setList("printer_names", data);
        }
        client.onerror = function(){
            Ti.App.Properties.setList("printer_names", null);
        }

        var printServer = Ti.App.Properties.getString('printServer');
        var url = printServer;
        if (printServer.match(/^\w+:\/\//) == null) {
            url = 'http://' + url;
        }

        if (printServer.match(/\/$/) == null) {
            url = url + '/';
        }
        url += 'printers.json';
        Ti.API.info('url:' + url);

        client.open('GET', url);
        client.send();
    };

    si.app.template_names = function(){
        return Ti.App.Properties.getList("template_names", null);
    };
    si.app.getTemplateNames = function(){
        Ti.API.info('si.app.getTemplateNames');

        var client = Ti.Network.createHTTPClient();
        client.onload = function(){
            var data = [];
            var templates = JSON.parse(this.responseText);
            for(var i=0; i<templates.length; i++){
               data.push({"title":templates[i].name,"id":i});
            }
            Ti.App.Properties.setList("template_names", data);
        }
        client.onerror = function(){
            Ti.App.Properties.setList("template_names", null);
        }

        var printServer = Ti.App.Properties.getString('printServer');
        var url = printServer;
        if (printServer.match(/^\w+:\/\//) == null) {
            url = 'http://' + url;
        }

        if (printServer.match(/\/$/) == null) {
            url = url + '/';
        }
        url += 'templates.json';
        Ti.API.info('url:' + url);

        client.open('GET', url);
        client.send();
    };

    var empty = {};
    function mixin(/*Object*/target, /*Object*/source) {
        var name, s, i;
        for (name in source) {
            s = source[name];
            if (!( name in target) || (target[name] !== s && (!( name in empty) || empty[name] !== s))) {
                target[name] = s;
            }
        }
        return target;
        // Object
    };
    si.mixin = function(/*Object*/obj, /*Object...*/props) {
        if (!obj) {
            obj = {};
        }
        for (var i = 1, l = arguments.length; i < l; i++) {
            mixin(obj, arguments[i]);
        }
        return obj;
        // Object
    };

    si.combine = function(/*Object*/obj, /*Object...*/props) {
        var newObj = {};
        for (var i = 0, l = arguments.length; i < l; i++) {
            mixin(newObj, arguments[i]);
        }
        return newObj;
    };

    var locale = Ti.Platform.locale;
    var osname = Ti.Platform.osname;

    /*
     Branching logic based on locale
     */
    si.locale = function(/*Object*/map) {
        var def = map.def || null;
        //default function or value
        if (map[locale]) {
            if ( typeof map[locale] == 'function') {
                return map[locale]();
            } else {
                return map[locale];
            }
        } else {
            if ( typeof def == 'function') {
                return def();
            } else {
                return def;
            }
        }
    };

    /*
     Branching logic based on OS
     */
    si.os = function(/*Object*/map) {
        var def = map.def || null;
        //default function or value
        if ( typeof map[osname] != 'undefined') {
            if ( typeof map[osname] == 'function') {
                return map[osname]();
            } else {
                return map[osname];
            }
        } else {
            if ( typeof def == 'function') {
                return def();
            } else {
                return def;
            }
        }
    };

    si.serverURL = function(){
        var _server = Ti.App.Properties.getString('server');
        var url = _server;
        if (_server.match(/^\w+:\/\//) == null) {
            url = 'http://' + url;
        }

        if (_server.match(/\/$/) == null) {
            url = url + '/';
        }
        return url;
    }


    si.imageURL = function(_path) {
        var server_url = si.serverURL();
        var url = si.parseURL(server_url);
        var hostname_with_port = url.protocol + '//' + url.hostname;
        if (url.port){
            hostname_with_port += ':' + url.port;
        }
        return hostname_with_port + _path;
    };

    si.authURL = function(_path) {
        var server_url = si.serverURL();
        var username = Ti.App.Properties.getString('username');
        var password = Ti.App.Properties.getString('password');
        var url = si.parseURL(server_url);
        var hostname_with_port = url.protocol + '//' + username + ':' + password + '@' + url.hostname;
        if (url.port){
            hostname_with_port += ':' + url.port;
        }
        return hostname_with_port + _path;
    };

    si.parseURL = function (href) {
        var match = href.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)(\/[^?#]*)(\?[^#]*|)(#.*|)$/);
        return match && {
            protocol: match[1],
            host: match[2],
            hostname: match[3],
            port: match[4],
            pathname: match[5],
            search: match[6],
            hash: match[7]
        }
    };
    //Initialize Sound
    si.sound_created = Ti.Media.createSound({
        url : '/etc/2.mp3'
    });
    si.sound_label = Ti.Media.createSound({
        url : '/etc/5.mp3'
    });
    si.sound_error = Ti.Media.createSound({
        url : '/etc/7.mp3'
    });
    si.sound_newmail = Ti.Media.createSound({
    //    url : '/etc/newmail.wav'
        url : '/etc/4.mp3'
    });
    si.sound_mailerror = Ti.Media.createSound({
    //    url : '/etc/mailerror.wav'
        url : '/etc/1.mp3'
    });
    si.sound_reminder = Ti.Media.createSound({
        url : '/etc/reminder.wav'
    });
    si.sound_attention = Ti.Media.createSound({
        url : '/etc/attention.wav'
    });
    si.sound_cricket = Ti.Media.createSound({
        url : '/etc/cricket.wav'
    });
import {config} from './config/config'
si.config = config;
import {nfc} from './nfc'
si.nfc = nfc;
import { sqlite } from './sqlite'
si.sqlite = sqlite;
export {si};