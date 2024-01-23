import { useEffect, useState } from "react";

const StarRatingInput = ({ stars, onChange }) => {

  const [activeRating, setActiveRating] = useState(stars)

  useEffect(() => {
    setActiveRating(stars)
  }, [stars])

  return (
    <>
      <div className="rating-input">
        {[1, 2, 3, 4, 5].map((starOrder) => (
          <div
            key={starOrder}
            className={activeRating >= starOrder ? "filled" : "empty"}
            onMouseEnter={() => setActiveRating(starOrder)}
            onMouseLeave={() => setActiveRating(activeRating)}
            onClick={() => onChange(starOrder)}
          >
            <i className="fa fa-star"></i>
          </div>
        ))}Stars
      </div>
    </>
  )
}

export default StarRatingInput;
