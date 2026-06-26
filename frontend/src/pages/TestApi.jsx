import { useEffect } from "react";
import api from "../services/api";

function TestApi() {
    useEffect(() => {
        api
            .get("/projects")
            .then((response) => {
                console.log("Projects:", response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    return (
        <div className="p-10">
            <h1>Testing API...</h1>
        </div>
    );
}

export default TestApi;