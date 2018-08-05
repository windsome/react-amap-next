var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { createPolyline, updatePolyline } from './api';
var __com__ = 'Polyline';
//const debug = console.log;
var debug = function debug() {};

export var Polyline = function (_Component) {
  _inherits(Polyline, _Component);

  function Polyline() {
    _classCallCheck(this, Polyline);

    var _this = _possibleConstructorReturn(this, (Polyline.__proto__ || Object.getPrototypeOf(Polyline)).call(this));

    _this.refElement = null;
    _this._entity = null;
    debug(__com__, 'constructor', _this._entity);
    return _this;
  }

  _createClass(Polyline, [{
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

      var opts = _extends({}, options || {}, { map: __map__ });
      this._entity = createPolyline(AMap, opts, events);
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

      var opts = _extends({}, options || {}, { map: __map__ });
      if (!this._entity) {
        this._entity = createPolyline(AMap, opts, events);
        return;
      }

      // need check props changes, then update.
      var oldOpts = _extends({}, prevProps.options || {}, {
        map: prevProps.__map__
      });
      updatePolyline(this._entity, opts, events, oldOpts, prevProps.events);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      debug(__com__, 'componentWillUnmount', this.props.children, this._entity);
      if (this._entity) {
        //   this._entity.clearMap();
        this._entity.setMap(null);
        delete this._entity;
        //   delete this._entity;
        this._entity = null;
      }
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //   debug(__com__, 'shouldComponentUpdate', this._entity);
    //   return false;
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
          rest = _objectWithoutProperties(_props3, ['AMap', 'options', 'events', 'match', 'location', 'history', 'staticContext']);

      return null;
      // return (
      //   <React.Fragment>
      //   </React.Fragment>
      // )
    }
  }]);

  return Polyline;
}(Component);

Polyline.propTypes = {
  AMap: PropTypes.object,
  __map__: PropTypes.object,
  options: PropTypes.object,
  events: PropTypes.object
};
export default Polyline;