import { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { Link } from 'react-router-dom'

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep click from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu])

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button className='menu' onClick={toggleMenu}>
        <i className="fa-solid fa-bars" />&nbsp;
        <i className="fas fa-user-circle fa-xl" />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <div>
            <li>Hello, {user.firstName}.</li>
            <li>{user.email}</li>
            <li>
              <Link to={`/spots/current`}
              className='menuBorders'
              style={{ fontWeight: "600", color: "rgb(2, 114, 179)", textDecoration: "none" }}
              onClick={closeMenu}
              >Manage Spots</Link>
            </li>
            <li>
              <Link
              to={`/reviews/current`}
              style={{ fontWeight: "600", color: "rgb(2, 114, 179)", textDecoration: "none" }}
              onClick={closeMenu}
              >Manage Reviews</Link>
            </li>
            <li className='menuBorders'>
              <button className="logout" onClick={logout}>Log Out</button>
            </li>
          </div>
        ) : (
          <>
            <li>
              <OpenModalMenuItem
                itemText="Log In"
                onItemClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
            </li>
            <li>
              <OpenModalMenuItem
                itemText="Sign Up"
                onItemClick={closeMenu}
                modalComponent={<SignupFormModal />}
              />
            </li>
          </>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
