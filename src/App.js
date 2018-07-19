import React, { Component } from 'react';
import cx from 'classnames';
import './App.css';

import loadJs from './loadScript';
import { loadMap } from './api';
import Map from './Map';
import Marker from './Marker';
import MassMarks from './MassMarks';

class MarkerTest extends Component {
  constructor() {
    super();
    this.state = {};
    this._mapDblclick = this._mapDblclick.bind(this);
  }

  componentDidMount() {
    loadMap('0325e3d6d69cd56de4980b4f28906fd8').then(AMap => {
      let satellite = new AMap.TileLayer.Satellite();
      let roadNet = new AMap.TileLayer.RoadNet();
      let traffic = new AMap.TileLayer.Traffic({
        autoRefresh: true, //是否自动刷新，默认为false
        interval: 5 //刷新间隔，默认180s
      });
      this.setState({ AMap, layers: [roadNet, traffic] });
    });
  }

  _mapDblclick() {
    this.setState({msg:'双击了Map!'});
  }

  render() {
    return (
      <div>
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
        <div style={{margin:2}}>
          {'消息:'+this.state.msg}
        </div>
        <Map
          AMap={this.state.AMap}
          style={{ width: 700, height: 800 }}
          options={{ center: this.state.center, layers: this.state.layers }}
          events={{
            click:e=>this.setState({msg: '点击了Map'}),
            dblclick: this._mapDblclick,
          }}
      >
          {this.state.showMarker &&
          <Marker
            AMap={this.state.AMap}
            options={{
              icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
              position: this.state.position || [116.405467, 39.907761]
            }}
            events={{
              click:e=>this.setState({msg: '点击了Marker1'}),
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
            events={{
              click:e=>this.setState({msg: '点击了Marker2'})
            }}
          >
          </Marker>
        </Map>
      </div>
      </div>
    );
  }

}


class MassMarkTest extends Component {
  constructor() {
    super();
    this.state = {};
    this._mapDblclick = this._mapDblclick.bind(this);
    this._changeStyle = this._changeStyle.bind(this);
  }

  componentDidMount() {
    loadMap('0325e3d6d69cd56de4980b4f28906fd8').then(AMap => {
      let roadNet = new AMap.TileLayer.RoadNet();
      let traffic = new AMap.TileLayer.Traffic({
        autoRefresh: true, //是否自动刷新，默认为false
        interval: 15 //刷新间隔，默认180s
      });
      let style = [{
        url: 'https://a.amap.com/jsapi_demos/static/images/mass0.png',
        anchor: new AMap.Pixel(16, 16),
        size: new AMap.Size(21, 21)
      },{
        url: 'https://a.amap.com/jsapi_demos/static/images/mass1.png',
        anchor: new AMap.Pixel(24, 24),
        size: new AMap.Size(17, 17)
      },{
        url: 'https://a.amap.com/jsapi_demos/static/images/mass2.png',
        anchor: new AMap.Pixel(23, 23),
        size: new AMap.Size(5, 5)
      }
    ];

      this.setState({ AMap, layers: [roadNet, traffic], style });
    });
    loadJs('https://a.amap.com/jsapi_demos/static/citys.js','js').then(ret => {
      console.log('ret:', ret, window.citys);
      // this.setState({citys:window.citys});
      let citys = window.citys.map ((item, index) => {
        return {...item, id: index};
      })
      this.setState({citys});
    })
  }

  _mapDblclick() {
    this.setState({msg:'双击了Map!'});
  }
  _changeStyle(item) {
    let style = (item.style+1) % 3;
    let data = this.state.citys
    let data2 = [...data];
    data2[item.id] = {...item, style};
    this.setState({citys:data2});
  }

  render() {
    return (
      <div>
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
          {'消息:'+this.state.msg}
        </div>
        <Map
          AMap={this.state.AMap}
          style={{ width: 1100, height: 800 }}
          options={{ center: this.state.center, layers: this.state.layers }}
          events={{
            // click:e=>this.setState({msg: '点击了Map'}),
            dblclick: this._mapDblclick,
          }}
      >
          <MassMarks
            AMap={this.state.AMap}
            options={{
              data: this.state.citys,
              opacity:0.8,
              zIndex: 111,
              cursor:'pointer',
              style: this.state.style
            }}
            events={{
              click:e=> {
                console.log('e:', e);
                this._changeStyle(e.data);
                this.setState({msg: '点击了MassMarks:'+JSON.stringify(e.data)})
              }
            }}
          >
          </MassMarks>
        </Map>
      </div>
      </div>
    );
  }

}

class App extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <div>
        <div>
          <span style={{padding:5, margin: 5, backgroundColor:(this.state.test === 'marker')?'#ff0':'#fff'}} onClick={()=>this.setState({test: 'marker'})}> MarkerTest </span>
          <span style={{padding:5, margin: 5, backgroundColor:(this.state.test === 'massmarks')?'#ff0':'#fff'}} onClick={()=>this.setState({test: 'massmarks'})}> MassMarksTest </span>
          <span style={{padding:5, margin: 5, backgroundColor:(this.state.test === 'mess')?'#ff0':'#fff'}} onClick={()=>this.setState({test: 'mess'})}> MessMarkerTest </span>
        </div>
        <div>
          {this.state.test === 'marker' &&
          <MarkerTest />
          }
          {this.state.test === 'massmarks' &&
          <MassMarkTest />
          }
          
        </div>
      </div>
    );
  }
}

export default App;
