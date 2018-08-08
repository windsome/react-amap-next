import forOwn from 'lodash/forOwn';
import isEqual from 'lodash/isEqual';
import isNil from 'lodash/isNil';
import isEmpty from 'lodash/isEmpty';
//import loadjscssfile from './loadScript';
import APILoader from './APILoader'

//const xdebug = console.log;
const xdebug = () => {};

export const loadApi = (key = '0325e3d6d69cd56de4980b4f28906fd8') => {
  return new APILoader({
    key,
    useAMapUI: true,
    version: '1.4.7',
    protocol: 'https'
  }).load();
};
export const loadMap = key => {
  return new Promise((resolve, reject) => {
    if (window.AMap) {
      resolve(window.AMap);
    }
    loadApi(key)
      .then(ret => {
        if (window.AMap) {
          resolve(window.AMap);
        } else {
          reject(new Error('window.AMap不存在!'));
        }
      })
      .catch(error => {
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
export const loadPlugin = name => {
  return new Promise((resolve, reject) => {
    if (window.AMap) {
      window.AMap.plugin(name, () => {
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
const commonUpdate = (
  entity,
  newOptions,
  newEvents,
  oldOptions,
  oldEvents,
  operators,
  __func__ = 'commonUpdate'
) => {
  // const __func__ = 'commonUpdate';
  if (!entity) {
    xdebug(__func__, 'fail! no entity!');
    return false;
  }

  // 找到改变的属性集合,包含添加,删除及修改的属性,删除的置为null
  let props = {};
  if (newOptions != oldOptions) {
    oldOptions &&
      forOwn(oldOptions, (value, key) => {
        // 找到改变的旧属性,用新属性取代
        let newValue = newOptions && newOptions[key];
        if (!isEqual(newValue, value)) {
          if (!(isNil(newValue) && isNil(value)))
            props[key] = newValue;
        }
      });
    newOptions &&
      forOwn(newOptions, (value, key) => {
        // 找到新加的属性,添加进去
        let oldValue = oldOptions && oldOptions[key];
        if (isNil(oldValue) && !isNil(value)) {
          props[key] = value;
        }
      });
  }
  // 找到改变的事件集合,包含添加,删除及修改的事件处理函数,删除的置为null
  let events = {};
  if (newEvents != oldEvents) {
    oldEvents &&
      forOwn(oldEvents, (value, key) => {
        // 找到改变的旧属性,用新属性取代
        let newValue = newEvents && newEvents[key];
        if (!isEqual(newValue, value)) {
          if (!(isNil(newValue) && isNil(value)))
            events[key] = newValue;
        }
      });
    newEvents &&
      forOwn(newEvents, (value, key) => {
        // 找到新加的属性,添加进去
        let oldValue = oldEvents && oldEvents[key];
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

  forOwn(props, (value, key) => {
    if (value) {
      let func = operators[key];
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
  forOwn(events, (value, key) => {
    let oldFunc = oldEvents && oldEvents[key];
    if (oldFunc) {
      entity.off(key, oldFunc);
    }
    if (value) {
      entity.on(key, value);
    }
  });
  if (!isEmpty(props) || !isEmpty(events)) {
    xdebug(
      __func__, 'update:',
      props,
      events,
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
export const createMap = (dom, options, events) => {
  const __func__ = 'createMap';
  if (!window.AMap) {
    xdebug(__func__, 'fail! no window.AMap!');
    return null;
  }
  if (!dom) {
    xdebug(__func__, 'fail! no dom!');
    return null;
  }
  let map = new window.AMap.Map(dom, { ...(options || {}) });
  forOwn(events, (value, key) => {
    xdebug(__func__, 'event on ' + key);
    map.on(key, value);
  });
  xdebug(__func__, 'ok!');
  return map;
};

export const updateMap = (
  map,
  newOptions,
  newEvents,
  oldOptions,
  oldEvents
) => {
  let operators = {
    view: null,
    layers: v => map.setLayers(v),
    zoom: v => map.setZoom(v),
    center: v => map.setCenter(v),
    labelzIndex: v => map.setlabelzIndex(v),
    zooms: null,
    lang: v => map.setLang(v),
    defaultCursor: v => map.setDefaultCursor(v),
    crs: null,
    animateEnable: null,
    isHotspot: v => map.setStatus({ isHotspot: v }),
    defaultLayer: v => map.setDefaultLayer(v),
    rotateEnable: null,
    resizeEnable: null,
    showIndoorMap: null,
    indoorMap: null,
    expandZoomRange: null,
    dragEnable: v => map.setStatus({ dragEnable: v }),
    zoomEnable: null,
    doubleClickZoom: v => map.setStatus({ doubleClickZoom: v }),
    keyboardEnable: v => map.setStatus({ keyboardEnable: v }),
    jogEnable: null,
    scrollWheel: null,
    touchZoom: null,
    touchZoomCenter: null,
    mapStyle: v => map.setMapStyle(v),
    features: v => map.setFeatures(v),
    showBuildingBlock: null,
    viewMode: null,
    pitch: v => map.setPitch(v),
    pitchEnable: null,
    buildAnimation: null,
    skyColor: null,
    preloadMode: null
  };
  return commonUpdate (
    map,
    newOptions,
    newEvents,
    oldOptions,
    oldEvents,
    operators,
    'updateMap'
  )
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
export const createMarker = (options, events) => {
  const __func__ = 'createMarker';
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
  let entity = new window.AMap.Marker(options);
  forOwn(events, (value, key) => {
    entity.on(key, value);
  });
  xdebug(__func__, 'ok!');
  return entity;
};

export const updateMarker = (
  entity,
  newOptions,
  newEvents,
  oldOptions,
  oldEvents
) => {
  let operators = {
    map: v => entity.setMap(v),
    position: v => entity.setPosition(v),
    offset: v => entity.setOffset(v),
    icon: v => entity.setIcon(v),
    content: v => entity.setContent(v),
    topWhenClick: null,
    bubble: null,
    draggable: v => entity.setDraggable(v),
    raiseOnDrag: null,
    cursor: v => entity.setCursor(v),
    visible: null,
    zIndex: v => entity.setzIndex(v),
    angle: v => entity.setAngle(v),
    autoRotation: null,
    animation: v => entity.setAnimation(v),
    shadow: v => entity.setShadow(v),
    title: v => entity.setTitle(v),
    clickable: v => entity.setClickable(v),
    shape: v => entity.setShape(v),
    extData: v => entity.setExtData(v),
    label: v => entity.setLabel(v)
  };

  return commonUpdate (
    entity,
    newOptions,
    newEvents,
    oldOptions,
    oldEvents,
    operators,
    'updateMarker'
  )
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
export const createTraffic = (options, events) => {
  const __func__ = 'createTraffic';
  if (!window.AMap || !options || !options.map) {
    xdebug(__func__, 'fail! parameters!', 'window.AMap:'+!!window.AMap, 'options:'+!!options, 'options.map:'+!!(options&&options.map));
    return null;
  }
  let {map, data, ...restOpts} = options;
  let entity = new window.AMap.TileLayer.Traffic(data, restOpts);
  forOwn(events, (value, key) => {
    entity.on(key, value);
  });
  entity.setMap(map);
  xdebug(__func__, 'ok!');
  return entity;
};

export const updateTraffic = (
  entity,
  newOptions,
  newEvents,
  oldOptions,
  oldEvents
) => {
  let operators = {
    map: v => entity.setMap(v),
    zIndex: v => entity.setzIndex(v),
    opacity: v => entity.setOpacity(v),
    zooms: null,
    detectRetina: null,
    autoRefresh: null,
    interval: null,
  };

  return commonUpdate (
    entity,
    newOptions,
    newEvents,
    oldOptions,
    oldEvents,
    operators,
    'updateTraffic'
  )
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
export const createMassMarks = (options, events) => {
  const __func__ = 'createMassMarks';
  if (!window.AMap || !options || !options.map) {
    xdebug(__func__, 'fail! parameters!', 'window.AMap:'+!!window.AMap, 'options:'+!!options, 'options.map:'+!!(options&&options.map));
    return null;
  }
  let {map, data, style, ...restOpts} = options;
  let entity = new window.AMap.MassMarks(data||[], {...restOpts, style: style||[]});
  forOwn(events, (value, key) => {
    entity.on(key, value);
  });
  entity.setMap(map);
  xdebug(__func__, 'ok!', map, 'layers:', map.getLayers());
  return entity;
};

export const updateMassMarks = (
  entity,
  newOptions,
  newEvents,
  oldOptions,
  oldEvents
) => {
  let operators = {
    zIndex: v => entity.setzIndex(v),
    opacity: null,
    zooms: null,
    cursor: v => entity.setCursor(v),
    alwaysRender: null,
    style: v => entity.setStyle(v),
    map: v => {
      xdebug('updateMassMarks', 'setMap', v, 'layers:', (v && v.getLayers()));
      entity.setMap(v)
    },
    data: v=> {
      entity.setData(v);
    }
  };
  xdebug('updateMassMarks', 'mapOld:', (oldOptions && oldOptions.map && oldOptions.map.getLayers()), 'mapNew:', (newOptions && newOptions.map && newOptions.map.getLayers()));

  return commonUpdate (
    entity,
    newOptions,
    newEvents,
    oldOptions,
    oldEvents,
    operators,
    'updateMassMarks'
  )
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
export const createPolygon = (options, events) => {
  const __func__ = 'createPolygon';
  if (!window.AMap || !options || !options.map) {
    xdebug(__func__, 'fail! parameters!', 'window.AMap:'+!!window.AMap, 'options:'+!!options, 'options.map:'+!!(options&&options.map));
    return null;
  }
  let entity = new window.AMap.Polygon(options);
  forOwn(events, (value, key) => {
    entity.on(key, value);
  });
  xdebug(__func__, 'ok!');
  return entity;
};

export const updatePolygon = (
  entity,
  newOptions,
  newEvents,
  oldOptions,
  oldEvents
) => {
  let operators = {
    map: v => entity.setMap(v),
    zIndex: v => entity.setzIndex(v),
    path: v => entity.setPath(v),
    bubble: null,
    cursor: null,
    strokeColor: null,
    strokeOpacity: null,
    strokeWeight: null,
    fillColor: null,
    fillOpacity: null,
    draggable: null,
    extData: v => entity.setExtData(v),
    strokeStyle: null,
    strokeDasharray: null,
    options: v => entity.setOptions(v)
  };

  return commonUpdate (
    entity,
    newOptions,
    newEvents,
    oldOptions,
    oldEvents,
    operators,
    'updatePolygon'
  )
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
export const createPolyline = (options, events) => {
  const __func__ = 'createPolyline';
  if (!window.AMap || !options || !options.map) {
    xdebug(__func__, 'fail! parameters!', 'window.AMap:'+!!window.AMap, 'options:'+!!options, 'options.map:'+!!(options&&options.map));
    return null;
  }
  let entity = new window.AMap.Polyline(options);
  forOwn(events, (value, key) => {
    entity.on(key, value);
  });
  xdebug(__func__, 'ok!');
  return entity;
};

export const updatePolyline = (
  entity,
  newOptions,
  newEvents,
  oldOptions,
  oldEvents
) => {
  let operators = {
    map: v => entity.setMap(v),
    zIndex: v => entity.setzIndex(v),
    bubble: null,
    cursor: null,
    gedodesic: null,
    isOutline: null,
    borderWeight: null,
    outlineColor: null,
    path: v => entity.setPath(v),
    strokeColor: null,
    strokeOpacity: null,
    strokeWeight: null,
    strokeStyle: null,
    strokeDasharray: null,
    lineJoin: null,
    lineCap: null,
    draggable: null,
    extData: v => entity.setExtData(v),
    showDir: null,
    options: v => entity.setOptions(v)
  };

  return commonUpdate (
    entity,
    newOptions,
    newEvents,
    oldOptions,
    oldEvents,
    operators,
    'updatePolyline'
  )
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
export const createInfoWindow = (options, events) => {
  const __func__ = 'createInfoWindow';
  if (!window.AMap || !options || !options.map) {
    xdebug(__func__, 'fail! parameters!', 'window.AMap:'+!!window.AMap, 'options:'+!!options, 'options.map:'+!!(options&&options.map));
    return null;
  }
  let entity = new window.AMap.InfoWindow(options);
  forOwn(events, (value, key) => {
    entity.on(key, value);
  });
  xdebug(__func__, 'ok!');
  return entity;
};

export const updateInfoWindow = (
  entity,
  newOptions,
  newEvents,
  oldOptions,
  oldEvents
) => {
  let operators = {
    isCustom: null,
    autoMove: null,
    closeWhenClickMap: null,
    content: v => entity.setContent(v),
    size: v => entity.setSize(v),
    offset: null,
    position: v => entity.setPosition(v),
    showShadow: null,
  };

  return commonUpdate (
    entity,
    newOptions,
    newEvents,
    oldOptions,
    oldEvents,
    operators,
    'updateInfoWindow'
  )
};

