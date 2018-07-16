import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { createMarker, updateMarker } from './api';

export class Marker extends Component {
  static propTypes = {
    AMap: PropTypes.object,
    __map__: PropTypes.object,
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
    console.log('maker constructor', this._entity);
  }

  componentWillMount() {
    console.log('makerWillMount', this.props.children, this._entity);
  }

  componentDidMount() {
    console.log('makerDidMount', this.props.children, this._entity);
    let { AMap, __map__, options, events, children } = this.props;
    //let opts = { ...(options || {}), map: __map__, content: children };
    let opts = { ...(options || {}), map: __map__ };
    this._entity = createMarker(AMap, opts, events);
  }

  componentWillReceiveProps(nextProps) {
    console.log('makerWillReceiveProps', this.props.children, this._entity);
  }

  componentWillUpdate() {
    console.log('makerWillUpdate', this.props.children, this._entity);
  }

  componentDidUpdate(prevProps) {
    console.log('makerDidUpdate', this.props.children, this._entity);
    let { AMap, __map__, options, events, children } = this.props;
    //let opts = { ...(options || {}), map: __map__, content: children };
    let opts = { ...(options || {}), map: __map__ };
    if (!this._entity) {
      this._entity = createMarker(AMap, opts, events);
      return;
    }

    // need check props changes, then update.
    let oldOpts = {
      ...(prevProps.options || {}),
      map: prevProps.__map__,
      content: prevProps.children
    };
    updateMarker(this._entity, opts, events, oldOpts, prevProps.events);
  }

  componentWillUnmount() {
    console.log('makerWillUnmount', this.props.children, this._entity);
    if (this._entity) {
      //   this._entity.clearMap();
      this._entity.setMap(null);
      delete this._entity;
      //   delete this._entity;
      this._entity = null;
    }
  }

  render() {
    console.log('maker render', this.props.children, this._entity);
    let {
      AMap,
      options,
      match,
      location,
      history,
      staticContext,
      ...rest
    } = this.props;
    return null;
    // return (
    //   <React.Fragment>
    //   </React.Fragment>
    // )
  }
}

export default Marker;
