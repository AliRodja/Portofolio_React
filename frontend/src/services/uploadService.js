import api from "./api";

const uploadService = {

    uploadFile(file) {
        const formData = new FormData();
        formData.append("file", file);

        return api.post("/uploads", formData);
    },

};

export default uploadService;
