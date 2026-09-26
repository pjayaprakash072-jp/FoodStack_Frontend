
const  FormPage = ({form,change,outletNext,busy,id,sendData})=>{
    return(       
            <form className="panel form grid-2" onSubmit={id ?sendData :outletNext}>
                <label>
                    Outlet Name 
                    <input type="text" 
                    name="outletName"
                    required
                    value={form.outletName}
                    onChange={change}
                    />
                </label>
                <label className="grid-span-2">
                    Description
                    <input type="text" 
                    name="description"
                    value={form.description}
                    onChange={change}
                    />
                </label>
                <label>
                    Cuisine <span className="hint">(comma seperated)</span>
                    <input
                    name="cuisine"
                    value={form.cuisine}
                    onChange={change}
                    />
                </label>
                <label>
                    Food Type
                    <select 
                    name="foodType"
                    value={form.foodType}
                    onChange={change}
                    
                    >
                        <option value="veg">veg</option>
                        <option value="non-veg">non-veg</option>
                        <option value="both">both</option>

                    </select>
                </label>
                <label>
                    Opening Time 
                    <input 
                    type="time"
                    required
                    name="openingTime"
                    value={form.openingTime}
                    onChange={change}
                    />
                </label>
                <label>
                    Closing Time
                    <input
                    type="time"
                    required
                    name="closingTime"
                    value={form.closingTime}
                    onChange={change}
                    />
                </label>
                <label>
                    Status
                    <select 
                    name="status"
                    value={form.status}
                    onChange={change}
                    
                    >
                        <option value="Active">active</option>
                        <option value="Inactive">inactive</option>
                    </select>
                </label>
                <label className="check">
                    <input type="checkbox"
                    name="isOpen"
                    checked={form.isOpen}
                    onChange={change}
                    />{" "} Currently open
                </label>
                <label className="grid-span-2">
                    Outlet image
                    <input 
                    type="file"
                    name = "image"
                    accept="image/*"
                    capture="environment"
                    onChange={change}
                    />
                </label>
                <div className="grid-span-2 form-actions">
                    <button type="button" className="button secondary" onClick={()=>history.back()}>Cancel</button>
                    <button className="button secondary" type="submit"  disabled={busy}>{busy?"Saving...": id ? "Update Outlet":"Next"}</button>
                </div>
            </form>
    )
}
export default FormPage