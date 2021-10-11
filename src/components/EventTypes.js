import React, { Component } from 'react';
import axios from 'axios';

export class EventTypes extends Component {
    /*static displayName = EventTypes.name;*/

  constructor(props) {
    super(props);
    this.state = { 
      eventTypes: [], 
      loading: true 
    };
  }

  componentDidMount() {
    this.populateEventTypesData();
  }

  static renderEventsTable(events) {
    return (
        <table className='table table-striped' aria-labelledby="tableLabel">
            <thead>
                <tr>
                    <th>Age</th>
                    <th>Distance</th>
                    <th>Stroke</th>
                </tr>
            </thead>
            <tbody>
                {events.map(event =>
                    <tr key={event.stroke}>
                        <td>{event.minAge} - {event.maxAge}</td>
                        <td>{event.distance}m</td>
                        <td>{event.stroke}</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
  }

  render() {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
        : EventTypes.renderEventsTable(this.state.eventTypes);

    return (
      <div>
        <h1 id="tableLabel">Events</h1>
        {contents}
      </div>
    );
  }

  async populateEventTypesData() {
      axios.get('http://localhost:4000/fridaynightraces/eventtypes/')
          .then(response => {
              this.setState({ eventTypes: response.data, loading: false });
          })
          .catch(function (error) {
              console.log(error);
          })
  }
}
