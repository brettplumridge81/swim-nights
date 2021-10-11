import React, { Component } from 'react';
import { Swimmers } from './Swimmers'
import { EventTypes } from './EventTypes'
import axios from 'axios';

const RaceEvent = props => (
  <tr>
    <td>{props.raceEvent.minAge} - {props.raceEvent.maxAge}</td>
    <td>{props.raceEvent.distance}</td>
    <td>{props.raceEvent.stroke}</td>
    {/* <td>
      <button onClick={() => { handleDelete(props.raceEvent._id); }}>Remove</button>
    </td> */}
  </tr>
)

export class EnterRaces extends Component {
    static displayName = EnterRaces.name;

  constructor(props) {
    super(props);
    this.state = { 
      eventTypes: [],
      raceNights: [],
      eventTypesLoading: true,
      raceNightsLoading: true
    };
  }

  componentDidMount() {
    this.populateEventTypesData();
    this.getRaceNightEvents();
  }

  async populateEventTypesData() {
    await axios.get('http://localhost:4000/fridaynightraces/eventtypes/')
      .then(response => {
        this.setState({ 
          eventTypes: response.data,
          eventTypesLoading: false
        });
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  async getRaceNightEvents() {
    await axios.get('http://localhost:4000/fridaynightraces/racenights/')
      .then(response => {
        this.setState({ 
          raceNights: response.data, 
          raceNightsLoading: false 
        });
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  selectedEventsList() {
    if (!this.state.eventTypesLoading && !this.state.raceNightsLoading) {
      return this.state.eventTypes
        .filter(x => this.state.raceNights[0].raceEvents.includes(x.eventTypeId))
        .map(function(currentEvent, i) {
          return <RaceEvent raceEvent={currentEvent} key={i} />
      });
    }
  }

  static renderRaceNightEventsTable(selectedEventsList) {
    return (
      <div>
        <table><tbody><tr>
            <td><Swimmers /></td>
        </tr></tbody></table>

        <h3>Events</h3>
        <table className="table table-striped" style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th>Age</th>
              <th>Distance</th>
              <th>Stroke</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            { selectedEventsList }
          </tbody>
        </table>
      </div>
    );
  }

  render() {
    let contents = this.state.eventTypesLoading || this.state.raceNightsLoading
      ? <p><em>Loading...</em></p>
        : EnterRaces.renderRaceNightEventsTable(this.selectedEventsList());

    return (
      <div>
        {contents}
      </div>
    );
  }
}
