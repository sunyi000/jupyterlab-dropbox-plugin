"use strict";

var jupyterlab_dropbox = require('./index');

var base = require('@jupyter-widgets/base');

var mainMenu = require('@jupyterlab/mainmenu');

var fileBrowser = require('@jupyterlab/filebrowser');

var menu = require('@phosphor/widgets');

module.exports = [{
  id: 'jupyterlab_dropbox',
  autoStart: true,
  requires: [mainMenu.IMainMenu, filebrowser.IFileBrowserFactory],
  activate: function activate(app) {
    console.log('JupyterLab extension jupyterlab_dropbox is activated!');
    console.log(app.commands);
  }
}];