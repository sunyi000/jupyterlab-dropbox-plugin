"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _import_service = _interopRequireDefault(require("./import_service.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// var jupyterlab_dropbox =require('./index');
var mainMenu = require('@jupyterlab/mainmenu');

var fileBrowser = require('@jupyterlab/filebrowser');

var menu = require('@phosphor/widgets');

var cmd = require('@phosphor/commands');

var coreutils = require('@jupyterlab/coreutils');

var apputils = require('@jupyterlab/apputils');

var load = require('little-loader');

load("https://www.dropbox.com/static/api/2/dropins.js", {
  // setup: {"data-api-key":"xnthqk084hoxoc0"},
  callback: function callback() {
    Dropbox.appKey = "xnthqk084hoxoc0";
    console.log(Dropbox);
  }
}, void 0);
//var dropbox=require('https://www.dropbox.com/static/api/2/dropins.js');
// var base = require('@jupyter-widgets/base');
//import DropBox  from './dropbox.js';
var CommandIDs;

(function (CommandIDs) {
  CommandIDs.saver = 'dropbox-saver';
  CommandIDs.chooser = 'dropbox-chooser';
})(CommandIDs || (CommandIDs = {}));

var _default = [{
  id: 'jupyterlab_dropbox',
  autoStart: true,
  requires: [mainMenu.IMainMenu, fileBrowser.IFileBrowserFactory],
  activate: function activate(app, topmenu, browserFactory) {
    var commands = app.commands;
    var u = coreutils.PageConfig; // console.log(u.getBaseUrl());

    console.log(app);
    commands.addCommand(CommandIDs.chooser, {
      label: 'Chooser',
      caption: 'Chooser',
      execute: function execute() {
        var dropbox_options = {
          success: function success(files) {
            var links = new Array();
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = files[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var file = _step.value;
                console.log(file.link);
                links.push(file.link);
              }
            } catch (err) {
              _didIteratorError = true;
              _iteratorError = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion && _iterator.return != null) {
                  _iterator.return();
                }
              } finally {
                if (_didIteratorError) {
                  throw _iteratorError;
                }
              }
            }
          },
          cancel: function cancel() {},
          linkType: 'direct',
          multiselect: true
        };
        Dropbox.choose(dropbox_options);
      }
    });
    createDropboxMenu(app, topmenu, commands);
    console.log('JupyterLab extension jupyterlab_dropbox is activated!');
    console.log(app.commands);
  }
}];
exports.default = _default;

function createDropboxMenu(app, topmenu, commands) {
  var m = new menu.Menu({
    commands: commands
  });
  m.title.label = 'File Transfer';
  [CommandIDs.saver, CommandIDs.chooser].forEach(function (command) {
    m.addItem({
      command: command
    });
  });
  topmenu.addMenu(m, {
    rank: 2000
  });
}