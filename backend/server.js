const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const fridayNightRacesRoutes = express.Router();
const PORT = 4000;

/*let Swimmer = require('./swimmer.model');*/
/*let EventType = require('./eventType.model');*/

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

/*boreholeRoutes.route('/update/:id').post(function (req, res) {
    Borehole.findById(req.params.id, function (err, borehole) {
        if (!borehole)
            res.status(404).send("data is not found");
        else
            borehole.borehole_id = req.body.borehole_id;
        borehole.borehole_deveui = req.body.borehole_deveui;
        borehole.borehole_lat = req.body.borehole_lat;
        borehole.borehole_long = req.body.borehole_long;
        borehole.borehole_level = req.body.borehole_level;

        borehole.save().then(borehole => {
            res.json('Borehole updated!');
        })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});*/

fridayNightRacesRoutes.route('/currentselectedevents/delete/:id').get(function (req, res) {
    let SelectedEvent = require('./selectedEvent.model');
    SelectedEvent.findByIdAndRemove({_id: req.params.id}, function(err, selectedEvent){
        if(err) res.json(err);
        else res.json('Successfully removed');
    });
});

// fridayNightRacesRoutes.delete('/currentselectedevents/delete/:id', async (req, res) => {
//     try{
//         await SelectedEvent.findByIdAndDelete(req.body.id);
//         return res.status(200).json({ success: true, msg: 'SelectedEvent Deleted' });
//     }
//     catch(err){
//         console.error(err);
//     }
// });

app.use('/fridaynightraces', fridayNightRacesRoutes);

app.listen(PORT, function () {
    console.log("Server is running on Port: " + PORT);
});