import React, { Component } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export class CreateRaceNight extends Component {

  constructor(props) {
    super(props);
    this.state = {
      backstrokeEventTypes: [],
      breaststrokeEventTypes: [],
      butterflyEventTypes: [],
      freestyleEventTypes: [],
      otherEventTypes: [],
      raceEvents: [],
      date: [0, 0, 0],
      selectedEventType: undefined,
      grades: [],
      raceNights: [],
      selectedRaceNightDate: []
    };

    this.handleChangeDateDay = this.handleChangeDateDay.bind(this);
    this.handleChangeDateMonth = this.handleChangeDateMonth.bind(this);
    this.handleChangeDateYear = this.handleChangeDateYear.bind(this);
    this.handleChangeGradesList = this.handleChangeGradesList.bind(this);
  }

  componentDidMount() {
    this.populateEventTypesData();
    this.getRaceNights();
  }

  async populateEventTypesData() {
    await axios.get('http://localhost:4000/fridaynightraces/eventtypes/')
      .then(response => {
        this.setState({ 
          backstrokeEventTypes: response.data.filter(x => x.stroke === "Backstroke"),
          breaststrokeEventTypes: response.data.filter(x => x.stroke === "Breaststroke"),
          butterflyEventTypes: response.data.filter(x => x.stroke === "Butterfly"),
          freestyleEventTypes: response.data.filter(x => x.stroke === "Freestyle"),
          otherEventTypes: response.data.filter(x => x.stroke !== "Backstroke" && x.stroke !== "Breaststroke" && x.stroke !== "Butterfly" && x.stroke !== "Freestyle")
        });
      })
      .catch(function (error) {
        console.log(error);
      })
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

  handleEventTypeSelect(eventType) {
    this.setState({ selectedEventType: eventType });
  }

  addRaceEvent() {
    const existingRaceEvents = this.state.raceEvents
      .filter(x => x.distance === this.state.selectedEventType.distance)
      .filter(x => x.stroke === this.state.selectedEventType.stroke)
      .filter(x => x.grades === this.state.grades);

    if (existingRaceEvents.length !== 0) {
      return;
    }

    const newRaceEvent = {
      raceEventId: uuidv4(),
      eventTypeId: this.state.selectedEventType.eventTypeId,
      stroke: this.state.selectedEventType.stroke,
      distance: this.state.selectedEventType.distance,
      swimmerNames: [],
      grades: this.state.grades,
      resultIds: [],
      date: [],
      eventNumber: this.state.raceEvents.length === 0 ? 1 : [...this.state.raceEvents].pop().eventNumber + 1
    }

    var raceEvents = this.state.raceEvents.concat(newRaceEvent);
    raceEvents.sort((a, b) => (a.eventNumber > b.eventNumber) ? 1 : -1);
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
      raceEvent.date = this.state.date;
      axios.post('http://localhost:4000/fridaynightraces/raceevents/add_raceEvent', raceEvent)
      .catch(function (error) {
        console.log(error);
      });
    });

    axios.post('http://localhost:4000/fridaynightraces/racenights/add_raceNight', newRaceNight)
    .catch(function (error) {
      console.log(error);
    });
  }

  handleRemove(raceEvent) {
    var raceEvents = [...this.state.raceEvents];
    raceEvents = raceEvents.filter(x => x !== raceEvent);
    const sortedRaceEvents = raceEvents.sort((a, b) => a.eventNumber > b.eventNumber ? 1 : -1);
    this.setState({ raceEvents: sortedRaceEvents });
  }

  produceGradesString = (grades) => {
    if (grades.length === 0) {
      return "";
    }

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

  up(raceEvent) {
    var raceEvents = [...this.state.raceEvents];
    var index = raceEvents.indexOf(raceEvent);
    if (index === 0) {
      return;
    }
    raceEvents[index].eventNumber -= 1;
    raceEvents[index - 1].eventNumber += 1;
    const sortedRaceEvents = raceEvents.sort((a, b) => a.eventNumber > b.eventNumber ? 1 : -1);
    this.setState({ raceEvents: sortedRaceEvents });
  }
  
  down(raceEvent) {
    var raceEvents = [...this.state.raceEvents];
    var index = raceEvents.indexOf(raceEvent);
    if (index === raceEvents.length - 1) {
      return;
    }
    raceEvents[index].eventNumber += 1;
    raceEvents[index + 1].eventNumber -= 1;
    const sortedRaceEvents = raceEvents.sort((a, b) => a.eventNumber > b.eventNumber ? 1 : -1);
    this.setState({ raceEvents: sortedRaceEvents });
  }

  handleRaceNightSelect(raceNight) {
    this.setState({
      selectedRaceNightDate: raceNight.date
    });

    this.setState({raceEvents: []});

    axios.get('http://localhost:4000/fridaynightraces/raceEvents/')
    .then(response => {
      var loadedRaceEvents = response.data.filter(x => raceNight.raceEventIds.includes(x.raceEventId)).sort((a, b) => (a.eventNumber > b.eventNumber) ? 1 : -1);
      var newRaceEvents = [];

      loadedRaceEvents.forEach(loadedRaceEvent => {
        const newRaceEvent = {
          raceEventId: uuidv4(),
          eventTypeId: loadedRaceEvent.eventTypeId,
          stroke: loadedRaceEvent.stroke,
          distance: loadedRaceEvent.distance,
          swimmerNames: [],
          grades: loadedRaceEvent.grades,
          resultIds: [],
          date: [],
          eventNumber: loadedRaceEvent.eventNumber
        }
    
        newRaceEvents = newRaceEvents.concat(newRaceEvent);
        newRaceEvents.sort((a, b) => (a.eventNumber > b.eventNumber) ? 1 : -1);
        this.setState({raceEvents: newRaceEvents});
      });
    });
  }

  render() {
    return (
      <div>
        <div>
          <h3>Create Race Nights</h3>
          <hr/>
          <h4>Previous Race Nights</h4>
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
          <hr/>
          <br/>
          <div>
            <table style={{width: '100%'}}>
              <tbody>
                <tr>
                  <td>
                    {
                      this.state.backstrokeEventTypes.map((eventType) => (
                        <div>
                          <label>
                            <input type="radio" name="event_type_select" onChange={() => this.handleEventTypeSelect(eventType)} />
                              &emsp; {eventType.distance}m {eventType.stroke}
                          </label>
                        </div>
                      ))
                    }
                  </td>
                  <td>
                    {
                      this.state.breaststrokeEventTypes.map((eventType) => (
                        <div>
                          <label>
                            <input type="radio" name="event_type_select" onChange={() => this.handleEventTypeSelect(eventType)} />
                              &emsp; {eventType.distance}m {eventType.stroke}
                          </label>
                        </div>
                      ))
                    }
                  </td>
                  <td>
                    {
                      this.state.butterflyEventTypes.map((eventType) => (
                        <div>
                          <label>
                            <input type="radio" name="event_type_select" onChange={() => this.handleEventTypeSelect(eventType)} />
                              &emsp; {eventType.distance}m {eventType.stroke}
                          </label>
                        </div>
                      ))
                    }
                  </td>
                  <td>
                    {
                      this.state.freestyleEventTypes.map((eventType) => (
                        <div>
                          <label>
                            <input type="radio" name="event_type_select" onChange={() => this.handleEventTypeSelect(eventType)} />
                              &emsp; {eventType.distance}m {eventType.stroke}
                          </label>
                        </div>
                      ))
                    }
                  </td>
                  <td>
                    {
                      this.state.otherEventTypes.map((eventType) => (
                        <div>
                          <label>
                            <input type="radio" name="event_type_select" onChange={() => this.handleEventTypeSelect(eventType)} />
                              &emsp; {eventType.distance}m {eventType.stroke}
                          </label>
                        </div>
                      ))
                    }
                  </td>
                </tr>
              </tbody>
            </table>
            
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
        <br/>
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
              { this.state.raceEvents.map(currentRaceEvent => (
                <tr>
                  <td>{currentRaceEvent.eventNumber}</td>
                  <td>{this.produceGradesString(currentRaceEvent.grades)}</td>
                  <td>{currentRaceEvent.distance}</td>
                  <td>{currentRaceEvent.stroke}</td>
                  <td>
                    <button onClick={() => { this.handleRemove(currentRaceEvent) }}>Remove</button>
                  </td>
                  <td>
                    <table>
                      <tbody>
                        <tr>
                          <td>
                            <button onClick={() => this.up(currentRaceEvent) }>&#8593;</button>
                          </td>
                          <td>
                            <button onClick={() => this.down(currentRaceEvent) }>&#8595;</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        <div>
            <label>Date:&emsp;</label>
            <input type="number" onChange={this.handleChangeDateDay} style={{ width: '50px', textAlign: 'center' }} />
            <input type="number" onChange={this.handleChangeDateMonth} style={{ width: '50px', textAlign: 'center' }} />
            <input type="number" onChange={this.handleChangeDateYear} style={{ width: '50px', textAlign: 'center' }} />
            &emsp; &emsp;
          <button onClick={ () => this.addRaceNight() }>Add Race Night</button>
        </div>
      </div>
    );
  }
}
