import React, { Component } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

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
      selectedSwimmerId: "",
      selectedSwimmerAge: "",
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
    this.setState({
      raceNightEventTypes: this.state.eventTypes
        .filter(x => this.state.raceNight[0].raceEventIds.includes(x.eventTypeId))
        .filter(x => this.state.selectedSwimmerAge >= x.minAge && this.state.selectedSwimmerAge <= x.maxAge)
    });
  }

  handleEnterRaces() {
    // Enter selected events
    var raceEvent;
    this.state.eventIdsToEnter.forEach(raceEventId => {
      axios.get('http://localhost:4000/fridaynightraces/raceevents/')
        .then(response => {
          raceEvent = response.data.filter(x => x.raceEventId === raceEventId);

          if (!raceEvent[0].swimmerIds.includes(this.state.selectedSwimmerId)) {
            raceEvent[0].swimmerIds.push(this.state.selectedSwimmerId);
          }

          axios.post('http://localhost:4000/fridaynightraces/raceevents/update/' + raceEvent[0]._id, raceEvent);

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

          if (raceEvent[0].swimmerIds.includes(this.state.selectedSwimmerId)) {
            var index = raceEvent[0].swimmerIds.indexOf(this.state.selectedSwimmerId);
            raceEvent[0].swimmerIds.splice(index, 1);
          }
  
          axios.post('http://localhost:4000/fridaynightraces/raceevents/update/' + raceEvent[0]._id, raceEvent);

          setTimeout(() => {
            this.generateRaceSheetsForEvent(this.state.eventIdsToWithdraw);
          }, 500);
        })
        .catch(function (error) {
          console.log(error);
        });
      });

    setTimeout(() => {
      alert("Races Entered");
      window.location.reload(false);
    }, 1000);
  }

  generateRaceSheetsForEvent(raceEventIds) {
    var numberOfHeats;
    var swimmerIds = [];
    var raceEvent;
    var hcapTimes = [];
    var goAts = [];

    this.getRaceNightEventsData();

    setTimeout(() => {
      raceEventIds.forEach(raceEventId => {
        raceEvent = this.state.raceNightEvents.filter(x => x.raceEventId === raceEventId);
        swimmerIds = raceEvent[0].swimmerIds;

        if (swimmerIds.length === 0) {
          numberOfHeats = 0;
        } else if (swimmerIds.length <= 7) {
          numberOfHeats = 1;
        } else {
          numberOfHeats = swimmerIds.length !== 0 ? parseInt(swimmerIds.length / 6) : 0;
        }
    
        axios.get('http://localhost:4000/fridaynightraces/swimmereventresults/')
          .then(response => {
            var swimmerEventResults = response.data
              .filter(x => swimmerIds.includes(x.swimmerId))
              .filter(x => raceEvent.eventTypeId === x.eventTypeId);
  
            // Store the swimmerIds and the hcapTimes
            var lastThreeTimes;
            var hcapTime;
            swimmerIds.forEach(swimmerId => {
              lastThreeTimes = swimmerEventResults.filter(x => x.swimmerId === swimmerId).slice(0, 3).map(x => x.recordedTime);
              hcapTime = 10000;
              lastThreeTimes.forEach(time => {
                if (hcapTime === 10000 || parseInt(time) < hcapTime) {
                  hcapTime = parseInt(time);
                }
              });
              swimmerIds.push(swimmerId);
              hcapTimes.push(hcapTime);
            });
  
            // sort the hcapTimes and match the swimmerIds
            for(var i = 0; i < hcapTimes.length; i++) {
              for(var j = 0; j < hcapTimes.length; j++) {
                if(hcapTimes[j] < hcapTimes[j+1]) {
                  var temp = hcapTimes[j]
                  hcapTimes[j] = hcapTimes[j+1]
                  hcapTimes[j+1] = temp
  
                  temp = swimmerIds[j]
                  swimmerIds[j] = swimmerIds[j+1]
                  swimmerIds[j+1] = temp
                }
              }
            }
            
            // Calculate and store the goAts
            hcapTimes.forEach(x => {
              goAts.push(hcapTimes[0] - x);
            });
  
            this.populateRaceEventHeats(swimmerIds, hcapTimes, goAts, numberOfHeats, raceEvent);
          })
          .catch(function (error) {
            console.log(error);
          });
      });
    }, 500);
  }

  populateRaceEventHeats(swimmerIds, hcapTimes, goAts, numberOfHeats, raceEvent) {
    var swimmerCount = 0
    var numberOfSwimmers = swimmerIds.length;
    var swimmersPerHeat = parseInt(numberOfSwimmers / numberOfHeats);
    for (var heatCount = 0; heatCount < numberOfHeats; heatCount++) {
      var heatSwimmerIds = [];
      var heatHcapTimes = [];
      var heatGoAts = [];

      while (swimmersPerHeat % swimmerCount != 0) {
        heatSwimmerIds.push(swimmerIds[swimmerCount]);
        heatHcapTimes.push(hcapTimes[swimmerCount]);
        heatGoAts.push(goAts[swimmerCount]);
        swimmerCount++;
      }

      console.log("raceEvent");
      console.log(raceEvent);

      const newRaceSheet = {
        raceSheetId: uuidv4(),
        date: raceEvent[0].date,
        raceEventId: raceEvent[0].raceEventId,
        eventTypeId: raceEvent[0].eventTypeId,
        eventNumber: raceEvent[0].eventNumber,
        heatNumber: heatCount + 1,
        swimmerIds: heatSwimmerIds,
        hcapTimes: heatHcapTimes,
        goAts: heatGoAts
      }

      console.log("newRaceSheet");
      console.log(newRaceSheet);

      axios.post('http://localhost:4000/fridaynightraces/racesheets/add_racesheet', newRaceSheet);
    }
  }

  isEntered(currentEvent) {
    var raceEvent = this.state.raceNightEvents.filter(x => x.eventTypeId === currentEvent.eventTypeId);
    if (raceEvent[0].swimmerIds.includes(this.state.selectedSwimmerId)) {
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
      selectedSwimmerId: swimmer.swimmerId,
      selectedSwimmerAge: swimmer.ageAtSeasonStart,
      raceNightEventTypes: []
    });

    setTimeout(() => {
      this.setRaceNightEvents();
    },50);
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
                  <th>Age</th>
                  <th>Distance</th>
                  <th>Stroke</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.raceNightEventTypes.map((currentEvent, i) => (
                    <tr>
                      <td>{currentEvent.minAge} - {currentEvent.maxAge}</td>
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
 