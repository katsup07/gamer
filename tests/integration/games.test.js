const request = require('supertest');
const { Game } = require('../../models/game-model');
const { User } = require('../../models/user-model');
const mongoose = require('mongoose');

let server;

describe('/api/games', () => {
  beforeEach( () => {
    server = require('../../app');
  });
  afterEach(async() => {
    server.close()
    await Game.collection.deleteMany();
  });

  // === GET / ===
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

  // === GET  /:id ===
  describe('GET /:id', () => {
    it('should return status 400 for incorrect id format', async() => {
      const res = await request(server).get('/api/customers/1');
      expect(res.status).toBe(400);
    });

    it('should return status 400 for incorrect id format', async() => {
      const res = await request(server).get('/api/games/1');
      expect(res.status).toBe(400);
    });

    it('should return status 404 when invalid mongoose id passed', async() => {
      const game = {_id:'invalid_id' , name: 'game1'};

      await Game.collection.insertOne(game);
      const res = await request(server).get(`/api/games/${game._id}`);
      expect(res.status).toBe(400);
    });

    it('should return status 404 when valid mongoose id passed but no such game', async() => {
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
  });

  // === POST / ===
  describe('POST /', () => {
    it('should return 401 if client is not logged in', async() => {
      const res = await request(server).post('/api/games').send({name: 'game1'});
      expect(res.status).toBe(401);
    });

    it('should return 400 if client is logged in but supplies game with name length less than 5 chars', async() => {
      const user = new User({name: 'john', email: 'john@test.com', password:'12345', isAdmin: true});
      const token = user.generateAuthToken();
      const res = await request(server).post('/api/games').send({name: '12', developer: '123', isPublished: false, price: '1.23' }).set('x-auth-token', token);
      expect(res.status).toBe(400);
    });
    it('should return 400 if client is logged in but supplies game with name length more than 50 chars', async() => {
      const fiftyOneCharacters = new Array(52).join('a');
      const user = new User({name: 'john', email: 'john@test.com', password:'12345', isAdmin: true});
      const token = user.generateAuthToken();
      const res = await request(server).post('/api/games').send({name: fiftyOneCharacters, developer: '123', isPublished: false, price: '1.23' }).set('x-auth-token', token);
      expect(res.status).toBe(400);
    });

    it('should return 400 if client is logged in but supplies game with developer length less than 5 chars', async() => {
      const user = new User({name: 'john', email: 'john@test.com', password:'12345', isAdmin: true});
      const token = user.generateAuthToken();
      const res = await request(server).post('/api/games').send({name: '123', developer: '12', isPublished: false, price: '1.23' }).set('x-auth-token', token);
      expect(res.status).toBe(400);
    });
    it('should return 400 if client is logged in but supplies game with developer length more than 50 chars', async() => {
      const fiftyOneCharacters = new Array(52).join('a');
      const user = new User({name: 'john', email: 'john@test.com', password:'12345', isAdmin: true});
      const token = user.generateAuthToken();
      const res = await request(server).post('/api/games').send({name: '123', developer: fiftyOneCharacters, isPublished: false, price: '1.23' }).set('x-auth-token', token);
      expect(res.status).toBe(400);
    });

    it('should return 400 if client is logged in but fails to supply a name field', async() => {
      const user = new User({name: 'john', email: 'john@test.com', password:'12345', isAdmin: true});
      const token = user.generateAuthToken();
      const res = await request(server).post('/api/games').send({ developer: '123', isPublished: false, price: '1.23' }).set('x-auth-token', token);
      expect(res.status).toBe(400);
    });

    it('should return 400 if client is logged in but fails to supply a developer field', async() => {
      const user = new User({name: 'john', email: 'john@test.com', password:'12345', isAdmin: true});
      const token = user.generateAuthToken();
      const res = await request(server).post('/api/games').send({ name: '123', isPublished: false, price: '1.23' }).set('x-auth-token', token);
      expect(res.status).toBe(400);
    });

    it('should return 400 if client is logged in but fails to supply a price field', async() => {
      const user = new User({name: 'john', email: 'john@test.com', password:'12345', isAdmin: true});
      const token = user.generateAuthToken();
      const res = await request(server).post('/api/games').send({ name: '123', developer: '123', isPublished: false}).set('x-auth-token', token);
      expect(res.status).toBe(400);
    });

    it('should return 400 if client is logged in but fails to supply an isPublished field', async() => {
      const user = new User({name: 'john', email: 'john@test.com', password:'12345', isAdmin: true});
      const token = user.generateAuthToken();
      const res = await request(server).post('/api/games').send({ name: '123', developer: '123', price: '1.23' }).set('x-auth-token', token);
      expect(res.status).toBe(400);
    });

    it('should return 200 and game object if all fields are supplied correctly', async() => {
      const user = new User({name: 'john', email: 'john@test.com', password:'12345', isAdmin: true});
      const token = user.generateAuthToken();
      const res = await request(server).post('/api/games').send({ name: '123', developer: '123', price: '1.23', isPublished: false }).set('x-auth-token', token);
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('123');
      expect(res.body.developer).toBe('123');
      expect(res.body.price).toBe(1.23);
      expect(res.body.isPublished).toBe(false);
    });

    it('should save game in db and return its data if it is valid', async() => {
      const user = new User({name: 'john', email: 'john@test.com', password:'12345', isAdmin: true});
      const token = user.generateAuthToken();
      
      await request(server).post('/api/games').send({ name: '123', developer: '123', price: '1.23', isPublished: false }).set('x-auth-token', token);
      
      const result = await Game.find({name: '123'});
      const gameInDb = result[0]._doc;
      expect(gameInDb).toHaveProperty('_id');
      expect(gameInDb.name).toBe('123');
      expect(gameInDb.developer).toBe('123');
      expect(gameInDb.price).toBe(1.23);
      expect(gameInDb.isPublished).toBe(false);
    });
  });

  // === PUT /:id ===
  describe('PUT /:id', () => {
    it('should return 400 if invalid game name data is passed', async() => {
      const token = new User().generateAuthToken();
      const id = mongoose.Types.ObjectId();
      const game = new Game({name: '12', developer: '123', isPublished: false, price: 1});
      const res = await request(server).put(`/api/games/${id}`).send(game).set('x-auth-token', token);
      expect(res.status).toBe(400);
    });

    it('should return 400 if invalid developer data is passed', async() => {
      const token = new User().generateAuthToken();
      const id = mongoose.Types.ObjectId();
      const game = new Game({name: '123', developer: '12', isPublished: false, price: 1});
      const res = await request(server).put(`/api/games/${id}`).send(game).set('x-auth-token', token);
      expect(res.status).toBe(400);
    });

    it('should return 400 if game is missing required fields', async() => {
      const token = new User().generateAuthToken();
      const id = mongoose.Types.ObjectId();
      const game = new Game({name: '123', developer: '12', price: 1});
      const res = await request(server).put(`/api/games/${id}`).send(game).set('x-auth-token', token);
      expect(res.status).toBe(400);
    });

    it('should return 400 if invalid id is passed', async() => {
      const token = new User().generateAuthToken();
      const game ={name: '123', developer: '123', isPublished: false, price: 1};
      const res = await request(server).put(`/api/games/1`).send(game).set('x-auth-token', token);
      expect(res.status).toBe(400);
    });

    it('should return 401 if valid id is passed but no such id in database', async() => {
      const token = new User().generateAuthToken();
      const id = mongoose.Types.ObjectId();
      const game ={name: '123', developer: '123', isPublished: false, price: 1};
      const res = await request(server).put(`/api/games/${id}`).send(game).set('x-auth-token', token);
      expect(res.status).toBe(401);
    });

    it('should return 200 if valid mongoose id is passed', async() => {
      const token = new User().generateAuthToken();
      const game ={name: '123', developer: '123', isPublished: false, price: 1};

      const gameData = await request(server).post('/api/games').send(game).set('x-auth-token', token);

      const res = await request(server).put(`/api/games/${gameData.body._id}`).send(game).set('x-auth-token', token);
      expect(res.status).toBe(200);
    });

    it('should update game if valid mongoose id is passed', async() => {
      const token = new User().generateAuthToken();
      const game ={name: '123', developer: '123', isPublished: false, price: 1};
      const updatedGame = {name: 'abc', developer: '456', isPublished: true, price: 2};
      const gameData = await request(server).post('/api/games').send(game).set('x-auth-token', token);
      const res = await request(server).put(`/api/games/${gameData.body._id}`).send(updatedGame).set('x-auth-token', token);
      expect(res.body.name).toBe('abc');
      expect(res.body.developer).toBe('456');
      expect(res.body.isPublished).toBe(true);
      expect(res.body.price).toBe(2);
    });

  });

  // === Delete /:id ===
  describe('DELETE /:id', () =>{
    it('should return a 400 if not authorized', async() => {
      const token = ''
      const game ={name: '123', developer: '123', isPublished: false, price: 1};

      const gameData = await request(server).post('/api/games').send(game).set('x-auth-token', token);
      
      const res = await request(server).delete(`/api/games/${gameData.body._id}`);
      expect(res.status).toBe(401);
    })

    it('should return a 403 if authorized but not admin', async() => {
      const token = new User().generateAuthToken();
      const game ={name: '123', developer: '123', isPublished: false, price: 1};

      const gameData = await request(server).post('/api/games').send(game).set('x-auth-token', token);
      
      const res = await request(server).delete(`/api/games/${gameData.body._id}`).set('x-auth-token', token);
      expect(res.status).toBe(403);
    });

    it('should return a 400 if authorized and admin, but invalid game id', async() => {
      const token = new User({name: 'test_name', email: 'test@mail.com', isAdmin: true}).generateAuthToken();

      const res = await request(server).delete(`/api/games/x`).set('x-auth-token', token)
      expect(res.status).toBe(400);
    });

    it('should return a 404 if authorized and admin and valid game id, but no id found in database', async() => {
      const token = new User({name: 'test_name', email: 'test@mail.com', isAdmin: true}).generateAuthToken();
      const game ={name: '123', developer: '123', isPublished: false, price: 1};
      const idNotInDatabase = new mongoose.Types.ObjectId();
      
      const gameData = await request(server).post('/api/games').send(game).set('x-auth-token', token);
      
      const res = await request(server).delete(`/api/games/${idNotInDatabase}`).set('x-auth-token', token)
      expect(res.status).toBe(404);
    });
    
    it('should return a 200 if authorized and admin and valid game id, and id found in database', async() => {
      const token = new User({name: 'test_name', email: 'test@mail.com', isAdmin: true}).generateAuthToken();
      const game ={name: '123', developer: '123', isPublished: false, price: 1};
      
      const gameData = await request(server).post('/api/games').send(game).set('x-auth-token', token);
      
      const res = await request(server).delete(`/api/games/${gameData.body._id}`).set('x-auth-token', token)
      expect(res.status).toBe(200);
    });
  });
})