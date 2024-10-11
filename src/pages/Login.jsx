import { useEffect, useState } from "react";
import { 
    signInUserWithPassword, 
    signInWithGoogle,
    sendPasswordResetLink, 
    authError
} from "../utils/authUtils.js";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/FirebaseConfig.js";
import { onAuthStateChanged } from "firebase/auth";

function Login() {
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate("/");
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const { email, password } = formData;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const loginUser = async (e) => {
        e.preventDefault();  // Prevent default form submission
        try {
            await signInUserWithPassword(email, password);
            navigate("/"); // Navigate only if authentication is successful
        } catch (error) {
            setError(authError); // Handle authentication errors
        }
    }

    const handlePasswordReset = async () => {
        if (email) {
            await sendPasswordResetLink(email);
            setSuccessMsg("A link to reset your password was sent to your email...");
        } else {
            setError("Please enter your email address.");
        }
    };

    return (
        <>
            <div className="container-fluid m-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h2 className="card-title text-center mb-4">Log In</h2>
                                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                                {successMsg && <div className="alert alert-success">{successMsg}</div>}
                                <form onSubmit={loginUser}>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email:</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            placeholder="Email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Password:</label>
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            placeholder="Password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className="d-grid">
                                        <button type="submit" className="btn btn-primary">Submit</button>
                                    </div>
                                </form>

                                <div className="mt-3 d-grid">
                                    <button onClick={signInWithGoogle} className="btn btn-danger">Continue with Google</button>
                                </div>

                                <div className="mt-3 text-center">
                                    <button className="btn btn-link" onClick={handlePasswordReset}>Forgot password?</button>
                                    <p>Don&apos;t have an account? <Link to="/signup" className="link-primary">Sign Up</Link></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;