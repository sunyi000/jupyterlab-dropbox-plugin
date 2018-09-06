"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var coreutils = require('@jupyterlab/coreutils');

var services = require('@jupyterlab/services');

var pgc = coreutils.PageConfig;
var defaultSettings = services.ServerConnection.makeSettings();

var TempUrlService = function TempUrlService(options) {
  options = options || {}; // notebook server prefix

  this.base_url = pgc.getBaseUrl() || "";
};

TempUrlService.prototype.api_url = function () {
  var _coreutils$URLExt;

  return coreutils.URLExt.join(this.base_url, 'api/tmpurl', (_coreutils$URLExt = coreutils.URLExt).encodeParts.apply(_coreutils$URLExt, arguments));
};

TempUrlService.prototype.post = function (path, files, options) {
  var init = {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json"
    },
    redirect: "follow",
    referrer: "no-referrer",
    body: JSON.stringify(files)
  };
  var url = this.api_url(path);
  return services.ServerConnection.makeRequest(url, init, defaultSettings);
};

var _default = {
  'TempUrlService': TempUrlService
};
exports.default = _default;