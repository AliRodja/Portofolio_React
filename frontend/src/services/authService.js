import api from "./api";

const TOKEN_KEY = "aurora_token";
const USER_KEY = "aurora_user";

const authService = {
    async login(email, password) {
        const response = await api.post("/auth/login", {
            email,
            password,
        });

        const { token, user } = response.data;

        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));

        return user;
    },

    logout() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    },

    getToken() {
        return localStorage.getItem(TOKEN_KEY);
    },

    getUser() {
        const user = localStorage.getItem(USER_KEY);

        return user ? JSON.parse(user) : null;
    },

    isAuthenticated() {
        return !!localStorage.getItem(TOKEN_KEY);
    },
};

export default authService;