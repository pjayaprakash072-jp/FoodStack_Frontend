
const steps = [
    "placed",
    "confirmed",
    "preparing",
    "ready",
    "out_for_delivery",
    "delivered"
]

const OrderStatus = ({status="placed",updateStatus,statusUpdating}) => {
    const current = Math.max(0,
        steps.findIndex((s)=>s.toLowerCase() === String(status).toLocaleLowerCase())
    )
    
  return (
    <div className="status-steps">
        {
            steps.map(
                (step,index)=>{
                    const completed = index <current;
                    const currentStep = index === current;
                    const nextStep = index === current +1;
                    const clickable = nextStep && !statusUpdating;
                    return(
                        <div
                        type="button"
                        disabled={!clickable}
                        onClick={()=>{
                                if(clickable){
                                    updateStatus(step)
                                }
                            }
                        }
                        className={`
                            status-step ${completed || currentStep ? "active":""}
                                        ${clickable ?"cursor-pointer":"cursor-not-allowed"}
                            `}
                        key={step}
                        >
                            <span>{index+1}</span>
                            <small>{step.replaceAll("_"," ")}</small>
                        </div>
                    )
                }
            )
        }
    </div>
  )
}

export default OrderStatus