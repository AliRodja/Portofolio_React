import api from "./api";

const messageService = {

    getAll() {
        return api.get("/messages");
    },

    delete(id) {
        return api.delete(`/messages/${id}`);
    },

};

export default messageService;
