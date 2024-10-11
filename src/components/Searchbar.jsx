import { useState } from "react";
import { collection, where, getDocs, query } from "firebase/firestore";
import { db } from "../config/FirebaseConfig";

const Searchbar = ({ onSearchResults }) => {
    const [userSearch, setUserSearch] = useState("");

    function capitalizeFirstLetter() {
         setUserSearch(userSearch.charAt(0).toUpperCase() + userSearch.slice(1))
    }

    const search = async (e) => {
        capitalizeFirstLetter();
        e.preventDefault();
        const collectionRef = collection(db, "products");
        const q = query(collectionRef, where("productName", ">=", userSearch), where("productName", "<=", userSearch + "\uf8ff"));
        const docRefs = await getDocs(q);

        const res = [];
        docRefs.forEach((doc) => {
            res.push({
                id: doc.id,
                ...doc.data(),
            });
        });

        onSearchResults(res);
    };

    return (
        <div className="row p-2">
            <form className="d-flex" role="search" onSubmit={search}>
                <input
                    className="form-control me-2"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    name="userSearch"
                    onChange={(e) => setUserSearch(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}
                    value={userSearch}
                />
                <button className="btn btn-outline-success" type="submit">Search</button>
            </form>
        </div>
    );
};

export default Searchbar;