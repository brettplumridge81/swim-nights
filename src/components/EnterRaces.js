import React, { Component } from 'react';
import axios from 'axios';

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

          this.generateRaceSheetsForEvent(this.state.eventIdsToEnter);
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

          this.generateRaceSheetsForEvent(this.state.eventIdsToWithdraw);
        })
        .catch(function (error) {
          console.log(error);
        });
      });

    setTimeout(function() {
      alert("Races Entered");
      window.location.reload(false);
    }, 50);
  }

  generateRaceSheetsForEvent(raceEventIds) {
    var numberOfHeats;
    var heats = [];
    var swimmerIds = [];
    var raceEvent;
    var hcapTimes = [];
    var goAts = [];
    var currentSwimmerLastThreeTimes = [];

    raceEventIds.forEach(raceEventId => {
      raceEvent = this.state.raceNightEvents.filter(x => x.raceEventId === raceEventId);
      swimmerIds = this.state.raceNightEvents.filter(x => x.raceEventId === raceEventId)[0].swimmerIds;
      if (swimmerIds.length <= 7) {
        numberOfHeats = 1;
      } else {
        numberOfHeats = swimmerIds.length !== 0 ? parseInt(swimmerIds.length / 6) : 0;
      }
      console.log(numberOfHeats);
  
      axios.get('http://localhost:4000/fridaynightraces/swimmerEventResults/')
        .then(response => {
          var swimmerEventResults = response.data
            .filter(x => swimmerIds.includes(x.swimmerId))
            .filter(x => raceEvent.eventTypeId === x.eventTypeId);

          var lastThreeTimes;
          var hcapTime;
          swimmerIds.forEach(swimmerId => {
            lastThreeTimes = swimmerEventResults.filter(x => x.swimmerId === swimmerId).slice(0, 3).map(x => x.recordedTime);
            hcapTime = 0;
            lastThreeTimes.forEach(time => {
              if (hcapTime === 0 || parseInt(time) < hcapTime) {
                hcapTime = parseInt(time);
              }
            });
            swimmerIds.push(swimmerId);
            hcapTimes.push(hcapTime);
          });

          var sortedHcapTimes = [];
          sortedHcapTimes.push(hcapTime);
          for (var i = 1; i < hcapTimes.length; i++) {
            for (var j = 0; j < i; j++) {
              if (hcapTimes[i] > sortedHcapTimes[j]) {
                sortedHcapTimes[i + 1] = sortedHcapTimes[i];
                sortedHcapTimes[i] = hcapTimes[j];
              } else {
                // sortedHcapTimes[i] = hcapTimes[i];
              }
              j++;
            }
            j = 0;
            i++;
          }
          
          hcapTimes.forEach(x => {

          });
        })
        .catch(function (error) {
          console.log(error);
        });
    });
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
      selectedSwimmerAge: swimmer.ageAtSeasonStart
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
 