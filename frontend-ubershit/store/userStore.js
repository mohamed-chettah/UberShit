import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useFetch, navigateTo, useCookie } from '#app';

export const useUserStore = defineStore('user', () => {
    const user = ref(null);
    const token = ref(null);
    const csrfToken = ref(null);  // Stockage du CSRF token
    const loading = ref(false);
    const errorMessage = ref('');
    const isAuthInitialized = ref(false); // Indique si l'authentification est prête

    // Utiliser useCookie pour gérer les cookies
    const authTokenCookie = useCookie('authToken');
    const authUserCookie = useCookie('authUser');
    const csrfTokenCookie = useCookie('csrfToken');

    // Action pour récupérer le CSRF token depuis Laravel
    const fetchCsrfToken = async () => {
        try {
            const { data, error } = await useFetch('/api/csrf-token', {
                method: 'GET',
            });

            if (error.value) {
                throw new Error("Failed to fetch CSRF token");
            }

            csrfToken.value = data.value.csrf_token;
            csrfTokenCookie.value = csrfToken.value; // Stockage du CSRF token dans les cookies
        } catch (error) {
            console.error("Error fetching CSRF token:", error);
            errorMessage.value = "Unable to fetch CSRF token";
        }
    };

    // Login Action
    const login = async (credentials) => {
        loading.value = true;
        errorMessage.value = '';
        try {
            const { data, error } = await useFetch('/api/login', {
                method: 'POST',
                body: credentials,
                headers: {
                    'X-CSRF-TOKEN': csrfToken.value || csrfTokenCookie.value, // Ajout du CSRF token dans les headers
                },
            });

            if (error.value) {
                throw new Error(error.value.message);
            }

            token.value = data.value.token;
            user.value = data.value.user;

            // Stockage dans les cookies
            authTokenCookie.value = token.value; // Expire dans 7 jours par défaut
            authUserCookie.value = JSON.stringify(user.value);

            await navigateTo('/dashboard');
        } catch (error) {
            errorMessage.value = error.message || 'Login failed';
        } finally {
            loading.value = false;
        }
    };

    // Register Action
    const register = async (credentials) => {
        loading.value = true;
        errorMessage.value = '';
        try {
            if (!csrfToken.value) {
                await fetchCsrfToken();
            }
            const { data, error } = await useFetch('/api/register', {
                method: 'POST',
                body: credentials,
                headers: {
                    'X-CSRF-TOKEN': csrfToken.value || csrfTokenCookie.value, // Ajout du CSRF token dans les headers
                },
            });

            if (error.value) {
                throw new Error(error.value.message);
            }

            token.value = data.value.token;
            user.value = data.value.user;

            // Stockage dans les cookies
            authTokenCookie.value = token.value;
            authUserCookie.value = JSON.stringify(user.value);

            await navigateTo('/dashboard');
        } catch (error) {
            errorMessage.value = error.message || 'Registration failed';
        } finally {
            loading.value = false;
        }
    };

    // Logout Action
    const logout = () => {
        token.value = null;
        user.value = null;

        // Suppression des cookies
        authTokenCookie.value = null;
        authUserCookie.value = null;
        csrfTokenCookie.value = null;

        navigateTo('/login');
    };

    // Initialiser l'authentification
    const initAuth = async () => {
        const savedToken = authTokenCookie.value;
        const savedUser = authUserCookie.value;

        console.log("savedToken", savedToken);
        console.log("savedUser", savedUser);

        if (savedUser) {
            user.value = savedUser;
        }
        if (savedToken) {
            token.value = savedToken;
        }

        // Récupérer le CSRF token dès l'initialisation si nécessaire
        if (!csrfToken.value) {
            const savedCsrfToken = csrfTokenCookie.value;
            if (savedCsrfToken) {
                csrfToken.value = savedCsrfToken;
            } else {
                await fetchCsrfToken();
            }
        }

        isAuthInitialized.value = true; // Authentification initialisée
    };

    // Vérifier si l'utilisateur est authentifié
    const isAuthenticated = () => {
        return !!token.value;
    };

    // Appeler initAuth() au chargement du store
    initAuth();

    return {
        user,
        token,
        csrfToken,
        loading,
        errorMessage,
        isAuthInitialized,
        login,
        register,
        logout,
        isAuthenticated,
        fetchCsrfToken,
        initAuth,
    };
});
