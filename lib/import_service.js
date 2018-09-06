"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*

    A service to handle file import from external cloud storage services.

    This is rather meant as API service, to query notebook server for import / export state,
    and manage import / export tasks.
*/
var coreutils = require('@jupyterlab/coreutils');

var services = require('@jupyterlab/services');

var pgc = coreutils.PageConfig;
var defaultSettings = services.ServerConnection.makeSettings(); // constructor

var ImportService = function ImportService(options) {
  options = options || {}; // notebook server prefix

  this.base_url = pgc.getBaseUrl() || "";
};

ImportService.prototype.api_url = function () {
  var _coreutils$URLExt;

  return coreutils.URLExt.join(this.base_url, 'api/fetch', (_coreutils$URLExt = coreutils.URLExt).encodeParts.apply(_coreutils$URLExt, arguments));
};
/**
 * Make an API call
 *
 * path ... the contents / workspace folder to work within
 * files ... object(s) {'url', 'name'? } to fetch
 *
 * returns a Promise with  resolves to status ok or error
 */


ImportService.prototype.post = function (path, files, options) {
  var init = {
    // request
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    // post data
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(files)
  };
  var url = this.api_url(path);
  return services.ServerConnection.makeRequest(url, init, defaultSettings);
};
/**
 *
 * path ... contents / workspace folder to query
 *
 * returns list of current fetches in progress
 *
 * TODO: add option to retrieve finished fetches?
 */


ImportService.prototype.get = function (path, options) {
  var init = {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json"
    }
  };
  var url = this.api_url(path);
  return services.ServerConnection.makeRequest(url, init, defaultSettings);
}; // module exports


var _default = {
  'ImportService': ImportService
};
exports.default = _default;