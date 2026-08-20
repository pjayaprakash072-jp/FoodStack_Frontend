const Dashboard = () => {
    const clear = ()=> localStorage.clear();
    return (
        <div>
            <button onClick={
                clear
            }>clear</button>
            <h1>Vendor Dashboard</h1>
            <p>Welcome to your dashboard.</p>
        </div>
    );
};

export default Dashboard;