const { User } = require('../../../models/user-model');
const auth = require('../../../middleware/auth');

describe('auth middleware', () => {
	it('should populate req.user with the payload of a valid jwt', () => {
    const user = new User();
		const token = user.generateAuthToken();

        // args
    const header = () => {
      return token;
    }
		const req = { header }; // req = jest.fn().mockReturnValue(token); works too
		const res = {}
    const callBack = () => req;

		auth(req, res, callBack);
    const userId = user._id.toString();
    const decodedId = callBack().user._id.toString();

		expect(userId).toBe(decodedId);
    console.log('user vs userId', user, user)
	});
});
