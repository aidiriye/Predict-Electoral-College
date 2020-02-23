import React from 'react';
//import logo from './logo.svg';
import './App.css';

const PaletteCode = ["gray", "blue", "red"];

function USState(props) {
  return (
    <div class="state_container">
      <div class="state_name_container">{props.name}</div>
      <div class="state_button_container">
        <button onClick={props.onClick}
              style={{backgroundColor: PaletteCode[props.winner]}}>A</button>
      </div>
    </div>
  ); 
}

function PaletteOption(props) {
  return (
    <button className={"palette-button " + (props.isSelected ? "palette-selected" : null)}
        onClick={props.onClick}>
    </button>
  );
}

// For Palette: 0 = blank, 1 = dem, 2 = rep
class App extends React.Component {
  getDefaultStateBoard() {
    return {"alabama":{"color":0,"delegates":9},
              "alaska":{"color":0,"delegates":3},
              "arizona":{"color":0,"delegates":11},
              "arkansas":{"color":0,"delegates":6},
              "california":{"color":0,"delegates":55},
              "colorado":{"color":0,"delegates":9},
              "connecticut":{"color":0,"delegates":7},
              "dc":{"color":0,"delegates":3},
              "delaware":{"color":0,"delegates":3},
              "florida":{"color":0,"delegates":29},
              "georgia":{"color":0,"delegates":16},
              "hawaii":{"color":0,"delegates":4},
              "idaho":{"color":0,"delegates":4},
              "illinois":{"color":0,"delegates":20},
              "indiana":{"color":0,"delegates":11},
              "iowa":{"color":0,"delegates":6},
              "kansas":{"color":0,"delegates":6},
              "kentucky":{"color":0,"delegates":8},
              "louisiana":{"color":0,"delegates":8},
              "maine":{"color":0,"delegates":4},
              "maryland":{"color":0,"delegates":10},
              "massachusetts":{"color":0,"delegates":11},
              "michigan":{"color":0,"delegates":16},
              "minnesota":{"color":0,"delegates":10},
              "mississippi":{"color":0,"delegates":6},
              "missouri":{"color":0,"delegates":10},
              "montana":{"color":0,"delegates":3},
              "nebraska":{"color":0,"delegates":5},
              "nevada":{"color":0,"delegates":6},
              "new hampshire":{"color":0,"delegates":4},
              "new jersey":{"color":0,"delegates":14},
              "new mexico":{"color":0,"delegates":5},
              "new york":{"color":0,"delegates":29},
              "north carolina":{"color":0,"delegates":15},
              "north dakota":{"color":0,"delegates":3},
              "ohio":{"color":0,"delegates":18},
              "oklahoma":{"color":0,"delegates":7},
              "oregon":{"color":0,"delegates":7},
              "pennsylvania":{"color":0,"delegates":20},
              "rhode island":{"color":0,"delegates":4},
              "south carolina":{"color":0,"delegates":9},
              "south dakota":{"color":0,"delegates":3},
              "tennessee":{"color":0,"delegates":11},
              "texas":{"color":0,"delegates":38},
              "utah":{"color":0,"delegates":6},
              "vermount":{"color":0,"delegates":3},
              "virginia":{"color":0,"delegates":13},
              "washington":{"color":0,"delegates":12},
              "west virginia":{"color":0,"delegates":5},
              "wisconsin":{"color":0,"delegates":10},
              "wyoming":{"color":0,"delegates":3}};
  }

  getDefaultRatings() {
    return {"lean_blue":["nevada","minnesota","michigan",
              "new hampshire","maine"],
            "lean_red":["iowa","ohio","georgia"],
            "likely_blue":["colorado","new mexico","virginia"],
            "likely_red":["texas"],
            "safe_blue":["washington","oregon","california",
              "illinois","new york", "vermount","massachusetts",
              "rhode island","connecticut","new jersey",
              "delaware","maryland","dc","hawaii"],
            "safe_red":["alaska","idaho","utah","montana",
              "wyoming","north dakota",
              "south dakota","nebraska","kansas",
              "oklahoma","indiana","south carolina",
              "kentucky","west virginia","tennessee",
              "alabama","mississippi","louisiana",
              "arkansas","missouri"],
            "tossup":["wisconsin","pennsylvania",
              "north carolina","florida","arizona"]};
  }

  constructor(props) {
    super(props);
    this.state = {
      delegates: {dem_delegates: 0, rep_delegates: 0},
      palette: [true, false, false],
      currColor: 0, 
      state_board: this.getDefaultStateBoard(),
      ratings: this.getDefaultRatings()
    }
  }

  handlePaletteClick(i) {
    var palette = [false, false, false];
    palette[i] = true;
    this.setState({palette: palette, currColor: i});
  }

  renderPaletteOption(i) {
    return (
      <PaletteOption 
        isSelected={this.state.palette[i]} 
        onClick={() => this.handlePaletteClick(i)}
      />
    );
  }

  handleUSStateClick(name) {
    const stateColor = this.state.state_board[name].color;
    if (this.state.currColor != stateColor) { //Do nothing if matches current color
      var state_board = {};
      Object.assign(state_board, this.state.state_board);
      state_board[name].color = this.state.currColor;
      var delegates = {};
      Object.assign(delegates, this.state.delegates);
      if (this.state.currColor == 1) {
        delegates.dem_delegates += this.state.state_board[name].delegates;
        if (stateColor == 2) {
          delegates.rep_delegates -= this.state.state_board[name].delegates;
        }
        this.setState({delegates: delegates, state_board: state_board});
      } else if (this.state.currColor == 2) {
        delegates.rep_delegates += this.state.state_board[name].delegates;
        if (stateColor == 1) {
          delegates.dem_delegates -= this.state.state_board[name].delegates;
        }
        this.setState({delegates: delegates, state_board: state_board});
      } else {
        if (stateColor == 1) {
          delegates.dem_delegates -= this.state.state_board[name].delegates;
          this.setState({delegates: delegates, state_board: state_board});
        } else {
          delegates.rep_delegates -= this.state.state_board[name].delegates;
          this.setState({delegates: delegates, state_board: state_board});
        }
      }
    }
  }

  renderUSState(name) {
    return (
      <USState name={name} onClick={() => this.handleUSStateClick(name)}
        winner={this.state.state_board[name].color}
      />
    );
  }

  getStatesWithRatings(rating) {
    const stateNames = this.state.ratings[rating];
    const stateComponents = stateNames.map(name => this.renderUSState(name));
    return stateComponents;
  }

  handleResetClick() {
    this.setState({
      delegates: {dem_delegates: 0, rep_delegates: 0},
      palette: [true, false, false],
      currColor: 0, 
      state_board: this.getDefaultStateBoard(),
      ratings: this.getDefaultRatings()
    });
  }

  render() {
    return (
      <div>
        <div>Make You Election Prediction</div>
        {this.renderPaletteOption(0)}
        {this.renderPaletteOption(1)}
        {this.renderPaletteOption(2)}
        <div><button onClick={() => this.handleResetClick()}>Reset</button></div>
        <div>{this.state.delegates.dem_delegates}</div>
        <div>{this.state.delegates.rep_delegates}</div>
        <div class="cols_container">
          <div class="ratings_col">
            <div class="rating_header" id="rating_header_sb">Safe Blue</div>
            {this.getStatesWithRatings("safe_blue")}
          </div>
          <div class="ratings_col">
            <div class="rating_header" id="rating_header_lkb">Likely Blue</div>
            {this.getStatesWithRatings("likely_blue")}</div>
          <div class="ratings_col">
            <div class="rating_header" id="rating_header_lnb">Lean Blue</div>
            {this.getStatesWithRatings("lean_blue")}</div>
          <div class="ratings_col">
            <div class="rating_header" id="rating_header_tu">Tossup</div>
            {this.getStatesWithRatings("tossup")}
          </div>
          <div class="ratings_col">
            <div class="rating_header" id="rating_header_lnr">Lean Red</div>
            {this.getStatesWithRatings("lean_red")}
          </div>
          <div class="ratings_col">
            <div class="rating_header" id="rating_header_lkr">Likely Red</div>
            {this.getStatesWithRatings("likely_red")}
          </div>
          <div class="ratings_col">
            <div class="rating_header" id="rating_header_sr">Safe Red</div>
            {this.getStatesWithRatings("safe_red")}
          </div>
        </div>
        <div>5</div>
      </div>
      );
  }

}

export default App;
