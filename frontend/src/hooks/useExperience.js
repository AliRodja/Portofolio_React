import { useEffect, useState } from "react";
import api from "../services/api";

function useExperience() {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchExperiences() {
            try {
                const response = await api.get("/experiences");
                setExperiences(response.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load experiences.");
            } finally {
                setLoading(false);
            }
        }

        fetchExperiences();
    }, []);

    return {
        experiences,
        loading,
        error,
    };
}

export default useExperience;