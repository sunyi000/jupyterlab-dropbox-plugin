var coreutils=require('@jupyterlab/coreutils');
var services=require('@jupyterlab/services');

const pgc= coreutils.PageConfig;
const defaultSettings=services.ServerConnection.makeSettings();

    var TempUrlService = function(options) {
        options = options || {}
        // notebook server prefix
        this.base_url = pgc.getBaseUrl() || ""
    }

    TempUrlService.prototype.api_url = function(...params) {
        return coreutils.URLExt.join(
            this.base_url, 
            'api/tmpurl',
             coreutils.URLExt.encodeParts(...params)  
        );
    }


    TempUrlService.prototype.post = function(path, files, options) {

        var init ={
            method : "POST",
            mode: "cors",
            cache : "no-cache",
            credentials: "same-origin",
            headers:{
                 "Content-Type": "application/json",
            },
            redirect: "follow",
            referrer: "no-referrer",           
            body: JSON.stringify(files)
        };
        var url = this.api_url(path)

        return services.ServerConnection.makeRequest(url,init,defaultSettings)

    }

        export default {
        'TempUrlService': TempUrlService
    }