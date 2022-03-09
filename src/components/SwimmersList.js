import React, { Component } from 'react';
import axios from 'axios';
import { AddSwimmer } from './AddSwimmer';

const Swimmer = props => (
  <tr>
    <td>{props.swimmer.name}</td>
    <td>{props.swimmer.gender}</td>
    <td>{props.swimmer.grade}</td>
    <td>{props.swimmer.points}</td>
    <td>
      <button onClick={() => { handleDelete(props.raceEvent._id); }}>Remove</button>
    </td>
    <td>
      
    </td>
  </tr>
)

const handleDelete = (id) => {
  try {
    axios.get('http://localhost:4000/fridaynightraces/currentselectedevents/delete/' + id);
    window.location.reload(false);
  } catch (err) {
    console.error(err);
  }
}

export class SwimmersList extends Component {

  constructor(props) {
    super(props);
    this.state = { swimmers: []};
  }

  componentDidMount() {
    axios.get('http://localhost:4000/fridaynightraces/swimmers/')
      .then(response => {
        var swimmers = response.data;
        var sortedSwimmers = swimmers.sort(function (a, b) {
          return a.grade.localeCompare(b.grade) || a.name.localeCompare(b.name);
        });
        this.setState({ swimmers: sortedSwimmers });
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  swimmersList() {
    return this.state.swimmers.map(function(currentSwimmer, i) {
        return <Swimmer swimmer={currentSwimmer} key={i} />
    });
  }

  render() {
    return (
      <div>
        <div>
          <h2>New Swimmer</h2>
          <AddSwimmer /> <br/>
        </div>
        <div>
          <h2>Swimmers</h2>
          <table className="table table-striped" style={{ marginTop: 20 }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Gender</th>
                <th>Grade</th>
                <th>Points</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              { this.swimmersList() }
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}
