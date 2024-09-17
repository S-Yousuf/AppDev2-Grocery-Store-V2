export default {
    template: `
    <nav class="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
            <div class="container-fluid">
                <a class="navbar-brand" href="#">Navbar</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <router-link class="nav-link active" aria-current="page" :to="homeRoute">Home</router-link>
                        </li>

                        <li class="nav-item" v-if="role === 'admin' && is_login">
                            <router-link class="nav-link" to="/users">Users</router-link>
                        </li>
                      

                        <li class="nav-item" v-if="role === 'customer' && is_login">
                            <router-link class="nav-link" :to="{name:'Cart', params:{ u_id: loggedInUserId } }">Cart</router-link>
                        </li>

                        <li class="nav-item" v-if="role !== 'admin' && !is_login">
                            <router-link class="nav-link" to="/manager-login">Manage</router-link>
                        </li>
                       

                        <li class="nav-item" v-if="!is_login">
                             <router-link class="nav-link" to="/login">Login</router-link>
                        </li>
                        <li class="nav-item" v-else>
                            <button class="nav-link" @click='logout' >Logout</button>
                        </li>
                    </ul>
                    <form class="d-flex" >
                        <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
                        <button class="btn btn-outline-success" type="submit">Search</button>
                    </form>
                </div>
            </div>
        </nav>`,

    computed: {
        loggedInUserId() {
            const userId =  localStorage.getItem('user_id');
            return userId;
        },

        role(){
            return localStorage.getItem('role') ? localStorage.getItem('role') : null;
        },
        is_login() {
            return localStorage.getItem('auth-token') && localStorage.getItem('auth-token').trim() !== '' ? true : false;
        },

        homeRoute() {
            if (!this.is_login) {
                return '/';
            }
            if (this.role === 'admin') {
                return '/admin';
            } else if (this.role === 'manager') {
                return '/manager';
            } else {
                return '/user';
            }
        }
    },
    methods: {
        logout() {
            localStorage.removeItem('auth-token')
            localStorage.removeItem('role')
            this.$router.push({ path: '/' })
        },
    },
};