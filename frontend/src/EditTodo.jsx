import React, { useState, useRef } from 'react';
import Modal from 'react-modal';
import './editTodo.css';

const customStyles = {
	content: {
		padding: '0',
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
	},
};

Modal.setAppElement('#root');

function EditTodo({ todo, getTodos }) {
	let subtitle;
	const [modalIsOpen, setIsOpen] = useState(false);
	const [title, setTitle] = useState(todo.title);
	const [taskList, setTaskList] = useState(todo.tasks);
	const [task, setTask] = useState('');
	const newTask = useRef();
	const resetCheckBox = useRef();
	const [isImportant, setIsImportant] = useState(false);

	function openModal() {
		setIsOpen(true);
	}

	function afterOpenModal() {
		subtitle.style.color = '#f00';
	}

	function closeModal() {
		setIsOpen(false);
	}

	function addTask(e) {
		e.preventDefault();
		if (!task) return;
		setTaskList((prevList) => [...prevList, { task, isImportant }]);
		setTask('');
		newTask.current.value = '';
		setIsImportant(false);
		resetCheckBox.current.checked = false;
	}

	function editTask(task, key, isImportant, isCompleted, _id) {
		const newTaskList = JSON.parse(JSON.stringify(taskList));
		newTaskList.splice(key, 1, { task, isImportant, isCompleted, _id });
		setTaskList(newTaskList);
	}

	function deleteTask(e, key) {
		e.preventDefault();
		const newTaskList = JSON.parse(JSON.stringify(taskList));
		newTaskList.splice(key, 1);
		setTaskList(newTaskList);
	}

	function editTodo(e) {
		e.preventDefault();
		try {
			if (!title || taskList.length < 1) return;
			fetch('http://localhost:8000/updateTodo', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					id: todo._id,
					title,
					tasks: taskList,
					token: window.localStorage.getItem('token'),
				}),
			})
				.then((res) => res.json())
				.then((data) => {
					if (data.success) {
						getTodos();
						setIsOpen(false);
					}
				})
				.catch((err) => console.error(err.message));
		} catch (error) {
			console.error(error.message);
		}
	}

	return (
		<div>
			<button className='edit' onClick={openModal}>
				EDIT
			</button>
			<Modal
				isOpen={modalIsOpen}
				onAfterOpen={afterOpenModal}
				onRequestClose={closeModal}
				style={customStyles}
				contentLabel='Edit Todo'>
				<div className='modal' onClick={(e) => e.stopPropagation()}>
					<div className='edit-todo'>
						<h2 ref={(_subtitle) => (subtitle = _subtitle)}>Edit Todo</h2>
						<button className='close' onClick={closeModal}>
							CLOSE
						</button>
					</div>
					<form onSubmit={editTodo}>
						<label htmlFor='title'>Title:</label>
						<input
							type='text'
							name='title'
							id='title'
							defaultValue={title}
							onChange={(e) => setTitle(e.target.value)}
							required
						/>
						<div className='task-list'>
							{taskList?.length
								? taskList.map((task, key) => {
										return (
											<div className='tasks' key={key}>
												<div>
													<label htmlFor={'task' + key}>Task {key + 1}:</label>
													<input
														id={'task' + key}
														type='text'
														defaultValue={task.task}
														onBlur={(e) => {
															editTask(
																e.target.value,
																key,
																task.isImportant,
																task.isCompleted,
																task._id
															);
														}}
													/>
												</div>
												<div>
													<label htmlFor={'isImportant' + key}>
														Important:
													</label>
													<input
														type='checkbox'
														id={'isImportant' + key}
														defaultChecked={task.isImportant}
														onChange={(e) => {
															editTask(
																task.task,
																key,
																e.target.checked,
																task.isCompleted,
																task._id
															);
														}}
													/>
												</div>
												<div>
													<label htmlFor={'isCompleted' + key}>
														Completed:
													</label>
													<input
														type='checkbox'
														id={'isCompleted' + key}
														defaultChecked={task.isCompleted}
														onChange={(e) =>
															editTask(
																task.task,
																key,
																task.isImportant,
																e.target.checked,
																task._id
															)
														}
													/>
												</div>
												<button
													className='close'
													onClick={(e) => deleteTask(e, key)}>
													X
												</button>
											</div>
										);
								  })
								: ''}
						</div>
						<div className='add-task'>
							<div>
								<label htmlFor='task'>Add Task:</label>
								<input
									ref={newTask}
									type='text'
									name='task'
									id='task'
									onBlur={(e) => setTask(e.target.value.trim())}
								/>
							</div>
							<div>
								<label htmlFor='important'>Important:</label>
								<input
									ref={resetCheckBox}
									type='checkbox'
									name='important'
									id='important'
									onChange={(e) => {
										setIsImportant(e.target.checked);
									}}
								/>
							</div>
							<button className='add-btn' onClick={(e) => addTask(e)}>
								ADD
							</button>
						</div>
						<input className='save' type='submit' value='SAVE' />
					</form>
				</div>
			</Modal>
		</div>
	);
}

export default EditTodo;
