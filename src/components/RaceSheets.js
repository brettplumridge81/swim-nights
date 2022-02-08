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
        console.log("raceSheet");
        console.log(raceSheet);
        console.log("eventType");
        console.log(eventType);
        console.log("raceEvent");
        console.log(raceEvent);

        if(eventType !== undefined && raceEvent !== undefined) {
          return (
            <div>
              <h1>Maitland Swimming Club Race Sheet</h1>
              
              <table style={{ borderWidth: '0px', borderStyle: 'solid' }}>
                <tbody>
                  <tr>
                    <td colSpan="2" style={{ border: '0px' }}><strong>EVENT:</strong> {eventType.distance}m {eventType.stroke} </td>
                    <td colSpan="2" style={{ border: '0px' }}><strong>GRADE:</strong> {this.produceGradesString(eventType.grades)} </td>
                  </tr>
                  <tr>
                    <td colSpan="1" style={{ border: '0px' }}><strong>EVENT No.:</strong>{raceSheet.eventNumber}</td>
                    <td colSpan="1" style={{ border: '0px' }}><strong>DISTANCE:</strong> {eventType.distance}m </td>
                    <td colSpan="1" style={{ border: '0px' }}><strong>HEAT No.:</strong>{raceSheet.heatNumber}</td>
                    <td colSpan="1" style={{ border: '0px' }}><strong>DATE:</strong> {raceSheet.date[0]}/{raceSheet.date[1]}/{raceSheet.date[2]} </td>
                  </tr>
                </tbody>					
              </table>
                
              <table>
                <colgroup>
                  <col span="1" style={{ width:'33%', align: 'center', borderWidth: '1px', borderStyle: 'solid' }} />
                  <col span="1" style={{ width:'10%', align: 'center', borderWidth: '1px', borderStyle: 'solid' }} />
                  <col span="1" style={{ width:'10%', align: 'center', borderWidth: '1px', borderStyle: 'solid' }} />
                  <col span="1" style={{ width:'8%', align: 'center', borderWidth: '1px', borderStyle: 'solid' }} />
                  <col span="1" style={{ width:'12%', align: 'center', borderWidth: '1px', borderStyle: 'solid' }} />
                  <col span="1" style={{ width:'13%', align: 'center', borderWidth: '1px', borderStyle: 'solid' }} />
                  <col span="1" style={{ width:'13%', align: 'center', borderWidth: '1px', borderStyle: 'solid' }} />
                </colgroup>
                
                <thead>
                  <tr height="30">
                    <th style={{ textAlign: 'center' }}>NAME</th>
                    <th style={{ textAlign: 'center' }}>LANE</th>
                    <th style={{ textAlign: 'center' }}>H'CAP TIME</th>
                    <th style={{ textAlign: 'center' }}>GO AT</th>
                    <th style={{ textAlign: 'center' }}>PLACE</th>
                    <th style={{ textAlign: 'center' }}>GROSS TIME</th>
                    <th style={{ textAlign: 'center' }}>NET TIME</th>
                  </tr>
                </thead>
                
                <tbody>
                  { raceSheet.swimmerNames.map(function(currentSwimmer, count = 1) {
                    return (<tr>
                      <td style={{ textAlign: 'center', borderWidth: '1px', borderStyle: 'solid' }}>
                        {currentSwimmer}
                      </td>
                      <td style={{ textAlign: 'center', borderWidth: '1px', borderStyle: 'solid' }}>
                        {count+1}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {raceSheet.hcapTimes[0]}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {raceSheet.goAts[0]}
                      </td>
                    </tr>)
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
 