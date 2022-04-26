import React, { Component } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export class EnterRaces extends Component {
    static displayName = EnterRaces.name;

    storedResults;
  
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
      results: []
    };

    this.handleSwimmerSelect = this.handleSwimmerSelect.bind(this);
  }

  componentDidMount() {
    this.populateSwimmers();
    this.populateEventTypesData();
    this.getRaceNight();
    this.getRaceNightEventsData();
    this.getResultsDataForRaceNightEventsForSelectedSwimmer();
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

  async getResultsDataForRaceNightEventsForSelectedSwimmer() {
    axios.get('http://localhost:4000/fridaynightraces/results/')
      .then(response => {
        var raceEventIds = this.state.raceNightEvents.map(x => x.raceEventId);
        var results = response.data
          .filter(x => raceEventIds.includes(x.raceEventId))
          .filter(x => x.swimmerName === this.state.selectedSwimmerName);
        this.setState({
          results: results
        });
        this.storedResults = new Array();
        results.forEach(result => this.storedResults.push(result));
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  handleSwimmerSelect(swimmer) {
    this.setState({
      selectedSwimmerName: swimmer.name,
      selectedSwimmerGrade: swimmer.grade,
      raceNightEventTypes: []
    }, () => {
      this.setRaceNightEvents();
      this.getResultsDataForRaceNightEventsForSelectedSwimmer();
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

  handleEventChecked(eventType) {
    console.log("eventType");
    console.log(eventType);

    var raceEvent = this.state.raceNightEvents.filter(x => x.eventTypeId === eventType.eventTypeId)[0];

    if (this.isEntered(eventType)) {
      var index = raceEvent.swimmerNames.indexOf(this.state.selectedSwimmerName);
      raceEvent.swimmerNames.splice(index, 1);
      this.removeResult(raceEvent, this.state.selectedSwimmerName);
    } else {
      raceEvent.swimmerNames.push(this.state.selectedSwimmerName);
      this.addResult(raceEvent, eventType, this.state.selectedSwimmerName);
    }
  }

  addResult(raceEvent, eventType, swimmerName) {
    var results = this.state.results;

    const newResult = {
      resultId: uuidv4(),
      raceEventId: raceEvent.raceEventId,
      eventTypeId: eventType.eventTypeId,
      swimmerName: swimmerName,
      goAt: undefined,
      grossTime: undefined,
      netTime: undefined,
      place: undefined,
      points: undefined
    }

    results.push(newResult);
    
    raceEvent.resultIds.push(newResult.resultId);
  }

  removeResult(raceEvent, swimmerName) {
    var results = this.state.results;
    
    var resultId = results
      .filter(x => x.raceEventId === raceEvent.raceEventId)
      .filter(x => x.swimmerName === swimmerName)
      .map(x => x.resultId)[0];

    var index = results.map(x => x.resultId).indexOf(resultId);
    results.splice(index, 1);

    index = raceEvent.resultIds.indexOf(resultId);
    raceEvent.resultIds.splice(index, 1);
  }

  handleEnterRaces() {
    this.storeUpdatedRaceEvents(this.state.raceNightEvents);

    this.deleteResults(this.state.results).then(() => {
      this.storeResults(this.state.results);
    });

    this.removeActiveRaceSheets(this.state.raceNightEvents.map(x => x.raceEventId)).then(() => {
      this.generateRaceSheetsForEvents(this.state.raceNightEvents);
    });

    // setTimeout(() => {
    //   alert("Races Entered");
    //   window.location.reload(false);
    // }, 1000);
  }

  async storeUpdatedRaceEvents(raceEvents) {
    raceEvents.forEach(raceEvent => {
      axios.post('http://localhost:4000/fridaynightraces/raceevents/update/' + raceEvent._id, raceEvent)
      .catch(function (error) {
        console.log(error);
      });
    });
  }

  async deleteResults(results) {
    var resultsToDelete = this.storedResults.filter(result => !results.includes(result));
    resultsToDelete.forEach(result => {
      axios.get('http://localhost:4000/fridaynightraces/results/delete/' + result._id)
        .catch(function (error) {
          console.log(error);
        });
    });
  }

  async storeResults(results) {
    var resultsToCreate = results.filter(result => !this.storedResults.includes(result));
    resultsToCreate.forEach(result => {
      axios.post('http://localhost:4000/fridaynightraces/results/add_result', result)
        .catch(function (error) {
          console.log(error);
        });
    })
  }

  async removeActiveRaceSheets(raceEventIds) {
    var raceSheet_Ids = [];
    await axios.get('http://localhost:4000/fridaynightraces/racesheets/')
      .then(response => {
        raceSheet_Ids = response.data
          .filter(x => raceEventIds.includes(x.raceEventId))
          .map(x => x._id);
      })
      .then(() => {
        // Delete race sheets
        raceSheet_Ids.forEach(_id => axios.get('http://localhost:4000/fridaynightraces/raceSheets/delete/' + _id));
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  generateRaceSheetsForEvents(raceEvents) {
    var numberOfHeats;
    var swimmerNames = [];
    var hcapTimes = [];
    var goAts = [];

    raceEvents.forEach(raceEvent => {
      console.log("raceEvent");
      console.log(raceEvent);

      var swimmers = [];
      axios.get('http://localhost:4000/fridaynightraces/swimmers/')
      .then(response => {
        swimmers = response.data.filter(x => raceEvent.swimmerNames.includes(x.name));
      }).then(() => {
        // console.log("swimmers");
        // console.log(swimmers);

        if (swimmers.length === 0) {
          numberOfHeats = 0;
        } else if (swimmerNames.length <= 7) {
          numberOfHeats = 1;
        } else {
          numberOfHeats = swimmerNames.length !== 0 ? parseInt(swimmerNames.length / 6) : 0;
        }

        var swimmerSheetObjects = [];
        swimmers.forEach(swimmer => {
          var index = swimmer.eventTypeIds.indexOf(raceEvent.eventTypeId);
          swimmerSheetObjects.push([swimmer.name, swimmer.hCapTimes[index]]);
        });

        swimmerSheetObjects.sort((a, b) => (a[1] > b[1]) ? -1 : 1);
        // console.log(swimmerSheetObjects);

        swimmerNames = swimmerSheetObjects.map(x => x[0]);
        hcapTimes = swimmerSheetObjects.map(x => x[1]);
        // console.log(hcapTimes);

        hcapTimes.forEach(x => {
          goAts.push(hcapTimes[0] - x);
        });

        this.populateRaceEventHeats(swimmerNames, hcapTimes, goAts, numberOfHeats, raceEvent);
      })
      .catch(function (error) {
        console.log(error);
      });
    });
  }

  populateRaceEventHeats(swimmerNames, hcapTimes, goAts, numberOfHeats, raceEvent) {
    console.log(swimmerNames);
    console.log(hcapTimes);
    console.log(goAts);
    console.log(numberOfHeats);
    console.log(raceEvent);

    var numberOfSwimmers = swimmerNames.length;
    var swimmersPerHeat = parseInt(numberOfSwimmers / numberOfHeats);
    var swimmerCount = 0;

    for (var heatCount = 0; heatCount < numberOfHeats; heatCount++) {
      var heatSwimmerNames = [];
      var heatHcapTimes = [];
      var heatGoAts = [];
      
      while (swimmerCount < swimmersPerHeat) {
        heatSwimmerNames.push(swimmerNames[swimmerCount]);
        heatHcapTimes.push(hcapTimes[swimmerCount]);
        heatGoAts.push(goAts[swimmerCount]);
        swimmerCount++;
      }

      const newRaceSheet = {
        raceSheetId: uuidv4(),
        date: raceEvent.date,
        raceEventId: raceEvent.raceEventId,
        eventTypeId: raceEvent.eventTypeId,
        eventNumber: raceEvent.eventNumber,
        heatNumber: heatCount + 1,
        swimmerNames: heatSwimmerNames,
        hcapTimes: heatHcapTimes,
        goAts: heatGoAts
      }

      axios.post('http://localhost:4000/fridaynightraces/racesheets/add_racesheet', newRaceSheet)
      .catch(function (error) {
        console.log(error);
      });
    }

    this.updateGoAtsInResults(raceEvent, swimmerNames, goAts);
  }

  updateGoAtsInResults(raceEvent, swimmerNames, goAts) {
    var raceEventResults = [];
    axios.get('http://localhost:4000/fridaynightraces/results/')
      .then(response => {
        raceEventResults = response.data.filter(x => x.raceEventId === raceEvent.raceEventId);
      })
      .then(() => {
        for (var i = 0; i < swimmerNames.length; i++) {
          raceEventResults.filter(result => result.swimmerName === swimmerNames[i])[0].goAt = goAts[i];
        }

        raceEventResults.forEach(result => {
          axios.post('http://localhost:4000/fridaynightraces/results/update/' + result._id, result)
            .catch(function (error) {
              console.log(error);
            });
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  isEntered(currentEvent) {
    var raceEvent = this.state.raceNightEvents.filter(x => x.eventTypeId === currentEvent.eventTypeId)[0];
    if (raceEvent.swimmerNames.includes(this.state.selectedSwimmerName)) {
      return true;
    } else {
      return false;
    }
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
              this.state.swimmers.map((swimmer) => (
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
                  this.state.raceNightEventTypes.map((currentEvent) => (
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
 