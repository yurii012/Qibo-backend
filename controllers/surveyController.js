const Survey = require('../models/Survey');

exports.createSurvey = async (req, res) => {
    const { responses } = req.body;

    try {
        let survey = new Survey({
            userId: req.user.id,
            responses,
        });

        await survey.save();

        res.json(survey);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getUserSurveys = async (req, res) => {
    try {
        const surveys = await Survey.find({ userId: req.user.id });
        res.json(surveys);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};