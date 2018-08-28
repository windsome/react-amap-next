## 项目目标
此项目是对高德地图的react封装,相比较于react-amap,集成更原生化,更简单. 用最react的方式使用高德地图AMap.

## 使用方法
```
// 首先安装react-amap-next
yarn add react-amap-next
// 加载所需组件
import { loadMap } from 'react-amap-next/lib/api'; //加载高德地图方法,如果与redux配合,可以写在action/reducer中
import Map from 'react-amap-next/lib/Map';
import Marker from 'react-amap-next/lib/Marker';

// 在componentDidMount中加载js
componentDidMount() {
  loadMap('<amap-key>').then(AMap=>{
    // 可在此做一些初始化
    this.setState({AMap});
  })
}
// 在render中使用Map,注意其中参数refer类似react中ref,只支持函数,可以获得amap实例;options是参数,更新的参数也通过此处传下去,events是地图事件的回调,设置后将会被调用,可以触发属性的改变.
// 一般地图组件都包含AMap, refer, options, events4个属性.
// 注意, options和events中的函数和变量最好都为外面声明的,而不使用匿名的函数.否则容易触发事件的频繁移除及更新,耗费性能.
render() {
  return (
  <Map refer={} AMap={this.state.AMap} style={{width:1200, height:800}} options={{}} events={{}} >
    <Marker
      refer={(entity) => this.setState({carEntity: entity})}
      options={{
        position: [116.397428, 39.90923],
        icon: "https://webapi.amap.com/images/car.png",
        offset: this.state.carOffset,
        autoRotation: true
      }}
      events={{
        moving:this._carMoving
      }}
    />
  </Map>
  )
}
```

## 测试用例
例子请参考`src/App.js`,
```
git clone https://github.com/windsome/react-amap-next
yarn install # npm install
npm start
```

## 方案介绍
1. `api.js`为amap相关的操作,主要包含高德js的加载及各种组件的创建及更新方法.
2. `webservice.js`为地图webservice服务,与UI无关的操作均使用webservice进行
3. `Map.js`为根节点地图组件,其他所有子UI组件都必须作为其一级子元素.遵循react生命周期函数,主要使用`componentDidMount`, `componentDidUpdate`进行创建和更新的处理.
4. `Marker.js`为标记点组件
5. `MassMarks`为海量点组件,此组件是一个layer图层,因为比traffic, sattelite复杂,需要设置很多属性,所以独立成一个组件.其他图层也可以参考设置成独立组件
6. `Polygon.js`为多边形控件,可以用来画行政区域图
7. `Polyline.js`为多折点线组件,可以用来模拟汽车行驶轨迹
8. `InfoWindow.js`为InfoWindow组件,可以用来显示弹出框
9. `LayerTraffic.js`为LayerTraffic组件,可以用来显示交通层
10. 其他组件,有待添加.

## 注意事项
1. `loadScript.js`是用来加载js和css的,希望能确保加载文件的唯一性,可以参考requirejs的实现机制改掉.注意:这里已经用react-amap的加载方式替换了.
2. 与`react-amap`的不同之处,加载高德地图js与`Map`,`Marker`等组件是分离的.

## 已知问题
1. 有时海量点图层(`MassMarks`层)不显示,见此版本例子中的`App.js`,首先点击MarkerTest,然后再打开MassMarksTest,会发现海量点图层有时不显示.原因为:MassMarks层是属于Map的其中一个层,如果Map的layers属性后于海量点图层加载,则海量点图层会被layers属性替代. 建议以后将所有图层均做成组件,并且Map组件不再支持layers属性.

## 反馈
We are always open to [your feedback](https://github.com/windsome/react-amap-next/issues).

## 更新计划

## 团队协作
