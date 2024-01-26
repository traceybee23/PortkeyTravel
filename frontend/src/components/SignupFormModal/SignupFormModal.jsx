import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal'
import * as sessionActions from '../../store/session';
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    if (password === confirmPassword) {
      dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password
        })
      )
      .then(() => {
        closeModal
      })
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors)
        }
      });
    }
    // return setErrors({
    //   confirmPassword: "Confirm Password field must be the same as the Password field"
    // });
  };

  useEffect(() => {
    let errObj = {}
    if(password.length < 6) {
      errObj.password = "Password must be more than 6 characters"
    }
    if(password !== confirmPassword) errObj.confirmPassword = "Confirm Password field must be the same as the Password field"

    setErrors(errObj)
  }, [password, confirmPassword])



  return (
    <div className='inputForm'>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        {errors.email && <span className='errors'>{errors.email}</span>}
        {errors.username && <span className='errors'>{errors.username}</span>}
        {errors.firstName && <span className='errors'>{errors.firstName}</span>}
        {errors.lastName && <span className='errors'>{errors.lastName}</span>}
        {errors.password && <span className='errors'>{errors.password}</span>}
        {errors.confirmPassword && <span className='errors'>{errors.confirmPassword}</span>}
          <label>Email</label>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Username</label>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label>First Name</label>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <label>Last Name</label>
          <input
            type="text"
            value={lastName}
            placeholder="Last Name"
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        <div className='submitButton'>
          <button type="submit"
          disabled={!email || !password || !username || !firstName || !lastName || !!Object.values(errors).length}>Sign Up</button>
        </div>
      </form>
    </div>
  );
}

export default SignupFormModal;
