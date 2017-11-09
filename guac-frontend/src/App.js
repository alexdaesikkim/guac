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
      song_num: 0,
      song:{
        name: '',
        artist: '',
        level: '',
        difficulty: ''
      },
      songs: [],
      status: ""
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
    var that = this;
    $.ajax({
      url: '/'+that.state.game_id+'/'+that.state.min_level+'/'+that.state.max_level,
      method: 'GET',
      success: function(data){
        that.setState({
          song:{
            name: data.name,
            artist: data.artist,
            level: data.level,
            difficulty: data.difficulty
          }
        });
      },
      error: function(data){
      }
    })
  },

  handleDDRCall(){
      var that = this;
      var songnum = parseInt(this.state.song_num, 10) + 3;
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
              card_class: " selected"
            }
            return object;
          })
          that.setState({
            songs: songs,
            status: ""
          });
        },
        error: function(data){
        }
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
        max_level = 9;
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

  ddr_song_inputform(){
    if(this.state.game_id === 'ddr'){
      return(
        <div>
          Number of Players:
          <input type="number" className="form-control" value={this.state.song_num} onChange={this.changeSongNum}></input>
        </div>
      )
    }
  },

  displayLevelForm(){
    if(this.state.game_id === 'ddr'){
      return(
        //form for min_level
        <div>
          <div>
            Min Level:
            <input type="number" className="form-control" value={this.state.min_level} onChange={this.changeMinLevel}></input>
            Max Level:
            <input type="number" className="form-control" value={this.state.max_level} onChange={this.changeMaxLevel}></input>
            Number of Players (+3 songs grabbed):
            <input type="number" className="form-control" value={this.state.song_num} onChange={this.changeSongNum}></input>
          </div>
          <div className="row">
            <div className="col-sm-6 justify-content-center">
              Grab {this.state.song_num} Random Songs (Lvl {this.state.min_level} ~ {this.state.max_level})
            </div>
          </div>
          <button className="btn btn-primary" onClick={this.handleDDRCall}>Submit</button>
        </div>
      );
    }
    else if(this.state.game_id !== ''){
      return(
        //form for min_level
        <div>
          <div>
            Min Level:
            <input type="number" className="form-control" value={this.state.min_level} onChange={this.changeMinLevel}></input>
            Max Level:
            <input type="number" className="form-control" value={this.state.max_level} onChange={this.changeMaxLevel}></input>
            {this.ddr_song_inputform()}
          </div>
          <div className="row">
            <div className="col-sm-6 justify-content-center">
              Grab Random Song (Lvl {this.state.min_level} ~ {this.state.max_level})
            </div>
          </div>
          <button className="btn btn-primary" onClick={this.handleRandomCall}>Submit</button>
        </div>
      );
    }
    else return null;
  },

  displaySong(){
    if(this.state.game_id === "ddr"){
      var ddr_songs = this.state.songs.map(function(obj){
        return(
          <Song song={obj} key={"song_"+obj.name + " " + obj.difficulty} />
        )
      })
      return(
        <div className="row justify-content-center">
          {ddr_songs}
        </div>
      )
    }
    else return(
      <div>
        {this.state.song.name}
        <br/>
        {this.state.song.artist}
        <br/>
        {this.state.song.difficulty + " " + this.state.song.level}
      </div>
    )
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
        </p>
        <div className="container">
          {this.state.game_name}
          <br/>
          {this.dropdown()}
          <br/>
          {this.displayLevelForm()}
          <br/>
          {this.displaySong()}
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
    else{
      this.setState({
        class: " selected"
      })
    }
  },

  render() {
    var c = "card" + this.state.class;
    console.log(c);
    return (
        <div className={c}>
          <div className="card-body" style={{width: 225}} onClick={this.onClickChange}>
            <h5 className="card-title">{this.props.song.name}</h5>
            <h6 className="card-subtitle mb-4 text-muted">{this.props.song.artist}</h6>
            <h6 className="card-subtitle mb-4">{this.props.song.difficulty + " " + this.props.song.level}</h6>
          </div>
        </div>
    );
  }
});

export default App;
