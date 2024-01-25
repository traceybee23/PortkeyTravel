import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { createSpot, createSpotImage } from "../../store/spots";
import './CreateSpotForm.css'
import { useNavigate } from "react-router-dom";

const CreateSpotForm = () => {

  const dispatch = useDispatch();

  const navigate = useNavigate();

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
        const imageArr = Object.values(imageInfo)
        let spotImg;
        imageArr.map((img, index) => {
          if (index <= 0) {
            spotImg = {
              id: spot.id,
              url: img,
              preview: true
            }
          } else {
            spotImg = {
              id: spot.id,
              url: img,
              preview: false
            }
          }

          dispatch(createSpotImage(spot.id, spotImg))
          .then(navigate(`/spots/${spot.id}`))
        })
      })
      .catch(async (response) => {
        const data = await response.json();
        if (data && data.errors) {
          setErrors(data.errors)
        }
      })

  }

  useEffect(() => {
    let errObj = {}
    if(!country) errObj.country = ( "Country required")
    if(!address) errObj.address =  ("Address required")
    if(!city) errObj.city =  ("City required")
    if(!state) errObj.state =  ("State required")
    if(!lat) errObj.lat =  ("Latitude required")
    if(!lng) errObj.lng =  ("Longitude required")
    if(!description || description.length < 30) errObj.description =  ("Description must be 30 characters")
    if(!name) errObj.name =  ("Name required")
    if(!url) errObj.url = ("Image required")
    if(!price) errObj.price =  ("Price required")

    if(price && price <= 0) errObj.price = ("Price is required")

    if(lat && (lat > 90 || lat < -90)) errObj.lat = ("Latitude is not valid")
    if(lng && (lng > 180 || lng < -180)) errObj.lng = ("Longitude is not valid")

    const urlFormat = url.split('.').pop()
    if(url && (urlFormat !== "png" && urlFormat !== "jpg" && urlFormat !== "jpeg")) errObj.image = ("Image URL must end in .png, .jpg, or .jpeg")

    const urlFormat1 = img1.split('.').pop()
    if(img1 && (urlFormat1 !== "png" && urlFormat1 !== "jpg" && urlFormat1 !== "jpeg")) errObj.img1 = ("Image URL must end in .png, .jpg, or .jpeg")

    const urlFormat2 = img2.split('.').pop()
    if(img2 && (urlFormat2 !== "png" && urlFormat2 !== "jpg" && urlFormat2 !== "jpeg")) errObj.img2 = ("Image URL must end in .png, .jpg, or .jpeg")


    const urlFormat3 = img3.split('.').pop()
    if(img3 && (urlFormat3 !== "png" && urlFormat3 !== "jpg" && urlFormat3 !== "jpeg")) errObj.img3 = ("Image URL must end in .png, .jpg, or .jpeg")

    const urlFormat4 = img4.split('.').pop()
    if(img4 && (urlFormat4 !== "png" && urlFormat4 !== "jpg" && urlFormat4 !== "jpeg")) errObj.img4 = ("Image URL must end in .png, .jpg, or .jpeg")

    setErrors(errObj)

  }, [address, city, state, description, lat, lng, name, url, price, country, img1, img2, img3, img4])


  return (
    <div className="spotFormContainer">
      {sessionUser &&
        <form onSubmit={handleSubmit}>
          <div className="createLocation">
            <h2>Create a new Spot</h2>
            <h4>Where&apos;s your place located?</h4>
            <span style={{fontSize: "small", borderBottom: 0}}>Guests will only get your exact address once they booked a reservation</span>
            <span className="labels">Country{errors.country && <span className="errors">&nbsp;{errors.country}</span>}</span>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Country"
              name="country"
            />
            <span className="labels">Address{errors.address && <span className="errors">&nbsp;{errors.address}</span>}</span>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address"
              name="address"
            />
            <div className="cityState">
              <div>
                <span className="labels">City{errors.city && <span className="errors">&nbsp;{errors.city}</span>}</span>
                <input
                  className="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  name="city"
                />
                <>&nbsp;,&nbsp;</>
              </div>
              <div>
                <span className="labels">State{errors.state && <span className="errors">&nbsp;{errors.state}</span>}</span>
                <input
                  className="state"
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="State"
                  name="state"
                />
              </div>
            </div>
            <div className="latlngContainer">
              <div>
                <span className="labels">Latitude{errors.lat && <span className="errors">&nbsp;{errors.lat}</span>}</span>
                <input
                  className="lat"
                  type="text"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  placeholder="Latitude"
                  name="lat"
                />
              <>&nbsp;,&nbsp;</>
              </div>
              <div>
                <span className="labels">Longitude{errors.lng && <span className="errors">&nbsp;{errors.lng}</span>}</span>
                <input
                  className="lng"
                  type="text"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  placeholder="Longitude"
                  name="lng"
                />
              </div>
            </div>
          </div>
          <div className="placeDescription">
            <h4>Describe your place to guests</h4>
            <span style={{fontSize: "small"}}>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</span><br></br>
            <textarea
              className="textBox"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please write at least 30 characters"
              name="description"
              rows="6"
            />
            {errors.description && <span className="errors">{errors.description}</span>}
          </div>
          <div className="spotTitle">
            <h4>Create a title for your spot</h4>
            <span style={{fontSize: "small"}}>Catch guests&apos; attention with a spot title that highlights what makes your place special.</span><br></br>
            <input
              className="newName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name of your spot"
              name="name"
            />
            {errors.name && <span className="errors" >{errors.name}</span>}
          </div>
          <div className="spotPrice">
            <h4>Set a base price for your spot</h4>
            <span style={{fontSize: "small"}}>Competitive pricing can help your listing stand out and rank higher in search results.</span><br></br>
            $ <input style={{ marginBottom: "0", width: "94%", marginRight: "3px" }}
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price per night (USD)"
              name="price"
            />
            {errors.price && <span className="errors">{errors.price}</span>}
          </div>
          <div className="spotsPhotos">
            <h4>Liven up your spot with photos</h4>
            <span style={{fontSize: "small", marginBottom: "10px"}}>Submit a link to at least one photo to publish your spot.</span>
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
            {errors.url && <span className="errors">{errors.url}</span>}
            {errors.image && <span className="errors">{errors.image}</span>}
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
            {errors.img1 && <span className="errors">{errors.img1}</span>}
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
            {errors.img2 && <span className="errors">{errors.img2}</span>}
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
            {errors.img3 && <span className="errors">{errors.img3}</span>}
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
            {errors.img4 && <span className="errors">{errors.img4}</span>}
          </div>
          <button type="submit" disabled={!!Object.values(errors).length}>Create Spot</button>
        </form>
      }
    </div>
  )
}

export default CreateSpotForm
