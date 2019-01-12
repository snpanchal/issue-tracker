import 'babel-polyfill';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import Issue from './models/Issue';

const app = express();
const router = express.Router();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/issues');

const connection = mongoose.connection;

connection.once('open', () => {
  console.log('MongoDB database connection established successfully!');
});

router.route('/issues').get(async (req, res) => {
  try {
    const issues = await Issue.find();
    res.json(issues);
  } catch (err) {
    console.log(err);
  }
});

router.route('/issues/:id').get(async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    res.json(issue);
  } catch (err) {
    console.log(err);
  }
});

router.route('/issues/add').post(async (req, res) => {
  try {
    let issue = new Issue(req.body);
    await issue.save();
    res.status(200).json({ 'issue': 'Added successfully' });
  } catch (err) {
    res.status(400).send('Failed to create new record!');
  }
});

router.route('/issues/update/:id').post(async (req, res) => {
  const issue = await Issue.findById(req.params.id);
  if (!issue) {
    return next(new Error('Could not load document'));
  } else {
    issue.title = req.body.title;
    issue.responsible = req.body.responsible;
    issue.description = req.body.description;
    issue.severity = req.body.severity;
    issue.status = req.body.status;

    try {
      await issue.save();
      res.json('Update done');
    } catch (err) {
      res.status(400).send('Update failed');
    }
  }
});

router.route('/issues/delete/:id').get(async (req, res) => {
  try {
    const issue = await Issue.findByIdAndRemove({ _id: req.params.id });
    res.json('Remove successfully');
  } catch (err) {
    res.json(err);
  }
});

router.route('/issues/comment/:id').post(async (req, res) => {
  const issue = await Issue.findById(req.params.id);
  if (!issue) {
    return next(new Error('Could not find issue'));
  } else {
    const newComment = {
      name: req.body.name,
      message: req.body.message,
      timestamp: req.body.timestamp
    }
    issue.comments.push(newComment);

    try {
      await issue.save();
      res.json('Comment added');
    } catch (err) {
      res.status(400).send('Failed to add comment');
    }
  }
});

app.use('/', router);

app.listen(4000, () => console.log('Express server running on port 4000.'));