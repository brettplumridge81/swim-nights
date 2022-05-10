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
      selectedRaceNightDate: [],
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
    })

    axios.get('http://localhost:4000/fridaynightraces/raceEvents/')
    .then(response => {
      this.setState({raceEvents: response.data.filter(x => raceNight.raceEventIds.includes(x.raceEventId))});
    });
  }

  render() {
    return (
      <div>
        <h3>Race Night Dates</h3>
        <div>
          {
            this.state.raceNights.map((raceNight, i) => (
              <div>
                <label>
                  <input type="radio" name="race_night_select" onChange={() => this.handleRaceNightSelect(raceNight)} />
                  {raceNight.date[0] + "/" + raceNight.date[1] + "/" + raceNight.date[2]}
                </label>
              </div>
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
