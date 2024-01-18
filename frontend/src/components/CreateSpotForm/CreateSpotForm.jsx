import { useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { createSpot } from "../../store/spots";
// import * as sessionActions from '../../store/session'
import './CreateSpotForm.css'

const CreateSpotForm = () => {

  const dispatch = useDispatch();

  const sessionUser = useSelector(state => state.session.user);

  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [image1, setImage1] = useState('');
  const [image2, setImage2] = useState('');
  const [image3, setImage3] = useState('');
  const [image4, setImage4] = useState('');

  // useEffect(() => {
  //   dispatch(sessionActions.restoreUser())
  // },[dispatch])

  const handleSubmit = (e) => {
    e.preventDefault();
    const newSpot = {
      country,
      address,
      city,
      state,
      latitude,
      longitude,
      description,
      name,
      price,
      previewImage,
      image1,
      image2,
      image3,
      image4
    }
    dispatch(createSpot(newSpot));
    reset();
  }

  const reset = () => {
    setCountry('');
    setAddress(''),
    setCity('');
    setState('');
    setLatitude('');
    setLongitude('');
    setDescription('');
    setName('');
    setPrice('');
    setPreviewImage('');
    setImage1('');
    setImage2('');
    setImage3('');
    setImage4('');
  }

  return (
    <div className="spotFormContainer">
      {sessionUser &&
        <form onSubmit={handleSubmit}>
          <h1>Create a new Spot</h1>
          <span>Where&apos;s your place located?</span>
          <span>Guests will only get your exact address once they booked a reservation</span>
          <label>Country</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Country"
            name="country"
          />
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
            name="address"
          />
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
            name="city"
          />
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="State"
            name="state"
          />
          <input
            type="text"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            placeholder="Latitude"
            name="latitiude"
          />
          <input
            type="text"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            placeholder="Longitude"
            name="longitude"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please write at least 30 characters"
            name="description"
          />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name of your spot"
            name="name"
          />
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price per night (USD)"
            name="price"
          />
          <input
            type="src"
            value={previewImage}
            onChange={(e) => setPreviewImage(e.target.value)}
            placeholder="Preview Image URL"
            name="previewImage"
          />
          <input
            type="src"
            value={image1}
            onChange={(e) => setImage1(e.target.value)}
            placeholder="Image URL"
            name="image1"
          />
          <input
            type="src"
            value={image2}
            onChange={(e) => setImage2(e.target.value)}
            placeholder="Image URL"
            name="image"
          />
          <input
            type="src"
            value={image3}
            onChange={(e) => setImage3(e.target.value)}
            placeholder="Image URL"
            name="image"
          />
          <input
            type="src"
            value={image4}
            onChange={(e) => setImage4(e.target.value)}
            placeholder="Image URL"
            name="image"
          />
          <button type="submit">Create Spot</button>
        </form>
      }
    </div>
  )
}

export default CreateSpotForm
