
function ManagerPage({managerForm,managerchange,sendData,outletNext}){
    return (
        <>
            <h1>Manager</h1>
            <form className="panel form grid-2" onSubmit={sendData}>
                    <label>
                        name
                        <input type="text" 
                        name="name"
                        required
                        value={managerForm.name}
                        onChange={managerchange}
                        placeholder="Manager Name"
                        />
                    </label>
                    <label>
                        Email
                        <input type="email" 
                        name="email"
                        required
                        value={managerForm.email}
                        onChange={managerchange}
                        placeholder="Manager Email"
                        />
                    </label>
                    <label>
                        Phone
                        <input type="tel" 
                        name="phone"
                        required
                        value={managerForm.phone}
                        onChange={managerchange}
                        placeholder="contact Numver"
                        />
                    </label>
                    <label>
                        Password
                        <input type="password" 
                        name="password"
                        required
                        value={managerForm.password}
                        onChange={managerchange}
                        placeholder="password"
                        />
                    </label>
                    <div className="grid-span-2 form-actions">
                        <button className="button secondary" type="button" onClick={outletNext} >Back</button>
                        <button className="button secondary" type="submit">Create Outlet</button>
                    </div>
            </form>
        </>
    )
}
export default ManagerPage;