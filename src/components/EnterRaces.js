import React, { Component } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export class EnterRaces extends Component {
    static displayName = EnterRaces.name;

    // storedResults;
  
    constructor(props) {
    super(props);
    this.state = { 
      eventTypes: [],
      raceNightDates: [],
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
      results: [],
      storedResults: []
    };

    this.handleSwimmerSelect = this.handleSwimmerSelect.bind(this);
  }

  componentDidMount() {
    this.populateSwimmers();
    this.populateEventTypesData();
    this.getRaceNightDates();
    this.getRaceNight([new Date().getDate(), new Date().getMonth() + 1, new Date().getFullYear()]);
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

  async getRaceNightDates() {
    await axios.get('http://localhost:4000/fridaynightraces/racenights/')
      .then(response => {
        this.setState({ 
          raceNightDates: response.data.map(x => x.date)
        });
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  async getRaceNight(date) {
    await axios.get('http://localhost:4000/fridaynightraces/racenights/')
      .then(response => {
        this.setState({ 
          raceNight: response.data
            .filter(x => x.date[0] === date[0])
            .filter(x => x.date[1] === date[1])
            .filter(x => x.date[2] === date[2])[0]
        });
      })
      .then(() => this.getRaceNightEventsData(date))
      .catch(function (error) {
        console.log(error);
      })
  }

  async getRaceNightEventsData(date) {
    axios.get('http://localhost:4000/fridaynightraces/raceevents/')
        .then(response => {
          this.setState({
            raceNightEvents: response.data
              .filter(x => x.date[0] === date[0])
              .filter(x => x.date[1] === date[1])
              .filter(x => x.date[2] === date[2])
          });
        })
        .then (() => this.getResultsDataForRaceNightEvents())
        .catch(function (error) {
          console.log(error);
        });
  }

  async getResultsDataForRaceNightEvents() {
    axios.get('http://localhost:4000/fridaynightraces/results/')
      .then(response => {
        var raceEventIds = this.state.raceNightEvents.map(x => x.raceEventId);
        var results = response.data
          .filter(x => raceEventIds.includes(x.raceEventId));
        var storedResults = response.data
          .filter(x => raceEventIds.includes(x.raceEventId));
        this.setState({
          results: results,
          storedResults: storedResults
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  handleRaceNightSelect(raceNightDate) {
    this.setState({
      selectedSwimmerName: "",
      selectedSwimmerGrade: "",
      raceNightEventsForSwimmer: []
    });
    this.getRaceNight(raceNightDate);
  }

  handleSwimmerSelect(swimmer) {
    this.setState({
      raceNightEventsForSwimmer: [],
      isEnteredForSwimmer: [],
      selectedSwimmerName: swimmer.name,
      selectedSwimmerGrade: swimmer.grade
    }, () => {
      this.setRaceNightEventsForSwimmer();
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
      grossTime: [undefined, undefined, undefined],
      netTime: [undefined, undefined, undefined],
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
    var resultsToDelete = this.state.storedResults.filter(result => !results.includes(result));
    resultsToDelete.forEach(result => {
      axios.get('http://localhost:4000/fridaynightraces/results/delete/' + result._id)
        .catch(function (error) {
          console.log(error);
        });
    });
  }

  async storeResults(results) {
    var resultsToCreate = results.filter(result => !this.state.storedResults.includes(result));

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
        
        if (swimmers.length === 0) {
          numberOfHeats = 0;
        } else if (swimmers.length < 8) {
          numberOfHeats = 1;
        } else {
          numberOfHeats = Math.ceil(swimmers.length / 7);
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
      });
    });
  }

  populateRaceEventHeats(swimmerNames, hcapTimes, goAts, numberOfHeats, raceEvent) {
    var numberOfSwimmers = swimmerNames.length;
    var swimmersPerHeat = Math.ceil(numberOfSwimmers / numberOfHeats);
    var swimmerCount = 1;

    var heatSwimmerNames = [];
    var heatHcapTimes = [];
    var heatGoAts = [];

    for (var heatCount = 0; heatCount < numberOfHeats; heatCount++) {
      heatSwimmerNames = [];
      heatHcapTimes = [];
      heatGoAts = [];

      while (swimmerCount % swimmersPerHeat !== 0 && swimmerCount < swimmerNames.length) {
        heatSwimmerNames.push(swimmerNames[swimmerCount - 1]);
        heatHcapTimes.push(hcapTimes[swimmerCount - 1]);
        heatGoAts.push(goAts[swimmerCount - 1]);
        swimmerCount++;
      }
      heatSwimmerNames.push(swimmerNames[swimmerCount - 1]);
      heatHcapTimes.push(hcapTimes[swimmerCount - 1]);
      heatGoAts.push(goAts[swimmerCount - 1]);
      swimmerCount++;
      

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

    this.updateGoAtsInResults(raceEvent, heatSwimmerNames, heatGoAts);
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
          <div>
            <h3>Race Night Dates</h3>
            <div>
              {
                this.state.raceNightDates.map((raceNightDate) => (
                  <div>
                    <label>
                      <input type="radio" name="race_night_select" onChange={() => this.handleRaceNightSelect(raceNightDate)} 
                        checked={
                          this.state.raceNight !== undefined
                           ? raceNightDate[0] === this.state.raceNight.date[0] && raceNightDate[1] === this.state.raceNight.date[1] && raceNightDate[2] === this.state.raceNight.date[2] 
                           : false
                        }/>
                      {raceNightDate[0] + "/" + raceNightDate[1] + "/" + raceNightDate[2]}
                    </label>
                  </div>
                ))
              }
            </div>
          </div>
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
                            <input type="radio" name="swimmer_select" onChange={() => this.handleSwimmerSelect(swimmer)} checked={this.state.selectedSwimmerName === swimmer.name}/>
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
                            <input type="radio" name="swimmer_select" onChange={() => this.handleSwimmerSelect(swimmer)} checked={this.state.selectedSwimmerName === swimmer.name}/>
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
                            <input type="radio" name="swimmer_select" onChange={() => this.handleSwimmerSelect(swimmer)} checked={this.state.selectedSwimmerName === swimmer.name}/>
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
                            <input type="radio" name="swimmer_select" onChange={() => this.handleSwimmerSelect(swimmer)} checked={this.state.selectedSwimmerName === swimmer.name}/>
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
                            <input type="radio" name="swimmer_select" onChange={() => this.handleSwimmerSelect(swimmer)} checked={this.state.selectedSwimmerName === swimmer.name}/>
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
                            <input type="radio" name="swimmer_select" onChange={() => this.handleSwimmerSelect(swimmer)} checked={this.state.selectedSwimmerName === swimmer.name}/>
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
 