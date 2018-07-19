import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { createPolygon, updatePolygon } from './api';
const __com__ = 'Polygon';
//const debug = console.log;
const debug = () => {};

export class Polygon extends Component {
  static propTypes = {
    AMap: PropTypes.object,
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
    debug(__com__, 'componentWillMount', this._entity);
  }

  componentDidMount() {
    debug(__com__, 'componentDidMount', this._entity);
    let { AMap, __map__, options, events, children } = this.props;
    //let opts = { ...(options || {}), map: __map__, content: children };
    let opts = { ...(options || {}), map: __map__ };
    this._entity = createPolygon(AMap, opts, events);
  }

  componentWillReceiveProps(nextProps) {
    debug(__com__, 'componentWillReceiveProps', this._entity);
  }

  componentWillUpdate() {
    debug(__com__, 'componentWillUpdate', this._entity);
  }

  componentDidUpdate(prevProps) {
    debug(__com__, 'componentDidUpdate', this._entity);
    let { AMap, __map__, options, events, children } = this.props;
    //let opts = { ...(options || {}), map: __map__, content: children };
    let opts = { ...(options || {}), map: __map__ };
    if (!this._entity) {
      this._entity = createPolygon(AMap, opts, events);
      return;
    }

    // need check props changes, then update.
    let oldOpts = {
      ...(prevProps.options || {}),
      map: prevProps.__map__
    };
    updatePolygon(this._entity, opts, events, oldOpts, prevProps.events);
  }

  componentWillUnmount() {
    debug(__com__, 'componentWillUnmount', this._entity);
    if (this._entity) {
      //   this._entity.clearMap();
      this._entity.setMap(null);
      delete this._entity;
      //   delete this._entity;
      this._entity = null;
    }
  }

  render() {
    debug(__com__, 'render', this._entity);
    let {
      AMap,
      options,
      events,
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

export default Polygon;
