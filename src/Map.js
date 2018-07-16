import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { loadMap, createMap, updateMap } from './api';

export class Map extends Component {
  static propTypes = {
    AMap: PropTypes.object,
    refMap: PropTypes.func, // 类似ref的函数形式,可以让父组件调用_entity
    options: PropTypes.object,
    events: PropTypes.object
    //   zoom: PropTypes.number, // 10, //设置地图显示的缩放级别
    //   center: PropTypes.array, // [116.397428, 39.90923]，//设置地图中心点坐标
    //   layers: PropTypes.array, // [new AMap.TileLayer.Satellite()],  //设置图层,可设置成包含一个或多个图层的数组
    //   mapStyle: PropTypes.string, // 'amap://styles/whitesmoke',  //设置地图的显示样式
    //   viewMode: PropTypes.string, // '2D',  //设置地图模式
    //   lang: PropTypes.string, // 'zh_cn',  //设置地图语言类型
    //   events: PropTypes.object, // {'click': function}, // 事件map
  };
  constructor() {
    super();
    this.refElement = null;
    this._entity = null;
    console.log('wcomponent constructor', this.refElement, this._entity);
  }

  componentWillMount() {
    console.log('wcomponentWillMount', this.refElement, this._entity);
  }

  componentDidMount() {
    console.log('wcomponentDidMount', this.refElement, this._entity);
    let { AMap, refMap, options, events } = this.props;
    this._entity = createMap(AMap, this.refElement, options, events);
    if (this._entity) {
      if (refMap) refMap(this._entity);
      this.setState({ __map__: this._entity });
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log('wcomponentWillReceiveProps', this.refElement, this._entity);
  }

  componentWillUpdate() {
    console.log('wcomponentWillUpdate', this.refElement, this._entity);
  }

  componentDidUpdate(prevProps) {
    console.log('wcomponentDidUpdate', this.refElement, this._entity);
    let { AMap, refMap, options, events } = this.props;
    if (!this._entity) {
      this._entity = createMap(AMap, this.refElement, options, events);
      if (this._entity) {
        if (refMap) refMap(this._entity);
        this.setState({ __map__: this._entity });
      }
      return;
    }
    // need check props changes, then update.
    //updateMap(this._entity, this.props, prevProps);
    updateMap(
      this._entity,
      options,
      events,
      prevProps.options,
      prevProps.events
    );
  }

  componentWillUnmount() {
    console.log('wcomponentWillUnmount', this.refElement, this._entity);
    if (this._entity) {
      let { refMap } = this.props;
      //   this._entity.clearMap();
      this._entity.destroy();
      //   delete this._entity;
      this._entity = null;
      if (refMap) refMap(this._entity);
    }
  }

  renderChildren(children, __map__) {
    return React.Children.map(children, child => {
      if (child) {
        const cType = child.type;
        /* 针对下面两种组件不注入地图相关属性
         * 1. 明确声明不需要注入的
         * 2. DOM 元素
         */
        if (cType.preventAmap || typeof cType === 'string') {
          console.log('wcomponent renderChildren orig');
          return child;
        }
        console.log('wcomponent renderChildren add __map__');
        return React.cloneElement(child, {
          __map__
        });
      }
      console.log('wcomponent renderChildren null');
      return child;
    });
  }

  render() {
    console.log('wcomponent render', this.refElement, this._entity);
    let {
      AMap,
      options,
      match,
      location,
      history,
      children,
      staticContext,
      ...rest
    } = this.props;
    return (
      <div
        ref={ele => {
          this.refElement = ele;
        }}
        {...rest}
      >
        {this.renderChildren(children, this._entity)}
      </div>
    );
  }
}

export default Map;
