import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Home } from './components/Home';
import { Create } from './components/Create';
import { EnterRaces } from './components/EnterRaces';
import { RaceSheets } from './components/RaceSheets';
import { SwimmersList } from './components/SwimmersList';
import { EventTypesList } from './components/EventTypesList';
import { RaceNightsList } from './components/RaceNightsList';
import { RaceNightResultsInput } from './components/RaceNightResultsInput';

import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";

import './custom.css'

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Router>
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link to="/" className="navbar-brand">Friday Night Races</Link>
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav mr-auto">
                <li className="navbar-item">
                  <Link to="/" className="nav-link">Home</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/create" className="nav-link">Create</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/enter-races" className="nav-link">Enter Races</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/race-sheets" className="nav-link">Race Sheets</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/swimmers-list" className="nav-link">Swimmers</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/event-types-list" className="nav-link">Events Types</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/race-nights-list" className="nav-link">Race Nights</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/race-night-results-input" className="nav-link">Race Night Result Input</Link>
                </li>
              </ul>
            </div>
          </nav>
          <br/>
          <Route exact path='/' component={Home} />
          <Route path='/create' component={Create} />
          <Route path='/enter-races' component={EnterRaces} />
          <Route path='/race-sheets' component={RaceSheets} />
          <Route path='/swimmers-list' component={SwimmersList} />
          <Route path='/event-types-list' component={EventTypesList} />
          <Route path='/race-nights-list' component={RaceNightsList} />
          <Route path='/race-night-results-input' component={RaceNightResultsInput} />
        </div>
      </Router>
    );
  }
}
