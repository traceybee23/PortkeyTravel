import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import './Navigation.css'

function Navigation({ isLoaded }) {

  const sessionUser = useSelector(state => state.session.user);


  return (
    <ul id="header">
      <li>
        <NavLink to="/"><i className="fa-solid fa-dragon fa-3x"/></NavLink>
      </li>
      {isLoaded && (
        <li className="profileButton">
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
  )
}

export default Navigation;
