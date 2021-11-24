import React, { Component } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export class AddSwimmer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            swimmerId: uuidv4(),
            name: "",
            date: new Date(),
            dob: []
        };

        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangeDob = this.handleChangeDob.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangeName(event) {
        this.setState({ name: event.target.value });
    }

    handleChangeDob(event) {
        this.setState({ date: event });
        var dateValues = [];
        dateValues.push(event.getDate());
        dateValues.push(event.getMonth() + 1);
        dateValues.push(event.getFullYear());
        this.setState({ dob: dateValues });       
    }

    handleSubmit(event) {
        event.preventDefault();

        var seasonStartDate = [1, 10, 2021];
        var age = seasonStartDate[2] - this.state.dob[2];
        if (this.state.dob[1] > seasonStartDate[1]) {
            age = age - 1;
        } else if (this.state.dob[1] >= seasonStartDate[1] && this.state.dob[0] > seasonStartDate[0]) {
            age = age - 1;
        }

        const newSwimmer = {
            swimmerId: this.state.swimmerId,
            name: this.state.name,
            dob: this.state.dob,
            ageAtSeasonStart: age,
            points: 0
        }

        axios.post('http://localhost:4000/fridaynightraces/swimmers/add_swimmer', newSwimmer);

        window.location.reload();
    }


    render() {
        return (
            <form onSubmit={this.handleSubmit} >
                <label>
                    Name:
                    <input type="text" value={this.state.name} onChange={this.handleChangeName} />
                </label>
                <label>
                    DOB:
                    <DatePicker dateFormat="dd-MM-yyyy" selected={this.state.date} onSelect={this.handleChangeDob} />
                </label>
                <input type="submit" value="Submit" />
            </form>
        )
  }
}
