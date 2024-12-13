import React, { useState,useEffect } from "react";
import ApiBaseUrl from "../ApiBaseUrl";
import { useNavigate,Link } from "react-router-dom";
import { toast } from "react-toastify";
const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });
    const [errorMessage,setErrorMessage] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        if (localStorage.getItem("token")) {
            navigate("/dashboard");
        }
   },[navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await ApiBaseUrl.post("/register", formData);
            if(response.data.resCode == 1){
                localStorage.setItem("token", response.data.token);
                toast.success("Login successful!");
                navigate("/dashboard");
            }else{
                toast.error(response.data.message);
                navigate("/register");
            }
        } catch (error) {
            console.error("Registration failed:", error.response.data);
            if(error.response.data.resCode == 3){
                setErrorMessage(error.response.data.errors);
            }else{
                setErrorMessage([]);  
            }
        }
    };

    return (
        <div className="container">
            <div className="card card-container">
            <h2>Create Account</h2>
            {
                errorMessage.map((error)=>(
                    <p className="errorMessage">{error}</p>
                ))
            }
            <form onSubmit={handleRegister}  className="form-signin">
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password_confirmation"
                    placeholder="Confirm Password"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    required
                />
                <button type="submit" className="cardButton">Register</button>
            </form>
            <div id="formFooter">
                    <Link to={"/login"}>Login Account</Link>
                </div>
           </div>
        </div>
    );
};

export default Register;
