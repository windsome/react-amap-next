import forOwn from 'lodash/forOwn';
import isEqual from 'lodash/isEqual';
import loadjscssfile from './loadScript';

export const loadApi = async (key = '0325e3d6d69cd56de4980b4f28906fd8') => {
  return await loadjscssfile(
    'https://webapi.amap.com/maps?v=1.4.7&key=' + key,
    'js'
  );
};

// let LoadResult = false;
// loadApi().then(result => {
//   console.log('loadApi result:', result);
//   LoadResult = result;
//   return result;
// })

// export default LoadResult;

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

/**
 * [加载插件](https://lbs.amap.com/api/javascript-api/guide/abc/plugins)
 * 加载完成后,可以调用:
 *  var toolbar = new AMap.ToolBar();
 *  map.addControl(toolbar);
 * @param {string} name 插件名或插件数组,如:AMap.ToolBar,['AMap.ToolBar','AMap.Driving']
 */
export const loadPlugin = name => {
  return new Promise((resolve, reject) => {
    if (window.AMap) {
      resolve(true);
    }
    loadApi()
      .then(ret => {
        if (!name) {
          reject(new Error('未填写组件名'));
        }
        window.AMap.plugin(name, () => {
          resolve(true);
        });
      })
      .catch(error => {
        reject(new Error('加载地图错误!' + error.message));
      });
  });
};

////////////////////////////////////////////////////////////
// Map
////////////////////////////////////////////////////////////
export const createMap = (AMap, dom, options, events) => {
  if (!AMap) {
    console.log('createMap fail! no AMap!');
    return null;
  }
  if (!dom) {
    console.log('createMap fail! no dom!');
    return null;
  }
  let map = new AMap.Map(dom, { ...(options || {}) });
  forOwn(events, (value, key) => {
    map.on(key, value);
  });
  console.log('createMap ok!');
  return map;
};

export const updateMap = (
  map,
  newOptions,
  newEvents,
  oldOptions,
  oldEvents
) => {
  if (!map) {
    console.log('updateMap fail! no map!');
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
          //if (newValue != value) {
          props[key] = newValue;
        }
      });
    newOptions &&
      forOwn(newOptions, (value, key) => {
        // 找到新加的属性,添加进去
        let oldValue = oldOptions && oldOptions[key];
        if (oldValue == null) {
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
          //if (newValue != value) {
          events[key] = newValue;
        }
      });
    newEvents &&
      forOwn(newEvents, (value, key) => {
        // 找到新加的属性,添加进去
        let oldValue = oldEvents && oldEvents[key];
        if (oldValue == null) {
          events[key] = value;
        }
      });
  }

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

  forOwn(props, (value, key) => {
    if (value) {
      let func = operators[key];
      if (func) {
        func(value);
      } else {
        // ignore properties can not set.
        console.log('updateMap: warning! no setter! can not update ' + key);
      }
    } else {
      // key removed, not support!
      console.log('updateMap: warning! remove prop not support! key=' + key);
    }
  });
  forOwn(events, (value, key) => {
    let oldFunc = oldEvents && oldEvents[key];
    if (oldFunc) {
      map.off(key, oldFunc);
    }
    if (value) {
      map.on(key, value);
    }
  });
  console.log(
    'updateMap: update:',
    props,
    events,
    newOptions,
    newEvents,
    oldOptions,
    oldEvents
  );
  return true;
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
export const createMarker = (AMap, options, events) => {
  if (!AMap) {
    console.log('createMarker fail! no AMap!');
    return null;
  }
  if (!options) {
    console.log('createMarker fail! no options!');
    return null;
  }
  if (!options.map) {
    console.log('createMarker fail! no options.map!');
    return null;
  }
  // let marker = new AMap.Marker({
  //   icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
  //   position: [116.405467, 39.907761]
  // });
  // marker.setMap(map);
  let marker = new AMap.Marker(options);
  forOwn(events, (value, key) => {
    marker.on(key, value);
  });
  console.log('createMarker ok!');
  return marker;
};

export const updateMarker = (
  entity,
  newOptions,
  newEvents,
  oldOptions,
  oldEvents
) => {
  if (!entity) {
    console.log('updateMarker fail! no entity!');
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
          //if (newValue != value) {
          props[key] = newValue;
        }
      });
    newOptions &&
      forOwn(newOptions, (value, key) => {
        // 找到新加的属性,添加进去
        let oldValue = oldOptions && oldOptions[key];
        if (oldValue == null) {
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
          //if (newValue != value) {
          events[key] = newValue;
        }
      });
    newEvents &&
      forOwn(newEvents, (value, key) => {
        // 找到新加的属性,添加进去
        let oldValue = oldEvents && oldEvents[key];
        if (oldValue == null) {
          events[key] = value;
        }
      });
  }

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

  forOwn(props, (value, key) => {
    if (value) {
      let func = operators[key];
      if (func) {
        func(value);
      } else {
        // ignore properties can not set.
        console.log('updateMarker: warning! no setter! can not update ' + key);
      }
    } else {
      // key removed, not support!
      console.log('updateMarker: warning! remove prop not support! key=' + key);
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
  console.log(
    'updateMarker: update:',
    props,
    events,
    newOptions,
    newEvents,
    oldOptions,
    oldEvents
  );
  return true;
};
