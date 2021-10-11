import React, { Component } from 'react';
import axios from 'axios';

export class AddSwimmer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            dob: ""
        };

        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangeDob = this.handleChangeDob.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangeName(event) {
        this.setState({ name: event.target.value });
    }

    handleChangeDob(event) {
        this.setState({ dob: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();

        const newSwimmer = {
            name: this.state.name,
            dob: this.state.dob
        }

        axios.post('http://localhost:4000/fridaynightraces/swimmers/add_swimmer', newSwimmer);

        alert("Name: " + this.state.name + ", DOB: " + this.state.dob);
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
                    <input type="text" value={this.state.dob} onChange={this.handleChangeDob} />
                </label>
                <input type="submit" value="Submit" />
            </form>
        )
  }
}
