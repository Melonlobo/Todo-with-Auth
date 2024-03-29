import React, { useState, useEffect } from 'react';
import './dashboard.css';
import AddTodo from './AddTodo';
import EditTodo from './EditTodo';

const Dashboard = () => {
	const [todos, setTodos] = useState([]);
	const [search, setSearch] = useState('');
	const [show, setShow] = useState(false);
	const [id, setId] = useState('');

	const display = (id) => {
		setId(id);
		setShow((prevState) => !prevState);
	};

	const getTodos = () => {
		fetch('http://localhost:8000/getTodos', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				token: window.localStorage.getItem('token'),
			}),
		})
			.then((res) => res.json())
			.then((data) => setTodos(data));
	};

	const deleteTodo = async (e, id) => {
		e.stopPropagation();
		try {
			await fetch('http://localhost:8000/deleteTodo', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					token: window.localStorage.getItem('token'),
					id: id,
				}),
			})
				.then((res) => res.json())
				.then((data) => {
					if (data.success) getTodos();
				});
		} catch (error) {
			console.log(error.message);
		}
	};

	const getSearches = (e) => {
		e.preventDefault();
		fetch('http://localhost:8000/search', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				token: window.localStorage.getItem('token'),
				search,
			}),
		})
			.then((res) => res.json())
			.then((data) => console.log(data));
	};

	useEffect(() => {
		getTodos();
	}, []);

	return (
		<div className='dashboard'>
			<div className='head'>
			<h1 className='main-title'>MY TODO LIST</h1>
			<button className='logout' onClick={e => {
				localStorage.removeItem('token');
				location.replace('login');
			}}>LOGOUT</button>
			</div>
			<div className='add-search'>
				<AddTodo getTodos={getTodos} />
				<form onSubmit={getSearches} className='search-form'>
					<input
						type='text'
						placeholder='Search your todo here...'
						required
						onChange={(e) => setSearch(e.target.value)}
					/>
					<input type='submit' value='Search' />
				</form>
			</div>
			{todos.map((todo) => {
				return (
					<div className='todo' key={todo._id}>
						<div className='todo-head' onClick={() => display(todo._id)}>
							<h3>{todo.title}</h3>
							<div className='button-group'>
								<EditTodo todo={todo} getTodos={getTodos} />
								<button className='delete' onClick={(e) => deleteTodo(e, todo._id)}>DELETE</button>
							</div>
						</div>
						<div className={show && todo._id === id ? '' : 'hidden'}>
							{todo.tasks.map((task, index) => {
								return (
									<div className='task' key={index}>
										<span>
											{index + 1}. {task.task}
										</span>
										<span>{task.isImportant && 'IMPORTANT!'}</span>
										<span>
											STATUS: {task.isCompleted ? 'Completed' : 'Pending'}
										</span>
									</div>
								);
							})}
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default Dashboard;
