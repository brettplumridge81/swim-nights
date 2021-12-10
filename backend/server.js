const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const fridayNightRacesRoutes = express.Router();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/fridaynightraces', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function () {
    console.log("MongoDB connection established");
})

fridayNightRacesRoutes.route('/swimmers').get(function (req, res) {
    let Swimmer = require('./swimmer.model');
    Swimmer.find(function (err, swimmers) {
        if (err) {
            console.log(err);
        } else {
            res.json(swimmers);
        }
    });
});

fridayNightRacesRoutes.route('/eventtypes').get(function (req, res) {
    let EventType = require('./eventType.model');
    EventType.find(function (err, events) {
        if (err) {
            console.log(err);
        } else {
            res.json(events);
        }
    });
});

fridayNightRacesRoutes.route('/currentselectedevents').get(function (req, res) {
    let SelectedEvent = require('./selectedEvent.model');
    SelectedEvent.find(function (err, events) {
        if (err) {
            console.log(err);
        } else {
            res.json(events);
        }
    });
});

fridayNightRacesRoutes.route('/racenights').get(function (req, res) {
    let RaceNight = require('./raceNight.model');
    RaceNight.find(function (err, raceNights) {
        if (err) {
            console.log(err);
        } else {
            res.json(raceNights);
        }
    });
});

fridayNightRacesRoutes.route('/raceevents').get(function (req, res) {
    let RaceEvent = require('./raceEvent.model');
    RaceEvent.find(function (err, raceEvent) {
        if (err) {
            console.log(err);
        } else {
            res.json(raceEvent);
        }
    });
});

fridayNightRacesRoutes.route('/raceevents/:id').get(function (req, res) {
    let RaceEvent = require('./raceEvent.model');
    let id = req.params.id;
    RaceEvent.findById(id, function (err, raceEvent) {
        if (err) {
            console.log(err);
        } else {
            res.json(raceEvent);
        }
    });
});

fridayNightRacesRoutes.route('/swimmereventresults').get(function (req, res) {
    let SwimmerEventResult = require('./swimmerEventResult.model');
    SwimmerEventResult.find(function (err, swimmerEventResult) {
        if (err) {
            console.log(err);
        } else {
            res.json(swimmerEventResult);
        }
    });
});

fridayNightRacesRoutes.route('/racesheets').get(function (req, res) {
    let RaceSheet = require('./raceSheet.model');
    RaceSheet.find(function (err, raceSheet) {
        if (err) {
            console.log(err);
        } else {
            res.json(raceSheet);
        }
    });
});

/*boreholeRoutes.route('/:id').get(function (req, res) {
    let id = req.params.id;

    Borehole.findById(id, function (err, borehole) {
        if (err) {
            console.log(err);
        } else {
            res.json(borehole);
        }
    });
});*/

fridayNightRacesRoutes.route('/swimmers/add_swimmer').post(function (req, res) {
    let Swimmer = require('./swimmer.model');
    let swimmer = new Swimmer(req.body);
    swimmer.save()
        .then(swimmer => {
            res.status(200).json({ 'swimmer': 'swimmer added successfully' });
        })
        .catch(err => {
            res.status(400).send('adding new swimmer failed');
        });
});

fridayNightRacesRoutes.route('/events/add_eventtype').post(function (req, res) {
    let EventType = require('./eventType.model');
    let eventType = new EventType(req.body);
    eventType.save()
        .then(eventType => {
            res.status(200).json({ 'eventType': 'eventType added successfully' });
        })
        .catch(err => {
            res.status(400).send('adding new eventType failed');
        });
});

fridayNightRacesRoutes.route('/selectedevents/add_selectedevent').post(function (req, res) {
    let EventType = require('./selectedEvent.model');
    let eventType = new EventType(req.body);
    eventType.save()
        .then(eventType => {
            res.status(200).json({ 'eventType': 'selectedevent added successfully' });
        })
        .catch(err => {
            res.status(400).send('adding new selectedevent failed');
        });
});

fridayNightRacesRoutes.route('/racenights/add_racenight').post(function (req, res) {
    let RaceNight = require('./raceNight.model');
    let raceNight = new RaceNight(req.body);
    raceNight.save()
        .then(raceNight => {
            res.status(200).json({ 'raceNight': 'raceNight added successfully' });
        })
        .catch(err => {
            res.status(404).send('adding new raceNight failed');
            console.log(err);
        })
        .catch(err => {
            res.status(400).send('adding new raceNight failed');
        });
});

fridayNightRacesRoutes.route('/raceevents/add_raceevent').post(function (req, res) {
    let RaceEvent = require('./raceEvent.model');
    let raceEvent = new RaceEvent(req.body);
    console.log(req.body);
    raceEvent.save()
        .then(raceEvent => {
            res.status(200).json({ 'raceEvent': 'raceEvent added successfully' });
        })
        .catch(err => {
            res.status(400).send('adding new raceEvent failed');
        });
});

fridayNightRacesRoutes.route('/raceevents/add_racesheet').post(function (req, res) {
    let RaceSheet = require('./raceSheet.model');
    let raceSheet = new RaceSheet(req.body);
    console.log(req.body);
    raceSheet.save()
        .then(raceEvent => {
            res.status(200).json({ 'raceSheet': 'raceSheet added successfully' });
        })
        .catch(err => {
            res.status(400).send('adding new raceSheet failed');
        });
});


// fridayNightRacesRoutes.route('/swimmerEventResult/add_selectedswimmer').post(function (req, res) {
//     console.log("Here");
//     let SwimmerEventResult = require('./swimmerEventResult.model');
//     let swimmerEventResult = new SwimmerEventResult(req.body);
//     console.log(req.body);
//     swimmerEventResult.save()
//         .then(swimmerEventResult => {
//             res.status(200).json({ 'swimmerEventResult': 'swimmerEventResult added successfully' });
//         })
//         .catch(err => {
//             res.status(400).send('adding new swimmerEventResult failed');
//         });
// });





fridayNightRacesRoutes.route('/raceevents/update/:id').post(function (req, res) {
    let RaceEvent = require('./raceEvent.model');
    console.log(req.body);
    RaceEvent.findById(req.params.id, function (err, raceEvent) {
        if (!raceEvent) {
            res.status(404).send("data is not found");
        } else {
            raceEvent.swimmerIds = req.body[0].swimmerIds;
            raceEvent.resultIds = req.body[0].resultIds;

            raceEvent.save()
                .then(raceEvent => {
                    res.status(200).json({ 'raceEvent': 'raceEvent updated successfully' });
                })
                .catch(err => {
                    res.status(400).send('updating raceEvent failed');
                });
        }
        
    });
});

fridayNightRacesRoutes.route('/swimmerEventResult/update/:id').post(function (req, res) {
    let SwimmerEventResult = require('./swimmerEventResult.model');
    console.log(req.body);
    SwimmerEventResult.findById(req.params.id, function (err, swimmerEventResult) {
        if (!swimmerEventResult) {
            res.status(404).send("data is not found");
        } else {
            swimmerEventResult.recordedTime = req.body[0].recordedTime;
            swimmerEventResult.recordedPlace = req.body[0].recordedPlace;
            swimmerEventResult.points = req.body[0].points;

            swimmerEventResult.save()
                .then(swimmerEventResult => {
                    res.status(200).json({ 'swimmerEventResult': 'swimmerEventResult updated successfully' });
                })
                .catch(err => {
                    res.status(400).send('updating swimmerEventResult failed');
                });
        }
        
    });
});



fridayNightRacesRoutes.route('/selectedswimmers/delete/:id').get(function (req, res) {
    let SelectedSwimmer = require('./selectedSwimmer.model');
    SelectedSwimmer.findByIdAndRemove({_id: req.params.id}, function(err, SelectedSwimmer){
        if(err) res.json(err);
        else res.json('Successfully removed');
    });
});

fridayNightRacesRoutes.route('/currentselectedevents/delete/:id').get(function (req, res) {
    let SelectedEvent = require('./selectedEvent.model');
    SelectedEvent.findByIdAndRemove({_id: req.params.id}, function(err, selectedEvent){
        if(err) res.json(err);
        else res.json('Successfully removed');
    });
});



app.use('/fridaynightraces', fridayNightRacesRoutes);

app.listen(PORT, function () {
    console.log("Server is running on Port: " + PORT);
});