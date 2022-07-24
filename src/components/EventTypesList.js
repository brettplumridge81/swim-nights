import React, { Component } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const EventType = props => (
  <tr>
    <td>{props.eventType.stroke}</td>
    <td>{props.eventType.distance}</td>
    <td>
      <button onClick={() => { handleDelete(props.eventType._id); }}>Remove</button>
    </td>
    <td>
      
    </td>
  </tr>
)

const handleDelete = (id) => {
  try {
    axios.get('http://localhost:4000/fridaynightraces/eventTypes/delete/' + id);
    window.location.reload(false);
  } catch (err) {
    console.error(err);
  }
}

export class EventTypesList extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      eventTypes: [],
      stroke: "",
      distance: 0,
      raceNightType: undefined
    };

    this.handleChangeStroke = this.handleChangeStroke.bind(this);
    this.handleChangeDistance = this.handleChangeDistance.bind(this);
    this.handleChangeRaceNightType = this.handleChangeRaceNightType.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    axios.get('http://localhost:4000/fridaynightraces/eventtypes/')
      .then(response => {
        this.setState({ eventTypes: response.data });
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  handleChangeStroke(event) {
    this.setState({ stroke: event.target.value });
  }

  handleChangeDistance(event) {
      this.setState({ distance: event.target.value });
  }

  handleChangeRaceNightType(event) {
      this.setState({ raceNightType: event.target.value });
  }

  handleSubmit(event) {
      event.preventDefault();

      if (this.state.stroke === "" || this.state.distance === 0 || this.state.raceNightType === undefined) {
          return;
      }

      const newEventType = {
          eventTypeId: uuidv4(),
          stroke: this.state.stroke,
          distance: this.state.distance,
          raceNightType: this.state.raceNightType
      }

      axios.post('http://localhost:4000/fridaynightraces/events/add_eventtype', newEventType);

      this.componentDidMount();
  }

  eventTypesList() {
    return this.state.eventTypes.filter(x => x.raceNightType === this.state.raceNightType).map(function(currentEventType, i) {
        return <EventType eventType={currentEventType} key={i} />
    });
  }

  render() {
    return (
      <div>
        <h2>New Event</h2>
        <div>
          <form onSubmit={this.handleSubmit} >
            <hr/>
            <div>
                <label>
                    <input type="radio" name="race_night_type_select" value="pointscore" onChange={this.handleChangeRaceNightType} /> {"  "} Pointscore &emsp; &emsp;
                    <input type="radio" name="race_night_type_select" value="championship" onChange={this.handleChangeRaceNightType} /> {"  "} Championship
                </label>
            </div>
            <hr/>
            <label>Stroke: &nbsp;</label>
            <select defaultValue={'DEFAULT'} onChange={this.handleChangeStroke}>
                <option value="DEFAULT" disabled hidden> Select Stroke...</option>
                <option value="Backstroke">Backstroke</option>
                <option value="Breaststroke">Breaststroke</option>
                <option value="Butterfly">Butterfly</option>
                <option value="Freestyle">Freestyle</option>
                <option value="Medley">Medley</option>
                <option value="Baths Dash">Baths Dash</option>
                <option value="Relay">Relay</option>
            </select>

            &emsp;

            <label>Distance: &nbsp;</label>
            <select defaultValue={'DEFAULT'} onChange={this.handleChangeDistance}>
                <option value="DEFAULT" disabled hidden> Select Distance...</option>
                <option value="25">25m</option>
                <option value="30">30m</option>
                <option value="50">50m</option>
                <option value="100">100m</option>
                <option value="200">200m</option>
            </select>

            <br/><br/>

            <input type="submit" value="Submit" />
          </form>
        </div>
        <br/>
        <div>
          <h2>Event Types</h2>
          <table className="table table-striped" style={{ marginTop: 20 }}>
            <thead>
              <tr>
                <th>Stroke</th>
                <th>Distance</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              { this.eventTypesList() }
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}
