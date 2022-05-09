import React, { Component } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const RaceEvent = props => (
  <tr>
    <td>{props.raceEvent.eventNumber}</td>
    <td>{produceGradesString(props.raceEvent.grades)}</td>
    <td>{props.raceEvent.distance}</td>
    <td>{props.raceEvent.stroke}</td>
    <td>
      <button onClick={() => { this.handleRemove(props.raceEvent.raceEventId) }}>Remove</button>
    </td>
    <td>
      <table>
        <tr><td>
          <a href="#" onClick="up();">&#8593;</a>
        </td></tr>
        <tr><td>
          &#8593;
        </td></tr>
      </table>
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

function up(){
  console.log("jhbasdkljbhas");
}

export class CreateRaceNight extends Component {

  constructor(props) {
    super(props);
    this.state = {
      eventTypes: [],
      raceEvents: [],
      date: [0, 0, 0],
      selectedEventType: undefined,
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
        grades = grades.concat([event.target.id]);
    } else {
        grades = grades.filter(x => x !== event.target.id);
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
      stroke: this.state.selectedEventType.stroke,
      distance: this.state.selectedEventType.distance,
      swimmerNames: [],
      grades: this.state.grades,
      resultIds: [],
      date: this.state.date,
      eventNumber: this.state.raceEvents.length === 0 ? 1 : [...this.state.raceEvents].pop().eventNumber + 1
    }

    var raceEvents = this.state.raceEvents.concat(newRaceEvent);
    raceEvents.sort((a, b) => (a.eventNumber - b.eventNumber) ? 1 : -1);
    this.setState({raceEvents: raceEvents});
  }

  addRaceNight() {
    if (this.state.date[0] === 0 || this.state.date[2 === 0 || this.state.date[2] === 0]) {
      return;
    }

    if (this.state.raceEvents.length === 0) {
      return;
    }

    const newRaceNight = {
      date: this.state.date,
      raceEventIds: this.state.raceEvents.map(x => x.raceEventId)
    }

    this.state.raceEvents.forEach(raceEvent => {
      axios.post('http://localhost:4000/fridaynightraces/events/add_raceEvent', raceEvent)
      .catch(function (error) {
        console.log(error);
      });
    })

    axios.post('http://localhost:4000/fridaynightraces/events/add_raceNight', newRaceNight)
    .catch(function (error) {
      console.log(error);
    });
  }

  handleRemove() {

  }

  raceEventsList() {
    return this.state.raceEvents.map(function(currentRaceEvent, i) {
        return <RaceEvent raceEvent={currentRaceEvent} key={i} />
    });
  }

  render() {
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
                <th></th>
              </tr>
            </thead>
            <tbody>
              { this.raceEventsList() } 
            </tbody>
          </table>
        </div>

        <div>
          <button onClick={ () => this.addRaceNight() }>Add Race Night</button>
        </div>
      </div>
    );
  }
}
