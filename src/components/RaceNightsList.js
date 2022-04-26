import React, { Component } from 'react';
import axios from 'axios';
import { AddRaceNight } from './AddRaceNight';

const EventType = props => (
  <tr>
    <td>{props.eventType.stroke}</td>
    <td>{props.eventType.distance}</td>
    <td>{produceGradesString(props.eventType.grades)}</td>
    <td>{props.eventType.gender}</td>
    <td>{props.eventType.isRelay}</td>
    <td>{props.eventType.swimmersPerTeam}</td>
    <td>{props.eventType.isScratch}</td>
    <td>{props.eventType.isEnterOwnHcapTime}</td>
    <td>{props.eventType.isNovalty}</td>
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
      eventTypes: []
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

  async getRaceNight() {
    await axios.get('http://localhost:4000/fridaynightraces/racenights/')
      .then(response => {
        var today = new Date(2021, 11, 20);
        this.setState({ 
          raceNight: response.data
            .filter(x => x.date[0] === today.getDate())
            .filter(x => x.date[1] === today.getMonth())
            .filter(x => x.date[2] === today.getFullYear())
        });
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  async getEventTypesForSelectedRaceNight() {
    await axios.get('http://localhost:4000/fridaynightraces/eventTypes/')
      .then(response => {
        console.log(response.data);
        this.setState({ 
          eventTypes: response.data
        });
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  async getEventTypesForRaceNight() {
    await axios.get('http://localhost:4000/fridaynightraces/eventTypes/')
    .then(response => {
      console.log(response.data);
      this.setState({ 
        eventTypes: response.data
      });
    })
    .catch(function (error) {
      console.log(error);
    })
  }

  eventTypesListForRaceNight() {
    return this.state.eventTypes.map(function(currentEventType, i) {
        return <EventType eventType={currentEventType} key={i} />
    });
  }

  handleRaceNightSelect(raceNight) {
    console.log("raceNight");
    console.log(raceNight);
    var raceEvents;

    this.setState({
      selectedRaceNightDate: raceNight.date
    })

    axios.get('http://localhost:4000/fridaynightraces/raceEvents/')
    .then(response => {
      console.log("Get Race Events");
      console.log(response.data);
      raceEvents = response.data.filter(x => raceNight.raceEventIds.includes(x.raceEventId));
    })
    .then(() => {
      console.log("this.state.raceEvents");
      console.log(this.state.raceEvents);
    })
    .then(() => {
      axios.get('http://localhost:4000/fridaynightraces/eventTypes/')
      .then(response => {
        console.log("Get Event Types");
        console.log(response.data);
        this.setState({ 
          eventTypes: response.data
            .filter(x => raceEvents.map(x => x.eventTypeId).includes(x.eventTypeId))
        });
      })
      .then(() => {
        console.log("this.state.eventTypes");
        console.log(this.state.eventTypes);
      });
    });
  }

  render() {
    return (
      <div>
        {/* <div>
          <h2>New Race Night</h2>
          <AddRaceNight />
        </div> */}
        <div>
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
                  <th>Stroke</th>
                  <th>Distance</th>
                  <th>Grades</th>
                  <th>Gender</th>
                  <th>IsRelay</th>
                  <th>SwimmersPerTeam</th>
                  <th>IsScratch</th>
                  <th>IsEnterOwnHcapTime</th>
                  <th>IsNovalty</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                { this.eventTypesListForRaceNight() }
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
