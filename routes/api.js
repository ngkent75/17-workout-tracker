const router = require('express').Router();
const Workout = require('../models/workout');

router.get('/api/workouts', (req, res) => {
    Workout.aggregate([{
        $addFields: { totalDuration: { $sum: '$exercises.duration' } }
    }])
        .sort({ _id: 1 })
        .then(dbWorkout => {
            res.json(dbWorkout);
        })
        .catch(err => {
            res.status(400).json(err);
        })
});

router.post('/api/workouts', ({ body }, res) => {
    Workout.create(body)
        .then(dbWorkout => {
            res.json(dbWorkout);
        })
        .catch(err => {
            res.status(400).json(err);
        })
});

router.post('/api/workouts/bulk', ({ body }, res) => {
    Workout.insertMany(body)
        .then(dbWorkout => {
            res.json(dbWorkout)
        })
        .catch(err => {
            res.status(400).json(err);
        })
});

router.put('/api/workouts/:id', (req, res) => {
    Workout.findByIdAndUpdate(req.params.id, { $push: { exercises: [req.body] } }, { new: true })
        .then(dbWorkout => {
            res.json(dbWorkout)
        })
        .catch(err => {
            res.status(400).json(err);
        })
});

router.get('/api/workouts/range', (req, res) => {
    Workout.aggregate([{
        $addFields: { totalDuration: { $sum: "$exercises.duration" } }
    }])
        .sort({ day: -1 })
        .then(dbWorkout => {
            function compare(a, b) {
                let comp
                if (a.day > b.day) {
                    comp = 1;
                } else if (a.day < b.day) {
                    comp = -1;
                }
                return comp;
            }
            dbWorkout.length = 7;
            dbWorkout.sort(compare)
            res.json(dbWorkout);
        })
        .catch(err => {
            res.status(400).json(err);
        })
});

module.exports = router;