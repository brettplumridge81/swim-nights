import React, { Component } from 'react';
import { AddSwimmer } from './AddSwimmer';
import { AddEventType } from './AddEventType';
import { AddRaceNight } from './AddRaceNight';

export class Create extends Component {

  constructor(props) {
    super(props);
  }

  static renderCreateScreen() {
      return (
        <div>
            <h2>New Swimmer</h2>
            <AddSwimmer /> <br/>
            <h2>New Event</h2>
            <AddEventType /> <br/>
            <h2>New Race Night</h2>
            <AddRaceNight />
        </div>
    );
  }

  render() {
      let contents = Create.renderCreateScreen();

    return (
        <div>
            {contents}
      </div>
    );
  }
}
