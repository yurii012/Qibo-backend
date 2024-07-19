const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const bodyConstitutionRoutes = require('./routes/bodyConstitution');

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');

    // Start server after successful DB connection
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1); // Exit process with failure
  });

app.use(passport.initialize());

app.use('/auth', authRoutes);
app.use('/body-constitution', bodyConstitutionRoutes);