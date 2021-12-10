import React, { Component } from 'react';
import axios from 'axios';

export class RaceSheets extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      raceSheets: [],
      eventTypes: [],
      raceNightEvents: []
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

        return (
          <div>
            <h1>Maitland Swimming Club Race Sheet</h1>
            
            <table style={{ borderWidth: '0px', borderStyle: 'solid' }}>
              <tbody>
                <tr>
                  <td colSpan="2" style={{ border: '0px' }}><strong>EVENT:</strong> 50M FREESTYLE </td>
                  <td colSpan="2" style={{ border: '0px' }}><strong>GRADE:</strong> BATHS DASH </td>
                </tr>
                <tr>
                  <td colSpan="1" style={{ border: '0px' }}><strong>EVENT No.:</strong></td>
                  <td colSpan="1" style={{ border: '0px' }}><strong>DISTANCE:</strong> {eventType.distance}m </td>
                  <td colSpan="1" style={{ border: '0px' }}><strong>HEAT No.:</strong> " . ($race_count) . "</td>
                  <td colSpan="1" style={{ border: '0px' }}><strong>DATE:</strong> {raceEvent.date[0]}/{raceEvent.date[1]}/{raceEvent.date[2]} </td>
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
                <tr>
                  <td>

                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      })


      
    );
  }
}
 