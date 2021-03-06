import AppFilter from './app-filter.cmp.js'
import AppMenu from './app-menu.cmp.js'

export default {
    template: `
    <section class="app-header flex align-items center">
        <header class="header-container common-width flex space-between"> 
            <div class="logo-container flex align-items center">
                <router-link class="homepage-router" to="/">
                    <h1 class="logo-title">Appsus</h1>
                </router-link>
            </div>
            <app-filter />  
            <div class="menu-btn flex">
                <a class="burger flex align-items center" @click="isMenuOpen=!isMenuOpen"><i class="fas fa-th"></i></a> 
                <app-menu :isMenuOpen="isMenuOpen" @close="closeMenu" />
            </div>
        </header>
    </section>
    `,
    data() {
        return {
            isMenuOpen: false
        }
    },
    methods: {
        closeMenu() {
            this.isMenuOpen = false
        }

    },
    components: {
        AppFilter,
        AppMenu
    }
}