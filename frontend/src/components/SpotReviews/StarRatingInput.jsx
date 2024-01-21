const StarRatingInput = ({ stars, onChange }) => {
  return (
    <input
    type="number"
    onChange={onChange}
    value={stars}
    />
  )
}

export default StarRatingInput;
