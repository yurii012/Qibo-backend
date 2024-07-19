const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const passport = require('passport');
const sendgrid = require('@sendgrid/mail');

const router = express.Router();
// Set SendGrid API key
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

// User registration
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      email,
      password: hashedPassword
    });

    await user.save();

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Password reset request (simplified)
// You will need to implement your actual email sending logic here
router.post('/password-reset/request', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }
   // Create a reset token
    const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });

    const resetLink = `http://${req.headers.host}/auth/password-reset/confirm/${resetToken}`;

    const msg = {
      to: email,
      from: process.env.SENDGRID_ACCOUNT_EMAIL, // Add your email
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.
              Please click on the following link, or paste this into your browser to complete the process:
              ${resetLink}
              If you did not request this, please ignore this email and your password will remain unchanged.`,
    };

    await sendgrid.send(msg);

    res.json({ msg: 'Password reset link sent' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Password reset confirmation (simplified)
router.post('/password-reset/confirm', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(400).json({ msg: 'Invalid token' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({ msg: 'Password updated successfully' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Google OAuth setup
require('../config/passport-setup');
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const token = jwt.sign({ user: { id: req.user.id } }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.redirect(`http://yourfrontendurl.com?token=${token}`);
  }
);

module.exports = router;