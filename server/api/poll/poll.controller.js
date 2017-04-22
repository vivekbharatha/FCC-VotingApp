/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/polls              ->  index
 * POST    /api/polls              ->  create
 * GET     /api/polls/:id          ->  show
 * PUT     /api/polls/:id          ->  upsert
 * PATCH   /api/polls/:id          ->  patch
 * DELETE  /api/polls/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Poll from './poll.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      // eslint-disable-next-line prefer-reflect
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Polls
export function index(req, res) {
  return Poll.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a list of Polls by user id
export function fetch(req, res) {
  return Poll.find({ userId: req.user._id.toString() }).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Poll from the DB
export function show(req, res) {
  return Poll.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Poll in the DB
export function create(req, res) {
  var pollData = {
    title: req.body.title,
    options: {}
  };
  pollData.userId = req.user.id;
  req.body.options.forEach(function (option) {
    pollData.options[option] = 0;
  });

  return Poll.create(pollData)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Poll in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Poll.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Vote Poll in the DB
export function vote(req, res) {
  if(!req.params.id) {
    return res.status(400).json({ message: 'Invalid id' });
  }

  if(typeof req.body.option === 'undefined') {
    return res.status(400).json({ message: 'No option given' });
  }

  var pollId = req.params.id;
  var optionGiven = req.body.option;

  return Poll.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(function (poll) {
      var votedUserElement;

      // Check already vote given condition
      if (typeof req.user === 'undefined') {
        votedUserElement = req.ip;
      } else {
        votedUserElement = req.user._id.toString();
      }

      var votedUsers = poll.votedUsers;

      if (votedUsers.indexOf(votedUserElement) !== -1) {
        return res.status(400).json({ message: 'Either from user or ip, you already given vote to this poll' });
      }

      votedUsers.push(votedUserElement);

      // Check option or create option
      var options = poll.options;
      if (typeof options[optionGiven] === 'undefined') {
        options[optionGiven] = 0;
      }

      options[optionGiven] = options[optionGiven] + 1;
      Poll.update({_id: pollId}, { $set: { options: options, votedUsers: votedUsers } }, function (err, updatedPoll) {
        if (err) return res.status(500).json({ message: 'Our bad server error :(' });
        if (updatedPoll.nModified !== 1) return res.status(500).json({ message: 'Invalid poll' });
        return res.json({});
      });
    })
    .catch(handleError(res));
}

// Updates an existing Poll in the DB
export function patch(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Poll.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Poll from the DB
export function destroy(req, res) {
  return Poll.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
