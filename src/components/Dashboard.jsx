import React, { useEffect,useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import ApiBaseUrl from "../ApiBaseUrl";
import { toast } from "react-toastify";

const Dashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await ApiBaseUrl.post("/logout", {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            localStorage.removeItem("token");
            toast.success("Logged out successfully.");
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error.response.data);
        }
    };
    // Fetch products from the API
  const fetchOrders = async () => {
    setLoading(true);
    try {
        const response = await ApiBaseUrl.get("getUserOrders", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
      setOrders(response.data.orders);
    } catch (error) {
      console.error("Error fetching products:", error);
      console.log(error)
    } finally {
      setLoading(false);
    }
  };


    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/login");
        }else{
            fetchOrders();
        }
    }, [navigate]);
    const productTitleStyle = {'textAlign':'center'}
    const styleObject = {"width" : "100px"}
    return (
        <div className="container">
            <div class="topnav">
                <Link to={"/"}>Home</Link>
                <Link  class="active" to={"/login"}>Dashboard</Link>
                <button className="logOutBTN" onClick={handleLogout}>Logout</button>
            </div>
            <h2 style={productTitleStyle}>All Orders List</h2>
            {loading && <p>Loading...</p>}
            {!loading && orders.length === 0 && <p>No Orders found.</p>}
            <table class="table">
                    <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Product Image</th>
                        <th>Price</th>
                        <th>Payment Status</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map((item) => (
                            <tr key={item.id}>
                                <td>{item.items[0].product.name}</td>
                                <td><img src={item.items[0].product.imagesUrl} alt={item.items[0].product.name} style={styleObject}/></td>
                                <td>{item.total_amount}</td>
                                <td>{item.payment_status}</td>
                                <td>{item.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
        </div>
    );
};

export default Dashboard;
