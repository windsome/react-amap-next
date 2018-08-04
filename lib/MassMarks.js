import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { createMassMarks, updateMassMarks } from './api';
var __com__ = 'MassMarks';
//const debug = console.log;
var debug = function debug() {};

export var MassMarks = function (_Component) {
  babelHelpers.inherits(MassMarks, _Component);

  function MassMarks() {
    babelHelpers.classCallCheck(this, MassMarks);

    var _this = babelHelpers.possibleConstructorReturn(this, (MassMarks.__proto__ || Object.getPrototypeOf(MassMarks)).call(this));

    _this.refElement = null;
    _this._entity = null;
    debug(__com__, 'constructor', _this._entity);
    return _this;
  }

  babelHelpers.createClass(MassMarks, [{
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
      this._entity = createMassMarks(AMap, opts, events);
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
        this._entity = createMassMarks(AMap, opts, events);
        return;
      }

      // need check props changes, then update.
      var oldOpts = babelHelpers.extends({}, prevProps.options || {}, {
        map: prevProps.__map__
      });
      updateMassMarks(this._entity, opts, events, oldOpts, prevProps.events);
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
          rest = babelHelpers.objectWithoutProperties(_props3, ['AMap', 'options', 'events', 'match', 'location', 'history', 'staticContext']);

      return null;
      // return (
      //   <React.Fragment>
      //   </React.Fragment>
      // )
    }
  }]);
  return MassMarks;
}(Component);

MassMarks.propTypes = {
  AMap: PropTypes.object,
  __map__: PropTypes.object,
  options: PropTypes.object,
  events: PropTypes.object
};
export default MassMarks;