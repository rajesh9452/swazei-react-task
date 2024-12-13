import React, { useState,useEffect } from "react";
import ApiBaseUrl from "../ApiBaseUrl";
import { useNavigate,Link } from "react-router-dom";
import { toast } from "react-toastify";
import './css/login_register_screen.css'; // Import the CSS file
const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        if (localStorage.getItem("token")) {
            navigate("/dashboard");
        }
   },[navigate]);
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await ApiBaseUrl.post("/login", { email, password });
            if (response.data.resCode == 1) {
                localStorage.setItem("token", response.data.token);
                toast.success("Login successful!");
                navigate("/dashboard");
              } else if (response.data.resCode == 0) {
                toast.error(response.data.message);
                navigate("/login");
              }
        } catch (error) {
            console.error("Login failed:", error.response.data);
            toast.error(error.response.data.message);
        }
    };

    return (
        <div className="container">
            <div className="card card-container">
            <img id="profile-img" className="profile-img-card" src="https://ssl.gstatic.com/accounts/ui/avatar_2x.png" />
                <form onSubmit={handleLogin} className="form-signin">
                    <input id="login" className="fadeIn second"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        id="password" className="fadeIn third"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit"  className="fadeIn fourth cardButton" >Login</button>
                </form>
                <div id="formFooter">
                    <Link to={"/register"}>Register New Account</Link>
                </div>
            </div>
        </div>
    );
};
export default Login;
