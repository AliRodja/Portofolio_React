import api from "./api";

const skillService = {

    getAll() {
        return api.get("/skills");
    },

    create(data) {
        return api.post("/skills", data);
    },

    update(id, data) {
        return api.put(`/skills/${id}`, data);
    },

    delete(id) {
        return api.delete(`/skills/${id}`);
    },

};

export default skillService;
