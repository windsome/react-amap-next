import React, { Component } from 'react';
import './App.css';

import { loadMap } from './api';
import Map from './Map';
import Marker from './Marker';

class App extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    loadMap('0325e3d6d69cd56de4980b4f28906fd8').then(AMap => {
      let satellite = new AMap.TileLayer.Satellite();
      let roadNet = new AMap.TileLayer.RoadNet();
      let traffic = new AMap.TileLayer.Traffic({
        autoRefresh: true, //是否自动刷新，默认为false
        interval: 5 //刷新间隔，默认180s
      });
      this.setState({ AMap, layers: [satellite, roadNet, traffic] });
    });
  }

  render() {
    return (
      <div>
        <div style={{margin:2}}>
          <span style={{marginRight:2}}>改Map位置:</span>
          <input type='button' onClick={() => this.setState({ center: [116.39, 39.9] })} value='北京' />
          <span onClick={() => this.setState({ center: [115.39, 38.9] })}>
            北京-1
          </span>
          <span onClick={() => this.setState({ center: [114.39, 37.9] })}>
            北京-2
          </span>
        </div>
        <div style={{margin:2}}>
          <span style={{marginRight:2}}>改Marker位置:</span>
          <span onClick={() => this.setState({ showMarker: !this.state.showMarker })}>
            {this.state.showMarker && '隐藏'}
            {!this.state.showMarker && '显示'}
          </span>
          <span onClick={() => this.setState({ position: [116.39, 39.9] })}>
            北京
          </span>
          <span onClick={() => this.setState({ position: [115.39, 38.9] })}>
            北京-1
          </span>
          <span onClick={() => this.setState({ position: [114.39, 37.9] })}>
            北京-2
          </span>
        </div>
        <Map
          AMap={this.state.AMap}
          options={{ center: this.state.center, layers: this.state.layers }}
          style={{ width: 700, height: 800 }}
        >
          {this.state.showMarker &&
          <Marker
            AMap={this.state.AMap}
            options={{
              icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
              position: this.state.position || [116.405467, 39.907761]
            }}
          >
          </Marker>
          }
          <Marker
            AMap={this.state.AMap}
            options={{
              icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
              position: [116.406467, 39.908761],
              content:'<div class="marker-route marker-marker-bus-from"></div>'
            }}
          >
          </Marker>
        </Map>
      </div>
    );
  }
}

export default App;
