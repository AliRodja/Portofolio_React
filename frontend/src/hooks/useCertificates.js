import { useEffect, useState } from "react";
import api from "../services/api";

function useCertificates() {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchCertificates() {
            try {
                const response = await api.get("/certificates");
                setCertificates(response.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load certificates.");
            } finally {
                setLoading(false);
            }
        }

        fetchCertificates();
    }, []);

    return {
        certificates,
        loading,
        error,
    };
}

export default useCertificates;