import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Home } from './components/Home';
import { Create } from './components/Create';
import { EnterRaces } from './components/EnterRaces';
import { RaceSheets } from './components/RaceSheets';

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
              </ul>
            </div>
          </nav>
          <br/>
          <Route exact path='/' component={Home} />
          <Route path='/create' component={Create} />
          <Route path='/enter-races' component={EnterRaces} />
          <Route path='/race-sheets' component={RaceSheets} />
        </div>
      </Router>
    );
  }
}
