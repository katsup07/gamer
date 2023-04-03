const request = require('supertest');
const { User } = require('../../models/user-model');
const { Game } = require('../../models/game-model');


let server;
describe('auth middleware', () => {
  let token;
  const game = {name: 'abc', developer: '123', isPublished: false, price: '1.23' };

	beforeEach(async () => {
    server = require('../../app');
    token = new User().generateAuthToken();
  });

	afterEach(async () => {
    server.close();
    try{
    await Game.remove({});
    }catch(err){
      console.log(err);
    }
  });

	it('should return 401 if no token is provided', async() => {
    token = '';
		const res = await request(server).post('/api/games').set('x-auth-token', token).send(game);
    expect(res.status).toBe(401);
	});

	it('should return 401 if null token is provided', async() => {
    token = null;
		const res = await request(server).post('/api/games').set('x-auth-token', token).send(game);
    expect(res.status).toBe(401);
	});

	it('should return 400 if invalid token is provided', async() => {
    token = 'a';
		const res = await request(server).post('/api/games').set('x-auth-token', token).send(game);
    expect(res.status).toBe(400);
	});

	it('should return 200 if valid token is provided', async() => {
    console.log('token !!!!!', token);
		const res = await request(server).post('/api/games').set('x-auth-token', token).send(game);
    expect(res.status).toBe(200);
	});


});
