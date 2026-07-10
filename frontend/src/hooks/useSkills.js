import { useEffect, useState } from "react";
import api from "../services/api";

function useSkills() {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchSkills() {
            try {
                const response = await api.get("/skills");
                setSkills(response.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load skills.");
            } finally {
                setLoading(false);
            }
        }

        fetchSkills();
    }, []);

    return {
        skills,
        loading,
        error,
    };
}

export default useSkills;
