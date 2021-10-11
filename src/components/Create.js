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
            <AddSwimmer />
            <AddEventType />
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
