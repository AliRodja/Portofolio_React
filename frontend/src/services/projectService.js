import api from "./api";

const projectService = {

    getAll() {
        return api.get("/projects");
    },

    create(data) {
        return api.post("/projects", data);
    },

    update(id, data) {
        return api.put(`/projects/${id}`, data);
    },

    delete(id) {
        return api.delete(`/projects/${id}`);
    }

};

export default projectService;