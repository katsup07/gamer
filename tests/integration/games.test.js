const request = require('supertest');
const { Game } = require('../../models/game-model');
const { Customer } = require('../../models/game-model');
const mongoose = require('mongoose');
let server;

describe('/api/games', () => {
  beforeEach(async() => {
    server = require('../../app');
  });
  afterEach(async() => {
    server.close()
    await Game.collection.deleteMany();
  });

  describe('GET /', () => {
    it('should return all games', async() => {
      await Game.collection.insertMany([{name: 'game1'}, {name: 'game2'}]);
      const res = await request(server).get('/api/games');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(game => game.name === 'game1')).toBe(true);
      expect(res.body.some(game => game.name === 'game2')).toBe(true);
    })
  });

  describe('GET /:id', () => {
    it('should return status 400 for incorrect id format', async() => {
      const res = await request(server).get('/api/customers/1');
      expect(res.status).toBe(400);
    });

    it('should return status 400 for incorrect id format', async() => {
      const res = await request(server).get('/api/games/1');
      expect(res.status).toBe(400);
    });

    it('should return status 404 when invalid id passed', async() => {
      const game = {_id: mongoose.Types.ObjectId(), name: 'game1'};
      const an_id_that_ends_with_1 = '64295db3429b8e2ef4f77d11';
      const an_id_that_ends_with_0 = '64295db3429b8e2ef4f77d10';
      const lastIdDigit = game._id[23];

      // Set id to game not in database
      if(lastIdDigit === 0)
        game._id = an_id_that_ends_with_1;
      else
        game._id = an_id_that_ends_with_0;

      await Game.collection.insertOne(game);
      const res = await request(server).get(`/api/games/${game._id}`);
      expect(res.status).toBe(404);
    });

    it('should find the game with valid id passed', async() => {
      const game = new Game({name: 'game1', developer: 'some_dev', price: "60", isPublished: false });
      await game.save();
  
      const res = await request(server).get(`/api/games/${game._id}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', game.name);
      expect(res.body).toHaveProperty('developer', game.developer);
      expect(res.body).toHaveProperty('price', game.price);
      expect(res.body).toHaveProperty('isPublished', game.isPublished);
    })
  })
});