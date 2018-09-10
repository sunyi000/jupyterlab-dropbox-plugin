// var jupyterlab_dropbox =require('./index');

var mainMenu = require('@jupyterlab/mainmenu');
var fileBrowser = require('@jupyterlab/filebrowser');
var menu= require('@phosphor/widgets');
var cmd=require('@phosphor/commands');
var coreutils=require('@jupyterlab/coreutils');
var apputils=require('@jupyterlab/apputils');
var jupyterservice=require('@jupyterlab/services');

var import_service=require('./import_service.js').default;
var tempurl_service=require('./tempurl_service.js').default;


var load=require('little-loader');
load("https://www.dropbox.com/static/api/2/dropins.js", {
	// setup: {"data-api-key":"xnthqk084hoxoc0"},
	callback:function(){
		Dropbox.appKey="xnthqk084hoxoc0";
		console.log(Dropbox);
	},
},this);

//load("http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js");


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
      const browserModel= browserFactory.tracker.currentWidget.model;
      const browserWidget=browserFactory.tracker.currentWidget;

      // const cfg=jupyterservice.ConfigSection;

    	console.log(app);

      console.log(browserFactory.tracker.currentWidget.model.path);

     // var cfg=new jupyterservice.ConfigSection('fetch',common_options);
       
       commands.addCommand(CommandIDs.chooser, {
      		label:'Download from Dropbox',
      		caption:'Chooser',
      		execute: ()=>{
                var path=browserModel.path;
      			    var dropbox_options = {
        				      success: function (files) {
                        var imports=new import_service.ImportService();
                        for (const file of files) {
                             	//console.log(file);
                              file['url'] = file['link']
                              delete file['link']
                        }

                        return imports.post(path, files);
        				      },
        				      cancel: function cancel() {

        				      },
        				      linkType: 'direct',
        				      multiselect: true 
				          };
				        Dropbox.choose(dropbox_options);
      		}

       });

       commands.addCommand(CommandIDs.saver, {
          label:'Upload to Dropbox',
          caption:'Saver',
          execute: ()=>{
            var path=browserModel.path;
            dropboxSaver(browserWidget,path);
          }

       });

      var saver_span=document.createElement('span');
      saver_span.setAttribute('class','dropin-btn-status');

      var saver_btn=document.createElement('a');
      saver_btn.setAttribute('href','#');
      saver_btn.setAttribute('class','dropbox-dropin-btn dropbox-dropin-default');
      saver_btn.append(saver_span);
      saver_btn.append("Save to Dropbox");
 
      saver_btn.style.whiteSpace="nowrap";
      saver_btn.style.display="hidden";

      saver_btn.addEventListener('click',(event)=>{
          event.preventDefault();
          dropboxSaver(browserWidget,browserModel.path);

      });

      //adding dropbox menu with chooser command to main menubar
      var dropboxMenuBar=createDropboxMenu(commands);
      topmenu.addMenu(dropboxMenuBar,{rank:100});


      //create saver context menu
      var saverContextMenu=createDropboxContextMenu(commands);

      //right click to show saver context menu
      let node=browserWidget.node.getElementsByClassName('jp-DirListing-content')[0];
      node.addEventListener('contextmenu',(event)=>{
            event.preventDefault();
            const model=browserWidget.modelForClick(event);

            saverContextMenu.open(event.clientX,event.clientY);
            //document.getElementsByClassName("p-Widget p-Menu")[1].style.width='206px';
      });

      // left click to show saver button
      node.addEventListener('click',(event)=>{
            const model=browserWidget.modelForClick(event);
            if(model.type=="file"|| model.type=="notebook")
            {
               document.getElementsByClassName('jp-FileBrowser-toolbar')[0].append(saver_btn);
               saver_btn.style.display="inline-block";
               
            }
            else
            {
              saver_btn.style.display="hidden";

            }

      });


      // console.log('JupyterLab extension jupyterlab_dropbox is activated!');
      // console.log(app.commands);

    }


}];

    function dropboxSaver(browserWidget,path)
    {
      var tempurl=new tempurl_service.TempUrlService();
      var files=[];
      var selected=browserWidget.selectedItems();
      var file=selected.next();

      while(file!=null){
        if(file.type=="file"|| file.type=="notebook")
        {
            files.push(file.name);
        }
        file=selected.next();
      }

      if(files.length>0){
        //console.log(files);
        tempurl.post(path,files)
        .then( function(response){
          return response.json();
        })
        .then(function(temp_file_urls){
          console.log(temp_file_urls);
          var dropbox_files=[];
          temp_file_urls.forEach(function(temp_file,idx){
              dropbox_files.push(
              {
                url: temp_file.url,
                filename: temp_file.name
              })
          })
          
          var saver_options={
              files: dropbox_files,
              success: function(){

              },
              progress: function(progress){

              },
              cancel: function(){
                  console.log("upload cancelled");
              },
              error: function(error){
                  console.log(error);
              }

          };
          Dropbox.save(saver_options);
        })
        .catch(function(error){
            console.log(error);
        })

      }else{
        alert("Please select files before upload. Folders are not supported");
      }
                
    }

    function createDropboxMenu(commands){
      var saverMainMenu=new menu.Menu({commands});

      saverMainMenu.title.label='Dropbox';

      //saverMainMenu.addItem({command: CommandIDs.chooser});

	    [
          CommandIDs.saver,
          CommandIDs.chooser,
      ].forEach(command => {
        	saverMainMenu.addItem({ command });          
    	});      
 
      //topmenu.addMenu(saverMainMenu,{rank:2000});

      return saverMainMenu;

    }

    function createDropboxContextMenu(commands){
      var saverContextMenu=new menu.Menu({commands});
      [
          CommandIDs.saver,
        ].forEach(command => {
          saverContextMenu.addItem({ command });          
      });      

      return saverContextMenu;

      // let node=widget.node.getElementsByClassName('jp-DirListing-content')[0];
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