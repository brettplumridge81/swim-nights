import React, { Component } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export class AddEventType extends Component {

    constructor(props) {
        super(props);
        this.state = {
            eventTypeId: uuidv4(),
            stroke: "",
            distance: 0
        };

        this.handleChangeStroke = this.handleChangeStroke.bind(this);
        this.handleChangeDistance = this.handleChangeDistance.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangeStroke(event) {
        this.setState({ stroke: event.target.value });
    }

    handleChangeDistance(event) {
        this.setState({ distance: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();

        if (this.state.stroke === "" || this.state.distance === 0) {
            return;
        }

        const newEventType = {
            eventTypeId: this.state.eventTypeId,
            stroke: this.state.stroke,
            distance: this.state.distance
        }

        axios.post('http://localhost:4000/fridaynightraces/events/add_eventtype', newEventType);

        window.location.reload();
    }


    render() {
        return (
            <form onSubmit={this.handleSubmit} >
                <label>Stroke: &nbsp;</label>
                <select defaultValue={'DEFAULT'} onChange={this.handleChangeStroke}>
                    <option value="DEFAULT" disabled hidden> Select Stroke...</option>
                    <option value="Backstroke">Backstroke</option>
                    <option value="Breaststroke">Breaststroke</option>
                    <option value="Butterfly">Butterfly</option>
                    <option value="Freestyle">Freestyle</option>
                    <option value="Medley">Medley</option>
                    <option value="Baths Dash">Baths Dash</option>
                    <option value="Relay">Relay</option>
                </select>

                &emsp;

                <label>Distance: &nbsp;</label>
                <select defaultValue={'DEFAULT'} onChange={this.handleChangeDistance}>
                    <option value="DEFAULT" disabled hidden> Select Distance...</option>
                    <option value="25">25m</option>
                    <option value="50">50m</option>
                    <option value="100">100m</option>
                    <option value="200">200m</option>
                </select>

                <br/><br/>

                <input type="submit" value="Submit" />
            </form>
        )
  }
}
