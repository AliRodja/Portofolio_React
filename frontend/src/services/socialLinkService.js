import api from "./api";

const socialLinkService = {

    getAll() {
        return api.get("/social-links");
    },

    create(data) {
        return api.post("/social-links", data);
    },

    update(id, data) {
        return api.put(`/social-links/${id}`, data);
    },

    delete(id) {
        return api.delete(`/social-links/${id}`);
    },

};

export default socialLinkService;
