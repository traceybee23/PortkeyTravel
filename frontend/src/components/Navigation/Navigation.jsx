import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import './Navigation.css'

function Navigation({ isLoaded }) {

  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul id="header">
      <li>
        <NavLink className='logo' to="/"><i className="fa-solid fa-dragon fa-3x" />LairBnB</NavLink>
      </li>
      {isLoaded && (
        <>
          <li>
            {sessionUser &&
              <NavLink to='/spots/new'>Create a new Spot</NavLink>
            }
          </li>
          <li className="profileButton">
            <ProfileButton user={sessionUser} />
          </li>
        </>
      )}
    </ul>
  )
}

export default Navigation;
