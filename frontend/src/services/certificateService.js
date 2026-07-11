import api from "./api";

const certificateService = {

    getAll() {
        return api.get("/certificates");
    },

    create(data) {
        return api.post("/certificates", data);
    },

    update(id, data) {
        return api.put(`/certificates/${id}`, data);
    },

    delete(id) {
        return api.delete(`/certificates/${id}`);
    },

};

export default certificateService;
