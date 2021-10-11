import React, { Component } from 'react';
import axios from 'axios';
import { CurrentEventSelection } from './CurrentEventSelection';

export class AddRaceNight extends Component {

    constructor(props) {
        super(props);
        this.state = {
            eventTypes: [],
            raceNightDate: "",
            raceEventIds: [],
            raceEvents: [],
            loading: true
        };

        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.handleChangeRaceEvents = this.handleChangeRaceEvents.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.getEventTypesData();
        this.getCurrentEventSelections();
    }

    async getEventTypesData() {
        axios.get('http://localhost:4000/fridaynightraces/eventtypes/')
            .then(response => {
                this.setState({ eventTypes: response.data });
                this.setState({ loading: false });
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    async getCurrentEventSelections() {
        axios.get('http://localhost:4000/fridaynightraces/currentselectedevents/')
        .then(response => {
            var currentIds = [];
            response.data.forEach(x => currentIds.push(x.eventTypeId));
            this.setState({ raceEventIds: currentIds });
        })
        .catch(function (error) {
            console.log(error);
        })
    }

    handleChangeDate(event) {
        this.setState({ raceNightDate: event.target.value });
    }

    handleChangeRaceEvents(event) {
        var newArray = this.state.raceEventIds.slice();
        if(!newArray.includes(event.target.value)) {
            newArray.push(event.target.value);
            this.state.raceEvents.push(this.state.eventTypes.filter(x => x.eventTypeId === event.target.value));

            var selectedEvent = this.state.eventTypes.filter(x => x.eventTypeId === event.target.value);

            const newEvent = {
                eventTypeId: selectedEvent[0].eventTypeId,
                stroke: selectedEvent[0].stroke,
                distance: selectedEvent[0].distance,
                minAge: selectedEvent[0].minAge,
                maxAge: selectedEvent[0].maxAge
            }

            axios.post('http://localhost:4000/fridaynightraces/selectedevents/add_selectedevent', newEvent);
        }
        this.setState({raceEventIds: newArray});

        window.location.reload(false);
    }

    handleSubmit(event) {
        event.preventDefault();

        const newRaceNight = {
            raceNightDate: this.state.raceNightDate,
            raceEvents: this.state.raceEventIds
        }

        axios.post('http://localhost:4000/fridaynightraces/racenights/add_racenight', newRaceNight);
    }

    static renderEvents(events) {
        return events.map(function(eventType) {
            return <option value={eventType.eventTypeId}>{eventType.minAge + " - " + eventType.maxAge + "yrs " + eventType.distance + "m " + eventType.stroke}</option>
        });
    }

    render() {
        let contents = this.state.loading
            ? <option>Loading...</option>
                : AddRaceNight.renderEvents(this.state.eventTypes);

        return (
            <div>
                <form onSubmit={this.handleSubmit} >
                    <label>
                        Date:
                        <input type="text" value={this.state.raceNightDate} onChange={this.handleChangeDate} />
                    </label>
                    <select 
                        onChange={this.handleChangeRaceEvents} 
                        value={this.state.value} 
                        key={this.state.value}>
                            <option label='Select Event' value=''></option>
                            {contents}
                    </select>
                    <input type="submit" value="Submit" />
                </form>

                <div>
                    <CurrentEventSelection />
                </div>
            </div>
        )
    }
}
