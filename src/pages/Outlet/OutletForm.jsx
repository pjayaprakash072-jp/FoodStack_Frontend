import { useNavigate } from "react-router-dom"

const  FormPage = ({form,change,outletNext,busy,id,sendData,isManagerAuthenticated})=>{
    const navigate = useNavigate();
    return(       
        <form
        className="form-container"
        onSubmit={id ? sendData : outletNext}
        >
        <div className="form-grid">
            <label className="form-field">
            Outlet Name

            <input
                className="form-input"
                type="text"
                name="outletName"
                required
                disabled={isManagerAuthenticated}
                value={form.outletName}
                onChange={change}
            />
            </label>

            <label className="form-field">
                <div>
                    Cuisine
                    <span className="field-hint">
                        {" ( Comma separated )"}
                    </span>

                </div>

            <input
                className="form-input"
                type="text"
                name="cuisine"
                value={form.cuisine}
                onChange={change}
                placeholder="Indian, Chinese, Italian"
            />
            </label>
            <label className="form-field form-full-width">
            Description

            <textarea
                className="form-input"
                name="description"
                rows={3}
                value={form.description || ""}
                onChange={change}
                placeholder="Describe your outlet"
            />
            </label>


            <label className="form-field">
            Food Type

            <select
                className="form-select"
                name="foodType"
                value={form.foodType}
                onChange={change}
            >
                <option value="veg">Veg</option>
                <option value="non-veg">Non-Veg</option>
                <option value="both">Both</option>
            </select>
            </label>

            <label className="form-field">
            Opening Time

            <input
                className="form-input"
                type="time"
                name="openingTime"
                required
                value={form.openingTime}
                onChange={change}
            />
            </label>

            <label className="form-field">
            Closing Time

            <input
                className="form-input"
                type="time"
                name="closingTime"
                required
                value={form.closingTime}
                onChange={change}
            />
            </label>

            <label className="form-field">
            Status

            <select
                className="form-select"
                name="status"
                value={form.status}
                onChange={change}
            >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
            </select>
            </label>

                {!isManagerAuthenticated && (
                <label className="form-field ">
                    Outlet Image
    
                    <input
                    className="form-input"
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={change}
                    />
                </label>
                )}
            <label className="form-checkbox">
            <input
                type="checkbox"
                name="isOpen"
                checked={Boolean(form.isOpen)}
                onChange={change}
            />
            Currently Open
            </label>

        </div>

        <div className="form-actions outlet-form-actions">
            <button
            type="button"
            className="secondary-button"
            onClick={() => navigate(-1)}
            >
            Cancel
            </button>

            <button
            className="primary-button"
            type="submit"
            disabled={busy}
            >
            {busy
                ? "Saving..."
                : id
                ? "Update Outlet"
                : "Next"}
            </button>
        </div>
        </form>
    )
}
export default FormPage