import React, { Component } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export class CreateRaceNight extends Component {

  constructor(props) {
    super(props);
    this.state = {
      eventTypes: [],
      raceEvents: [],
      date: [0, 0, 0],
      selectedEventType: "",
      grades: [],
      isRelay: false,
      swimmersPerTeam: 1,
      isEnterOwnHcapTime: false
    };

    this.handleChangeDateDay = this.handleChangeDateDay.bind(this);
    this.handleChangeDateMonth = this.handleChangeDateMonth.bind(this);
    this.handleChangeDateYear = this.handleChangeDateYear.bind(this);
    this.handleChangeGradesList = this.handleChangeGradesList.bind(this);
    this.handleChangeIsRelay = this.handleChangeIsRelay.bind(this);
    this.handleChangeSwimmersPerTeam = this.handleChangeSwimmersPerTeam.bind(this);
    this.handleChangeIsEnterOwnHcapTime = this.handleChangeIsEnterOwnHcapTime.bind(this);
  }

  componentDidMount() {
    this.populateEventTypesData();
  }

  async populateEventTypesData() {
    await axios.get('http://localhost:4000/fridaynightraces/eventtypes/')
      .then(response => {
        this.setState({ 
          eventTypes: response.data
        });
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  handleChangeDateDay(event) {
    var date = this.state.date;
    date[0] = event.target.value;
    if (date[0] < 1 || date[0] > 31) {
      date[0] = 0;
    }
    this.setState({ date: date })
  }

  handleChangeDateMonth(event) {
    var date = this.state.date;
    date[1] = event.target.value;
    if (date[1] < 1 || date[1] > 12) {
      date[1] = 0;
    }
    this.setState({ date: date })
  }

  handleChangeDateYear(event) {
    var date = this.state.date;
    date[2] = event.target.value;
    console.log(date);
    if (date[2] < 1900 || date[2] > new Date().getFullYear()) {
      date[2] = 0;
    }
    this.setState({ date : date });
  }

  handleChangeGradesList(event) {
    var grades = this.state.grades;
    if (event.target.checked) {
        grades.push(event.target.id);
    } else {
        var index = grades.indexOf(event.target.id);
        grades.splice(index, 1);
    }
    this.setState({ grades: grades });
  }

  handleChangeIsRelay(event) {
      this.setState({ 
          isRelay: event.target.checked,
          swimmersPerTeam: 1
      });
  }

  handleChangeSwimmersPerTeam(event) {
      this.setState({ swimmersPerTeam: event.target.value });
  }

  handleChangeIsEnterOwnHcapTime(event) {
      this.setState({ isEnterOwnHcapTime: event.target.checked });
  }

  handleEventTypeSelect(eventType) {
    this.setState({ selectedEventType: eventType });
  }

  addRaceEvent() {
    const newRaceEvent = {
      raceEventId: uuidv4(),
      eventTypeId: this.state.selectedEventType.eventTypeId,
      swimmerNames: [],
      grades: this.state.grades,
      resultIds: [],
      date: this.state.date,
      eventNumber: undefined
    }

    var raceEvents = this.state.raceEvents;
    raceEvents.push(newRaceEvent);
    this.setState({raceEvents: raceEvents});
  }

  produceGradesString(grades) {
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

  handleRemove() {

  }

  render() {
    console.log(this.state.raceEvents);
    return (
      <div>
        <div>
          <h3>Create Race Nights</h3>
          <br/>
          <div>
          <label>Date:&emsp;</label>
            <input type="number" onChange={this.handleChangeDateDay} style={{ width: '50px', textAlign: 'center' }} />
            <input type="number" onChange={this.handleChangeDateMonth} style={{ width: '50px', textAlign: 'center' }} />
            <input type="number" onChange={this.handleChangeDateYear} style={{ width: '50px', textAlign: 'center' }} />
          </div>
          <br/>
          <div>
            {
              this.state.eventTypes.map((eventType) => (
                <div>
                  <label>
                    <input type="radio" name="event_type_select" onChange={() => this.handleEventTypeSelect(eventType)} />
                      &emsp; {eventType.distance}m {eventType.stroke}
                  </label>
                </div>
              ))
            }
          </div>
          <br/>
          <div>
            <input type="checkbox" id="E" name="E" onClick={this.handleChangeGradesList}/>
            <label>&nbsp; E-Grade &emsp;</label>
            <input type="checkbox" id="D" name="D" onClick={this.handleChangeGradesList}/>
            <label>&nbsp; D-Grade &emsp;</label>
            <input type="checkbox" id="C" name="C" onClick={this.handleChangeGradesList}/>
            <label>&nbsp; C-Grade &emsp;</label>
            <input type="checkbox" id="B" name="B" onClick={this.handleChangeGradesList}/>
            <label>&nbsp; B-Grade &emsp;</label>
            <input type="checkbox" id="A" name="A" onClick={this.handleChangeGradesList}/>
            <label>&nbsp; A-Grade &emsp;</label>
            <input type="checkbox" id="15-years" name="15-years" onClick={this.handleChangeGradesList}/>
            <label>&nbsp; 15-Years &emsp;</label>
          </div>
          <br/>
          <div>
            <button onClick={ () => this.addRaceEvent() }>Add Race Event</button>
          </div>
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
              { this.state.raceEvents.map((raceEvent) => (
                // console.log("this.state.eventTypes");
                // console.log(this.state.eventTypes);
                // console.log("raceEvent");
                // console.log(raceEvent);
                this.state.eventTypes.filter(x => x.eventTypeId === raceEvent.eventTypeId).map((eventType) => (
                  // console.log("eventType");
                  // console.log(eventType);
                  <tr>
                    <td></td>
                    <td>{this.produceGradesString(raceEvent.grades)}</td>
                    <td>{eventType.distance}</td>
                    <td>{eventType.stroke}</td>
                    <td>
                      <button onClick={() => { this.handleRemove(raceEvent.raceEventId) }}>Remove</button>
                    </td>
                  </tr>
                ))
              )) }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
