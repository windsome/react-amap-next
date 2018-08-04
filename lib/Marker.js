'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Marker = undefined;

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = babelHelpers.interopRequireDefault(_propTypes);

var _api = require('./api');

var __com__ = 'Marker';
//const debug = console.log;
var debug = function debug() {};

var Marker = exports.Marker = function (_Component) {
  babelHelpers.inherits(Marker, _Component);

  function Marker() {
    babelHelpers.classCallCheck(this, Marker);

    var _this = babelHelpers.possibleConstructorReturn(this, (Marker.__proto__ || Object.getPrototypeOf(Marker)).call(this));

    _this.refElement = null;
    _this._entity = null;
    debug(__com__, 'constructor', _this._entity);
    return _this;
  }

  babelHelpers.createClass(Marker, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      debug(__com__, 'componentWillMount', this.props.children, this._entity);
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      debug(__com__, 'componentDidMount', this.props.children, this._entity);
      var _props = this.props,
          AMap = _props.AMap,
          __map__ = _props.__map__,
          options = _props.options,
          events = _props.events,
          children = _props.children;
      //let opts = { ...(options || {}), map: __map__, content: children };

      var opts = babelHelpers.extends({}, options || {}, { map: __map__ });
      this._entity = (0, _api.createMarker)(AMap, opts, events);
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
          AMap = _props2.AMap,
          __map__ = _props2.__map__,
          options = _props2.options,
          events = _props2.events,
          children = _props2.children;
      //let opts = { ...(options || {}), map: __map__, content: children };

      var opts = babelHelpers.extends({}, options || {}, { map: __map__ });
      if (!this._entity) {
        this._entity = (0, _api.createMarker)(AMap, opts, events);
        if (this._entity) {
          if (this.props.refer) this.props.refer(this._entity);
        }
        return;
      }

      // need check props changes, then update.
      var oldOpts = babelHelpers.extends({}, prevProps.options || {}, {
        map: prevProps.__map__,
        content: prevProps.children
      });
      (0, _api.updateMarker)(this._entity, opts, events, oldOpts, prevProps.events);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      debug(__com__, 'componentWillUnmount', this.props.children, this._entity);
      if (this._entity) {
        //   this._entity.clearMap();
        this._entity.stopMove();
        this._entity.setMap(null);
        delete this._entity;
        //   delete this._entity;
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
      debug(__com__, 'render', this.props.children, this._entity);
      var _props3 = this.props,
          AMap = _props3.AMap,
          options = _props3.options,
          events = _props3.events,
          match = _props3.match,
          location = _props3.location,
          history = _props3.history,
          staticContext = _props3.staticContext,
          rest = babelHelpers.objectWithoutProperties(_props3, ['AMap', 'options', 'events', 'match', 'location', 'history', 'staticContext']);

      return null;
      // return (
      //   <React.Fragment>
      //   </React.Fragment>
      // )
    }
  }]);
  return Marker;
}(_react.Component);

Marker.propTypes = {
  AMap: _propTypes2.default.object,
  __map__: _propTypes2.default.object,
  options: _propTypes2.default.object,
  events: _propTypes2.default.object
  //   zoom: PropTypes.number, // 10, //设置地图显示的缩放级别
  //   center: PropTypes.array, // [116.397428, 39.90923]，//设置地图中心点坐标
  //   layers: PropTypes.array, // [new AMap.TileLayer.Satellite()],  //设置图层,可设置成包含一个或多个图层的数组
  //   mapStyle: PropTypes.string, // 'amap://styles/whitesmoke',  //设置地图的显示样式
  //   viewMode: PropTypes.string, // '2D',  //设置地图模式
  //   lang: PropTypes.string, // 'zh_cn',  //设置地图语言类型
  //   events: PropTypes.object, // {'click': function}, // 事件map
};
exports.default = Marker;