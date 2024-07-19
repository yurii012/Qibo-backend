const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const { calculateScores, determineConstitution } = require('../utils/bodyConstitutionCalculator');

const router = express.Router();

// Process test results
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { responses } = req.body;
    const scores = calculateScores(responses);
    const constitution = determineConstitution(scores);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        bodyConstitution: {
          ...scores,
          testDate: new Date()
        }
      },
      { new: true }
    );

    res.json({ constitution });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get test results
router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user.bodyConstitution);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update test results
router.put('/:userId', authMiddleware, async (req, res) => {
  try {
    const { responses } = req.body;
    const scores = calculateScores(responses);
    const constitution = determineConstitution(scores);

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      {
        bodyConstitution: {
          ...scores,
          testDate: new Date()
        }
      },
      { new: true }
    );

    res.json({ constitution });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;