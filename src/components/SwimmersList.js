import React, { Component } from 'react';
import axios from 'axios';

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
    this.state = { 
      swimmers: [],
      name: "",
      gender: "",
      dob: [0, 0, 0],
      grade: ""
    };

    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeGender = this.handleChangeGender.bind(this);
    this.handleChangeDobDay = this.handleChangeDobDay.bind(this);
    this.handleChangeDobMonth = this.handleChangeDobMonth.bind(this);
    this.handleChangeDobYear = this.handleChangeDobYear.bind(this);
    this.handleChangeGrade = this.handleChangeGrade.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

  handleChangeName(event) {
    this.setState({ name: event.target.value });
  }

  handleChangeGender(event) {
    this.setState({ gender: event.target.value });
  }

  handleChangeDobDay(event) {
    var dob = this.state.dob;
    dob[0] = event.target.value;
    if (dob[0] < 1 || dob[0] > 31) {
        dob[0] = 0;
    }
    this.setState({ dob: dob })
  }

  handleChangeDobMonth(event) {
    var dob = this.state.dob;
    dob[1] = event.target.value;
    if (dob[1] < 1 || dob[1] > 12) {
        dob[1] = 0;
    }
    this.setState({ dob: dob })
  }

  handleChangeDobYear(event) {
    var dob = this.state.dob;
    dob[2] = event.target.value;
    if (dob[2] < 1900 || dob[2] > new Date().getFullYear()) {
        dob[2] = 0;
    }
    this.setState({ dob : dob });
  }

  handleChangeGrade(event) {
    this.setState({ grade: event.target.value });       
  }

  handleSubmit(event) {
    event.preventDefault();

    if (this.state.name === "" || this.state.gender === "" || this.state.dob[0] === 0 || 
            this.state.dob[1] === 0 || this.state.dob[2] === 0 || this.state.grade === "") {
      return;
    }

    const newSwimmer = {
      name: this.state.name,
      gender: this.state.gender,
      dob: this.state.dob,
      grade: this.state.grade,
      points: 0,
      eventTypeIds: [],
      bestTimes: [],
      hCapTimes: []
    }

    axios.post('http://localhost:4000/fridaynightraces/swimmers/add_swimmer', newSwimmer);

    this.componentDidMount();
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
          <div>
          <form onSubmit={this.handleSubmit} >
                <label>
                    Name: &nbsp;
                    <input type="text" value={this.state.name} onChange={this.handleChangeName} />
                </label>

                &emsp;

                <label>Gender: &nbsp;</label>
                <select defaultValue={'DEFAULT'} onChange={this.handleChangeGender}>
                    <option value="DEFAULT" disabled hidden> Select Gender...</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>

                &emsp;

                <label>DOB:&emsp;</label>
                <input type="number" name="dob_day" id="dob_day" onChange={this.handleChangeDobDay} style={{ width: '50px', textAlign: 'center' }} />
                <input type="number" name="dob_month" id="dob_month" onChange={this.handleChangeDobMonth} style={{ width: '50px', textAlign: 'center' }} />
                <input type="number" name="dob_year" id="dob_year" onChange={this.handleChangeDobYear} style={{ width: '50px', textAlign: 'center' }} />

                &emsp;

                <label>Grade: &nbsp;</label>
                <select defaultValue={'DEFAULT'} onChange={this.handleChangeGrade}>
                    <option value="DEFAULT" disabled hidden> Select Grade...</option>
                    <option value="Beginners">Beginners</option>
                    <option value="E">E-Grade</option>
                    <option value="D">D-Grade</option>
                    <option value="C">C-Grade</option>
                    <option value="B">B-Grade</option>
                    <option value="A">A-Grade</option>
                    <option value="15-years">15 Years &amp; Over</option>
                </select>

                <br/><br/>

                <input type="submit" value="Submit" />
            </form>
          </div>
          <br/>
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
