import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useFetch } from '#app';

export const useUserStore = defineStore('user', () => {
    const user = ref(null);
    const token = ref(null);
    const csrfToken = ref(null);  // Stockage du CSRF token
    const loading = ref(false);
    const errorMessage = ref('');

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
                    'X-CSRF-TOKEN': csrfToken.value, // Ajout du CSRF token dans les headers
                },
            });

            if (error.value) {
                throw new Error(error.value.message);
            }

            await navigateTo('/dashboard')
            token.value = data.value.token;
            user.value = data.value.user;
            onBeforeMount(() => {
                localStorage.setItem('authToken', token.value);
            })
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
            const { data, error } = await useFetch('/api/register', {
                method: 'POST',
                body: credentials,
                headers: {
                    'X-CSRF-TOKEN': csrfToken.value, // Ajout du CSRF token dans les headers
                },
            });

            if (error.value) {
                throw new Error(error.value.message);
            }

            token.value = data.value.token;
            user.value = data.value.user;
            onBeforeMount(() => {
                localStorage.setItem('authToken', token.value);
            })

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
        onBeforeMount(() => {
            localStorage.removeItem('authToken');
        })

    };

    // Initialiser l'authentification
    const initAuth = () => {
        let savedToken;
        onBeforeMount(() => {
             savedToken = localStorage.getItem('authToken');
        })

        if (savedToken) {
            token.value = savedToken;
            // Appel à l'API pour récupérer les infos du user via le token (optionnel)
            // Exemple: fetchUserData();
        }
        // Récupère le CSRF token dès l'initialisation
        fetchCsrfToken();
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
        login,
        register,
        logout,
        isAuthenticated,
        fetchCsrfToken,
    };
});
