import { useEffect, useState } from "react";
import api from "../services/api";

function useProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchProjects() {
            try {
                const response = await api.get("/projects");
                setProjects(response.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load projects.");
            } finally {
                setLoading(false);
            }
        }

        fetchProjects();
    }, []);

    return {
        projects,
        loading,
        error,
    };
}

export default useProjects;