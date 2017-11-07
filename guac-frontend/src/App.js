import React from 'react';
import logo from './logo.svg';
import './App.css';
import $ from 'jquery';

var createReactClass = require('create-react-class');

var App = createReactClass({
  getInitialState(){
    return{
      game_id: '',
      game_name: '',
      min_level: '',
      max_level: '',
      song:{
        name: '',
        artist: '',
        level: '',
        difficulty: ''
      }
    }
  },

  changeMinLevel(event){
    this.setState({
      min_level: event.target.value
    })
  },

  changeMaxLevel(event){
    this.setState({
      max_level: event.target.value
    })
  },

  handleChangeGameName(event){
    var game_id = event.target.id;
    var game_name = "";
    var min_level = 0;
    var max_level = 0;
    switch(event.target.id){
      case "iidx":
        game_name = "Beatmania IIDX Copula";
        min_level = 9;
        max_level = 12;
        break;
      case "ddr":
        game_name = "Dance Dance Revolution 2014";
        min_level = 1;
        max_level = 19;
        break;
      case "popn":
        game_name = "Pop'n Music Lapistoria";
        min_level = 1;
        max_level = 50;
        break;
      case "jubeat":
        game_name = "jubeat Qubell";
        min_level = 1;
        max_level = 10;
        break;
      case "museca":
        game_name = "Museca 1+1/2";
        min_level = 1;
        max_level = 15;
        break;
      case "reflec":
        game_name = "REFLEC BEAT 悠久のリフレシア";
        min_level = 1;
        max_level = 15;
        break;
      default: break;
    };
    this.setState({
      game_id: game_id,
      game_name: game_name,
      min_level: min_level,
      max_level: max_level
    });
  },

  dropdown(){
    var button_value = (this.state.game_name === "" ? "Select" : this.state.game_id.toUpperCase());

    return(
      <div className="col-12 col-md-6 col-lg-4">
        <div className="input-group">
          <div className="input-group-btn">
            <button type="button" id="dropdown" className="btn btn-danger dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              {button_value}
            </button>
            <div className="dropdown-menu">
              <div className="dropdown-item" id="iidx" onClick={this.handleChangeGameName}>IIDX</div>
              <div className="dropdown-item" id="ddr" onClick={this.handleChangeGameName}>DDR</div>
              <div className="dropdown-item" id="popn" onClick={this.handleChangeGameName}>POPN</div>
              <div className="dropdown-item" id="jubeat" onClick={this.handleChangeGameName}>JUBEAT</div>
              <div className="dropdown-item" id="museca" onClick={this.handleChangeGameName}>MUSECA</div>
              <div className="dropdown-item" id="reflec" onClick={this.handleChangeGameName}>REFLEC</div>
            </div>
          </div>
        </div>
      </div>
    );
  },

  displayLevelForm(){
    if(this.state.game_id !== ''){
      return(
        //form for min_level
        <div>
          <div>
            <input type="number" className="form-control" value={this.state.min_level} onChange={this.changeMinLevel}></input>
            <input type="number" className="form-control" value={this.state.max_level} onChange={this.changeMaxLevel}></input>
          </div>
          <div className="row">
            <div className="col-sm-6 justify-content-center">
              Grab Random Song (Lvl {this.state.min_level} ~ {this.state.max_level})
            </div>
          </div>
        </div>
      );
    }
    else return null;
  },

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
          <br/>
          {this.state.game_name}
        </p>
        {this.dropdown()}
        <br/>
        {this.displayLevelForm()}
      </div>
    );
  }
});

export default App;
