var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { createMassMarks, updateMassMarks } from './api';
var __com__ = 'MassMarks';
//const debug = console.log;
var debug = function debug() {};

export var MassMarks = function (_Component) {
  _inherits(MassMarks, _Component);

  function MassMarks() {
    _classCallCheck(this, MassMarks);

    var _this = _possibleConstructorReturn(this, (MassMarks.__proto__ || Object.getPrototypeOf(MassMarks)).call(this));

    _this.refElement = null;
    _this._entity = null;
    debug(__com__, 'constructor', _this._entity);
    return _this;
  }

  _createClass(MassMarks, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      debug(__com__, 'componentWillMount', this.props, this._entity);
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      debug(__com__, 'componentDidMount', this.props, this._entity);
      var _props = this.props,
          __map__ = _props.__map__,
          options = _props.options,
          events = _props.events,
          children = _props.children;
      //let opts = { ...(options || {}), map: __map__, content: children };

      var opts = _extends({}, options || {}, { map: __map__ });
      this._entity = createMassMarks(opts, events);
      if (this._entity) {
        if (this.props.refer) this.props.refer(this._entity);
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      debug(__com__, 'componentWillReceiveProps', this.props, this._entity);
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate() {
      debug(__com__, 'componentWillUpdate', this.props, this._entity);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      debug(__com__, 'componentDidUpdate', this.props, this._entity);
      var _props2 = this.props,
          __map__ = _props2.__map__,
          options = _props2.options,
          events = _props2.events;

      var opts = _extends({}, options || {}, { map: __map__ });
      if (!this._entity) {
        debug(__com__, 'componentDidUpdate', opts, events);
        this._entity = createMassMarks(opts, events);
        if (this._entity) {
          if (this.props.refer) this.props.refer(this._entity);
        }
        return;
      }

      // need check props changes, then update.
      var oldOpts = _extends({}, prevProps.options || {}, {
        map: prevProps.__map__
      });
      updateMassMarks(this._entity, opts, events, oldOpts, prevProps.events);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      debug(__com__, 'componentWillUnmount', this.props, this._entity);
      if (this._entity) {
        this._entity.setMap(null);
        // delete this._entity;
        this._entity = null;
        if (this.props.refer) this.props.refer(this._entity);
      }
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //   debug(__com__, 'shouldComponentUpdate', this._entity);
    //   return false;
    // }

  }, {
    key: 'render',
    value: function render() {
      debug(__com__, 'render', this._entity);
      return null;
    }
  }]);

  return MassMarks;
}(Component);

MassMarks.propTypes = {
  __map__: PropTypes.object,
  options: PropTypes.object,
  events: PropTypes.object
};
export default MassMarks;