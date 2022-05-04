import React, { Component } from 'react';
import axios from 'axios';
import { SwimmerGender } from './SwimmerGender';

export class AddSwimmer extends Component {

    constructor(props) {
        super(props);
        this.state = {
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

    handleChangeName(event) {
        this.setState({ name: event.target.value });
    }

    handleChangeGender(event) {
        this.setState({ gender: SwimmerGender[SwimmerGender[event.target.value]] });
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
        console.log(event.target.value);
        var dob = this.state.dob;
        dob[2] = event.target.value;
        console.log(dob);
        if (dob[2] < 1900 || dob[2] > new Date().getFullYear()) {
            dob[2] = 0;
        }
        this.setState({ dob : dob });
    }

    handleChangeGrade(event) {
        var gender = SwimmerGender[event.target.value];
        console.log("gender");
        console.log(gender);
        this.setState({ grade: gender });       
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

        window.location.reload();
    }


    render() {
        return (
            <form onSubmit={this.handleSubmit} >
                <label>
                    Name: &nbsp;
                    <input type="text" value={this.state.name} onChange={this.handleChangeName} />
                </label>

                &emsp;

                <label for="gender">Gender: &nbsp;</label>
                <select name="gender" id="gender" onChange={this.handleChangeGender}>
                    <option value="" selected disabled hidden> Select Gender...</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>

                &emsp;

                <label>
                    DOB:&emsp;
                    <input type="number" name="dob_day" id="dob_day" onChange={this.handleChangeDobDay} style={{ width: '50px', textAlign: 'center' }} />
                    <input type="number" name="dob_month" id="dob_month" onChange={this.handleChangeDobMonth} style={{ width: '50px', textAlign: 'center' }} />
                    <input type="number" name="dob_year" id="dob_year" onChange={this.handleChangeDobYear} style={{ width: '50px', textAlign: 'center' }} />
                </label>

                &emsp;

                <label for="grade">Grade: &nbsp;</label>
                <select name="grade" id="grade" onChange={this.handleChangeGrade}>
                    <option value="" selected disabled hidden> Select Grade...</option>
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
        )
    }
}
