import { useEffect, useState } from "react";
import api from "./services/api";

function App() {

  const [projects, setProjects] = useState([]);

  useEffect(() => {

    api.get("/projects")
      .then((res) => {
        setProjects(res.data);
      })
      .catch((err) => {
        console.error(err);
      });

  }, []);

  return (
    <div className="min-h-screen p-10">

      <h1 className="text-4xl font-bold mb-10">
        My Projects
      </h1>

      <div className="grid gap-6">

        {projects.map((project) => (

          <div
            key={project.id}
            className="border rounded-lg p-5 shadow"
          >
            <h2 className="text-2xl font-semibold">
              {project.title}
            </h2>

            <p className="mt-2">
              {project.description}
            </p>
          </div>

        ))}

      </div>

    </div>
  );
}

export default App;