import api from "./api";

const educationService = {

    getAll() {
        return api.get("/education");
    },

    create(data) {
        return api.post("/education", data);
    },

    update(id, data) {
        return api.put(`/education/${id}`, data);
    },

    delete(id) {
        return api.delete(`/education/${id}`);
    },

};

export default educationService;
