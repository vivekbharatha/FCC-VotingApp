'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './poll.events';

var PollSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

registerEvents(PollSchema);
export default mongoose.model('Poll', PollSchema);
