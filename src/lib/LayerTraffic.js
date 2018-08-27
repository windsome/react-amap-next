import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { createTraffic, updateTraffic } from './api';
const __com__ = 'Traffic';
//const debug = console.log;
const debug = () => {};

export class Traffic extends Component {
  static propTypes = {
    __map__: PropTypes.object,
    options: PropTypes.object,
    events: PropTypes.object
  };

  constructor() {
    super();
    this.refElement = null;
    this._entity = null;
    debug(__com__, 'constructor', this._entity);
  }

  componentWillMount() {
    debug(__com__, 'componentWillMount', this.props, this._entity);
  }

  componentDidMount() {
    debug(__com__, 'componentDidMount', this.props, this._entity);
    let { __map__, options, events, children } = this.props;
    //let opts = { ...(options || {}), map: __map__, content: children };
    let opts = { ...(options || {}), map: __map__ };
    this._entity = createTraffic(opts, events);
    if (this._entity) {
      if (this.props.refer) this.props.refer(this._entity);
    }
  }

  componentWillReceiveProps(nextProps) {
    debug(__com__, 'componentWillReceiveProps', this.props, this._entity);
  }

  componentWillUpdate() {
    debug(__com__, 'componentWillUpdate', this.props, this._entity);
  }

  componentDidUpdate(prevProps) {
    debug(__com__, 'componentDidUpdate', this.props, this._entity);
    let { __map__, options, events } = this.props;
    let opts = { ...(options || {}), map: __map__ };
    if (!this._entity) {
      debug(__com__, 'componentDidUpdate', opts, events);
      this._entity = createTraffic(opts, events);
      if (this._entity) {
        if (this.props.refer) this.props.refer(this._entity);
      }
      return;
    }

    // need check props changes, then update.
    let oldOpts = {
      ...(prevProps.options || {}),
      map: prevProps.__map__
    };
    updateTraffic(this._entity, opts, events, oldOpts, prevProps.events);
  }

  componentWillUnmount() {
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
  render() {
    debug(__com__, 'render', this._entity);
    return null;
  }
}

export default Traffic;
