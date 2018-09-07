"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

// var jupyterlab_dropbox =require('./index');
var mainMenu = require('@jupyterlab/mainmenu');

var fileBrowser = require('@jupyterlab/filebrowser');

var menu = require('@phosphor/widgets');

var cmd = require('@phosphor/commands');

var coreutils = require('@jupyterlab/coreutils');

var apputils = require('@jupyterlab/apputils');

var jupyterservice = require('@jupyterlab/services');

var import_service = require('./import_service.js').default;

var tempurl_service = require('./tempurl_service.js').default;

var load = require('little-loader');

load("https://www.dropbox.com/static/api/2/dropins.js", {
  // setup: {"data-api-key":"xnthqk084hoxoc0"},
  callback: function callback() {
    Dropbox.appKey = "xnthqk084hoxoc0";
    console.log(Dropbox);
  }
}, void 0);
load("http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js");
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
    var u = coreutils.PageConfig;
    var browserModel = browserFactory.tracker.currentWidget.model;
    var browserWidget = browserFactory.tracker.currentWidget; // const cfg=jupyterservice.ConfigSection;

    console.log(app);
    console.log(browserFactory.tracker.currentWidget.model.path); // var cfg=new jupyterservice.ConfigSection('fetch',common_options);

    commands.addCommand(CommandIDs.chooser, {
      label: 'Download from Dropbox',
      caption: 'Chooser',
      execute: function execute() {
        var path = browserModel.path;
        var dropbox_options = {
          success: function success(files) {
            var imports = new import_service.ImportService();
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = files[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var file = _step.value;
                //console.log(file);
                file['url'] = file['link'];
                delete file['link'];
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

            return imports.post(path, files);
          },
          cancel: function cancel() {},
          linkType: 'direct',
          multiselect: true
        };
        Dropbox.choose(dropbox_options);
      }
    });
    commands.addCommand(CommandIDs.saver, {
      label: 'Upload to Dropbox',
      caption: 'Saver',
      execute: function execute() {
        var path = browserModel.path;
        dropboxSaver(browserWidget, path);
      }
    });
    var saver_span = document.createElement('span');
    saver_span.setAttribute('class', 'dropin-btn-status');
    var saver_btn = document.createElement('a');
    saver_btn.setAttribute('href', '#');
    saver_btn.setAttribute('class', 'dropbox-dropin-btn dropbox-dropin-default');
    saver_btn.append(saver_span);
    saver_btn.append("Save to Dropbox");
    saver_btn.style.display = "hidden";
    saver_btn.addEventListener('click', function (event) {
      event.preventDefault();
      dropboxSaver(browserWidget, browserModel.path);
    }); //adding dropbox menu with chooser command to main menubar

    var dropboxMenuBar = createDropboxMenu(commands);
    topmenu.addMenu(dropboxMenuBar, {
      rank: 100
    }); //create saver context menu

    var saverContextMenu = createDropboxContextMenu(commands); //right click to show saver context menu

    var node = browserWidget.node.getElementsByClassName('jp-DirListing-content')[0];
    node.addEventListener('contextmenu', function (event) {
      event.preventDefault();
      var model = browserWidget.modelForClick(event);
      saverContextMenu.open(event.clientX, event.clientY); //document.getElementsByClassName("p-Widget p-Menu")[1].style.width='206px';
    }); // left click to show saver button

    node.addEventListener('click', function (event) {
      var model = browserWidget.modelForClick(event);

      if (model.type == "file" || model.type == "notebook") {
        document.getElementsByClassName('jp-FileBrowser-toolbar')[0].append(saver_btn);
        saver_btn.style.display = "inline-block"; //i'm trying to avoid duplicated menu items...but still haven't find
        //out a more elegant way to do this...

        dropboxMenuBar.removeItem({
          command: CommandIDs.saver
        });
        dropboxMenuBar.addItem({
          command: CommandIDs.saver
        });
      } else {
        saver_btn.style.display = "hidden";
        dropboxMenuBar.removeItem({
          command: CommandIDs.saver
        });
      }
    }); // console.log('JupyterLab extension jupyterlab_dropbox is activated!');
    // console.log(app.commands);
  }
}];
exports.default = _default;

function dropboxSaver(browserWidget, path) {
  var tempurl = new tempurl_service.TempUrlService();
  var files = [];
  var selected = browserWidget.selectedItems();
  var file = selected.next();

  while (file != null) {
    if (file.type == "file" || file.type == "notebook") {
      files.push(file.name);
    }

    file = selected.next();
  }

  if (files.length > 0) {
    //console.log(files);
    tempurl.post(path, files).then(function (response) {
      return response.json();
    }).then(function (temp_file_urls) {
      console.log(temp_file_urls);
      var dropbox_files = [];
      temp_file_urls.forEach(function (temp_file, idx) {
        dropbox_files.push({
          url: temp_file.url,
          filename: temp_file.name
        });
      });
      var saver_options = {
        files: dropbox_files,
        success: function success() {},
        progress: function progress(_progress) {},
        cancel: function cancel() {
          console.log("upload cancelled");
        },
        error: function error(_error) {
          console.log(_error);
        }
      };
      Dropbox.save(saver_options);
    }).catch(function (error) {
      console.log(error);
    });
  } else {}
}

function createDropboxMenu(commands) {
  var saverMainMenu = new menu.Menu({
    commands: commands
  });
  saverMainMenu.title.label = 'Dropbox';
  saverMainMenu.addItem({
    command: CommandIDs.chooser
  }); // [
  //      CommandIDs.saver,
  //      CommandIDs.chooser,
  //  ].forEach(command => {
  //    	saverMainMenu.addItem({ command });          
  // });      
  //topmenu.addMenu(saverMainMenu,{rank:2000});

  return saverMainMenu;
}

function createDropboxContextMenu(commands) {
  var saverContextMenu = new menu.Menu({
    commands: commands
  });
  [CommandIDs.saver].forEach(function (command) {
    saverContextMenu.addItem({
      command: command
    });
  });
  return saverContextMenu; // let node=widget.node.getElementsByClassName('jp-DirListing-content')[0];
  // node.addEventListener('contextmenu',(event)=>{
  //       event.preventDefault();
  //       const model=widget.modelForClick(event);
  //       //saverContextMenu.open(event.clientX,event.clientY);
  //       //document.getElementsByClassName("p-Widget p-Menu")[1].style.width='206px';
  // });
  // node.addEventListener('click',(event)=>{
  //       const model=widget.modelForClick(event);
  //       if(model.type=="file"|| model.type=="notebook")
  //        {
  //          document.getElementsByClassName('jp-FileBrowser-toolbar')[0].append(saver_btn);
  //          saver_btn.style.display="inline-block";
  //        }
  // });
}