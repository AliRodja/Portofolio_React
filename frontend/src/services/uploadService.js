import api from "./api";
import { toWebpIfImage } from "../utils/file";

const uploadService = {

    async uploadFile(file) {
        const prepared = await toWebpIfImage(file);
        const formData = new FormData();
        formData.append("file", prepared);

        return api.post("/uploads", formData);
    },

};

export default uploadService;
