import api from "./api";

const experienceService = {

    getAll() {
        return api.get("/experiences");
    },

    create(data) {
        return api.post("/experiences", data);
    },

    update(id, data) {
        return api.put(`/experiences/${id}`, data);
    },

    delete(id) {
        return api.delete(`/experiences/${id}`);
    },

};

export default experienceService;
