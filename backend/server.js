require('dotenv').config();
const express = require('express');
const server = express();
const cors = require('cors');
require('./config/dbConnect').connectDB();
const User = require('./Models/user');
const Todo = require('./Models/todo');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('./Middlewares/auth');

const { PORT } = process.env;

server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(cors());

server.post('/', auth, async (req, res) => {
	try {
		const { email } = req.user;
		if (!email) {
			return res
				.status(401)
				.json({ message: 'No email found!', success: false });
		}
		const user = await User.findOne({ email });
		user.password = undefined;
		res.status(200).json({ user, success: true });
	} catch (error) {
		console.error(error.message);
		return res.status(401).json({ message: error.message, success: false });
	}
});

server.post('/register', async (req, res) => {
	try {
		const { firstname, lastname, email, password } = req.body;
		if (!(firstname && lastname && email && password))
			return res
				.status(401)
				.json({ message: 'All fields are required!', success: false });

		const existing = await User.findOne({ email });
		if (existing) {
			return res
				.status(401)
				.json({ message: 'User already exists', success: false });
		}

		const encryptedPassword = await bcrypt.hash(password, 10);

		const user = await User.create({
			firstname,
			lastname,
			email,
			password: encryptedPassword,
		});

		const secret = process.env.JWT_SECRET;

		const token = jwt.sign(
			{
				id: user._id,
				email,
			},
			secret,
			{
				expiresIn: '1h',
			}
		);
		// user.token = token;
		user.password = undefined;
		return res.status(200).json({ user, token, success: true });
	} catch (err) {
		console.error(err.message);
	}
});

server.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!(email && password))
			res
				.status(401)
				.json({ message: 'Email and Password are required!', success: false });

		const user = await User.find({ email });

		if (user.length) {
			bcrypt.compare(password, user[0].password).then((valid) => {
				if (valid) {
					const secret = process.env.JWT_SECRET;
					const token = jwt.sign(
						{
							id: user[0]._id,
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

					return res
						.status(200)
						.cookie('token', token, options)
						.json({ user, success: true, token });
				} else {
					return res
						.status(401)
						.json({ message: 'Password does not match!', success: false });
				}
			});
		} else {
			return res
				.status(401)
				.json({ message: 'User not found!', success: false });
		}
	} catch (error) {
		console.error(error.message);
		return res.status(401).json(error.message);
	}
});

server.post('/getTodos', auth, async (req, res) => {
	try {
		const user = req.user.id;
		const todos = await Todo.find({ user });
		return res.status(200).json(todos);
	} catch (error) {
		return res.status(400).json(error.message);
	}
});

server.post('/addTodo', auth, async (req, res) => {
	try {
		const user = req.user.id;
		const { title, tasks } = req.body;
		if (!(title && tasks?.length))
			return res
				.status(400)
				.json({ message: 'Title and tasks are required!', success: false });
		const todos = await Todo.create({
			user,
			title,
			tasks,
		});
		return res.status(200).json({ todos, success: true });
	} catch (error) {
		return res.status(400).json(error.message);
	}
});

server.post('/updateTodo', auth, async (req, res) => {
	try {
		const { id, title, tasks } = req.body;
		if (!(id && (title || tasks?.length)))
			return res
				.status(400)
				.json({ message: 'Required info not found!', success: false });
		const todos = await Todo.findByIdAndUpdate(id, {
			title,
			tasks,
		});
		return res
			.status(200)
			.json({ message: `${todos._id} updated successfully`, success: true });
	} catch (error) {
		return res.status(400).json({ message: error.message, success: false });
	}
});

server.post('/deleteTodo', auth, async (req, res) => {
	try {
		const { id } = req.body;
		if (!id)
			return res.status(400).json({ message: 'Id required!', success: false });
		const todos = await Todo.findByIdAndDelete(id);
		if (todos._id)
			return res
				.status(200)
				.json({ message: `${todos._id} deleted successfully`, success: true });
	} catch (error) {
		return res.status(400).json({ message: error.message, success: false });
	}
});

server.post('/search', auth, async (req, res) => {
	try {
		const user = req.user.id;
		const title = new RegExp(req.body.search, 'i');
		const todos = await Todo.find({ user }).find({ title });
		return res.status(200).json({ todos, success: true });
	} catch (error) {
		return res.status(400).json({ message: error.message, success: false });
	}
});

server.listen(PORT, () => {
	console.log(`Listening at http://localhost:${PORT}`);
});
