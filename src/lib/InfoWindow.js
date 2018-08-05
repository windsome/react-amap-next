import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { createInfoWindow, updateInfoWindow } from './api';
const __com__ = 'InfoWindow';
//const debug = console.log;
const debug = () => {};

// https://lbs.amap.com/api/javascript-api/reference/infowindow
export class InfoWindow extends Component {
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

  componentDidMount() {
    debug(__com__, 'componentDidMount', this._entity);
    let { AMap, __map__, options, events, children } = this.props;
    //let opts = { ...(options || {}), map: __map__, content: children };
    let opts = { ...(options || {}), map: __map__ };
    this._entity = createInfoWindow(AMap, opts, events);
  }

  componentDidUpdate(prevProps) {
    debug(__com__, 'componentDidUpdate', this._entity);
    let { AMap, __map__, options, events, children } = this.props;
    //let opts = { ...(options || {}), map: __map__, content: children };
    let opts = { ...(options || {}), map: __map__ };
    if (!this._entity) {
      this._entity = createInfoWindow(AMap, opts, events);
      return;
    }

    // need check props changes, then update.
    let oldOpts = {
      ...(prevProps.options || {}),
      map: prevProps.__map__
    };
    updateInfoWindow(this._entity, opts, events, oldOpts, prevProps.events);
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

  // shouldComponentUpdate(nextProps, nextState) {
  //   debug(__com__, 'shouldComponentUpdate', this._entity);
  //   return false;
  // }
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

export default InfoWindow;
