import React, { Component } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import "react-datepicker/dist/react-datepicker.css";

export class SwimmerResultInput extends Component {

    constructor(props) {
        super(props);

        this.state = {
            raceEventId: props.raceEventId,
            swimmerName: props.swimmerName,
            result: undefined,
            grossMinutes: undefined,
            grossSeconds: undefined,
            grossHundredths: undefined,
            netTime: [undefined, undefined, undefined],
            place: undefined,
            points: 0,
            loaded: true
        };

        axios.get('http://localhost:4000/fridaynightraces/results/')
            .then(response => {
                let result = response.data
                    .filter(x => x.raceEventId === props.raceEventId)
                    .filter(x => x.swimmerName === props.swimmerName)[0]
                this.setState({
                    result: result,
                    grossMinutes: result.grossTime[0],
                    grossSeconds: result.grossTime[1],
                    grossHundredths: result.grossTime[2],
                    netTime: result.netTime,
                    place: result.place,
                    points: result.points
                });
            });

        this.handleChangeGrossMinutes = this.handleChangeGrossMinutes.bind(this);
        this.handleChangeGrossSeconds = this.handleChangeGrossSeconds.bind(this);
        this.handleChangeGrossHundredths = this.handleChangeGrossHundredths.bind(this);
        this.handleChangePlace = this.handleChangePlace.bind(this);
    }

    handleChangeGrossMinutes(event) {
        this.setState({ grossMinutes: event.target.value });
    }

    handleChangeGrossSeconds(event) {
        this.setState({ grossSeconds: event.target.value });
    }

    handleChangeGrossHundredths(event) {
        this.setState({ 
            grossHundredths: event.target.value 
        }, () => {
            this.setState({
                netTime: new Array(
                    this.state.grossMinutes - Math.floor(this.state.result.goAt / 60),
                    this.state.grossSeconds - this.state.result.goAt % 60,
                    this.state.grossHundredths
                )
            });
        });
    }

    handleChangePlace(event) {
        this.setState({ place: parseInt(event.target.value) });       
    }

    recordSwimmerResult() {
        let result = this.state.result;
        result.place = this.state.place;
        result.grossTime = new Array(this.state.grossMinutes, this.state.grossSeconds, this.state.grossHundredths);
        result.netTime = this.state.netTime;

        switch(this.state.place) {
            case 1: {
                result.points = 6;
                break;
            }
            case 2: {
                result.points = 4;
                break;
            }
            case 3: {
                result.points = 3;
                break;
            }
            default: {
                result.points = 2;
            }
        }

        this.setState({
            result: result,
            points: result.points
        }, () => {
            axios.post('http://localhost:4000/fridaynightraces/results/update/' + result._id, result);
        });
    }

    recordSwimmerDQ() {
        let result = this.state.result;
        result.points = 1;
        result.grossTime = [undefined, undefined, undefined];
        result.netTime = [undefined, undefined, undefined];
        result.place = undefined;

        this.setState({
            result: result,
            points: result.points,
            place: undefined,
            grossMinutes: undefined,
            grossSeconds: undefined,
            grossHundredths: undefined,
            netTime: [undefined, undefined, undefined]
        }, () => {
            axios.post('http://localhost:4000/fridaynightraces/results/update/' + result._id, result);
        });
    }

    recordSwimmerDNS() {
        let result = this.state.result;
        result.points = 0;
        result.grossTime = [undefined, undefined, undefined];
        result.netTime = [undefined, undefined, undefined];
        result.place = undefined;

        this.setState({
            result: result,
            points: result.points,
            place: undefined,
            grossMinutes: undefined,
            grossSeconds: undefined,
            grossHundredths: undefined
        }, () => {
            axios.post('http://localhost:4000/fridaynightraces/results/update/' + result._id, result);
        });
    }


    render() {
        if (this.state.loaded) {
            return (
                <tr>
                    <td style={{ textAlign: 'center', borderWidth: '1px' }}>
                        {this.state.swimmerName}
                    </td>
                    <td style={{ textAlign: 'center', borderWidth: '1px' }}>
                        <div class="record_place">
                            <input type="number" value={this.state.place !== undefined ? this.state.place: "" } onChange={this.handleChangePlace}></input>
                        </div>
                    </td>
                    <td style={{ textAlign: 'center', borderWidth: '1px' }}>
                        <div class="record_gross_time">
                            <td>
                                <input type="number" value={this.state.grossMinutes !== undefined ? this.state.grossMinutes : "" } 
                                    onChange={this.handleChangeGrossMinutes}>
                                </input>
                            </td>
                            <td>:</td>
                            <td>
                                <input type="number" value={this.state.grossSeconds !== undefined ? this.state.grossSeconds : ""} 
                                    onChange={this.handleChangeGrossSeconds}>
                                </input>
                            </td>
                            <td>.</td>
                            <td>
                                <input type="number" value={this.state.grossHundredths !== undefined ? this.state.grossHundredths : ""} 
                                    onChange={this.handleChangeGrossHundredths}>
                                </input>
                            </td>
                        </div>
                    </td>
                    <td style={{ textAlign: 'center', borderWidth: '1px' }}>
                        <div type="text">
                            {(this.state.netTime[0] !== undefined && this.state.netTime[0] !== null) ? this.state.netTime[0] : ""}
                            {(this.state.netTime[0] !== undefined && this.state.netTime[0] !== null) ? ":" : ""}
                            {(this.state.netTime[1] !== undefined && this.state.netTime[1] !== null) ? this.state.netTime[1] : ""}
                            {(this.state.netTime[2] !== undefined && this.state.netTime[2] !== null) ? "." : ""}
                            {(this.state.netTime[2] !== undefined && this.state.netTime[2] !== null) ? this.state.netTime[2] : ""}
                        </div>
                    </td>
                    <td style={{ textAlign: 'center', borderWidth: '1px' }}>
                        {this.state.points > 1 ? <div>&#10004;</div> : (this.state.points === 1 ? "DQ" : (this.state.points === 0 ? "DNS" : ""))}
                    </td>
                    <td style={{ textAlign: 'center', borderWidth: '1px' }}>
                        <button onClick={() => this.recordSwimmerResult()}>
                            Record Result
                        </button>
                        <button onClick={() => this.recordSwimmerDQ()}>
                            Record DQ
                        </button>
                        <button onClick={() => this.recordSwimmerDNS()}>
                            Record DNS
                        </button>
                    </td>
                </tr>
            )
        } else {
            return (<p>Not Loaded</p>)
        }
    }
}