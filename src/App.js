import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Home } from './components/Home';
import { CreateRaceNight } from './components/CreateRaceNight';
import { EnterRaces } from './components/EnterRaces';
import { RaceSheets } from './components/RaceSheets';
import { SwimmersList } from './components/SwimmersList';
import { EventTypesList } from './components/EventTypesList';
import { RaceNightsList } from './components/RaceNightsList';
import { RaceNightResultsInput } from './components/RaceNightResultsInput';

import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";

import './custom.css'
import { Button } from 'reactstrap';

export default class App extends Component {
  static displayName = App.name;

  password = "123";

  constructor() {
    super();
    this.state = {
      loggedIn: "",
      inputPassword: ""
    };

    this.handlePasswordInputChange = this.handlePasswordInputChange.bind(this);
  }

  handlePasswordInputChange(event) {
    this.setState({ inputPassword: event.target.value });
  }

  loginAdmin() {
    if (this.state.inputPassword === this.password) {
      this.setState({loggedIn: "admin"});
    }
  }

  loginSwimmer() {
    this.setState({loggedIn: "swimmer"});
  }

  render () {
    if (this.state.loggedIn) {
      return(
        <Router>
          <div className="container">
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
              {/* <Link to="/" className="navbar-brand">Friday Night Races</Link> */}
              <div className="collapse navbar-collapse">
                <ul className="navbar-nav mr-auto">
                  {
                    this.state.loggedIn === "admin" || this.state.loggedIn === "swimmer" ?
                    <li className="navbar-item">
                      <Link to="/enter-races" className="nav-link">Enter Races</Link>
                    </li> : <li></li>
                  }
                  {
                    this.state.loggedIn === "admin" ? 
                    <li className="navbar-item">
                      <Link to="/swimmers-list" className="nav-link">Swimmers</Link>
                    </li> : <li></li>
                  }
                  {
                    this.state.loggedIn === "admin" ? 
                    <li className="navbar-item">
                      <Link to="/event-types-list" className="nav-link">Events Types</Link>
                    </li> : <li></li>
                  }
                  {
                    this.state.loggedIn === "admin" ? 
                    <li className="navbar-item">
                      <Link to="/create-race-night" className="nav-link">Create Race Night</Link>
                    </li> : <li></li>
                  }
                  {
                    this.state.loggedIn === "admin" ? 
                    <li className="navbar-item">
                      <Link to="/race-nights-list" className="nav-link">Race Nights</Link>
                    </li> : <li></li>
                  }
                  {
                    this.state.loggedIn === "admin" ? 
                    <li className="navbar-item">
                      <Link to="/race-sheets" className="nav-link">Race Sheets</Link>
                    </li> : <li></li>
                  }
                  {
                    this.state.loggedIn === "admin" ? 
                    <li className="navbar-item">
                      <Link to="/race-night-results-input" className="nav-link">Race Night Result Input</Link>
                    </li> : <li></li>
                  }
                </ul>
              </div>
            </nav>
            <br/>
            <Route path='/enter-races' component={props => <EnterRaces {...props} loggedIn={this.state.loggedIn}/>} />
            <Route path='/swimmers-list' component={SwimmersList} />
            <Route path='/event-types-list' component={EventTypesList} />
            <Route path='/create-race-night' component={CreateRaceNight} />
            <Route path='/race-nights-list' component={RaceNightsList} />
            <Route path='/race-sheets' component={RaceSheets} />
            <Route path='/race-night-results-input' component={RaceNightResultsInput} />
          </div>
        </Router>
      );
    } else {
      return (
        <div className="container">
          <h1>Friday Night Races</h1>
          <br/><br/>
          <div>
            <h3>Admin</h3>
            <label>Password:</label>
            &emsp; <input type="password" onChange={this.handlePasswordInputChange}></input>
            &emsp; <Button onClick={() => this.loginAdmin()}>Admin Enter</Button>
          </div>
          <br/><br/>
          <div>
          <h3>Swimmer</h3>
            <Button onClick={() => this.loginSwimmer()}>Swimmer Enter</Button>
          </div>
        </div>
     );
    }
  }
}
