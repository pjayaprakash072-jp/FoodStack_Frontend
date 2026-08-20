
const StatCard = ({label,value,hint,icon:Icon}) => {
  return (
    <div className="stat-card">
        <div>
            <p>
                {label}
            </p>
            <h2>
                {value}
            </h2>
            {
                hint && <small> {hint}</small>
            }
        </div>
        {Icon && (
            <div className="stat-icon">
                <Icon size={21}/>
            </div>
        )}
    </div>
  )
}

export default StatCard