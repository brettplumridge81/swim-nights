import React, { Component } from 'react';
import axios from 'axios';

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

  recordSwimmerResult = (raceEvent, currentSwimmer, place, time) => {
    console.log("Swimmer Result Recorded");
    console.log(raceEvent);
    console.log(currentSwimmer);
    console.log(place);
    console.log(time);


  }

  produceNetTime(minutes, seconds, hundredths, goAt) {
    if (minutes === undefined || seconds === undefined || hundredths === undefined) {
      return;
    }

    var netTime = new Array(minutes, seconds, hundredths);

    console.log(netTime);
    return netTime;
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
        console.log("raceEvent");
        console.log(raceEvent);

        // <div>
        //   <h1>Race Night Results Input</h1>
        //   <div>
        //     {
        //       this.state.raceNights.map((raceNight, i) => (
        //         <div>
        //           <label>
        //             <input type="radio" name="race_night_select" onChange={() => this.handleRaceNightSelect(raceNight)} />
        //             {raceNight.date[0] + "/" + raceNight.date[1] + "/" + raceNight.date[2]}
        //           </label>
        //         </div>
        //       ))
        //     }
        //   </div>
        // </div>

        // var eventType = this.state.eventTypes.filter(eventType => raceSheet.eventTypeId === eventType.eventTypeId)[0];
        // var raceEvent = this.state.raceNightEvents.filter(raceEvent => raceSheet.raceEventId === raceEvent.raceEventId)[0];

        // var numSwimmers = raceSheet.swimmerNames.length;
        // var numUnusedLanes = 8 - numSwimmers;
        // var firstLane = Math.floor(numUnusedLanes / 2 + 1);
        // var lastLane = firstLane + numSwimmers - 1;

        // var swimmers = raceSheet.swimmerNames;
        // var hcaps = raceSheet.hcapTimes;
        // var goAts = raceSheet.goAts;
        // for (var count = 1; count < 9; count++) {
        //   if (count < firstLane) {
        //     swimmers.unshift("");
        //     hcaps.unshift("");
        //     goAts.unshift("");
        //   }
        //   if (count > lastLane) {
        //     swimmers.push("");
        //     hcaps.push("");
        //     goAts.push("");
        //   }
        // }

        if(raceEvent !== undefined && raceEvent.swimmerNames.length !== 0) {
          return (
            <div>
            <div>
                <h2>Race Night Events</h2>
                <h3>{raceEvent.eventNumber}</h3>
                  
                <table style={{ borderWidth: '2px', borderStyle: 'solid' }}>
                  <colgroup>
                    <col span="1" style={{ width:'50%', align: 'center', borderWidth: '1px' }} />
                    <col span="1" style={{ width:'10%', align: 'center', borderWidth: '1px' }} />
                    <col span="1" style={{ width:'10%', align: 'center', borderWidth: '1px' }} />
                    <col span="1" style={{ width:'10%', align: 'center', borderWidth: '1px' }} />
                    <col span="1" style={{ width:'10%', align: 'center', borderWidth: '1px' }} />
                    <col span="1" style={{ width:'10%', align: 'center', borderWidth: '1px' }} />
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
                          <tr>
                            <td style={{ textAlign: 'center', borderWidth: '1px' }}>
                              {currentSwimmer}
                            </td>
                            <td style={{ textAlign: 'center', borderWidth: '1px' }}>
                              <div class="record_place">
                                <input type="number" id="place"></input>
                              </div>
                            </td>
                            <td style={{ textAlign: 'center', borderWidth: '1px' }}>
                              <div class="record_gross_time">
                                <td><input type="number" id="gross_time_minutes"></input></td>
                                <td>:</td>
                                <td><input type="number" id="gross_time_seconds"></input></td>
                                <td>.</td>
                                <td>
                                  <input type="number" id="gross_time_hundredths" 
                                    onChange={() => this.produceNetTime(
                                        document.getElementById("gross_time_minutes")?.value,
                                        document.getElementById("gross_time_seconds")?.value,
                                        document.getElementById("gross_time_hundredths")?.value,
                                        
                                      )}>
                                  </input>
                                </td>
                              </div>
                            </td>
                            <td style={{ textAlign: 'center', borderWidth: '1px' }}>
                              <input type="text"></input>
                            </td>
                            <td style={{ textAlign: 'center', borderWidth: '1px' }}>
                              tick
                            </td>
                            <td style={{ textAlign: 'center', borderWidth: '1px' }}>
                              <button onClick={() => this.recordSwimmerResult(raceEvent, currentSwimmer, 
                                document.getElementById("place").value, document.getElementById("gross_time").value)}>
                                  Record Result
                              </button>
                            </td>
                          </tr>
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
