import { useEffect, useState } from "react";
import api from "../services/api";

function useEducation() {
    const [education, setEducation] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchEducation() {
            try {
                const response = await api.get("/education");
                setEducation(response.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load education.");
            } finally {
                setLoading(false);
            }
        }

        fetchEducation();
    }, []);

    return {
        education,
        loading,
        error,
    };
}

export default useEducation;