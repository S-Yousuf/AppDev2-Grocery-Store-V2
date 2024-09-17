import ManagerHome from './ManagerHome.js';
import AdminHome from './AdminHome.js';
import UserHome from './UserHome.js';

export default {
    template: `
        <div>
        <UserHome v-if="userRole== 'user' "/>
        <AdminHome v-if="userRole== 'admin' "/>
        <ManagerHome v-if="userRole== 'manager' "/>
        <div v-if="categories.length === 0">
            <p>No categories or products created</p>
        </div>
        <div v-else>
            <div v-for="category in categories" :key="category.c_id" v-if="category.is_approved" class="card">
                <h5 class="card-header">{{ category.c_name }}</h5>
                <div class="card-body">
                    <div v-for="product in products" :key="product.p_id" v-if="product.section === category.c_id" class="card-group mb-3 h-100 w-25">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">{{ product.p_name }}</h5>
                                <p>{{ product.rate }}<span> Rs/{{ product.unit }}</span></p>
                                <p>Best Before / Expiry Date: {{ product.mfd }}</p>
                                <p>Available items: {{ product.stock }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `, 

    data() {
        return {
            userRole: localStorage.getItem('role'),
            categories: [],
            products: [],
        }
    },
    components: {
        UserHome,
        ManagerHome,
        AdminHome,
    },
    created() {
        fetch('/api/categories')
            .then(response => response.json())
            .then(data => {
                this.categories = data;
                return fetch('/api/all_products');
            })
            .then(response => response.json())
            .then(data => {
                this.products = data;
                this.isLoading = false;
            })
            .catch(error => {
                console.error('Error:', error);
                this.isLoading = false;
            });
    }
}