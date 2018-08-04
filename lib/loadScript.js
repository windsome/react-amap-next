'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _indexOf = require('lodash/indexOf');

var _indexOf2 = babelHelpers.interopRequireDefault(_indexOf);

var gFileList = []; //list of files already added
/**
 * see: http://www.javascriptkit.com/javatutors/loadjavascriptcss.shtml
 */
var loadjscssfile = function loadjscssfile(filename, filetype) {
  return new Promise(function (resolve, reject) {
    if ((0, _indexOf2.default)(gFileList, filename) >= 0) {
      console.log('loadScript: already load! ' + filename);
      resolve(true);
      return;
    }
    var fileref = null;
    if (filetype == 'js') {
      //if filename is a external JavaScript file
      fileref = document.createElement('script');
      fileref.setAttribute('type', 'text/javascript');
      fileref.setAttribute('src', filename);
    } else if (filetype == 'css') {
      //if filename is an external CSS file
      fileref = document.createElement('link');
      fileref.setAttribute('rel', 'stylesheet');
      fileref.setAttribute('type', 'text/css');
      fileref.setAttribute('href', filename);
    } else {
      reject(new Error('not support![' + filetype + '] ' + filename));
    }
    if (typeof fileref == 'undefined' || fileref == null) {
      reject(new Error('error! fileref=' + fileref));
    }

    fileref.onload = function (res) {
      console.log('loadScript: onload:', res);
      gFileList.push(filename); //List of files added in the form "[filename1],[filename2],etc"
      resolve(true);
    };
    fileref.onerror = function (error) {
      console.log('loadScript: onerror:', error);
      reject(new Error('load fail! ' + filename));
    };
    fileref.onabort = function (error) {
      console.log('loadScript: onerror:', error);
      reject(new Error('load abort! ' + filename));
    };
    document.getElementsByTagName('head')[0].appendChild(fileref);
  });
};

exports.default = loadjscssfile;