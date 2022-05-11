import React, { Component } from 'react';
import axios from 'axios';

export class Swimmers extends Component {
    static displayName = Swimmers.name;

  constructor(props) {
    super(props);
    this.state = { 
      swimmers: [],
      selectedSwimmerName: "", 
      loading: true };
  }

  componentDidMount() {
    this.populateSwimmers();
    this.handleSwimmerSelection = this.handleSwimmerSelection.bind(this);
  }

  handleSwimmerSelection(event) {
    this.setState({ selectedSwimmerName: event.target.value });
  }

  static renderSwimmers(swimmers) {
    return swimmers.map(function(swimmer) {
      return <option value={swimmer.swimmerName}>{swimmer.name}</option>
    });
  }

  render() {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
        : Swimmers.renderSwimmers(this.state.swimmers);

    return (
      <div>
        <h1 id="tableLabel">Swimmers</h1>
        <select 
          onChange={this.handleSwimmerSelection} 
          value={this.state.value} 
          key={this.state.value}>
            <option label='Select Swimmer' value=''></option>
          {contents}
        </select>
      </div>
    );
  }

  async populateSwimmers() {
    axios.get('http://localhost:4000/fridaynightraces/swimmers/')
      .then(response => {
        this.setState({ swimmers: response.data, loading: false });
      })
      .catch(function (error) {
        console.log(error);
      })
  }
}
