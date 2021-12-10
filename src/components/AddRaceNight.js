import React, { Component } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export class AddRaceNight extends Component {

    constructor(props) {
        super(props);

        var today = new Date();
        var dateValues = [];
        dateValues.push(today.getDate());
        dateValues.push(today.getMonth() + 1);
        dateValues.push(today.getFullYear());
        
        this.state = {
            eventTypes: [],
            selectedEventTypes: [],
            selectedEventTypeIds: [],
            date: today,
            raceEvents: [],
            raceDate: dateValues,
            loading: true
        };
    }

    componentDidMount() {
        this.getEventTypesData();
        this.handleChangeDate = this.handleChangeDate.bind(this);
    }

    async getEventTypesData() {
        axios.get('http://localhost:4000/fridaynightraces/eventtypes/')
            .then(response => {
                this.setState({ eventTypes: response.data });
                this.setState({ loading: false });

                var eventTypeIds = [];
                this.state.eventTypes.forEach(x => eventTypeIds.push(x.eventTypeId));
                this.setState({ eventTypeIds: eventTypeIds });
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    handleChangeDate(event) {
        this.setState({ date: event });
        var dateValues = [];
        dateValues.push(event.getDate());
        dateValues.push(event.getMonth() + 1);
        dateValues.push(event.getFullYear());
        this.setState({ raceDate: dateValues });  
    }

    handleCreateRaceNight() {
        console.log("CurrentEvents");
        console.log(this.state.eventTypeIds);

        const newRaceNight = {
            date: this.state.raceDate,
            raceEventIds: this.state.selectedEventTypeIds
        }

        var eventNumber = 1;
        this.state.selectedEventTypeIds.forEach(eventId => {
            const newRaceEvent = {
                raceEventId: uuidv4(),
                eventTypeId: eventId,
                swimmerIds: [],
                resultIds: [],
                date: this.state.raceDate,
                eventNumber: eventNumber
            }

            axios.post('http://localhost:4000/fridaynightraces/raceevents/add_raceevent', newRaceEvent);

            eventNumber++;
        });

        axios.post('http://localhost:4000/fridaynightraces/racenights/add_racenight', newRaceNight);

        setTimeout(function() {
            alert("Race Night Created");
            window.location.reload(false);
        }, 1000);
    }

    handleAdd(eventType) {
        var selectedEvents = this.state.selectedEventTypes;
        selectedEvents.push(eventType);
        var selectedEventIds = this.state.selectedEventTypeIds;
        selectedEventIds.push(eventType.eventTypeId);
        this.setState({ 
            selectedEventTypes: selectedEvents,
            selectedEventTypeIds: selectedEventIds
        });

        var events = this.state.eventTypes;
        var index = events.indexOf(eventType);
        events.splice(index, 1);
        this.setState({ eventTypes: events });
    }
    
    handleRemove(eventType) {
        var events = this.state.eventTypes;
        events.push(eventType);
        this.setState({ eventTypes: events });

        var selectedEvents = this.state.selectedEventTypes;
        var index = selectedEvents.indexOf(eventType);
        selectedEvents.splice(index, 1);
        var selectedEventIds = this.state.selectedEventTypeIds;
        var idIndex = selectedEventIds.indexOf(eventType.eventTypeId);
        selectedEventIds.splice(idIndex, 1);
        this.setState({ 
            selectedEventTypes: selectedEvents,
            selectedEventTypeIds: selectedEventIds 
        });
    }

    handleMoveUp() {
        console.log("Move up");
    }

    handleMoveDown() {
        console.log("Move down");
    }

    render() {
        return (
            <div>
                <label>
                    Date:
                    <DatePicker dateFormat="dd-MM-yyyy" selected={this.state.date} onChange={this.handleChangeDate} />
                </label>
                <div>
                    <table style={{width:'100%'}}>
                        <tr>
                            <td style={{verticalAlign:'top', width:'50%'}}>
                                <h3>Available Events</h3>
                                <table className="table table-striped" style={{ marginTop: 20 }}>
                                    <thead>
                                        <tr>
                                        <th>Age</th>
                                        <th>Distance</th>
                                        <th>Stroke</th>
                                        <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.eventTypes.map((currentEvent, i) => (
                                                <tr>
                                                    <td>{currentEvent.minAge} - {currentEvent.maxAge}</td>
                                                    <td>{currentEvent.distance}</td>
                                                    <td>{currentEvent.stroke}</td>
                                                    <td>
                                                        <button onClick={() => this.handleAdd(currentEvent)}>Add</button>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </td>
                            <td style={{verticalAlign:'top', width:'50%'}}>
                                <h3>Selected Events</h3>
                                <table className="table table-striped" style={{ marginTop: 20 }}>
                                    <thead>
                                        <tr>
                                        <th>Age</th>
                                        <th>Distance</th>
                                        <th>Stroke</th>
                                        <th></th>
                                        <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.selectedEventTypes.map((currentEvent, i) => (
                                                <tr style={{verticalAlign:'middle'}}>
                                                    <td>{currentEvent.minAge} - {currentEvent.maxAge}</td>
                                                    <td>{currentEvent.distance}</td>
                                                    <td>{currentEvent.stroke}</td>
                                                    <td>
                                                        <button onClick={() => this.handleRemove(currentEvent)}>Remove</button>
                                                    </td>
                                                    <td>
                                                        <table>
                                                            <tbody>
                                                                <tr>
                                                                    <td>
                                                                        <button style={{background:'none', border:'none'}} onClick={this.handleMoveUp}>&#8593;</button>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        <button style={{background:'none', border:'none'}} onClick={this.handleMoveDown}>&#8595;</button>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </table>
                </div>
                <button onClick={() => this.handleCreateRaceNight()}>Create Race Night</button>
            </div>
        )
    }
}
