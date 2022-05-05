const API = "https://api.github.com/users/";

const app = Vue.createApp({
    data() {
        return {
            userName: null,
            result: null,
            error: null,
            favorites: new Map(),
        }
    },
    created() {
        const savedFavorites = this.restoreStorage();
        if (savedFavorites.length) {
            const favorites = new Map(savedFavorites.map(favorite => [favorite.id, favorite]));
            this.favorites = favorites;
        }
    },
    computed: {
        isFavorite() {
            return this.favorites.has(this.result.id);
        },
        allFavorites() {
            return Array.from(this.favorites.values());
        }
    },
    methods: {
        async searchUser() {
            try {
                this.result = this.error = null;
                const response = await fetch(`${API}${this.userName}`);
                if (!response.ok) throw new Error("User not found");
                const data = await response.json();
                this.result = data;
                return data;
            } catch (error) {
                this.error = error;
            } finally {
                this.userName = null;
            }
        },
        addFavorite() {
            this.favorites.set(this.result.id, this.result);
            this.updateStorage();
        },
        removeFavorite() {
            this.favorites.delete(this.result.id);
            this.updateStorage();
        },
        updateStorage() {
            localStorage.setItem("favorites", JSON.stringify(this.allFavorites));
        },
        restoreStorage() {
            return JSON.parse(localStorage.getItem("favorites"));
        }
    }
});