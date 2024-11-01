import {useUserStore} from "~/store/userStore.js";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const userStore = useUserStore();

    // Vérifier si l'authentification est initialisée
    if (!userStore.isAuthInitialized) {
        await userStore.initAuth();
    }

    // Éviter les boucles de redirection infinies
    const publicPages = ['/login', '/register'];
    const isPublicPage = publicPages.includes(to.path);

    // Vérifier si l'utilisateur est authentifié
    if (!userStore.isAuthenticated() && !isPublicPage) {
        // Si l'utilisateur n'est pas authentifié et tente d'accéder à une page protégée, on le redirige vers la page de connexion
        return navigateTo('/login');
    }

    // Si l'utilisateur est authentifié et tente d'accéder à la page de connexion ou d'inscription, rediriger vers le dashboard
    if (userStore.isAuthenticated() && isPublicPage) {
        return navigateTo('/dashboard');
    }
});
