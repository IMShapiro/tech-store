import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
    createUserWithPassword, 
    signInWithGoogle, 
    authError 
} from "../utils/authUtils";
import { auth } from "../config/FirebaseConfig.js";
import { onAuthStateChanged } from "firebase/auth";

function Signup() {
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const { email, password } = formData;

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate("/");
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const signupUser = async (e) => {
        e.preventDefault();
        try {
            await createUserWithPassword(email, password);
            navigate("/"); // Navigate only if authentication is successful
        } catch (error) {
            setError(authError); // Handle authentication errors
        }
    }

    return (
        <div className="container-fluid m-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">Sign Up</h2>
                            {error && <div className="alert alert-danger" role="alert">{error}</div>}
                            <form onSubmit={signupUser}>
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
                                <p>Already have an account? <Link to="/login" className="link-primary">Log in instead</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;