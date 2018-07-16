import forOwn from 'lodash/forOwn';
import isEqual from 'lodash/isEqual';
import isNil from 'lodash/isNil';
import isUndefined from 'lodash/isUndefined';

// M: Mandatory,必选
// api调用限流说明: https://lbs.amap.com/api/webservice/guide/tools/flowlevel

export const services = {
  // 地理/逆地理编码: https://lbs.amap.com/api/webservice/guide/api/georegeo
  geocode_geo: {
    name: '地理编码',
    method: 'GET',
    url: 'https://restapi.amap.com/v3/geocode/geo',
    parameters: {
      key:undefined, // M
      address:undefined, // M
      city:undefined, // M
      batch:false,
      sig:undefined,
      output:'JSON',
      callback: null
    }
  },
  geocode_regeo: {
    name: '逆地理编码',
    method: 'GET',
    url: 'https://restapi.amap.com/v3/geocode/regeo',
    parameters: {
      key:undefined, // M
      location:undefined, // M
      poitype:undefined,
      radius:1000,
      extensions:'base',
      batch:false,
      roadlevel:undefined,
      sig:undefined,
      output:'JSON',
      callback: null,
      homeorcorp:0
    }
  },
  // 路径规划: https://lbs.amap.com/api/webservice/guide/api/direction
  direction_walking: {
    name:'步行路径规划',
    method: 'GET',
    url: 'https://restapi.amap.com/v3/direction/walking',
    parameters: {
      key:undefined, // M
      origin:undefined, // M
      destination:undefined, // M
      sig:undefined,
      output:'JSON',
      callback: null,
    }
  },
  direction_transit_integrated: {
    name:'公交路径规划',
    method: 'GET',
    url: 'https://restapi.amap.com/v3/direction/transit/integrated',
    parameters: {
      key:undefined, // M
    }
  },
  direction_driving: {
    name:'驾车路径规划',
    method: 'GET',
    url: 'https://restapi.amap.com/v3/direction/driving',
    parameters: {
      key:undefined, // M
    }
  },
  direction_bicycling: {
    name:'骑行路径规划',
    method: 'GET',
    url: 'https://restapi.amap.com/v4/direction/bicycling',
    parameters: {
      key:undefined, // M
    }
  },
  direction_truck: {
    name:'货车路径规划',
    method: 'GET',
    url: 'https://restapi.amap.com/v4/direction/truck',
    parameters: {
      key:undefined, // M
    }
  },
  distance: {
    name:'距离测量',
    method: 'GET',
    url: 'https://restapi.amap.com/v3/distance',
    parameters: {
      key:undefined, // M
    }
  },
  // 行政区域查询: https://lbs.amap.com/api/webservice/guide/api/district
  config_district: {
    name:'行政区域查询',
    method: 'GET',
    url: 'https://restapi.amap.com/v3/config/district',
    parameters: {
      key:undefined, // M
    }
  },

  // 搜索POI: https://lbs.amap.com/api/webservice/guide/api/search
  place_text: {
    name:'关键字搜索',
    method: 'GET',
    url: 'https://restapi.amap.com/v3/place/text',
    parameters: {
      key:undefined, // M
    }
  },
  place_around: {
    name:'周边搜索',
    method: 'GET',
    url: 'https://restapi.amap.com/v3/place/around',
    parameters: {
      key:undefined, // M
    }
  },
  place_polygon: {
    name:'多边形搜索',
    method: 'GET',
    url: 'https://restapi.amap.com/v3/place/polygon',
    parameters: {
      key:undefined, // M
    }
  },
  place_detail: {
    name:'ID查询',
    method: 'GET',
    url: 'https://restapi.amap.com/v3/place/detail',
    parameters: {
      key:undefined, // M
    }
  },

  // IP定位: https://lbs.amap.com/api/webservice/guide/api/ipconfig
  ip: {
    name:'IP定位',
    method: 'GET',
    url: 'https://restapi.amap.com/v3/ip',
    parameters: {
      key:undefined, // M
    }
  },
  
  // 抓路服务: https://lbs.amap.com/api/webservice/guide/api/autograsp
  autograsp: {
    name:'抓路服务',
    method: 'GET',
    url: 'https://restapi.amap.com/v3/autograsp',
    parameters: {
      key:undefined, // M
    }
  },

  // 批量请求接口: https://lbs.amap.com/api/webservice/guide/api/batchrequest
  batch: {
    name:'批量请求接口',
    method: 'POST',
    url: 'https://restapi.amap.com/v3/batch',
    parameters: {
      key:undefined, // M
    },
    body: {
      "ops": [
        {
            "url": "/v3/place/around?offset=10&page=1&key=<您的key>&location=116.50394379585519,39.278209477408794&output=json&radius=100000&types=080000"
        },
        {
            "url": "/v3/place/around?offset=10&page=1&key=<您的key>&location=118.50394379585519,39.278209477408794&output=json&radius=100000&types=080000"
        }
      ]
    }
  },
  
  // 静态地图: https://lbs.amap.com/api/webservice/guide/api/staticmaps
  staticmap: {
    name:'静态地图',
    method: 'GET',
    url: 'https://restapi.amap.com/v3/staticmap',
    parameters: {
      key:undefined, // M
    },
  },

  // 坐标转换: https://lbs.amap.com/api/webservice/guide/api/convert
  assistant_coordinate_convert: {
    name:'坐标转换',
    method: 'GET',
    url: 'https://restapi.amap.com/v3/assistant/coordinate/convert',
    parameters: {
      key:undefined, // M
    },
  },

  // 天气查询: https://lbs.amap.com/api/webservice/guide/api/weatherinfo
  weather_weatherInfo: {
    name:'天气查询',
    method: 'GET',
    url: 'https://restapi.amap.com/v3/weather/weatherInfo',
    parameters: {
      key:undefined, // M
    },
  },
  
  // 输入提示: https://lbs.amap.com/api/webservice/guide/api/inputtips
  assistant_inputtips: {
    name:'输入提示',
    method: 'GET',
    url: 'https://restapi.amap.com/v3/assistant/inputtips',
    parameters: {
      key:undefined, // M
    },
  },

  // 交通态势: https://lbs.amap.com/api/webservice/guide/api/trafficstatus
  traffic_status_rectangle: {
    name: '矩形区域交通态势',
    method: 'GET',
    url: 'https://restapi.amap.com/v3/traffic/status/rectangle',
    parameters: {
      key:undefined, // M
    },
  },
  traffic_status_circle: {
    name: '圆形区域交通态势',
    method: 'GET',
    url: 'https://restapi.amap.com/v3/traffic/status/circle',
    parameters: {
      key:undefined, // M
    },
  },
  traffic_status_road: {
    name: '指定线路交通态势',
    method: 'GET',
    url: 'https://restapi.amap.com/v3/traffic/status/road',
    parameters: {
      key:undefined, // M
    },
  },

  // 地理围栏: https://lbs.amap.com/api/webservice/guide/api/geofence_service
  geofence_meta_post: {
    name: '创建围栏',
    method: 'POST',
    url: 'https://restapi.amap.com/v4/geofence/meta',
    parameters: {
      key:undefined, // M
    },
    body: {
      name: undefined //M
    }
  },
  geofence_meta_get: {
    name: '查询围栏',
    method: 'GET',
    url: 'https://restapi.amap.com/v4/geofence/meta',
    parameters: {
      key:undefined, // M
    },
  },
  geofence_meta_patch: {
    name: '更新围栏',
    method: 'POST ', // PATCH
    url: 'https://restapi.amap.com/v4/geofence/meta',
    parameters: {
      key:undefined, // M
      gid: undefined, // M
      method: undefined// 'patch'
    },
    body: {
      name: undefined, //M
    }
  },
  geofence_meta_patch2: {
    name: '围栏启动&停止',
    method: 'POST ', // PATCH
    url: 'https://restapi.amap.com/v4/geofence/meta',
    parameters: {
      key:undefined, // M
      gid: undefined, //M
      method: undefined //'patch'
    },
    body: {
      name: undefined, //M
    }
  },
  geofence_meta_delete: {
    name: '删除围栏',
    method: 'DELETE ', // POST
    url: 'https://restapi.amap.com/v4/geofence/meta',
    parameters: {
      key:undefined, // M
      gid: undefined, //M
      method: undefined, //'delete'
    },
    body: {
      name: undefined, //M
    }
  },
  geofence_status: {
    name: '围栏设备监控',
    method: 'GET',
    url: 'https://restapi.amap.com/v4/geofence/status',
    parameters: {
      key:undefined, // M
      diu:undefined, // M
      uid: undefined,
      locations: undefined, // M
      sig: undefined,
    },
  },

  // 轨迹纠偏: https://lbs.amap.com/api/webservice/guide/api/grasproad
  grasproad_driving: {
    name: '轨迹纠偏',
    method: 'POST',
    url: 'https://restapi.amap.com/v4/grasproad/driving',
    parameters: {
      key:undefined, // M
    },
    body: {
      x: undefined, // M
      y: undefined, // M
      ag: undefined, // M
      tm: undefined, // M
      sp: undefined // M
    }
  },

}

export const infocode = {
  "10000": {
    info: 'OK',
    desc: '请求正常',
    suggest: '请求正常'
  },
  "10001": {
    info: 'INVALID_USER_KEY',
    desc: 'key不正确或过期',
    suggest: '开发者发起请求时，传入的key不正确或者过期 '
  },
  "10002": {
    info: 'SERVICE_NOT_AVAILABLE',
    desc: '没有权限使用相应的服务或者请求接口的路径拼写错误',
    suggest: '1.开发者没有权限使用相应的服务，例如：开发者申请了WEB定位功能的key，却使用该key访问逆地理编码功能时，就会返回该错误。反之亦然。2.开发者请求接口的路径拼写错误。例如：正确的https://restapi.amap.com/v3/ip在程序中被拼装写了https://restapi.amap.com/vv3/ip"'
  },
}

export const getRequest = (service, parameters, body) => {
  if (!service) return null;

  let option = {};
  let { name, url, method, parameters: dfParameters, body: dfBody } = service;
  let destParameters = { ...(dfParameters||{}), ...(parameters||{}) };

  // 组建url中参数
  let paramArr = [];
  forOwn(destParameters, (value, key) => {
    if (!isNil(value)) {
      paramArr.push (key+'='+value);
    }
  });
  if (paramArr.length > 0) {
    url += '?'+paramArr.join('&');
  }
  // 组建option
  if (method === 'GET') {
    option = {
      credentials: 'include',
      method,
      headers: { 'Content-Type': 'application/json' },
    }
  } else if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
    let destBody = { ...(dfBody||{}), ...(body||{}) };
    option = {
      credentials: 'include',
      method,
      headers: { 'Content-Type': 'application/json' },
      body: destBody
    }
  } else {
    console.log('error! not support method='+method+' of '+name);
  }

  return {
    url, 
    option
  }
}