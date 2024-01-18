import { useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { createSpot } from "../../store/spots";
import './CreateSpotForm.css'

const CreateSpotForm = () => {

  const dispatch = useDispatch();

  const sessionUser = useSelector(state => state.session.user);

  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [image1, setImage1] = useState('');
  const [image2, setImage2] = useState('');
  const [image3, setImage3] = useState('');
  const [image4, setImage4] = useState('');
  const [errors, setErrors] = useState({});


  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({})

    if(!lat.length) setErrors(errors.lat ='Latitude is required')

    const newSpot = {
      country,
      address,
      city,
      state,
      lat,
      lng,
      description,
      name,
      price,
      previewImage,
      image1,
      image2,
      image3,
      image4
    }
    return dispatch(createSpot(newSpot))
    .then(reset())
    .catch(
      async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors)
        }
      }
    )

  }

  const reset = () => {
    setCountry('');
    setAddress(''),
    setCity('');
    setState('');
    setLat('');
    setLng('');
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
          {errors.country && <span className="errors">{errors.country}</span>}
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
            name="address"
          />
          {errors.address && <span className="errors">{errors.address}</span>}
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
            name="city"
          />
          {errors.city && <span className="errors">{errors.city}</span>}
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="State"
            name="state"
          />
          {errors.state && <span className="errors">{errors.state}</span>}
          <input
            type="text"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            placeholder="Latitude"
            name="lat"
          />
          {errors.lat && <span className="errors">{errors.lat}</span>}
          <input
            type="text"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            placeholder="Longitude"
            name="lng"
          />
          {errors.lng && <span className="errors">{errors.lng}</span>}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            name="description"
          />
          {errors.description && <span className="errors">{errors.description}</span>}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name of your spot"
            name="name"
          />
          {errors.name && <span className="errors">{errors.name}</span>}
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price per night (USD)"
            name="price"
          />
          {errors.price && <span className="errors">{errors.price}</span>}
          <input
            type="src"
            value={previewImage}
            onChange={(e) => setPreviewImage(e.target.value)}
            placeholder="Preview Image URL"
            name="previewImage"
          />
          {errors.previewImage && <span className="errors">{errors.previewImage}</span>}
          <input
            type="src"
            value={image1}
            onChange={(e) => setImage1(e.target.value)}
            placeholder="Image URL"
            name="image1"
          />
          {errors.image && <span className="errors">{errors.image}</span>}
          <input
            type="src"
            value={image2}
            onChange={(e) => setImage2(e.target.value)}
            placeholder="Image URL"
            name="image"
          />
          {errors.image && <span className="errors">{errors.image}</span>}
          <input
            type="src"
            value={image3}
            onChange={(e) => setImage3(e.target.value)}
            placeholder="Image URL"
            name="image"
          />
          {errors.image && <span className="errors">{errors.image}</span>}
          <input
            type="src"
            value={image4}
            onChange={(e) => setImage4(e.target.value)}
            placeholder="Image URL"
            name="image"
          />
          {errors.image && <span className="errors">{errors.image}</span>}
          <button type="submit">Create Spot</button>
        </form>
      }
    </div>
  )
}

export default CreateSpotForm
