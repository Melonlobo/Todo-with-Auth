exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!(email && password))
			res.status(401).send('Email and Password are required');

		const user = await User.find({ email });

		if (user && bcrypt.compare(password, user[0].password)) {
			const secret = process.env.JWT_SECRET;
			const token = jwt.sign(
				{
					id: user._id,
					email,
				},
				secret,
				{ expiresIn: '1h' }
			);

			const options = {
				expires: new Date(Date.now() + 1 * 60 * 60 * 1000),
				httpOnly: true,
			};

			user[0].password = undefined;

			res
				.status(200)
				.cookie('token', token, options)
				.json({ user, success: true, token });
		}
	} catch (error) {
		console.error(error.message);
	}
};
