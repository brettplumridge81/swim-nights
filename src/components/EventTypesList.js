import React, { Component } from 'react';
import axios from 'axios';
import { AddEventType } from './AddEventType';

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
    <td>
      <button onClick={() => { handleDelete(props.eventType._id); }}>Remove</button>
    </td>
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

const handleDelete = (id) => {
  try {
    axios.get('http://localhost:4000/fridaynightraces/eventTypes/delete/' + id);
    window.location.reload(false);
  } catch (err) {
    console.error(err);
  }
}

export class EventTypesList extends Component {

  constructor(props) {
    super(props);
    this.state = { eventTypes: []};
  }

  componentDidMount() {
    axios.get('http://localhost:4000/fridaynightraces/eventtypes/')
      .then(response => {
        var eventTypes = response.data;
        var sortedeventTypes = eventTypes.sort(function (a, b) {
          return a.stroke.localeCompare(b.stroke) || a.distance > b.distance;
        });
        this.setState({ eventTypes: eventTypes });
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  eventTypesList() {
    return this.state.eventTypes.map(function(currentEventType, i) {
        return <EventType eventType={currentEventType} key={i} />
    });
  }

  render() {
    return (
      <div>
        <h2>New Event</h2>
        <AddEventType /> <br/>
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
              { this.eventTypesList() }
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}
