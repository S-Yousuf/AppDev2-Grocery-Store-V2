export default {
    data() {
        return {
            categories: null,
            products: null,
            isLoading: false,
            isWaiting: false,
        }
    },
    async created() {
        try {
            const responseCategories = await fetch('/api/categories');
            this.categories = await responseCategories.json();

            const responseProducts = await fetch('/api/all_products');
            this.products = await responseProducts.json();

            this.isLoading = false;
        } catch (error) {
            console.log(error);
        }
    },
    methods: {
        async downloadResource() {
            this.isWaiting = true;
            const res = await fetch('/download-csv');
            const data = await res.json();
            if(res.ok){
                const taskId = data['task_id']
                const intv = setInterval(async () => {
                    const csv_res = await fetch(`/get-csv/${taskId}`);
                    if(csv_res.ok){
                        this.isWaiting = false;
                        clearInterval(intv);
                        window.location.href = `/get-csv/${taskId}`;
                        }
                    }, 1000);
            }
        }
           
    },
    template: `
<div>
<div class="d-grid gap-2 d-md-flex justify-content-md-end">
<button class="btn btn-outline-light btn-sm me-md-2" @click='downloadResource'>Download Resource</Button><span v-if='isWaiting'>Waiting..</span>
</div>
<div v-if="!categories || categories.length === 0" class="text-center">
    No categories created
</div>
<div v-else>
    <div v-for="category in categories.filter(category => category.is_approved)" :key="category.c_id" class="row g-4 mb-4">
        <div class="col-12">
            <div class="card bg-light">
                <div class="card-header">
                    <h5 class="card-title mb-0">{{ category.c_name }}</h5>
                </div>
                <div class="card-body d-flex justify-content-center flex-column">
                    <div v-if="!products || !Array.isArray(products) || products.filter(product => product.section === category.c_id).length === 0" class="text-center">
                        No products created
                    </div>
                    <div v-else>
                        <div class="card-deck">
                            <div v-for="product in products.filter(product => product.section === category.c_id)" :key="product.p_id" class="card mb-4 shadow-sm">
                                <div class="card-body">
                                    <h5 class="card-title">{{ product.p_name }}</h5>
                                    <router-link :to="'/action/' + product.p_id" class="btn btn-outline-dark btn-sm">Actions</router-link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex justify-content-center">
                        <router-link :to="'/add_product/' + category.c_id" class="btn btn-primary btn-sm btn-info mb-2">+</router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="d-flex justify-content-center">
    <router-link to="/add_category" class="btn btn-primary btn-sm btn-warning mb-2">Add Category</router-link>
</div>
</div>
</div>
    `,
}