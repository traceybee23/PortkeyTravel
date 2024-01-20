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
        <div className="createNewSpotContainer">
          <li>
            {sessionUser &&
              <NavLink to='/spots/new' style={{textDecoration: "none", color: "rgb(2, 114, 179)", fontWeight: '600'}}>Create a new Spot</NavLink>
            }
          </li>
          <li className="profileButton">
            <ProfileButton user={sessionUser} />
          </li>
        </div>
      )}
    </ul>
  )
}

export default Navigation;
