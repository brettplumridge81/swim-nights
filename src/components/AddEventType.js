import React, { Component } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export class AddEventType extends Component {

    constructor(props) {
        super(props);
        this.state = {
            eventTypeId: uuidv4(),
            stroke: "",
            distance: 0,
            minAge: 0,
            maxAge: 0
        };

        this.handleChangeStroke = this.handleChangeStroke.bind(this);
        this.handleChangeDistance = this.handleChangeDistance.bind(this);
        this.handleChangeMinAge = this.handleChangeMinAge.bind(this);
        this.handleChangeMaxAge = this.handleChangeMaxAge.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangeStroke(event) {
        this.setState({ stroke: event.target.value });
    }

    handleChangeDistance(event) {
        this.setState({ distance: event.target.value });
    }

    handleChangeMinAge(event) {
        this.setState({ minAge: event.target.value });
    }

    handleChangeMaxAge(event) {
        this.setState({ maxAge: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();

        const newEventType = {
            eventTypeId: this.state.eventTypeId,
            stroke: this.state.stroke,
            distance: this.state.distance,
            minAge: this.state.minAge,
            maxAge: this.state.maxAge
        }

        axios.post('http://localhost:4000/fridaynightraces/events/add_eventtype', newEventType);

        window.location.reload();
    }


    render() {
        return (
            <form onSubmit={this.handleSubmit} >
                <label>
                    Stroke:
                    <input type="text" value={this.state.stroke} onChange={this.handleChangeStroke} />
                </label>
                <label>
                    Distance(m):
                    <input type="text" value={this.state.distance} onChange={this.handleChangeDistance} />
                </label>
                <label>
                    Min Age:
                    <input type="text" value={this.state.minAge} onChange={this.handleChangeMinAge} />
                </label>
                <label>
                    Max Age:
                    <input type="text" value={this.state.maxAge} onChange={this.handleChangeMaxAge} />
                </label>
                <input type="submit" value="Submit" />
            </form>
        )
  }
}
