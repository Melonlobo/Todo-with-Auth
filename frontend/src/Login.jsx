import React from 'react';
import './login.scss';
import {useNavigate, Link} from 'react-router-dom';
import {useGlobalContext} from './contexts/AuthContext';

export const Login = () => {
  const {
    email,
    password,
    setEmail,
    setPassword,
    setSuccess,
  } = useGlobalContext ();
  const navigate = useNavigate ();
  const postLogin = e => {
    e.preventDefault ();
    if (!(email && password)) return;
    fetch ('http://localhost:8000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify ({email, password}),
    })
      .then (res => res.json ())
      .then (data => {
        setSuccess (data.success);
        if (data.success) {
          window.localStorage.setItem ('token', data.token);
          navigate ('/');
        }
      })
      .catch (err => console.error (err.message));
  };
  return (
    <main className="main">
      <div className="container">
        <section className="wrapper">
          <div className="heading">
            <h1 className="text text-large">Sign In</h1>
            <p className="text text-normal">
              New user?{' '}
              <span>
                <Link to="/register" className="text text-links">
                  Create an account
                </Link>
              </span>
            </p>
          </div>
          <form name="signin" className="form" onSubmit={postLogin}>
            <div className="input-control">
              <label htmlFor="email" className="input-label" hidden>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="input-field"
                placeholder="Email Address"
                onChange={e => setEmail (e.target.value)}
                required
              />
            </div>
            <div className="input-control">
              <label htmlFor="password" className="input-label" hidden>
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                className="input-field"
                placeholder="Password"
                onChange={e => setPassword (e.target.value)}
                required
              />
            </div>
            <div className="input-control">
              <a className="text text-links">
                Forgot Password
              </a>
              <input
                type="submit"
                name="submit"
                className="input-submit"
                value="Sign In"
              />
            </div>
          </form>
          <div className="striped">
            <span className="striped-line" />
            <span className="striped-text">Or</span>
            <span className="striped-line" />
          </div>
          <div className="method">
            <div className="method-control">
              <a href="#" className="method-action">
                <i className="ion ion-logo-google" />
                <span>Sign in with Google</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;
