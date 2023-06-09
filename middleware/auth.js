const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
	const token = req.header('x-auth-token');
	if (!token || token === 'null') return res.status(401).send('Access denied. No token provided.');

	try {
		const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = decoded; // currently _id (and possibly isAdmin) is all that gets encrypted, so will get decoded to this.
    next();
	} catch (err) {
		res.status(400).send('Invalid token provided.');
	} 
}