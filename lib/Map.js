import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { loadMap, createMap, updateMap } from './api';

var __com__ = 'Map';
//const debug = console.log;
var debug = function debug() {};

export var Map = function (_Component) {
  babelHelpers.inherits(Map, _Component);

  function Map() {
    babelHelpers.classCallCheck(this, Map);

    var _this = babelHelpers.possibleConstructorReturn(this, (Map.__proto__ || Object.getPrototypeOf(Map)).call(this));

    _this.refElement = null;
    _this._entity = null;
    debug(__com__, 'component constructor', _this.refElement, _this._entity);
    return _this;
  }

  babelHelpers.createClass(Map, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      debug(__com__, 'componentWillMount', this.refElement, this._entity);
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      debug(__com__, 'componentDidMount', this.refElement, this._entity);
      var _props = this.props,
          AMap = _props.AMap,
          options = _props.options,
          events = _props.events;

      this._entity = createMap(AMap, this.refElement, options, events);
      if (this._entity) {
        if (this.props.refer) this.props.refer(this._entity);
        this.setState({ __map__: this._entity });
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      debug(__com__, 'componentWillReceiveProps', this.refElement, this._entity);
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate() {
      debug(__com__, 'componentWillUpdate', this.refElement, this._entity);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      debug(__com__, 'componentDidUpdate', this.refElement, this._entity);
      var _props2 = this.props,
          AMap = _props2.AMap,
          options = _props2.options,
          events = _props2.events;

      if (!this._entity) {
        this._entity = createMap(AMap, this.refElement, options, events);
        if (this._entity) {
          if (this.props.refer) this.props.refer(this._entity);
          this.setState({ __map__: this._entity });
        }
        return;
      }
      // need check props changes, then update.
      //updateMap(this._entity, this.props, prevProps);
      updateMap(this._entity, options, events, prevProps.options, prevProps.events);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      debug(__com__, 'componentWillUnmount', this.refElement, this._entity);
      if (this._entity) {
        var refer = this.props.refer;
        //   this._entity.clearMap();

        this._entity.destroy();
        //   delete this._entity;
        this._entity = null;
        if (this.props.refer) this.props.refer(this._entity);
      }
    }
  }, {
    key: 'renderChildren',
    value: function renderChildren(children, __map__) {
      return React.Children.map(children, function (child) {
        if (child) {
          var cType = child.type;
          /* 针对下面两种组件不注入地图相关属性
           * 1. 明确声明不需要注入的
           * 2. DOM 元素
           */
          if (cType.preventAmap || typeof cType === 'string') {
            debug(__com__, 'component renderChildren orig');
            return child;
          }
          debug(__com__, 'component renderChildren add __map__');
          return React.cloneElement(child, {
            __map__: __map__
          });
        }
        debug(__com__, 'component renderChildren null');
        return child;
      });
    }
    // shouldComponentUpdate(nextProps, nextState) {
    //   debug(__com__, 'shouldComponentUpdate', this.refElement, this._entity);
    //   let { AMap: oldAMap, refer: oldRefer, options: oldOptions, events: oldEvents } = this.props;
    //   let { AMap: newAMap, refer: newRefer, options: newOptions, events: newEvents } = nextProps;
    //   if (oldAMap === newAMap && oldRefer === newRefer && oldOptions === newOptions && oldEvents === newEvents) {
    //     debug(__com__, 'shouldComponentUpdate', false);
    //     return false;
    //   }
    //   debug(__com__, 'shouldComponentUpdate', true);
    //   return true;
    // }

  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      debug(__com__, 'component render', this._entity);
      var _props3 = this.props,
          AMap = _props3.AMap,
          options = _props3.options,
          events = _props3.events,
          match = _props3.match,
          location = _props3.location,
          history = _props3.history,
          children = _props3.children,
          staticContext = _props3.staticContext,
          rest = babelHelpers.objectWithoutProperties(_props3, ['AMap', 'options', 'events', 'match', 'location', 'history', 'children', 'staticContext']);

      return React.createElement(
        'div',
        babelHelpers.extends({
          ref: function ref(ele) {
            _this2.refElement = ele;
          }
        }, rest),
        this.renderChildren(children, this._entity)
      );
    }
  }]);
  return Map;
}(Component);

Map.propTypes = {
  AMap: PropTypes.object,
  refer: PropTypes.func, // 类似ref的函数形式,可以让父组件调用_entity
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
export default Map;