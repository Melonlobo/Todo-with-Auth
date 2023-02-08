import React from 'react';
import Modal from 'react-modal';
import './addTodo.css';

const customStyles = {
	content: {
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
	},
};

Modal.setAppElement('#root');

function AddTodo({ getTodos }) {
	let subtitle;
	const [modalIsOpen, setIsOpen] = React.useState(false);
	const newTask = React.useRef();
	const resetCheckBox = React.useRef();
	const [taskList, setTaskList] = React.useState([]);
	const [title, setTitle] = React.useState('');
	const [task, setTask] = React.useState('');
	const [isImportant, setIsImportant] = React.useState(false);

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

	function deleteTask(e, key) {
		e.preventDefault();
		const newTaskList = JSON.parse(JSON.stringify(taskList));
		newTaskList.splice(key, 1);
		setTaskList(newTaskList);
	}

	function addTodo(e) {
		e.preventDefault();
		try {
			if (!title || taskList.length < 1) return;
			fetch('http://localhost:8000/addTodo', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					title,
					tasks: taskList,
					token: window.localStorage.getItem('token'),
				}),
			})
				.then((res) => res.json())
				.then((data) => {
					if (data.success) {
						getTodos();
						e.target.reset();
						setIsImportant(false);
						setTaskList([]);
					}
				})
				.catch((err) => console.error(err.message));
		} catch (error) {
			console.log(error.message);
		}
	}

	return (
		<div>
			<button className='add-todo' onClick={openModal}>
				ADD TODO
			</button>
			<Modal
				isOpen={modalIsOpen}
				onAfterOpen={afterOpenModal}
				onRequestClose={closeModal}
				style={customStyles}
				contentLabel='Add Todo'>
				<div className='new-todo'>
					<h2 ref={(_subtitle) => (subtitle = _subtitle)}>New Todo</h2>
					<button onClick={closeModal}>close</button>
				</div>
				<form onSubmit={addTodo}>
					<label htmlFor='title'>Title:</label>
					<input
						type='text'
						name='title'
						id='title'
						onChange={(e) => setTitle(e.target.value.trim())}
						required
					/>
					<div className='task-list'>
						{taskList?.length
							? taskList.map((task, key) => {
									return (
										<div key={key}>
											<span>{task.task}</span>
											<span>{task.isImportant ? 'Important!' : ''}</span>
											<button onClick={(e) => deleteTask(e, key)}>X</button>
										</div>
									);
							  })
							: ''}
					</div>
					<div className='tasks'>
						<div>
							<label htmlFor='task'>Task:</label>
							<input
								type='text'
								name='task'
								id='task'
								ref={newTask}
								onChange={(e) => setTask(e.target.value.trim())}
							/>
							<label htmlFor='task'>Important:</label>
							<input
								type='checkbox'
								name='important'
								id='important'
								ref={resetCheckBox}
								onChange={(e) => {
									setIsImportant(e.target.checked ? true : false);
								}}
							/>
							<button onClick={addTask}>+</button>
						</div>
					</div>
					<input type='submit' value='ADD TODO' />
				</form>
			</Modal>
		</div>
	);
}

export default AddTodo;
