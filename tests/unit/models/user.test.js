const { User } = require('../../../models/user-model');
const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

describe('user.generateAuthToken()', () => {
  it('should return a valid JWT', () => {
    const payload = {_id: mongoose.Types.ObjectId().toHexString(), isAdmin: true};
    const user = new User(payload);
    const token = user.generateAuthToken();

    const result = jwt.verify(token, config.get('jwtPrivateKey'));
    expect(result).toMatchObject(payload);
  })
})