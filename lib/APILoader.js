var DEFAULT_CONFIG = {
  v: '1.4.0',
  hostAndPath: 'webapi.amap.com/maps',
  key: 'f97efc35164149d0c0f299e7a8adb3d2',
  callback: '__amap_init_callback',
  useAMapUI: false
};

var mainPromise = null;
var amapuiPromise = null;
var amapuiInited = false;

var APILoader = function () {
  function APILoader(_ref) {
    var key = _ref.key,
        useAMapUI = _ref.useAMapUI,
        version = _ref.version,
        protocol = _ref.protocol;
    babelHelpers.classCallCheck(this, APILoader);

    this.config = babelHelpers.extends({}, DEFAULT_CONFIG, { useAMapUI: useAMapUI, protocol: protocol });
    if (typeof window !== 'undefined') {
      if (key) {
        this.config.key = key;
      } else if ('amapkey' in window) {
        this.config.key = window.amapkey;
      }
    }
    if (version) {
      this.config.v = version;
    }
    this.protocol = protocol || window.location.protocol;
    if (this.protocol.indexOf(':') === -1) {
      this.protocol += ':';
    }
  }

  babelHelpers.createClass(APILoader, [{
    key: 'getScriptSrc',
    value: function getScriptSrc(cfg) {
      return this.protocol + '//' + cfg.hostAndPath + '?v=' + cfg.v + '&key=' + cfg.key + '&callback=' + cfg.callback;
    }
  }, {
    key: 'buildScriptTag',
    value: function buildScriptTag(src) {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.defer = true;
      script.src = src;
      return script;
    }
  }, {
    key: 'getAmapuiPromise',
    value: function getAmapuiPromise() {
      var script = this.buildScriptTag(this.protocol + '//webapi.amap.com/ui/1.0/main-async.js');
      var p = new Promise(function (resolve) {
        script.onload = function () {
          resolve();
        };
      });
      document.body.appendChild(script);
      return p;
    }
  }, {
    key: 'getMainPromise',
    value: function getMainPromise() {
      var _this = this;

      var script = this.buildScriptTag(this.getScriptSrc(this.config));
      var p = new Promise(function (resolve) {
        window[_this.config.callback] = function () {
          resolve();
          delete window[_this.config.callback];
        };
      });
      document.body.appendChild(script);
      return p;
    }
  }, {
    key: 'load',
    value: function load() {
      if (typeof window === 'undefined') {
        return null;
      }
      var useAMapUI = this.config.useAMapUI;

      mainPromise = mainPromise || this.getMainPromise();
      if (useAMapUI) {
        amapuiPromise = amapuiPromise || this.getAmapuiPromise();
      }
      return new Promise(function (resolve) {
        mainPromise.then(function () {
          if (useAMapUI && amapuiPromise) {
            amapuiPromise.then(function () {
              if (window.initAMapUI && !amapuiInited) {
                window.initAMapUI();
                if (typeof useAMapUI === 'function') {
                  useAMapUI();
                }
                amapuiInited = true;
              }
              resolve();
            });
          } else {
            resolve();
          }
        });
      });
    }
  }]);
  return APILoader;
}();

export default APILoader;