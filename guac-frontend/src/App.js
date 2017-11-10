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
      min_level: 0,
      max_level: 0,
      abs_min: 0,
      abs_max: 0,
      song_num: 1,
      songs: [],
      status: false,
      errors:{
        error_message: "",
        error_class: ""
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

  changeSongNum(event){
    this.setState({
      song_num: event.target.value
    })
  },

  handleRandomCall(){
    if(this.state.min_level < this.state.abs_min || this.state.max_level > this.state.abs_max || this.state.min_level > this.state.max_level){
      this.setState({
        errors:{
          error_message: "Level must be between " + this.state.abs_min + " and " + this.state.abs_max + ". Please try again",
          error_class: "alert-warning"
        }
      })
    }
    else{
      this.setState({
        status: true
      }, this.grabRandomSongs());
    }
  },

  grabRandomSongs(){
    var that = this;
    var songnum = parseInt(this.state.song_num, 10);
    var song_class = "";
    if(this.state.game_id === "ddr"){
      songnum += 3;
      song_class = " selected";
    }
    $.ajax({
      url: '/'+that.state.game_id+'/'+that.state.min_level+'/'+that.state.max_level+'/'+songnum,
      method: 'GET',
      success: function(data){
        var songs = data.songs;
        songs = songs.map(function(obj){
          var object = {
            name: obj.name,
            artist: obj.artist,
            level: obj.level,
            difficulty: obj.difficulty,
            card_class: song_class
          }
          return object;
        })
        that.setState({
          songs: songs,
          status: false,
          errors:{
            error_message: "",
            error_class: ""
          }
        });
      },
      error: function(data){
        that.setState({
          songs: [],
          status: false,
          errors:{
            error_message: "There was an error. Please try reloading the page or tweet @supernovamaniac for support",
            error_class: "alert-danger"
          }
        })
      }
    })
  },

  handleChangeGameName(event){
    var game_id = event.target.id;
    var game_name = "";
    var min_level = 0;
    var max_level = 0;
    var abs_min = 0;
    var abs_max = 0;
    switch(event.target.id){
      case "iidx":
        game_name = "Beatmania IIDX Copula";
        min_level = 9;
        max_level = 9;
        abs_min = 9;
        abs_max = 9;
        break;
      case "ddr":
        game_name = "Dance Dance Revolution 2014";
        min_level = 1;
        max_level = 19;
        abs_min = 1;
        abs_max = 19;
        break;
      case "popn":
        game_name = "Pop'n Music éclale";
        min_level = 1;
        max_level = 50;
        abs_min = 1;
        abs_max = 50;
        break;
      case "jubeat":
        game_name = "jubeat Qubell";
        min_level = 1;
        max_level = 10;
        abs_min = 1;
        abs_max = 10;
        break;
      case "museca":
        game_name = "Museca 1+1/2";
        min_level = 1;
        max_level = 15;
        abs_min = 1;
        abs_max = 15;
        break;
      case "reflec":
        game_name = "REFLEC BEAT 悠久のリフレシア";
        min_level = 1;
        max_level = 15;
        abs_min = 1;
        abs_max = 15;
        break;
      default: break;
    };
    this.setState({
      game_id: game_id,
      game_name: game_name,
      min_level: min_level,
      max_level: max_level,
      abs_min: abs_min,
      abs_max: abs_max,
      song_num: 1
    });

  },

  dropdown(){
    var button_value = (this.state.game_id === '' ? "SELECT GAME" : this.state.game_id.toUpperCase());

    return(
      <div className="row justify-content-center">
        <div className="col-2">
          <div className="dropdown">
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

  num_inputform(){
    if(this.state.game_id === 'ddr'){
      return(
        <div>
          Number of Players (# of Players + 3 songs will be grabbed):
        </div>
      )
    }
    else{
      return(
        <div>
          Number of Songs:
        </div>
      )
    }
  },

  displayLevelForm(){
    if(this.state.game_id !== ''){
      return(
        //form for min_level
        <div>
          <div>
            <div className="row justify-content-center">
              <div className="col-1">
                Min Level:
                <input type="number" className="form-control" value={this.state.min_level} onChange={this.changeMinLevel}></input>
              </div>
              <div className="col-1">
                Max Level:
                <input type="number" className="form-control" value={this.state.max_level} onChange={this.changeMaxLevel}></input>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-12">
                {this.num_inputform()}
              </div>
              <div className="col-1">
                <input type="number" className="form-control" value={this.state.song_num} onChange={this.changeSongNum}></input>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col">
              <button className="btn btn-primary" onClick={this.handleRandomCall}>Submit</button>
            </div>
          </div>
        </div>
      );
    }
    else return null;
  },

  displayAlert(){
    if(this.state.errors.error_class !== ''){
      return(
        <div className="row justify-content-center">
          <div className="col-6">
            <div className={"alert " + this.state.errors.error_class} role="alert">
              {this.state.errors.error_message}
            </div>
          </div>
        </div>
      )
    }
  },

  displaySongs(){
    if(this.state.status){
      return(
        <div className="row justify-content-center">
          <div className="loader"></div>
        </div>
      )
    }
    else{
      var song_cards = this.state.songs.map(function(obj){
        return(
          <Song song={obj} key={obj.name + "_" + obj.difficulty} />
        )
      })

      return(
        <div className="row justify-content-center">
          {song_cards}
        </div>
      )
    }
  },

  render() {
    var song_cards = this.state.songs.map(function(obj){
      return(
        <Song song={obj} key={obj.name + "_" + obj.difficulty} />
      )
    })
    return (
      <div className="App">
        <header className="App-header">
          <div className="container">
            <h2>GUAC Randomizer</h2>
            <br/>
            {this.dropdown()}
            <h2>
              {this.state.game_name}
            </h2>
            {this.displayLevelForm()}
          </div>
        </header>
        <br/>
        {this.displayAlert()}
        <br/>
        <div className="container">
          {this.displaySongs()}
          <br/>
        </div>
      </div>
    );
  }
});

var Song = createReactClass({
  getInitialState(){
    return{
      class: this.props.song.card_class
    }
  },

  onClickChange(){
    if(this.state.class === " selected"){
      this.setState({
        class: " deselected"
      })
    }
    else if(this.state.class === " deselected"){
      this.setState({
        class: " selected"
      })
    }
  },

  render() {
    var c = "card" + this.state.class;
    var w = 225;
    if(this.state.class === ""){
      w = 300;
    }
    return (
        <div className={c}>
          <div className="card-body" style={{width: w}} onClick={this.onClickChange}>
            <h5 className="card-title">{this.props.song.name}</h5>
            <h5 className="card-subtitle mb-4">{this.props.song.artist}</h5>
            <h6 className="card-subtitle mb-4">{this.props.song.difficulty + " " + this.props.song.level}</h6>
          </div>
        </div>
    );
  }
});

export default App;
