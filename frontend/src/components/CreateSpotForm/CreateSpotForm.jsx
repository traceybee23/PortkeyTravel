import { useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { createSpot, createSpotImage } from "../../store/spots";
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
  const [url, setUrl] = useState('')
  const [img1, setImg1] = useState('')
  const [img2, setImg2] = useState('')
  const [img3, setImg3] = useState('')
  const [img4, setImg4] = useState('')
  const [errors, setErrors] = useState({});


  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({})

    const newSpot = {
      country,
      address,
      city,
      state,
      lat,
      lng,
      description,
      name,
      price
    }
    const imageInfo = {
      url,
      img1,
      img2,
      img3,
      img4
    }

    dispatch(createSpot(newSpot))
      .then((spot) => {
        console.log(spot)
        const imageArr = Object.values(imageInfo)
        let spotImg;
        imageArr.map(img => {
          spotImg = {
            id: spot.id,
            url: img,
            preview: true
          }
          return dispatch(createSpotImage(spot.id, spotImg))
        })
      })
      .then(reset())
      .catch(async (response) => {
        const data = await response.json();
        if (data && data.errors) {
          setErrors(data.errors)
        }
      })
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
    setUrl('')
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
          <label>Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
            name="address"
          />
          {errors.address && <span className="errors">{errors.address}</span>}
          <label>City</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
            name="city"
          />
          {errors.city && <span className="errors">{errors.city}</span>}
          <label>State</label>
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="State"
            name="state"
          />
          {errors.state && <span className="errors">{errors.state}</span>}
          <label>Latitude</label>
          <input
            type="text"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            placeholder="Latitude"
            name="lat"
          />
          {errors.lat && <span className="errors">{errors.lat}</span>}
          <label>Longitude</label>
          <input
            type="text"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            placeholder="Longitude"
            name="lng"
          />
          {errors.lng && <span className="errors">{errors.lng}</span>}
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            name="description"
          />
          {errors.description && <span className="errors">{errors.description}</span>}
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name of your spot"
            name="name"
          />
          {errors.name && <span className="errors">{errors.name}</span>}
          <label>Price</label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price per night (USD)"
            name="price"
          />
          {errors.price && <span className="errors">{errors.price}</span>}
          <label>PreviewImage</label>
          <input
            type="text"
            value={url}
            onChange={(e) => ({
              previewImage: true,
              url: setUrl(e.target.value)
            })
            }
            placeholder="Preview Image URL"
            name="previewImage"
          />
          {errors.previewImage && <span className="errors">{errors.previewImage}</span>}
          <label>Image</label>
          <input
            type="text"
            value={img1}
            onChange={(e) => ({
              previewImage: false,
              url: setImg1(e.target.value)
            })
            }
            placeholder="Image URL"
            name="image"
          />
          {errors.image && <span className="errors">{errors.image}</span>}
          <label>Image</label>
          <input
            type="text"
            value={img2}
            onChange={(e) => ({
              previewImage: false,
              url: setImg2(e.target.value)
            })
            }
            placeholder="Image URL"
            name="image"
          />
          <label>Image</label>
          <input
            type="text"
            value={img3}
            onChange={(e) => ({
              previewImage: false,
              url: setImg3(e.target.value)
            })
            }
            placeholder="Image URL"
            name="image"
          />
          <label>Image</label>
          <input
            type="text"
            value={img4}
            onChange={(e) => ({
              previewImage: false,
              url: setImg4(e.target.value)
            })
            }
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
