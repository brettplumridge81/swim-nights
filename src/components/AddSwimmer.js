import React, { Component } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import "react-datepicker/dist/react-datepicker.css";

export class AddSwimmer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            swimmerId: uuidv4(),
            name: "",
            gender: "",
            grade: ""
        };

        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangeGender = this.handleChangeGender.bind(this);
        this.handleChangeGrade = this.handleChangeGrade.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangeName(event) {
        this.setState({ name: event.target.value });
    }

    handleChangeGender(event) {
        this.setState({ gender: event.target.value });
    }

    handleChangeGrade(event) {
        this.setState({ grade: event.target.value });       
    }

    handleSubmit(event) {
        event.preventDefault();

        if (this.state.name === "" || this.state.gender === "" || this.state.grade === "") {
            return;
        }

        const newSwimmer = {
            swimmerId: this.state.swimmerId,
            name: this.state.name,
            gender: this.state.gender,
            grade: this.state.grade,
            points: 0
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
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>

                &emsp;

                <label for="grade">Grade: &nbsp;</label>
                <select name="grade" id="grade" onChange={this.handleChangeGrade}>
                    <option value="" selected disabled hidden> Select Grade...</option>
                    <option value="e">E-Grade</option>
                    <option value="d">D-Grade</option>
                    <option value="c">C-Grade</option>
                    <option value="b">B-Grade</option>
                    <option value="a">A-Grade</option>
                </select>

                <br/><br/>

                <input type="submit" value="Submit" />
            </form>
        )
    }
}
