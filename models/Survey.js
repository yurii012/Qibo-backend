const mongoose = require('mongoose');

const SurveySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    responses: {
        type: Map,
        of: Number,
        required: true
    }
});

module.exports = mongoose.model('Survey', SurveySchema);