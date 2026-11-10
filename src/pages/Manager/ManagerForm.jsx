
function ManagerPage({managerForm,managerchange,sendData,outletNext}){
    return (
    <div className="page-container">
        <header className="content-header">
        <div>
            <p className="content-eyebrow">Outlet Management</p>
            <h1 className="content-title">Create Manager</h1>
            <p className="content-description">
            Add a manager to manage this outlet.
            </p>
        </div>
        </header>

        <div className="content-body">
        <form className="form-container form-grid" onSubmit={sendData}>
            <label className="form-field">
            Name
            <input
                className="form-input"
                type="text"
                name="name"
                required
                value={managerForm.name}
                onChange={managerchange}
                placeholder="Manager Name"
            />
            </label>

            <label className="form-field">
            Email
            <input
                className="form-input"
                type="email"
                name="email"
                required
                value={managerForm.email}
                onChange={managerchange}
                placeholder="Manager Email"
            />
            </label>

            <label className="form-field">
            Phone
            <input
                className="form-input"
                type="tel"
                name="phone"
                required
                value={managerForm.phone}
                onChange={managerchange}
                placeholder="Contact Number"
            />
            </label>

            <label className="form-field">
            Password
            <input
                className="form-input"
                type="password"
                name="password"
                required
                value={managerForm.password}
                onChange={managerchange}
                placeholder="Password"
            />
            </label>

            <div className="form-actions form-full-width">
            <button
                className="secondary-button"
                type="button"
                onClick={outletNext}
            >
                Back
            </button>

            <button className="primary-button" type="submit">
                Create Outlet
            </button>
            </div>
        </form>
        </div>
    </div>
    )
}
export default ManagerPage;