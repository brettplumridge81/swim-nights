import React, { Component } from 'react';
import axios from 'axios';

const RaceEvent = props => (
  <tr>
    <td>{props.raceEvent.minAge} - {props.raceEvent.maxAge}</td>
    <td>{props.raceEvent.distance}</td>
    <td>{props.raceEvent.stroke}</td>
    <td>
      <button onClick={() => { handleDelete(props.raceEvent._id); }}>Remove</button>
    </td>
    <td>
      
    </td>
  </tr>
)

const handleDelete = (id) => {
  try {
    axios.get('http://localhost:4000/fridaynightraces/currentselectedevents/delete/' + id);
    window.location.reload(false);
  } catch (err) {
    console.error(err);
  }
}

export class CurrentEventSelection extends Component {

  constructor(props) {
    super(props);
    this.state = { currentSelectedEvents: []};
  }

  componentDidMount() {
    axios.get('http://localhost:4000/fridaynightraces/currentselectedevents/')
      .then(response => {
        this.setState({ currentSelectedEvents: response.data });
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  selectedEventsList() {
    return this.state.currentSelectedEvents.map(function(currentEvent, i) {
        return <RaceEvent raceEvent={currentEvent} key={i} />
    });
  }

  render() {
    return (
      <div>
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
            { this.selectedEventsList() }
          </tbody>
        </table>
      </div>
    )
  }
}
