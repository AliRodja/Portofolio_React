import api from "./api";

const uploadService = {

    uploadImage(file) {
        const formData = new FormData();
        formData.append("image", file);

        return api.post("/uploads", formData);
    },

};

export default uploadService;
