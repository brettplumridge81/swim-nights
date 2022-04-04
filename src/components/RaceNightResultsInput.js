import React, { Component } from 'react';
import axios from 'axios';
import { SwimmerResultInput } from './SwimmerResultInput';

export class RaceNightResultsInput extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      // raceSheets: [],
      // eventTypes: [],
      raceNights: [],
      raceNightEvents: [],
      swimmerNames: [],
      selectedRaceNightDate: []
    };
  }

  componentDidMount() {
    this.getRaceNights();
    // this.populateRaceSheets();
    // this.populateEventTypesData();
    this.getRaceNightEventsData();
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

  // async populateRaceSheets() {
  //   await axios.get('http://localhost:4000/fridaynightraces/racesheets/')
  //     .then(response => {
  //       var today = new Date(2021, 11, 20);
  //       this.setState({ 
  //         raceSheets: response.data
  //           .filter(x => x.date[0] === today.getDate())
  //           .filter(x => x.date[1] === today.getMonth())
  //           .filter(x => x.date[2] === today.getFullYear())
  //       });
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     })
  // }

  // async populateEventTypesData() {
  //   await axios.get('http://localhost:4000/fridaynightraces/eventtypes/')
  //     .then(response => {
  //       this.setState({ 
  //         eventTypes: response.data
  //       });
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     })
  // }

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

  // async getEventTypesForSelectedRaceNight() {
  //   await axios.get('http://localhost:4000/fridaynightraces/eventTypes/')
  //     .then(response => {
  //       console.log(response.data);
  //       this.setState({ 
  //         eventTypes: response.data
  //       });
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     })
  // }

  handleRaceNightSelect(raceNight) {
    console.log("raceNight");
    console.log(raceNight);
    this.setState({
      selectedRaceNightDate: raceNight.date//,
      // selectedRaceNightRaceEventIds: raceNight.raceEventIds
    });

    // setTimeout(() => {
    //   axios.get('http://localhost:4000/fridaynightraces/raceEvents/')
    //   .then(response => {
    //     console.log(response.data);
    //     this.setState({ 
    //       eventTypeIds: response.data
    //         .filter(x => this.state.selectedRaceNightRaceEventIds.includes(x.raceEventId))
    //         .map(x => x.eventTypeId)
    //       });
    //     })
    //     .catch(function (error) {
    //       console.log(error);
    //     })
    //   }, 100);

    //   setTimeout(() => {
    //     axios.get('http://localhost:4000/fridaynightraces/eventTypes/')
    //     .then(response => {
    //       console.log(response.data);
    //       this.setState({ 
    //         eventTypes: response.data
    //           .filter(x => this.eventTypeIds.includes(x.eventTypeId))
    //       });
    //     })
    //     .catch(function (error) {
    //       console.log(error);
    //     })
    
    //     setTimeout(() => {
    //       this.getEventTypesForSelectedRaceNight();
    //     }, 100);
    //   }, 100);
  }

  

  produceNetTime(minutes, seconds, hundredths, raceEventId, swimmerName) {
    if (minutes === undefined || seconds === undefined || hundredths === undefined) {
      return;
    }

    var result;
    axios.get('http://localhost:4000/fridaynightraces/results/')
      .then(response => {
        result = response.data
            .filter(x => x.raceEventId === raceEventId)
            .filter(x => x.swimmerName === swimmerName)[0];

        console.log(result);

        result.grossTime = new Array(minutes, seconds, hundredths);
        result.netTime = new Array(
          minutes - Math.floor(result.goAt / 60),
          seconds - result.goAt % 60,
          hundredths
        )

        console.log("result");
        console.log(result);
        return result.netTime;
      })
      .catch(function (error) {
        console.log(error);
      })
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
      this.state.raceNightEvents.map(raceEvent => {
        if(raceEvent !== undefined && raceEvent.swimmerNames.length !== 0) {
          return (
            <div>
              <div>
                <h2>Race Night Events</h2>
                <h3>{raceEvent.eventNumber}</h3>
                  
                <table style={{ borderWidth: '2px', borderStyle: 'solid' }}>
                  <colgroup>
                    <col span="1" style={{ width:'30%', align: 'center', borderWidth: '1px' }} />
                    <col span="1" style={{ width:'10%', align: 'center', borderWidth: '1px' }} />
                    <col span="1" style={{ width:'10%', align: 'center', borderWidth: '1px' }} />
                    <col span="1" style={{ width:'10%', align: 'center', borderWidth: '1px' }} />
                    <col span="1" style={{ width:'10%', align: 'center', borderWidth: '1px' }} />
                    <col span="1" style={{ width:'30%', align: 'center', borderWidth: '1px' }} />
                  </colgroup>
                  
                  <thead>
                    <tr height="30">
                      <th style={{ textAlign: 'center', borderWidth: '2px', borderStyle: 'solid' }}>NAME</th>
                      <th style={{ textAlign: 'center', borderWidth: '2px', borderStyle: 'solid' }}>PLACE</th>
                      <th style={{ textAlign: 'center', borderWidth: '2px', borderStyle: 'solid' }}>GROSS TIME</th>
                      <th style={{ textAlign: 'center', borderWidth: '2px', borderStyle: 'solid' }}>NET TIME</th>
                    </tr>
                  </thead>
                  
                  <tbody>
                    { 
                      raceEvent.swimmerNames.map((currentSwimmer) => {
                        return (
                          <SwimmerResultInput raceEventId={raceEvent.raceEventId} swimmerName={currentSwimmer} />
                        )
                      })
                    }
                  </tbody>
                </table>
                <button onClick={() => this.recordSwimmerResult()}>Record Result</button>
              </div>
            </div>
          );
        } else {
          return (<p></p>)
        }
      })
    );
  }
}
