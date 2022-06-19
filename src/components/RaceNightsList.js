import React, { Component } from 'react';
import axios from 'axios';
import { AddRaceNight } from './AddRaceNight';

const RaceEvent = props => (
  <tr>
    <td>{props.raceEvent.eventNumber}</td>
    <td>{produceGradesString(props.raceEvent.grades)}</td>
    <td>{props.raceEvent.distance}</td>
    <td>{props.raceEvent.stroke}</td>
    {/* <td>
      <button onClick={() => { handleDelete(props.eventType._id); }}>Remove</button>
    </td> */}
    <td>
      
    </td>
  </tr>
)

const produceGradesString = (grades) => {
  var string = "";
  string = string + grades[0];
  for (var i = 1; i < grades.length - 1; i++) {
      string = string + ", " + grades[i];
  }
  if (grades.length > 1) {
      string = string + " & " + grades[grades.length - 1] + " grades";
  } else {
      if (grades[grades.length - 1] === "15-years") {
          string = string + " & over";
      } else {
          string = string + "-grade";
      }
  }
  return string;
}

export class RaceNightsList extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      raceNights: [],
      selectedRaceNightDate: [new Date().getDate(), new Date().getMonth() + 1, new Date().getFullYear()],
      selectedRaceNight: [],
      selectedRaceNightRaceEvents: [],
      selectedRaceNightEventTypes: [],
      eventTypeIds: [],
      raceEvents: []
    };
  }

  componentDidMount() {
    this.getRaceNights();
  }

  async getRaceNights() {
    await axios.get('http://localhost:4000/fridaynightraces/racenights/')
      .then(response => {
        this.setState({ 
          raceNights: response.data
        });
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  raceEventsList() {
    return this.state.raceEvents.map(function(currentRaceEvent, i) {
        return <RaceEvent raceEvent={currentRaceEvent} key={i} />
    });
  }

  handleRaceNightSelect(raceNight) {
    this.setState({
      selectedRaceNightDate: raceNight.date
    });

    axios.get('http://localhost:4000/fridaynightraces/raceEvents/')
    .then(response => {
      this.setState({
        raceEvents: response.data.filter(x => raceNight.raceEventIds.includes(x.raceEventId))
          .sort((a, b) => (a.eventNumber > b.eventNumber) ? 1 : -1)
      });
    });
  }

  render() {
    return (
      <div>
        <h3>Race Night Dates</h3>
        <div>
          {
            this.state.raceNights
              .sort((a, b) => a.date[2] > b.date[2] ? 1 : -1 && a.date[1] > b.date[1] ? 1 : -1 && a.date[0] > b.date[0] ? 1 : -1)
              .map((raceNight) => (
                <label>
                  <input type="radio" name="race_night_select" onChange={() => this.handleRaceNightSelect(raceNight)}
                    checked = { this.state.selectedRaceNightDate !== undefined && raceNight.date !== undefined
                      ? this.state.selectedRaceNightDate[0] === raceNight.date[0] && this.state.selectedRaceNightDate[1] === raceNight.date[1] && this.state.selectedRaceNightDate[2] === raceNight.date[2] 
                      : false } />
                  {"  "} {raceNight.date[0] + "/" + raceNight.date[1] + "/" + raceNight.date[2]} &emsp; &emsp;
                </label>
              ))
          }
        </div>
        <div>
        <h2>Event Types</h2>
        <table className="table table-striped" style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th>Event Number</th>
              <th>Grades</th>
              <th>Distance</th>
              <th>Stroke</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            { this.raceEventsList() }
          </tbody>
        </table>
        </div>
      </div>
    )
  }
}
