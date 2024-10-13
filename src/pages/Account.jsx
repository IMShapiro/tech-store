import { useEffect, useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext.jsx";
import { updateUserPassword, deleteUser, updateUserEmail } from "../utils/authUtils";
import { useNavigate } from "react-router-dom";
import Orders from "../components/Orders";

const Account = () => {
    const { isSignedIn, user, signOut } = useContext(UserContext); // Use context to get user and signOut function
    const [view, setView] = useState("orders");
    const [formData, setFormData] = useState({
        email: user ? user.email : "",
        newPassword: ""
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    useEffect(() => {
        if (!isSignedIn) {
            navigate("/login"); // Redirect to login if not signed in
        }
    }, [isSignedIn, navigate]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            if (formData.newPassword) {
                await updateUserPassword(user, formData.newPassword);
            }

            if (formData.email !== user.email) {
                await updateUserEmail(user, formData.email);
                // Update the email in the formData
                setFormData((prevData) => ({ ...prevData, email: formData.email }));
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDelete = async () => {
        await deleteUser();
        navigate("/"); // Redirect after deletion
    };

    const handleSignOut = () => {
        signOut(); // Use context's signOut function
        navigate("/login");
    };

    const toggleView = () => {
        setView(view === "orders" ? "profile" : "orders");
    };

    const handleCancel = () => {
        setFormData({
            email: user ? user.email : "",
            newPassword: ""
        });
        setError("");
        setView("orders");
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <h3>Your Email: {formData.email}</h3>
                    <button className="btn btn-outline-primary btn-sm m-1" onClick={toggleView}>
                        {view === "orders" ? "Update Credentials" : "View Orders"}
                    </button>
                    <button className="btn btn-outline-danger btn-sm m-1" onClick={handleSignOut}>
                        Sign Out
                    </button>
                </div>
                <div className="col">
                    {view === "orders" &&
                        <div>
                            <h2>Your Orders</h2>
                            <Orders />
                        </div>
                    }
                    {view === "profile" && (
                        <div>
                            <h2>Email and Password</h2>
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}
                            <form>
                                <label className="form-label" htmlFor="email"><b>Email:</b></label><br />
                                <input className="form-control-sm" type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                                <button onClick={handleUpdate} className="btn btn-primary btn-sm m-1">Update Email</button>
                                <button type="button" onClick={handleCancel} className="btn btn-secondary btn-sm m-1">Cancel</button>
                                <br />
                                <label className="form-label" htmlFor="newPassword"><b>New Password:</b></label><br />
                                <input className="form-control-sm" type="password" id="newPassword" name="newPassword" value={formData.newPassword} onChange={handleChange} required />
                                <button onClick={handleUpdate} className="btn btn-primary btn-sm m-1" type="submit">Update Password</button>
                                <button type="button" onClick={handleCancel} className="btn btn-secondary btn-sm m-1">Cancel</button>
                            </form>
                            <div>
                                <h3>Account Deletion</h3>
                                <div className="alert alert-danger">
                                    WARNING: Deleted accounts can't be recovered!!
                                </div>
                                <button className="btn btn-danger btn-sm m-1" onClick={handleDelete}>Delete Account</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Account;