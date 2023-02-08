require('dotenv').config();
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
	// console.log(req.headers.cookie);
	// console.log(req.rawHeaders);
	// const { token } = req.cookies;
	let token;
	if (Object.keys(req.body).length === 0) {
		token = req.headers.cookie.slice(6);
	} else {
		token = req.body.token;
	}
	if (!token) {
		return res
			.status(403)
			.json({ message: 'Token is missing', success: false });
	}

	try {
		const decode = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decode;
		// console.log(decode);
		// console.log(req.user);
	} catch (error) {
		return res.status(403).json({ message: 'Token expired!', success: false });
	}
	next();
};

module.exports = auth;
