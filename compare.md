### 当前高德地图的react版本
  + 饿了么的`react-amap`项目地址为:<https://github.comElemeFE/react-amap>
  + 新的`react-amap-next`项目地址:<https://github.com/windsome/react-amap-next> ,采用新方案,极少代码

### 当前react版本amap的开源库react-amap介绍
  + 使用方法
```
import React from 'react';
import ReactDOM from 'react-dom';
import { Map, Polygon } from 'react-amap';

ReactDOM.render(
 <Map amapkey={YOUR_AMAPKEY} version={VERSION} useAMapUI={USE_AMAP_UI} events={EVENTS_MAP}>
   <Polygon path={...} bubble={...}/>
 </Map>,
 document.querySelector('#app')
)
```
&emsp;&emsp;使用过程中需要注意,amapkey和version需要作为`Map`属性传入,组件内部实现了高德地图相关js文件的加载:(https://webapi.amap.com/maps?v=1.4.8&key=您申请的key值).  
&emsp;&emsp;组件的使用主要在`events`属性中,`events`属性是一个事件处理函数集合,组件相关的事件均可在`events`中处理,但Map中有一个特殊事件,Map组件创建完后会触发`created`事件,在这个事件处理函数中可以做一些初始化,另外,其他的地图上触发事件如`click`等均可放到`events`中传入.如下例子:  
```
    events = {
      created: map => {
        this.setState({ mapInstance: map });
        window.AMap.plugin('AMap.Geocoder', () => {
          let geocoder = new window.AMap.Geocoder({
            //city: "010"//城市，默认：“全国”
          });
          this.setState({ geocoder });
        });
      },
      click: mapevt => {
        //console.log('mapevt:', mapevt);
        let gps = mapevt.lnglat;
        this.getAddressByGps(gps)
          .then(retAddr => this.setState({ ...retAddr }))
          .catch(error => {
            console.log('error!', error);
          });
        this.setState({ gps });
      },
    };
```
 &emsp;&emsp;`created`事件比较特殊,可以在此事件中初始化一些非可视化插件,比如`AMap.Geocoder`,`AMap.Geolocation`等,如上例,初始化了`AMap.Geocoder` ,并且塞到state中,以后可以被调用.注意调用时最好判断`this.state.geocoder`是否为空.
&emsp;&emsp;其他详细使用方法参照官网.
### react-amap使用中的注意事项及使用体验
  1. `created`是加载高德js完毕触发的事件,参数为map实例,可以之后调用map的方法,在`created`中`window.AMap`已经加载完成,可以调用`AMap`相关子类及方法等,注意map是Map类的实例.  
  2. 每次调用高德地图都在`<Map events={created:func}>`中的`created`中获取`window.AMap`,多个页面都调用了`Map`,会导致每个Map都要处理`created`函数,初始化逻辑非常冗余.如果使用redux,这部分初始化代码最好能独立,使用一个action直接获取后放入到store中,后续不用再处理`created`事件.  
  3. 还是`created`造成的问题,一般非显示组件在这里面初始化,同时会保存下来供后续使用.但每个Map一般都会用到一些组件,都得重新初始化,重新创建,增加了很多没必要的开销.   
  4. 对于一些非显示组件的使用,会用到`window.AMap.event.addListener` ,用常规回调函数方式,感觉不是很react,例子如下.这部分可以使用高德AMap的webservice替代,地址:(概述-Web服务 API | 高德地图API).  
```
          window.AMap.event.addListener(geolocation, 'complete', data => {
            console.log('data:', data);
            //let center = {}
            ///this.setState({center:data.position, gps:data.position});
            this.setState({ center: data.position });
          }); //返回定位信息
```
  &emsp;&emsp;其他优缺点,大家可以补充.

### 新的解决方案react-amap-next,重复造这个轮子的出发点
项目地址(windsome/react-amap-next)
  1. created方法在每个Map加载中都写,重复工作大.逻辑判断复杂,非常不适合react以数据为导向的思想,初始化只不过加载高德地图的js文件,加载完成后获得window.AMap类,后续开发均基于此类.基于此,可以将初始化部分独立出来,作为一个函数loadMap调用.
  2. 对于组件的属性的设置, react-amap只是支持有限的属性.我期望实现一种方便支持所有属性的方式, 同时希望属性能方便被更新, 这导致我给组件加一个options的想法,所有属性都写在里面. 
  3. 对于组件属性的更新,我希望直接修改options即完成对属性的更新,而不用手动去调用setXXX方法.
  4. 我希望得到组件的高德实例,有个某些特殊情况下需要特殊控制(一般比较少).我采用refer参数方式,类似react中的ref机制,我只实现了简单的函数方式.
  5.`events`的处理,我希望使用原有方式,但我希望能方便更新. 
  6. 总之,我希望使用起来非常简单,并且不出错.

### react-amap-next方案介绍
  1. 地图加载部分,`api.js`中包装 `APILoader.js`, 最后通过`loadMap`函数给外界调用初始化过程.
  2. 地图组件部分, `Map.js Marker.js MassMarks.js Polygon.js Polyline.js InfoWindow.js`
  3. `events`部分, 使用`on,off`方式注册及取消某个事件.
  4. 组件的开发:主要实现`constructor, componentDidMount componentDidUpdate componentWillUnmount render` 函数,详细可以查看源码.主要把握创建高德实例和销毁高德实例过程.
### react-amap-next使用方法
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
  </Map>
  )
}
```
具体用例参考`src/App.js`.
### react-amap-next的不足之处
  1. `events`属性,是一些事件处理函数的集合,最好不要是写在`render`中的函数或匿名函数,否则每次render函数都会重新实例化,会导致频繁调用on和off进行绑定和解绑事件. 
  2. `options`属性是高德组件的属性集合,参考高德官方文档即可.某些调用`set`进行设置的内容,可以作为属性添加,还有一些属性是`AMap`类中的一些子类,看起来比较复杂.并且属性是进行深比对,不一样的就会更新. 
  3. 目前组件还比较少,只满足了我个人的使用需求,有待增加
  4. Map组件的layers属性可能与海量点组件冲突,因海量点是个图层,如果海量点图层加载后,map的layers属性更新,则海量点图层就被删掉了,从而看不见.临时解决办法是layers属性保证先于MassMarks加载,或者Map不填入layers属性.以后可以将所有的图层都用组件方式开发出来,这样将不会出现此问题,并且,图层的属性将方便更新和设置.
