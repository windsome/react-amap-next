import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { createMassMarks, updateMassMarks } from './api';
const __com__ = 'MassMarks';
//const debug = console.log;
const debug = () => {};

export class MassMarks extends Component {
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
    debug(__com__, 'componentWillMount', this.props.children, this._entity);
  }

  componentDidMount() {
    debug(__com__, 'componentDidMount', this.props.children, this._entity);
    let { AMap, __map__, options, events, children } = this.props;
    //let opts = { ...(options || {}), map: __map__, content: children };
    let opts = { ...(options || {}), map: __map__ };
    this._entity = createMassMarks(AMap, opts, events);
  }

  componentWillReceiveProps(nextProps) {
    debug(__com__, 'componentWillReceiveProps', this.props.children, this._entity);
  }

  componentWillUpdate() {
    debug(__com__, 'componentWillUpdate', this.props.children, this._entity);
  }

  componentDidUpdate(prevProps) {
    debug(__com__, 'componentDidUpdate', this.props.children, this._entity);
    let { AMap, __map__, options, events, children } = this.props;
    //let opts = { ...(options || {}), map: __map__, content: children };
    let opts = { ...(options || {}), map: __map__ };
    if (!this._entity) {
      this._entity = createMassMarks(AMap, opts, events);
      return;
    }

    // need check props changes, then update.
    let oldOpts = {
      ...(prevProps.options || {}),
      map: prevProps.__map__
    };
    updateMassMarks(this._entity, opts, events, oldOpts, prevProps.events);
  }

  componentWillUnmount() {
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
  render() {
    debug(__com__, 'render', this.props.children, this._entity);
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

export default MassMarks;
