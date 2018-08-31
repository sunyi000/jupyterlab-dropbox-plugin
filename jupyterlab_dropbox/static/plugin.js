// var jupyterlab_dropbox =require('./index');

var mainMenu = require('@jupyterlab/mainmenu');
var fileBrowser = require('@jupyterlab/filebrowser');
var menu= require('@phosphor/widgets');
var cmd=require('@phosphor/commands');
var coreutils=require('@jupyterlab/coreutils');
var apputils=require('@jupyterlab/apputils');



var load=require('little-loader');
load("https://www.dropbox.com/static/api/2/dropins.js", {
	// setup: {"data-api-key":"xnthqk084hoxoc0"},
	callback:function(){
		Dropbox.appKey="xnthqk084hoxoc0";
		console.log(Dropbox);
	},
	
},this);
import ImportService  from './import_service.js';
//var dropbox=require('https://www.dropbox.com/static/api/2/dropins.js');
// var base = require('@jupyter-widgets/base');

//import DropBox  from './dropbox.js';

var CommandIDs;
(function (CommandIDs) {
    CommandIDs.saver = 'dropbox-saver';
    CommandIDs.chooser = 'dropbox-chooser';
})(CommandIDs || (CommandIDs = {}));

export default [{
    id: 'jupyterlab_dropbox',
    autoStart: true,
    requires: [mainMenu.IMainMenu, fileBrowser.IFileBrowserFactory],
    activate: function(app,topmenu,browserFactory) {

    	const {commands}=app;
    	const u= coreutils.PageConfig;
    	// console.log(u.getBaseUrl());

    	console.log(app);

       
       commands.addCommand(CommandIDs.chooser, {
      		label:'Chooser',
      		caption:'Chooser',
      		execute: ()=>{
      			    var dropbox_options = {
				      success: function (files) {
						var links = new Array();
                    	for (const file of files) {
                        	console.log(file.link);
                        	links.push(file.link);
                    	}
				      },
				      cancel: function cancel() {

				      },
				      linkType: 'direct',
				      multiselect: true 
				    };
				    Dropbox.choose(dropbox_options);
      		}



       });

       createDropboxMenu(app,topmenu,commands);

      console.log('JupyterLab extension jupyterlab_dropbox is activated!');
      console.log(app.commands);

    }


}];

    function createDropboxMenu(app,topmenu,commands){
       var m=new menu.Menu({commands});

       m.title.label='File Transfer';
	   [
          CommandIDs.saver,
          CommandIDs.chooser,
        ].forEach(command => {
        	m.addItem({ command });
    	});
      
 
      topmenu.addMenu(m,{rank:2000});

    }