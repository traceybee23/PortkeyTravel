import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal'
import './LoginForm.css';
import DemoUser from './DemoUser';

function LoginFormModal() {
  const dispatch = useDispatch();

  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(
        async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors)
          }
        });
  };

  return (
    <div className='inputForm'>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username or Email
          <div className='inputBox'>
            <input
              type="text"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              required
            />
          </div>
        </label>
        <label>
          Password
          <div className='inputBox'>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </label>
        {errors.credential && <span className='errors'>{errors.credential}</span>}
        <div className="login">
          <button
          className='loginButtonModal'
          type="submit"
          disabled={credential.length < 4}
          >Log In</button>
        </div>
      </form>
        <DemoUser/>
    </div>
  );
}

export default LoginFormModal;
