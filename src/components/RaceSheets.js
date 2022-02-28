import React, { Component } from 'react';
import axios from 'axios';

export class RaceSheets extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      raceSheets: [],
      eventTypes: [],
      raceNightEvents: [],
      swimmerNames: []
    };
  }

  componentDidMount() {
    this.populateRaceSheets();
    this.populateEventTypesData();
    this.getRaceNightEventsData();
  }

  async populateRaceSheets() {
    await axios.get('http://localhost:4000/fridaynightraces/racesheets/')
      .then(response => {
        var today = new Date(2021, 11, 20);
        this.setState({ 
          raceSheets: response.data
            .filter(x => x.date[0] === today.getDate())
            .filter(x => x.date[1] === today.getMonth())
            .filter(x => x.date[2] === today.getFullYear())
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
          var today = new Date(2021, 11, 20);
          this.setState({
            raceNightEvents: response.data
              .filter(x => x.date[0] === today.getDate())
              .filter(x => x.date[1] === today.getMonth())
              .filter(x => x.date[2] === today.getFullYear())
          });
        })
        .catch(function (error) {
          console.log(error);
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
      this.state.raceSheets.map(raceSheet => {
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

        if(eventType !== undefined && raceEvent !== undefined) {
          return (
            <div>
              <h1>Maitland Swimming Club Race Sheet</h1>
              
              <table>
                <tbody>
                  <tr>
                    <td colSpan="2"><strong>EVENT:</strong> {eventType.distance}m {eventType.stroke} </td>
                    <td colSpan="2"><strong>GRADE:</strong> {this.produceGradesString(eventType.grades)} </td>
                  </tr>
                  <tr>
                    <td colSpan="1"><strong>EVENT No.:</strong>{raceSheet.eventNumber}</td>
                    <td colSpan="1"><strong>DISTANCE:</strong> {eventType.distance}m </td>
                    <td colSpan="1"><strong>HEAT No.:</strong>{raceSheet.heatNumber}</td>
                    <td colSpan="1"><strong>DATE:</strong> {raceSheet.date[0]}/{raceSheet.date[1]}/{raceSheet.date[2]} </td>
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
                          {raceSheet.hcapTimes[count] === 10000 ? "TT" : raceSheet.hcapTimes[0]}
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
            </div>
          );
        } else {
          return (<p></p>)
        }
      })
    );
  }
}
 