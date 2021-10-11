import React, { Component } from 'react';
import axios from 'axios';

export class Swimmers extends Component {
    static displayName = Swimmers.name;

  constructor(props) {
    super(props);
    this.state = { swimmers: [], loading: true };
  }

  componentDidMount() {
    this.populateSwimmers();
  }

  static renderSwimmersTable(swimmers) {
    return (
      <table className='table table-striped' aria-labelledby="tableLabel">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody>
          {swimmers.map(swimmer =>
            <tr key={swimmer.name}>
                <td>{swimmer.name}</td>
                <td>{swimmer.age}</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  render() {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
        : Swimmers.renderSwimmersTable(this.state.swimmers);

    return (
      <div>
        <h1 id="tableLabel">Swimmers</h1>
        {contents}
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
