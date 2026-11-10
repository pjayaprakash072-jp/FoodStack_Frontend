
const StatCard = ({label,value,hint,icon:Icon}) => {
  return (
    <div className="statistics-card">
    <div className="statistics-content">
        <p>{label}</p>
        <h2>{value}</h2>

        {hint && <small>{hint}</small>}
    </div>

    {Icon && (
        <div className="statistics-icon">
        <Icon size={21} />
        </div>
    )}
    </div>
  )
}

export default StatCard