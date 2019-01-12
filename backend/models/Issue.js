import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Issue = new Schema({
  title: {
    type: String
  },
  responsible: {
    type: String
  },
  description: {
    type: String
  },
  severity: {
    type: String
  },
  status: {
    type: String,
    default: 'Open'
  },
  comments: {
    type: Array,
    default: []
  }
});

export default mongoose.model('Issue', Issue);