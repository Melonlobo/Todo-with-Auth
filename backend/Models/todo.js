const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			unique: false,
		},
		title: {
			type: String,
			required: [true, 'Title is required'],
			maxLength: [20, 'Maximum length of title is 20 charecters'],
		},
		tasks: {
			type: [
				{
					task: {
						type: String,
					},
					isImportant: {
						type: Boolean,
						default: false,
					},
					isCompleted: {
						type: Boolean,
						default: false,
					},
				},
			],
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Todo', todoSchema);
