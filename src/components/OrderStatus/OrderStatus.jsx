
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
        <div className="status-container">
        {steps.map((step, index) => {
            const completed = index < current;
            const currentStep = index === current;
            const nextStep = index === current + 1;

            const clickable = nextStep && !statusUpdating;

            return (
            <button
                type="button"
                disabled={!clickable}
                onClick={() => {
                if (clickable) {
                    updateStatus(step);
                }
                }}
                className={`status-step ${
                completed || currentStep ? "status-step-active" : ""
                } ${clickable ? "status-step-clickable" : ""}`}
                key={step}
            >
                <span>{index + 1}</span>
                <small>{step.replaceAll("_", " ")}</small>
            </button>
            );
        })}
        </div>
  )
}

export default OrderStatus