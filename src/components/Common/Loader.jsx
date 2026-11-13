
const Loader = ({text = "Loading..."}) => {
  return (
    <div className="loader">
        <div className="spinner"/>
        <span>{text}</span>
        
    </div>
  )
}

export default Loader