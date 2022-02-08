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
            grades: [],
            gender: "",
            isRelay: false,
            swimmersPerTeam: 1,
            isScratch: false,
            isEnterOwnHcapTime: false,
            isNovalty: false
        };

        this.handleChangeStroke = this.handleChangeStroke.bind(this);
        this.handleChangeDistance = this.handleChangeDistance.bind(this);
        this.handleChangeGradesList = this.handleChangeGradesList.bind(this);
        this.handleChangeGender = this.handleChangeGender.bind(this);
        this.handleChangeIsRelay = this.handleChangeIsRelay.bind(this);
        this.handleChangeSwimmersPerTeam = this.handleChangeSwimmersPerTeam.bind(this);
        this.handleChangeIsScratch = this.handleChangeIsScratch.bind(this);
        this.handleChangeIsEnterOwnHcapTime = this.handleChangeIsEnterOwnHcapTime.bind(this);
        this.handleChangeIsNovalty = this.handleChangeIsNovalty.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangeStroke(event) {
        this.setState({ stroke: event.target.value });
    }

    handleChangeDistance(event) {
        this.setState({ distance: event.target.value });
    }

    handleChangeGradesList(event) {
        var grades = this.state.grades;
        if (event.target.checked) {
            grades.push(event.target.id);
        } else {
            var index = grades.indexOf(event.target.id);
            grades.splice(index, 1);
        }
        this.setState({ grades: grades });
    }

    handleChangeGender(event) {
        this.setState({ gender: event.target.value });
    }

    handleChangeIsRelay(event) {
        this.setState({ 
            isRelay: event.target.checked,
            swimmersPerTeam: 1
        });
    }

    handleChangeSwimmersPerTeam(event) {
        this.setState({ swimmersPerTeam: event.target.value });
    }

    handleChangeIsScratch(event) {
        this.setState({ 
            isScratch: event.target.checked,
            isEnterOwnHcapTime: false
        });
    }

    handleChangeIsEnterOwnHcapTime(event) {
        this.setState({ isEnterOwnHcapTime: event.target.checked });
    }

    handleChangeIsNovalty(event) {
        this.setState({ isNovalty: event.target.checked });
    }

    handleSubmit(event) {
        event.preventDefault();

        console.log(this.state.stroke);
        console.log(this.state.distance);
        console.log(this.state.grades);
        console.log(this.state.gender);

        if (this.state.stroke === "" || this.state.distance === 0 || this.state.grades === [] || 
        this.state.gender === "") {
            return;
        }

        const newEventType = {
            eventTypeId: this.state.eventTypeId,
            stroke: this.state.stroke,
            distance: this.state.distance,
            grades: this.state.grades,
            gender: this.state.gender,
            isRelay: this.state.isRelay,
            swimmersPerTeam: this.state.swimmersPerTeam,
            isScratchEvent: this.state.isScratchEvent,
            isEnterOwnHcapTime: this.state.isEnterOwnHcapTime
        }

        axios.post('http://localhost:4000/fridaynightraces/events/add_eventtype', newEventType);

        window.location.reload();
    }


    render() {
        return (
            <form onSubmit={this.handleSubmit} >
                <input type="checkbox" id="isNovalty" name="isNovalty" onClick={this.handleChangeIsNovalty}/>
                <label for="isNovalty">&nbsp; Novalty? &emsp;</label>

                <input type="checkbox" id="isScratch" name="isScratch" onClick={this.handleChangeIsScratch}/>
                <label for="isScratch">&nbsp; Scratch? &emsp;</label>

                {this.state.isScratch ? <label></label> : (
                    <span>
                        <input type="checkbox" id="isEnterOwnHcapTime" name="isEnterOwnHcapTime" onClick={this.handleChangeIsEnterOwnHcapTime}/>
                        <label for="isEnterOwnHcapTime">&nbsp; Enter own hcap time? &emsp;</label>
                    </span>
                )}

                <input type="checkbox" id="isRelay" name="isRelay" onClick={this.handleChangeIsRelay}/>
                <label for="isRelay">&nbsp; Relay? &emsp;</label>

                {this.state.isRelay ? (
                    <label>
                        Number of swimmers per team: &nbsp;
                        <input style={{width: "3em"}} type="number" id="swimmersPerTeam" name="swimmersPerTeam" 
                            min="1" max="10"
                            value={this.state.swimmersPerTeam} onChange={this.handleChangeSwimmersPerTeam} />
                    </label>
                ) : <label></label>}

                <br/>

                <label for="stroke">Stroke: &nbsp;</label>
                <select name="stroke" id="stroke" onChange={this.handleChangeStroke}>
                    <option value="" selected disabled hidden> Select Stroke...</option>
                    <option value="freestyle">Freestyle</option>
                    <option value="backstroke">Backstroke</option>
                    <option value="breaststroke">Breaststroke</option>
                    <option value="butterfly">Butterfly</option>
                    <option value="medley">Medley</option>
                </select>

                <br/>

                <label for="distance">Distance: &nbsp;</label>
                <select name="distance" id="distance" onChange={this.handleChangeDistance}>
                    <option value="" selected disabled hidden> Select Distance...</option>
                    <option value="25">25m</option>
                    <option value="50">50m</option>
                    <option value="100">100m</option>
                    <option value="200">200m</option>
                </select>

                <br/>

                <label for="grades">Grades: &nbsp;</label>
                <input type="checkbox" id="E" name="E" onClick={this.handleChangeGradesList}/>
                <label for="E">&nbsp; E-Grade &emsp;</label>
                <input type="checkbox" id="D" name="D" onClick={this.handleChangeGradesList}/>
                <label for="D">&nbsp; D-Grade &emsp;</label>
                <input type="checkbox" id="C" name="C" onClick={this.handleChangeGradesList}/>
                <label for="C">&nbsp; C-Grade &emsp;</label>
                <input type="checkbox" id="B" name="B" onClick={this.handleChangeGradesList}/>
                <label for="B">&nbsp; B-Grade &emsp;</label>
                <input type="checkbox" id="A" name="A" onClick={this.handleChangeGradesList}/>
                <label for="A">&nbsp; A-Grade &emsp;</label>
                <input type="checkbox" id="15-years" name="15-years" onClick={this.handleChangeGradesList}/>
                <label for="15-years">&nbsp; 15-Years &emsp;</label>

                <br/>

                <label for="gender">Gender: &nbsp;</label>
                <select name="gender" id="gender" onChange={this.handleChangeGender}>
                    <option value="" selected disabled hidden> Select Gender...</option>
                    <option value="Men">Men</option>
                    <option value="Ladies">Ladies</option>
                    <option value="Mixed">Mixed</option>
                </select>

                <br/><br/>

                <input type="submit" value="Submit" />
            </form>
        )
  }
}
