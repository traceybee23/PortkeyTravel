import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import mainLogo from '../../../public/boot.png'
import './Navigation.css'

function Navigation({ isLoaded }) {

  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul id="header">
      <li>
        <NavLink className='logo' to="/"><img src={mainLogo} style={{height: "77px", width: "77px"}}/><span>Portkey<span>Travel</span></span></NavLink>
      </li>
      {isLoaded && (
        <div className="createNewSpotContainer">
          <li>
            {sessionUser &&
              <NavLink to='/spots/new'className="createSpotLink" >Create a new Spot</NavLink>
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
