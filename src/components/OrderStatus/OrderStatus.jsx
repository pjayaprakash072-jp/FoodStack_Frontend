
const steps = [
    "placed",
    "confirmed",
    "preparing",
    "ready",
    "out_for_delivery",
    "delivered"
]

const OrderStatus = ({status="ready"}) => {
    const current = Math.max(0,
        steps.findIndex((s)=>s.toLowerCase() === String(status).toLocaleLowerCase())
    )
  return (
    <div className="status-steps">
        {
            steps.map(
                (step,index)=>(
                    <div
                    className={index <= current ? "status-step active":"status-step"}
                    key={step}
                    >
                        <span>{index+1}</span>
                        <small>{step}</small>
                    </div>
                )
            )
        }
    </div>
  )
}

export default OrderStatus