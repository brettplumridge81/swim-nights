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
      raceNight: undefined,
      raceNightEvents: [],
      raceNightEventsForSwimmer: [],
      isEnteredForSwimmer: [],
      e_swimmers: [],
      d_swimmers: [],
      c_swimmers: [],
      b_swimmers: [],
      a_swimmers: [],
      old_fart_swimmers: [],
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
  }

  async populateSwimmers() {
    axios.get('http://localhost:4000/fridaynightraces/swimmers/')
      .then(response => {
        var e_swimmers = response.data.filter(x => x.grade === "E").sort((a, b) => a.name.localeCompare(b.name));
        var d_swimmers = response.data.filter(x => x.grade === "D").sort((a, b) => a.name.localeCompare(b.name));
        var c_swimmers = response.data.filter(x => x.grade === "C").sort((a, b) => a.name.localeCompare(b.name));
        var b_swimmers = response.data.filter(x => x.grade === "B").sort((a, b) => a.name.localeCompare(b.name));
        var a_swimmers = response.data.filter(x => x.grade === "A").sort((a, b) => a.name.localeCompare(b.name));
        var old_fart_swimmers = response.data.filter(x => x.grade === "15-years").sort((a, b) => a.name.localeCompare(b.name));
        this.setState({ 
          e_swimmers: e_swimmers,
          d_swimmers: d_swimmers,
          c_swimmers: c_swimmers,
          b_swimmers: b_swimmers,
          a_swimmers: a_swimmers,
          old_fart_swimmers: old_fart_swimmers
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
            .filter(x => x.date[2] === today.getFullYear())[0]
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
        var raceEventIds = this.state.raceNightEventsForSwimmer.map(x => x.raceEventId);
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
      raceNightEventsForSwimmer: [],
      isEnteredForSwimmer: [],
      selectedSwimmerName: swimmer.name,
      selectedSwimmerGrade: swimmer.grade
    }, () => {
      this.setRaceNightEventsForSwimmer();
      this.getResultsDataForRaceNightEventsForSelectedSwimmer();
    });
  }

  setRaceNightEventsForSwimmer() {
    if (this.state.raceNight === undefined) {
      return;
    }

    var raceNightEventsForSwimmer = this.state.raceNightEvents.filter(x => x.grades.includes(this.state.selectedSwimmerGrade))
      .sort((a, b) => (a.eventNumber > b.eventNumber) ? 1 : -1);
    
    var isEnteredForSwimmer = raceNightEventsForSwimmer.map(x => this.isEntered(x));

    this.setState({
      raceNightEventsForSwimmer: raceNightEventsForSwimmer,
      isEnteredForSwimmer: isEnteredForSwimmer
    });
  }

  // handleEventEntryChanged(raceEventId) {
  //   var raceNightEventsForSwimmer = [...this.state.raceNightEventsForSwimmer];
  //   var raceEvent = raceNightEventsForSwimmer.filter(x => x.raceEventId === raceEventId)[0];
  //   if (this.isEntered(raceEvent)) {
  //     raceEvent.swimmerNames = raceEvent.swimmerNames.filter(x => x !== this.state.selectedSwimmerName);
  //     this.removeResult(raceEvent, this.state.selectedSwimmerName);
  //   } else {
  //     raceEvent.swimmerNames = [...raceEvent.swimmerNames].concat(this.state.selectedSwimmerName);
  //     this.addResult(raceEvent, raceEvent.eventTypeId, this.state.selectedSwimmerName);
  //   }

  //   var isEnteredForSwimmer = raceNightEventsForSwimmer.map(x => this.isEntered(x));

  //   this.setState({
  //     raceNightEventsForSwimmer: raceNightEventsForSwimmer,
  //     isEnteredForSwimmer: isEnteredForSwimmer
  //   });
  // }

  handleEventChecked(raceEventId) {
    var raceNightEventsForSwimmer = [...this.state.raceNightEventsForSwimmer];
    var raceEvent = raceNightEventsForSwimmer.filter(x => x.raceEventId === raceEventId)[0];
    if (this.isEntered(raceEvent)) {
      raceEvent.swimmerNames = raceEvent.swimmerNames.filter(x => x !== this.state.selectedSwimmerName);
      this.removeResult(raceEvent, this.state.selectedSwimmerName);
    } else {
      raceEvent.swimmerNames = [...raceEvent.swimmerNames].concat(this.state.selectedSwimmerName);
      this.addResult(raceEvent, raceEvent.eventTypeId, this.state.selectedSwimmerName);
    }

    var isEnteredForSwimmer = raceNightEventsForSwimmer.map(x => this.isEntered(x));

    this.setState({
      raceNightEventsForSwimmer: raceNightEventsForSwimmer,
      isEnteredForSwimmer: isEnteredForSwimmer
    });
  }

  addResult(raceEvent, eventTypeId, swimmerName) {
    var results = this.state.results;

    const newResult = {
      resultId: uuidv4(),
      raceEventId: raceEvent.raceEventId,
      eventTypeId: eventTypeId,
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
    this.storeUpdatedRaceEvents(this.state.raceNightEventsForSwimmer);

    this.deleteResults(this.state.results).then(() => {
      this.storeResults(this.state.results);
    });

    this.removeActiveRaceSheets(this.state.raceNightEventsForSwimmer.map(x => x.raceEventId)).then(() => {
      this.generateRaceSheetsForEvents(this.state.raceNightEventsForSwimmer);
    });

    setTimeout(() => {
      window.location.reload(false);
    }, 1000);
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
      var swimmers = [];
      axios.get('http://localhost:4000/fridaynightraces/swimmers/')
      .then(response => {
        swimmers = response.data.filter(x => raceEvent.swimmerNames.includes(x.name));
      }).then(() => {
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
          swimmerSheetObjects.push([swimmer.name, index !== -1 ? swimmer.hCapTimes[index] : 10000]);
        });
        swimmerSheetObjects.sort((a, b) => (a[1] > b[1]) ? -1 : 1);

        swimmerNames = swimmerSheetObjects.map(x => x[0]);
        hcapTimes = swimmerSheetObjects.map(x => x[1]);

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
    if (currentEvent.swimmerNames.includes(this.state.selectedSwimmerName)) {
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
            <table style={{width: '100%'}}>
              <thead>
                <tr>
                  <th>E-Grade</th>
                  <th>D-Grade</th>
                  <th>C-Grade</th>
                  <th>B-Grade</th>
                  <th>A-Grade</th>
                  <th>15 Year &amp; Over</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{verticalAlign: 'top'}}>
                    {
                      this.state.e_swimmers.map((swimmer) => (
                        <div>
                          <label>
                            <input type="radio" name="swimmer_select" onChange={() => this.handleSwimmerSelect(swimmer)} />
                            &emsp; {swimmer.name}
                          </label>
                        </div>
                      ))
                    }
                  </td>
                  <td style={{verticalAlign: 'top'}}>
                    {
                      this.state.d_swimmers.map((swimmer) => (
                        <div>
                          <label>
                            <input type="radio" name="swimmer_select" onChange={() => this.handleSwimmerSelect(swimmer)} />
                            &emsp; {swimmer.name}
                          </label>
                        </div>
                      ))
                    }
                  </td>
                  <td style={{verticalAlign: 'top'}}>
                    {
                      this.state.c_swimmers.map((swimmer) => (
                        <div>
                          <label>
                            <input type="radio" name="swimmer_select" onChange={() => this.handleSwimmerSelect(swimmer)} />
                            &emsp; {swimmer.name}
                          </label>
                        </div>
                      ))
                    }
                  </td>
                  <td style={{verticalAlign: 'top'}}>
                    {
                      this.state.b_swimmers.map((swimmer) => (
                        <div>
                          <label>
                            <input type="radio" name="swimmer_select" onChange={() => this.handleSwimmerSelect(swimmer)} />
                            &emsp; {swimmer.name}
                          </label>
                        </div>
                      ))
                    }
                  </td>
                  <td style={{verticalAlign: 'top'}}>
                    {
                      this.state.a_swimmers.map((swimmer) => (
                        <div>
                          <label>
                            <input type="radio" name="swimmer_select" onChange={() => this.handleSwimmerSelect(swimmer)} />
                            &emsp; {swimmer.name}
                          </label>
                        </div>
                      ))
                    }
                  </td>
                  <td style={{verticalAlign: 'top'}}>
                    {
                      this.state.old_fart_swimmers.map((swimmer) => (
                        <div>
                          <label>
                            <input type="radio" name="swimmer_select" onChange={() => this.handleSwimmerSelect(swimmer)} />
                            &emsp; {swimmer.name}
                          </label>
                        </div>
                      ))
                    }
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <h3>Events</h3>
            <table className="table table-striped" style={{ marginTop: 20 }}>
              <thead>
                <tr>
                  <th>Event Number</th>
                  <th>Grades</th>
                  <th>Distance</th>
                  <th>Stroke</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.raceNightEventsForSwimmer.map((currentEvent, i) => (
                    <tr>
                      <td>{currentEvent.eventNumber}</td>
                      <td>{this.produceGradesString(currentEvent.grades)}</td>
                      <td>{currentEvent.distance}</td>
                      <td>{currentEvent.stroke}</td>
                      {/* <td>
                        <button onClick={ () => this.handleEventEntryChanged(currentEvent.raceEventId) }>{this.state.isEnteredForSwimmer[i] ? "Withdraw" : "Enter"}</button>
                      </td> */}
                      <td>
                        <input type="checkbox" defaultChecked={ this.isEntered(currentEvent) } onChange={ () => this.handleEventChecked(currentEvent.raceEventId) } />
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
 