var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import forOwn from 'lodash/forOwn';
import isEqual from 'lodash/isEqual';
import isNil from 'lodash/isNil';
import isEmpty from 'lodash/isEmpty';
//import loadjscssfile from './loadScript';
import APILoader from './APILoader';

//const xdebug = console.log;
var xdebug = function xdebug() {};

export var loadApi = function loadApi() {
  var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '0325e3d6d69cd56de4980b4f28906fd8';

  return new APILoader({
    key: key,
    useAMapUI: true,
    version: '1.4.7',
    protocol: 'https'
  }).load();
};
export var loadMap = function loadMap(key) {
  return new Promise(function (resolve, reject) {
    if (window.AMap) {
      resolve(window.AMap);
    }
    loadApi(key).then(function (ret) {
      if (window.AMap) {
        resolve(window.AMap);
      } else {
        reject(new Error('window.AMap不存在!'));
      }
    }).catch(function (error) {
      reject(new Error('加载地图错误!' + error.message));
    });
  });
};

// export const loadApiV1 = async (key = '0325e3d6d69cd56de4980b4f28906fd8') => {
//   return await loadjscssfile(
//     'https://webapi.amap.com/maps?v=1.4.7&key=' + key,
//     'js'
//   );
// };

// export const loadMapV1 = key => {
//   return new Promise((resolve, reject) => {
//     if (window.AMap) {
//       resolve(window.AMap);
//     }
//     loadApi(key)
//       .then(ret => {
//         if (window.AMap) {
//           resolve(window.AMap);
//         } else {
//           reject(new Error('window.AMap不存在!'));
//         }
//       })
//       .catch(error => {
//         reject(new Error('加载地图错误!' + error.message));
//       });
//   });
// };

/**
 * [加载插件](https://lbs.amap.com/api/javascript-api/guide/abc/plugins)
 * 加载完成后,可以调用:
 *  var toolbar = new window.AMap.ToolBar();
 *  map.addControl(toolbar);
 * @param {string} name 插件名或插件数组,如:window.AMap.ToolBar,['AMap.ToolBar','AMap.Driving']
 */
export var loadPlugin = function loadPlugin(name) {
  return new Promise(function (resolve, reject) {
    if (window.AMap) {
      window.AMap.plugin(name, function () {
        resolve(true);
      });
      //是否有加载失败的情况,如果加载失败,怎么reject?
    } else {
      reject(new Error('地图还未加载!'));
    }
  });
};

////////////////////////////////////////////////////////////
// 工具方法
////////////////////////////////////////////////////////////
var commonUpdate = function commonUpdate(entity, newOptions, newEvents, oldOptions, oldEvents, operators) {
  var __func__ = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 'commonUpdate';

  // const __func__ = 'commonUpdate';
  if (!entity) {
    xdebug(__func__, 'fail! no entity!');
    return false;
  }

  // 找到改变的属性集合,包含添加,删除及修改的属性,删除的置为null
  var props = {};
  if (newOptions != oldOptions) {
    oldOptions && forOwn(oldOptions, function (value, key) {
      // 找到改变的旧属性,用新属性取代
      var newValue = newOptions && newOptions[key];
      if (!isEqual(newValue, value)) {
        if (!(isNil(newValue) && isNil(value))) props[key] = newValue;
      }
    });
    newOptions && forOwn(newOptions, function (value, key) {
      // 找到新加的属性,添加进去
      var oldValue = oldOptions && oldOptions[key];
      if (isNil(oldValue) && !isNil(value)) {
        props[key] = value;
      }
    });
  }
  // 找到改变的事件集合,包含添加,删除及修改的事件处理函数,删除的置为null
  var events = {};
  if (newEvents != oldEvents) {
    oldEvents && forOwn(oldEvents, function (value, key) {
      // 找到改变的旧属性,用新属性取代
      var newValue = newEvents && newEvents[key];
      if (!isEqual(newValue, value)) {
        if (!(isNil(newValue) && isNil(value))) events[key] = newValue;
      }
    });
    newEvents && forOwn(newEvents, function (value, key) {
      // 找到新加的属性,添加进去
      var oldValue = oldEvents && oldEvents[key];
      if (isNil(oldValue) && !isNil(value)) {
        events[key] = value;
      }
    });
  }

  // let operators = {
  //   map: v => entity.setMap(v),
  //   position: v => entity.setPosition(v),
  //   offset: v => entity.setOffset(v),
  //   icon: v => entity.setIcon(v),
  //   content: v => entity.setContent(v),
  //   topWhenClick: null,
  //   bubble: null,
  //   draggable: v => entity.setDraggable(v),
  //   raiseOnDrag: null,
  //   cursor: v => entity.setCursor(v),
  //   visible: null,
  //   zIndex: v => entity.setzIndex(v),
  //   angle: v => entity.setAngle(v),
  //   autoRotation: null,
  //   animation: v => entity.setAnimation(v),
  //   shadow: v => entity.setShadow(v),
  //   title: v => entity.setTitle(v),
  //   clickable: v => entity.setClickable(v),
  //   shape: v => entity.setShape(v),
  //   extData: v => entity.setExtData(v),
  //   label: v => entity.setLabel(v)
  // };

  forOwn(props, function (value, key) {
    if (value) {
      var func = operators[key];
      if (func) {
        func(value);
      } else {
        // ignore properties can not set.
        xdebug(__func__, 'warning! no setter! can not update ' + key);
      }
    } else {
      // key removed, not support!
      xdebug(__func__, 'warning! remove prop not support! key=' + key);
    }
  });
  forOwn(events, function (value, key) {
    var oldFunc = oldEvents && oldEvents[key];
    if (oldFunc) {
      entity.off(key, oldFunc);
    }
    if (value) {
      entity.on(key, value);
    }
  });
  if (!isEmpty(props) || !isEmpty(events)) {
    xdebug(__func__, 'update:', props, events
    // newOptions,
    // newEvents,
    // oldOptions,
    // oldEvents
    );
  }
  return true;
};

////////////////////////////////////////////////////////////
// Map
////////////////////////////////////////////////////////////
export var createMap = function createMap(dom, options, events) {
  var __func__ = 'createMap';
  if (!window.AMap) {
    xdebug(__func__, 'fail! no window.AMap!');
    return null;
  }
  if (!dom) {
    xdebug(__func__, 'fail! no dom!');
    return null;
  }
  var map = new window.AMap.Map(dom, _extends({}, options || {}));
  forOwn(events, function (value, key) {
    xdebug(__func__, 'event on ' + key);
    map.on(key, value);
  });
  xdebug(__func__, 'ok!');
  return map;
};

export var updateMap = function updateMap(map, newOptions, newEvents, oldOptions, oldEvents) {
  var operators = {
    view: null,
    layers: function layers(v) {
      return map.setLayers(v);
    },
    zoom: function zoom(v) {
      return map.setZoom(v);
    },
    center: function center(v) {
      return map.setCenter(v);
    },
    labelzIndex: function labelzIndex(v) {
      return map.setlabelzIndex(v);
    },
    zooms: null,
    lang: function lang(v) {
      return map.setLang(v);
    },
    defaultCursor: function defaultCursor(v) {
      return map.setDefaultCursor(v);
    },
    crs: null,
    animateEnable: null,
    isHotspot: function isHotspot(v) {
      return map.setStatus({ isHotspot: v });
    },
    defaultLayer: function defaultLayer(v) {
      return map.setDefaultLayer(v);
    },
    rotateEnable: null,
    resizeEnable: null,
    showIndoorMap: null,
    indoorMap: null,
    expandZoomRange: null,
    dragEnable: function dragEnable(v) {
      return map.setStatus({ dragEnable: v });
    },
    zoomEnable: null,
    doubleClickZoom: function doubleClickZoom(v) {
      return map.setStatus({ doubleClickZoom: v });
    },
    keyboardEnable: function keyboardEnable(v) {
      return map.setStatus({ keyboardEnable: v });
    },
    jogEnable: null,
    scrollWheel: null,
    touchZoom: null,
    touchZoomCenter: null,
    mapStyle: function mapStyle(v) {
      return map.setMapStyle(v);
    },
    features: function features(v) {
      return map.setFeatures(v);
    },
    showBuildingBlock: null,
    viewMode: null,
    pitch: function pitch(v) {
      return map.setPitch(v);
    },
    pitchEnable: null,
    buildAnimation: null,
    skyColor: null,
    preloadMode: null
  };
  return commonUpdate(map, newOptions, newEvents, oldOptions, oldEvents, operators, 'updateMap');
};

////////////////////////////////////////////////////////////
// Marker
////////////////////////////////////////////////////////////
/**
 *
 * @param {*} AMap
 * @param {*} map
 * @param {*} options 如果有dom用来显示,则其中的content字段即被填充为dom,不再用独立参数表示dom
 * @param {*} events
 */
export var createMarker = function createMarker(options, events) {
  var __func__ = 'createMarker';
  if (!window.AMap) {
    xdebug(__func__, 'fail! no window.AMap!');
    return null;
  }
  if (!options) {
    xdebug(__func__, 'fail! no options!');
    return null;
  }
  if (!options.map) {
    xdebug(__func__, 'fail! no options.map!');
    return null;
  }
  // let marker = new AMap.Marker({
  //   icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
  //   position: [116.405467, 39.907761]
  // });
  // marker.setMap(map);
  var entity = new window.AMap.Marker(options);
  forOwn(events, function (value, key) {
    entity.on(key, value);
  });
  xdebug(__func__, 'ok!');
  return entity;
};

export var updateMarker = function updateMarker(entity, newOptions, newEvents, oldOptions, oldEvents) {
  var operators = {
    map: function map(v) {
      return entity.setMap(v);
    },
    position: function position(v) {
      return entity.setPosition(v);
    },
    offset: function offset(v) {
      return entity.setOffset(v);
    },
    icon: function icon(v) {
      return entity.setIcon(v);
    },
    content: function content(v) {
      return entity.setContent(v);
    },
    topWhenClick: null,
    bubble: null,
    draggable: function draggable(v) {
      return entity.setDraggable(v);
    },
    raiseOnDrag: null,
    cursor: function cursor(v) {
      return entity.setCursor(v);
    },
    visible: null,
    zIndex: function zIndex(v) {
      return entity.setzIndex(v);
    },
    angle: function angle(v) {
      return entity.setAngle(v);
    },
    autoRotation: null,
    animation: function animation(v) {
      return entity.setAnimation(v);
    },
    shadow: function shadow(v) {
      return entity.setShadow(v);
    },
    title: function title(v) {
      return entity.setTitle(v);
    },
    clickable: function clickable(v) {
      return entity.setClickable(v);
    },
    shape: function shape(v) {
      return entity.setShape(v);
    },
    extData: function extData(v) {
      return entity.setExtData(v);
    },
    label: function label(v) {
      return entity.setLabel(v);
    }
  };

  return commonUpdate(entity, newOptions, newEvents, oldOptions, oldEvents, operators, 'updateMarker');
};

////////////////////////////////////////////////////////////
// Traffic layer, warning! is a layer!
////////////////////////////////////////////////////////////
/**
 *
 * @param {*} AMap
 * @param {*} map
 * @param {*} options 如果有dom用来显示,则其中的content字段即被填充为dom,不再用独立参数表示dom
 * @param {*} events
 */
var createTraffic = function createTraffic(options, events) {
  var __func__ = 'createTraffic';
  if (!window.AMap || !options || !options.map) {
    xdebug(__func__, 'fail! parameters!', 'window.AMap:' + !!window.AMap, 'options:' + !!options, 'options.map:' + !!(options && options.map));
    return null;
  }

  var map = options.map,
      data = options.data,
      restOpts = _objectWithoutProperties(options, ['map', 'data']);

  var entity = new window.AMap.TileLayer.Traffic(data, restOpts);
  forOwn(events, function (value, key) {
    entity.on(key, value);
  });
  entity.setMap(map);
  xdebug(__func__, 'ok!');
  return entity;
};

export { createTraffic };
export var updateTraffic = function updateTraffic(entity, newOptions, newEvents, oldOptions, oldEvents) {
  var operators = {
    map: function map(v) {
      return entity.setMap(v);
    },
    zIndex: function zIndex(v) {
      return entity.setzIndex(v);
    },
    opacity: function opacity(v) {
      return entity.setOpacity(v);
    },
    zooms: null,
    detectRetina: null,
    autoRefresh: null,
    interval: null
  };

  return commonUpdate(entity, newOptions, newEvents, oldOptions, oldEvents, operators, 'updateTraffic');
};

////////////////////////////////////////////////////////////
// MassMarks, warning! is a layer!
////////////////////////////////////////////////////////////
/**
 *
 * @param {*} AMap
 * @param {*} map
 * @param {*} options 如果有dom用来显示,则其中的content字段即被填充为dom,不再用独立参数表示dom
 * @param {*} events
 */
var createMassMarks = function createMassMarks(options, events) {
  var __func__ = 'createMassMarks';
  if (!window.AMap || !options || !options.map) {
    xdebug(__func__, 'fail! parameters!', 'window.AMap:' + !!window.AMap, 'options:' + !!options, 'options.map:' + !!(options && options.map));
    return null;
  }

  var map = options.map,
      data = options.data,
      style = options.style,
      restOpts = _objectWithoutProperties(options, ['map', 'data', 'style']);

  var entity = new window.AMap.MassMarks(data || [], _extends({}, restOpts, { style: style || [] }));
  forOwn(events, function (value, key) {
    entity.on(key, value);
  });
  entity.setMap(map);
  xdebug(__func__, 'ok!', map, 'layers:', map.getLayers());
  return entity;
};

export { createMassMarks };
export var updateMassMarks = function updateMassMarks(entity, newOptions, newEvents, oldOptions, oldEvents) {
  var operators = {
    zIndex: function zIndex(v) {
      return entity.setzIndex(v);
    },
    opacity: null,
    zooms: null,
    cursor: function cursor(v) {
      return entity.setCursor(v);
    },
    alwaysRender: null,
    style: function style(v) {
      return entity.setStyle(v);
    },
    map: function map(v) {
      xdebug('updateMassMarks', 'setMap', v, 'layers:', v && v.getLayers());
      entity.setMap(v);
    },
    data: function data(v) {
      entity.setData(v);
    }
  };
  xdebug('updateMassMarks', 'mapOld:', oldOptions && oldOptions.map && oldOptions.map.getLayers(), 'mapNew:', newOptions && newOptions.map && newOptions.map.getLayers());

  return commonUpdate(entity, newOptions, newEvents, oldOptions, oldEvents, operators, 'updateMassMarks');
};

////////////////////////////////////////////////////////////
// Polygon
////////////////////////////////////////////////////////////
/**
 *
 * @param {*} AMap
 * @param {*} map
 * @param {*} options 如果有dom用来显示,则其中的content字段即被填充为dom,不再用独立参数表示dom
 * @param {*} events
 */
export var createPolygon = function createPolygon(options, events) {
  var __func__ = 'createPolygon';
  if (!window.AMap || !options || !options.map) {
    xdebug(__func__, 'fail! parameters!', 'window.AMap:' + !!window.AMap, 'options:' + !!options, 'options.map:' + !!(options && options.map));
    return null;
  }
  var entity = new window.AMap.Polygon(options);
  forOwn(events, function (value, key) {
    entity.on(key, value);
  });
  xdebug(__func__, 'ok!');
  return entity;
};

export var updatePolygon = function updatePolygon(entity, newOptions, newEvents, oldOptions, oldEvents) {
  var operators = {
    map: function map(v) {
      return entity.setMap(v);
    },
    zIndex: function zIndex(v) {
      return entity.setzIndex(v);
    },
    path: function path(v) {
      return entity.setPath(v);
    },
    bubble: null,
    cursor: null,
    strokeColor: null,
    strokeOpacity: null,
    strokeWeight: null,
    fillColor: null,
    fillOpacity: null,
    draggable: null,
    extData: function extData(v) {
      return entity.setExtData(v);
    },
    strokeStyle: null,
    strokeDasharray: null,
    options: function options(v) {
      return entity.setOptions(v);
    }
  };

  return commonUpdate(entity, newOptions, newEvents, oldOptions, oldEvents, operators, 'updatePolygon');
};

////////////////////////////////////////////////////////////
// Polyline
////////////////////////////////////////////////////////////
/**
 *
 * @param {*} AMap
 * @param {*} map
 * @param {*} options 如果有dom用来显示,则其中的content字段即被填充为dom,不再用独立参数表示dom
 * @param {*} events
 */
export var createPolyline = function createPolyline(options, events) {
  var __func__ = 'createPolyline';
  if (!window.AMap || !options || !options.map) {
    xdebug(__func__, 'fail! parameters!', 'window.AMap:' + !!window.AMap, 'options:' + !!options, 'options.map:' + !!(options && options.map));
    return null;
  }
  var entity = new window.AMap.Polyline(options);
  forOwn(events, function (value, key) {
    entity.on(key, value);
  });
  xdebug(__func__, 'ok!');
  return entity;
};

export var updatePolyline = function updatePolyline(entity, newOptions, newEvents, oldOptions, oldEvents) {
  var operators = {
    map: function map(v) {
      return entity.setMap(v);
    },
    zIndex: function zIndex(v) {
      return entity.setzIndex(v);
    },
    bubble: null,
    cursor: null,
    gedodesic: null,
    isOutline: null,
    borderWeight: null,
    outlineColor: null,
    path: function path(v) {
      return entity.setPath(v);
    },
    strokeColor: null,
    strokeOpacity: null,
    strokeWeight: null,
    strokeStyle: null,
    strokeDasharray: null,
    lineJoin: null,
    lineCap: null,
    draggable: null,
    extData: function extData(v) {
      return entity.setExtData(v);
    },
    showDir: null,
    options: function options(v) {
      return entity.setOptions(v);
    }
  };

  return commonUpdate(entity, newOptions, newEvents, oldOptions, oldEvents, operators, 'updatePolyline');
};

////////////////////////////////////////////////////////////
// InfoWindow
////////////////////////////////////////////////////////////
/**
 *
 * @param {*} AMap
 * @param {*} map
 * @param {*} options 如果有dom用来显示,则其中的content字段即被填充为dom,不再用独立参数表示dom
 * @param {*} events
 */
export var createInfoWindow = function createInfoWindow(options, events) {
  var __func__ = 'createInfoWindow';
  if (!window.AMap || !options || !options.map) {
    xdebug(__func__, 'fail! parameters!', 'window.AMap:' + !!window.AMap, 'options:' + !!options, 'options.map:' + !!(options && options.map));
    return null;
  }
  var entity = new window.AMap.InfoWindow(options);
  forOwn(events, function (value, key) {
    entity.on(key, value);
  });
  xdebug(__func__, 'ok!');
  return entity;
};

export var updateInfoWindow = function updateInfoWindow(entity, newOptions, newEvents, oldOptions, oldEvents) {
  var operators = {
    isCustom: null,
    autoMove: null,
    closeWhenClickMap: null,
    content: function content(v) {
      return entity.setContent(v);
    },
    size: function size(v) {
      return entity.setSize(v);
    },
    offset: null,
    position: function position(v) {
      return entity.setPosition(v);
    },
    showShadow: null
  };

  return commonUpdate(entity, newOptions, newEvents, oldOptions, oldEvents, operators, 'updateInfoWindow');
};