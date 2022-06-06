import React, { Component } from 'react';
import axios from 'axios';
import { SwimmerResultInput } from './SwimmerResultInput';

export class RaceNightResultsInput extends Component {

  constructor(props) {
    super(props);
    this.state = {
      raceNight: undefined,
      raceNightEvents: [],
      swimmerNames: [],
      raceNightDates: [],
      selectedRaceNightDate: [new Date().getDate(), new Date().getMonth() + 1, new Date().getFullYear()]
    };
  }

  componentDidMount() {
    this.getRaceNightDates();
    this.getRaceNight(this.state.selectedRaceNightDate);
  }

  async getRaceNightEventsData() {
    await axios.get('http://localhost:4000/fridaynightraces/raceevents/')
        .then(response => {
          this.setState({
            raceNightEvents: response.data
              .filter(x => x.date[0] === this.state.selectedRaceNightDate[0])
              .filter(x => x.date[1] === this.state.selectedRaceNightDate[1])
              .filter(x => x.date[2] === this.state.selectedRaceNightDate[2])
          });
        })
        .catch(function (error) {
          console.log(error);
        });
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
        this.setState({ raceNight: response.data });
      })
      .then(() => this.getRaceNightEventsData())
      .catch(function (error) {
        console.log(error);
      })
  }

  handleRaceNightSelect(raceNightDate) {
    this.setState({
      selectedRaceNightDate: raceNightDate
    });
    this.getRaceNight(this.state.selectedRaceNightDate);
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

        result.grossTime = new Array(minutes, seconds, hundredths);
        result.netTime = new Array(
          minutes - Math.floor(result.goAt / 60),
          seconds - result.goAt % 60,
          hundredths
        )
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
      <div>
        <div>
          {
            this.state.raceNightDates.map((raceNightDate) => (
              <div>
                <label>
                  <input type="radio" name="race_night_select" onChange={() => this.handleRaceNightSelect(raceNightDate)} 
                    checked = { this.state.selectedRaceNightDate === raceNightDate } />
                  &emsp; {raceNightDate[0] + "/" + raceNightDate[1] + "/" + raceNightDate[2]}
                </label>
              </div>
            ))
          }
        </div>
        <div>
          {
            this.state.raceNightEvents.sort((a, b) => (a.eventNumber > b.eventNumber) ? 1 : -1).map(raceEvent => {
              if(raceEvent !== undefined && raceEvent.swimmerNames.length !== 0) {
                return (
                  <div>
                    <h3>Event: {raceEvent.eventNumber}</h3>
                      
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
                              <SwimmerResultInput raceEventId={raceEvent.raceEventId} 
                                eventTypeId={raceEvent.eventTypeId} swimmerName={currentSwimmer} />
                            )
                          })
                        }
                      </tbody>
                    </table>
                  </div>
                );
              } else {
                return (<p></p>)
              }
            })
          }
          </div>
      </div>
    );
  }
}
