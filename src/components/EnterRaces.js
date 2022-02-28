import React, { Component } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { UncontrolledTooltip } from 'reactstrap';

export class EnterRaces extends Component {
    static displayName = EnterRaces.name;

  constructor(props) {
    super(props);
    this.state = { 
      eventTypes: [],
      raceNight: [],
      raceNightEventTypes: [],
      raceNightEvents: [],
      swimmers: [],
      selectedSwimmerName: "",
      selectedSwimmerGrade: "",
      eventIdsToEnter: [],
      eventIdsToWithdraw: []
    };

    this.handleSwimmerSelect = this.handleSwimmerSelect.bind(this);
  }

  componentDidMount() {
    this.populateSwimmers();
    this.populateEventTypesData();
    this.getRaceNight();
    this.getRaceNightEventsData();
  }

  async populateSwimmers() {
    axios.get('http://localhost:4000/fridaynightraces/swimmers/')
      .then(response => {
        this.setState({ 
          swimmers: response.data
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

  async getRaceNight() {
    await axios.get('http://localhost:4000/fridaynightraces/racenights/')
      .then(response => {
        var today = new Date(2021, 11, 20);
        this.setState({ 
          raceNight: response.data
            .filter(x => x.date[0] === today.getDate())
            .filter(x => x.date[1] === today.getMonth())
            .filter(x => x.date[2] === today.getFullYear())
        });
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  async getRaceNightEventsData() {
    axios.get('http://localhost:4000/fridaynightraces/raceevents/')
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

  setRaceNightEvents() {
    if (this.state.raceNight.length === 0) {
      return;
    }

    this.setState({
      raceNightEventTypes: this.state.eventTypes
        .filter(x => this.state.raceNight[0].raceEventIds.includes(x.eventTypeId))
        .filter(x => x.grades.includes(this.state.selectedSwimmerGrade))
    });
  }

  handleEnterRaces() {
    console.log("this.state.eventIdsToEnter");
    console.log(this.state.eventIdsToEnter);
    console.log("this.state.eventIdsToWithdraw");
    console.log(this.state.eventIdsToWithdraw);
    // Enter selected events
    var raceEvent;
    this.state.eventIdsToEnter.forEach(raceEventId => {
      axios.get('http://localhost:4000/fridaynightraces/raceevents/')
        .then(response => {
          raceEvent = response.data.filter(x => x.raceEventId === raceEventId);

          if (!raceEvent[0].swimmerNames.includes(this.state.selectedSwimmerName)) {
            raceEvent[0].swimmerNames.push(this.state.selectedSwimmerName);
          }

          axios.post('http://localhost:4000/fridaynightraces/raceevents/update/' + raceEvent[0]._id, raceEvent);

          // Clear the existing Race Sheets for this event
          var raceSheetsForRaceEvent;
          axios.get('http://localhost:4000/fridaynightraces/racesheets/')
          .then(response => {
            raceSheetsForRaceEvent = response.data.filter(x => x.raceEventId === raceEventId);

            raceSheetsForRaceEvent.forEach(raceSheet => {
              axios.get('http://localhost:4000/fridaynightraces/racesheets/delete/' + raceSheet._id);
            });
          })
          .catch(function (error) {
            console.log(error);
          });

          setTimeout(() => {
            this.generateRaceSheetsForEvent(this.state.eventIdsToEnter);
          }, 500);
        })
        .catch(function (error) {
          console.log(error);
        });
    });

    // Withdraw from deselected events
    this.state.eventIdsToWithdraw.forEach(raceEventId => {
      axios.get('http://localhost:4000/fridaynightraces/raceevents/')
        .then(response => {
          raceEvent = response.data.filter(x => x.raceEventId === raceEventId);

          if (raceEvent[0].swimmerNames.includes(this.state.selectedSwimmerName)) {
            var index = raceEvent[0].swimmerNames.indexOf(this.state.selectedSwimmerName);
            raceEvent[0].swimmerNames.splice(index, 1);
          }
  
          axios.post('http://localhost:4000/fridaynightraces/raceevents/update/' + raceEvent[0]._id, raceEvent);

          // Clear the existing Race Sheets for this event
          var raceSheetsForRaceEvent;
          axios.get('http://localhost:4000/fridaynightraces/racesheets/')
          .then(response => {
            raceSheetsForRaceEvent = response.data.filter(x => x.raceEventId === raceEventId);

            raceSheetsForRaceEvent.forEach(raceSheet => {
              axios.get('http://localhost:4000/fridaynightraces/racesheets/delete/' + raceSheet._id);
            });
          })
          .catch(function (error) {
            console.log(error);
          });

          setTimeout(() => {
            this.generateRaceSheetsForEvent(this.state.eventIdsToWithdraw);
          }, 500);
        })
        .catch(function (error) {
          console.log(error);
        });
      });

    // setTimeout(() => {
    //   alert("Races Entered");
    //   window.location.reload(false);
    // }, 1000);
  }

  generateRaceSheetsForEvent(raceEventIds) {
    var numberOfHeats;
    var swimmerNames = [];
    var raceEvent;
    var hcapTimes = [];
    var goAts = [];

    this.getRaceNightEventsData();

    console.log("this.state.raceNightEvents");
    console.log(this.state.raceNightEvents);

    setTimeout(() => {
      raceEventIds.forEach(raceEventId => {
        raceEvent = this.state.raceNightEvents.filter(x => x.raceEventId === raceEventId);
        swimmerNames = raceEvent[0].swimmerNames;

        if (swimmerNames.length === 0) {
          numberOfHeats = 0;
        } else if (swimmerNames.length <= 7) {
          numberOfHeats = 1;
        } else {
          numberOfHeats = swimmerNames.length !== 0 ? parseInt(swimmerNames.length / 6) : 0;
        }
    
        axios.get('http://localhost:4000/fridaynightraces/swimmereventresults/')
          .then(response => {
            var swimmerEventResults = response.data
              .filter(x => swimmerNames.includes(x.swimmerName))
              .filter(x => raceEvent.eventTypeId === x.eventTypeId);
  
            // Store the swimmerNames and the hcapTimes
            var lastThreeTimes;
            var hcapTime;
            swimmerNames.forEach(swimmerName => {
              lastThreeTimes = swimmerEventResults.filter(x => x.swimmerName === swimmerName).slice(0, 3).map(x => x.recordedTime);
              hcapTime = 10000;
              lastThreeTimes.forEach(time => {
                if (hcapTime === 10000 || parseInt(time) < hcapTime) {
                  hcapTime = parseInt(time);
                }
              });
              hcapTimes.push(hcapTime);
            });
  
            // sort the hcapTimes and match the swimmerNames
            for(var i = 0; i < hcapTimes.length; i++) {
              for(var j = 0; j < hcapTimes.length; j++) {
                if(hcapTimes[j] < hcapTimes[j+1]) {
                  var temp = hcapTimes[j]
                  hcapTimes[j] = hcapTimes[j+1]
                  hcapTimes[j+1] = temp
  
                  temp = swimmerNames[j]
                  swimmerNames[j] = swimmerNames[j+1]
                  swimmerNames[j+1] = temp
                }
              }
            }
            
            // Calculate and store the goAts
            hcapTimes.forEach(x => {
              goAts.push(hcapTimes[0] - x);
            });
  
            this.populateRaceEventHeats(swimmerNames, hcapTimes, goAts, numberOfHeats, raceEvent);
          })
          .catch(function (error) {
            console.log(error);
          });
      });
    }, 500);
  }

  populateRaceEventHeats(swimmerNames, hcapTimes, goAts, numberOfHeats, raceEvent) {
    var numberOfSwimmers = swimmerNames.length;
    var swimmersPerHeat = parseInt(numberOfSwimmers / numberOfHeats);
    var swimmerCount = swimmersPerHeat;

    for (var heatCount = 0; heatCount < numberOfHeats; heatCount++) {
      var heatSwimmerNames = [];
      var heatHcapTimes = [];
      var heatGoAts = [];
      
      while (swimmerCount > 0) {
        heatSwimmerNames.push(swimmerNames[swimmerCount - 1]);
        heatHcapTimes.push(hcapTimes[swimmerCount - 1]);
        heatGoAts.push(goAts[swimmerCount - 1]);
        swimmerCount--;
      }

      const newRaceSheet = {
        raceSheetId: uuidv4(),
        date: raceEvent[0].date,
        raceEventId: raceEvent[0].raceEventId,
        eventTypeId: raceEvent[0].eventTypeId,
        eventNumber: raceEvent[0].eventNumber,
        heatNumber: heatCount + 1,
        swimmerNames: heatSwimmerNames,
        hcapTimes: heatHcapTimes,
        goAts: heatGoAts
      }

      axios.post('http://localhost:4000/fridaynightraces/racesheets/add_racesheet', newRaceSheet);
    }

    setTimeout(() => {
      alert("Races Entered");
      window.location.reload(false);
    }, 1000);
  }

  isEntered(currentEvent) {
    var raceEvent = this.state.raceNightEvents.filter(x => x.eventTypeId === currentEvent.eventTypeId);
    if (raceEvent[0].swimmerNames.includes(this.state.selectedSwimmerName)) {
      return true;
    } else {
      return false;
    }
  }

  handleEventChecked(eventType) {
    var raceEventId = this.state.raceNightEvents.filter(x => x.eventTypeId === eventType.eventTypeId)[0].raceEventId;

    if (this.isEntered(eventType)) {
      var idsToWithdraw = this.state.eventIdsToWithdraw;

      if (!idsToWithdraw.includes(raceEventId)) {
        idsToWithdraw.push(raceEventId);
      } else {
        var index = idsToWithdraw.indexOf(raceEventId);
        idsToWithdraw.splice(index, 1);
      }

      this.setState({
        eventIdsToWithdraw: idsToWithdraw
      });

    } else {
      var idsToEnter = this.state.eventIdsToEnter;

      if (!idsToEnter.includes(raceEventId)) {
        idsToEnter.push(raceEventId);
      } else {
        var index = idsToEnter.indexOf(raceEventId);
        idsToEnter.splice(index, 1);
      }

      this.setState({
        eventIdsToEnter: idsToEnter
      });

    }
  }

  handleSwimmerSelect(swimmer) {
    this.setState({
      selectedSwimmerName: swimmer.name,
      selectedSwimmerGrade: swimmer.grade,
      raceNightEventTypes: []
    });

    setTimeout(() => {
      this.setRaceNightEvents();
    },50);
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
        <div>
          <h3>Swimmers</h3>
          <div>
            {
              this.state.swimmers.map((swimmer, i) => (
                <div>
                  <label>
                    <input type="radio" name="swimmer_select" onChange={() => this.handleSwimmerSelect(swimmer)} />
                    {swimmer.name}
                  </label>
                </div>
              ))
            }
          </div>
          <div>
            <h3>Events</h3>
            <table className="table table-striped" style={{ marginTop: 20 }}>
              <thead>
                <tr>
                  <th>Grades</th>
                  <th>Distance</th>
                  <th>Stroke</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.raceNightEventTypes.map((currentEvent, i) => (
                    <tr>
                      <td>{this.produceGradesString(currentEvent.grades)}</td>
                      <td>{currentEvent.distance}</td>
                      <td>{currentEvent.stroke}</td>
                      <td>
                        <input type="checkbox" defaultChecked={ this.isEntered(currentEvent) } onChange={ () => this.handleEventChecked(currentEvent) } />
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
        <div>
        <button onClick={ () => this.handleEnterRaces() }>Enter Races</button>
        </div>
      </div>
    );
  }
}
 