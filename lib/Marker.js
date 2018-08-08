var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { createMarker, updateMarker } from './api';
var __com__ = 'Marker';
//const debug = console.log;
var debug = function debug() {};

export var Marker = function (_Component) {
  _inherits(Marker, _Component);

  function Marker() {
    _classCallCheck(this, Marker);

    var _this = _possibleConstructorReturn(this, (Marker.__proto__ || Object.getPrototypeOf(Marker)).call(this));

    _this.refElement = null;
    _this._entity = null;
    debug(__com__, 'constructor', _this._entity);
    return _this;
  }

  _createClass(Marker, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      debug(__com__, 'componentWillMount', this.props.children, this._entity);
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      debug(__com__, 'componentDidMount', this.props.children, this._entity);
      var _props = this.props,
          __map__ = _props.__map__,
          options = _props.options,
          events = _props.events,
          children = _props.children;
      //let opts = { ...(options || {}), map: __map__, content: children };

      var opts = _extends({}, options || {}, { map: __map__ });
      this._entity = createMarker(opts, events);
      if (this._entity) {
        if (this.props.refer) this.props.refer(this._entity);
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      debug(__com__, 'componentWillReceiveProps', this.props.children, this._entity);
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate() {
      debug(__com__, 'componentWillUpdate', this.props.children, this._entity);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      debug(__com__, 'componentDidUpdate', this.props.children, this._entity);
      var _props2 = this.props,
          __map__ = _props2.__map__,
          options = _props2.options,
          events = _props2.events,
          children = _props2.children;
      //let opts = { ...(options || {}), map: __map__, content: children };

      var opts = _extends({}, options || {}, { map: __map__ });
      if (!this._entity) {
        this._entity = createMarker(opts, events);
        if (this._entity) {
          if (this.props.refer) this.props.refer(this._entity);
        }
        return;
      }

      // need check props changes, then update.
      var oldOpts = _extends({}, prevProps.options || {}, {
        map: prevProps.__map__,
        content: prevProps.children
      });
      updateMarker(this._entity, opts, events, oldOpts, prevProps.events);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      debug(__com__, 'componentWillUnmount', this.props.children, this._entity);
      if (this._entity) {
        //   this._entity.clearMap();
        this._entity.stopMove();
        this._entity.setMap(null);
        this._entity = null;
        if (this.props.refer) this.props.refer(this._entity);
      }
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //   debug(__com__, 'shouldComponentUpdate', this._entity);
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
      debug(__com__, 'render', this._entity);
      return null;
    }
  }]);

  return Marker;
}(Component);

Marker.propTypes = {
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
export default Marker;