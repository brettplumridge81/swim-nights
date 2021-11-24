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

  // async getEventsEntered() {
  //   var eventTypeIdsEntered = [];
  //   var eventsEntered;
  //     axios.get('http://localhost:4000/fridaynightraces/raceevents/')
  //     .then(response => {

  //       var today = new Date(2021, 11, 20);

  //       console.log(response.data);
  //       console.log(today);
  //       eventsEntered = response.data
  //         // .filter(x => x.date[0] === today.getDate())
  //         // .filter(x => x.date[1] === today.getMonth() + 1)
  //         // .filter(x => x.date[2] === today.getFullYear())
  //         // .filter(x => x.swimmerIds.includes(this.state.selectedSwimmerId))
  //         .map(x => x.eventTypeId);

  //       // console.log("eventsEntered");
  //       // console.log("selectedSwimmer: " + this.state.selectedSwimmerId);
  //       // console.log(eventsEntered);
  //       eventsEntered.forEach(x => {
  //         // console.log("x: " + x);
  //         eventTypeIdsEntered.push(x);
  //       });
  //     });
  // }

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
 