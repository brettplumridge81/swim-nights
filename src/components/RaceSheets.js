import React, { Component } from 'react';
import axios from 'axios';

export class RaceSheets extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      raceSheets: [],
      eventTypes: [],
      raceNightEvents: [],
      swimmerNames: [],
      raceNightDates: [],
      selectedRaceNightDate: [new Date().getDate(), new Date().getMonth() + 1, new Date().getFullYear()]
    };
  }

  componentDidMount() {
    this.getRaceNightDates();
    this.populateRaceSheets();
    this.populateEventTypesData();
    this.getRaceNightEventsData();
  }

  async getRaceNightDates() {
    await axios.get('http://localhost:4000/fridaynightraces/racenights/')
      .then(response => {
        this.setState({ 
          raceNightDates: response.data.map(x => x.date)
        });
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  async populateRaceSheets() {
    await axios.get('http://localhost:4000/fridaynightraces/racesheets/')
      .then(response => {
        this.setState({ 
          raceSheets: response.data.sort((a, b) => a.eventNumber < b.eventNumber ? -1 : 1)
        });
      })
      .catch(function (error) {
        console.log(error);
      })
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

  async getRaceNightEventsData() {
    await axios.get('http://localhost:4000/fridaynightraces/raceevents/')
        .then(response => {
          this.setState({ raceNightEvents: response.data });
        })
        .catch(function (error) {
          console.log(error);
        });
  }

  handleRaceNightSelect(raceNightDate) {
    this.setState({
      selectedRaceNightDate: raceNightDate
    });
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

  render() {
    return (
      <div>
        <div class="noPrint">
          {
            this.state.raceNightDates
              .sort((a, b) => a[2] > b[2] ? 1 : -1  && a[1] > b[1] ? 1 : -1 && a[0] > b[0] ? 1 : -1)
              .map((raceNightDate) => (
                <label>
                  <input type="radio" name="race_night_select" onChange={() => this.handleRaceNightSelect(raceNightDate)} 
                    checked = { this.state.selectedRaceNightDate !== undefined && raceNightDate !== undefined
                      ? this.state.selectedRaceNightDate[0] === raceNightDate[0] && this.state.selectedRaceNightDate[1] === raceNightDate[1] && this.state.selectedRaceNightDate[2] === raceNightDate[2] 
                      : false } />
                  {"  "} {raceNightDate[0] + "/" + raceNightDate[1] + "/" + raceNightDate[2]} &emsp; &emsp;
                </label>
              ))
          }
        </div>
        {
          this.state.raceSheets
            .filter(x => x.date[0] === this.state.selectedRaceNightDate[0])
            .filter(x => x.date[1] === this.state.selectedRaceNightDate[1])
            .filter(x => x.date[2] === this.state.selectedRaceNightDate[2])
            .map(raceSheet => {
              var eventType = this.state.eventTypes.filter(eventType => raceSheet.eventTypeId === eventType.eventTypeId)[0];
              var raceEvent = this.state.raceNightEvents.filter(raceEvent => raceSheet.raceEventId === raceEvent.raceEventId)[0];

              var numSwimmers = raceSheet.swimmerNames.length;
              var numUnusedLanes = 8 - numSwimmers;
              var firstLane = Math.floor(numUnusedLanes / 2 + 1);
              var lastLane = firstLane + numSwimmers - 1;

              var swimmers = raceSheet.swimmerNames;
              var hcaps = raceSheet.hcapTimes;
              var goAts = raceSheet.goAts;
              for (var count = 1; count < 9; count++) {
                if (count < firstLane) {
                  swimmers.unshift("");
                  hcaps.unshift("");
                  goAts.unshift("");
                }
                if (count > lastLane) {
                  swimmers.push("");
                  hcaps.push("");
                  goAts.push("");
                }
              }

              if (eventType !== undefined && raceEvent !== undefined) {
                return (
                  <div>
                    <h1>Maitland Swimming Club Race Sheet</h1>
                    
                    <table style={{ width:'100%' }}>
                      <colgroup>
                        <col span="1" style={{ width:'30%', align: 'center', borderWidth: '1px' }} />
                        <col span="1" style={{ width:'30%', align: 'center', borderWidth: '1px' }} />
                        <col span="1" style={{ width:'20%', align: 'center', borderWidth: '1px' }} />
                        <col span="1" style={{ width:'20%', align: 'center', borderWidth: '1px' }} />
                      </colgroup>

                      <tbody>
                        <tr>
                          <td><strong>EVENT:</strong> {eventType.distance}m {eventType.stroke} </td>
                          <td><strong>GRADE:</strong> {this.produceGradesString(raceEvent.grades)} </td>
                        </tr>
                        <tr>
                          <td><strong>EVENT No.:</strong> {raceSheet.eventNumber}</td>
                          <td><strong>DISTANCE:</strong> {eventType.distance}m </td>
                          <td><strong>HEAT No.:</strong> {raceSheet.heatNumber}</td>
                          <td><strong>DATE:</strong> {raceSheet.date[0]}/{raceSheet.date[1]}/{raceSheet.date[2]} </td>
                        </tr>
                      </tbody>					
                    </table>
                      
                    <table style={{ borderWidth: '2px', borderStyle: 'solid' }}>
                      <colgroup>
                        <col span="1" style={{ width:'33%', align: 'center', borderWidth: '1px' }} />
                        <col span="1" style={{ width:'10%', align: 'center', borderWidth: '1px' }} />
                        <col span="1" style={{ width:'10%', align: 'center', borderWidth: '1px' }} />
                        <col span="1" style={{ width:'8%', align: 'center', borderWidth: '1px' }} />
                        <col span="1" style={{ width:'12%', align: 'center', borderWidth: '1px' }} />
                        <col span="1" style={{ width:'13%', align: 'center', borderWidth: '1px' }} />
                        <col span="1" style={{ width:'13%', align: 'center', borderWidth: '1px' }} />
                      </colgroup>
                      
                      <thead>
                        <tr height="30">
                          <th style={{ textAlign: 'center', borderWidth: '2px', borderStyle: 'solid' }}>NAME</th>
                          <th style={{ textAlign: 'center', borderWidth: '2px', borderStyle: 'solid' }}>LANE</th>
                          <th style={{ textAlign: 'center', borderWidth: '2px', borderStyle: 'solid' }}>H'CAP TIME</th>
                          <th style={{ textAlign: 'center', borderWidth: '2px', borderStyle: 'solid' }}>GO AT</th>
                          <th style={{ textAlign: 'center', borderWidth: '2px', borderStyle: 'solid' }}>PLACE</th>
                          <th style={{ textAlign: 'center', borderWidth: '2px', borderStyle: 'solid' }}>GROSS TIME</th>
                          <th style={{ textAlign: 'center', borderWidth: '2px', borderStyle: 'solid' }}>NET TIME</th>
                        </tr>
                      </thead>
                      
                      <tbody>
                        { raceSheet.swimmerNames.map(function(currentSwimmer, count) {
                          return (
                            <tr>
                              <td style={{ textAlign: 'center', borderWidth: '1px' }}>
                                {currentSwimmer}
                              </td>
                              <td style={{ textAlign: 'center', borderWidth: '1px' }}>
                                {count+1}
                              </td>
                              <td style={{ textAlign: 'center', borderWidth: '1px' }}>
                                {raceSheet.hcapTimes[count] === 10000 ? "TT" : raceSheet.hcapTimes[count]}
                              </td>
                              <td style={{ textAlign: 'center', borderWidth: '1px' }}>
                                {raceSheet.goAts[count] === 0 ? "GO" : raceSheet.goAts[count]}
                              </td>
                              <td style={{ textAlign: 'center', borderWidth: '1px' }}>
                              </td>
                              <td style={{ textAlign: 'center', borderWidth: '1px' }}>
                              </td>
                              <td style={{ textAlign: 'center', borderWidth: '1px' }}>
                              </td>
                            </tr>
                          )
                        }) }
                      </tbody>
                    </table>
                    <br/><br/><br/>
                  </div>
                );
              } else {
                return (<p></p>)
              }
            })
        }
      </div>
    );
  }
}
 