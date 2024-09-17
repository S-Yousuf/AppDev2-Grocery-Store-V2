export default {
    data(){
        return{
            categories: null,
            products: null,
            isLoading: false,
        }
    },
    async created(){

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
 
    template: `

    <div v-if="isLoading">
        Loading...
    </div>
    <div v-else>
        <div v-if="!categories || categories.length === 0" class="text-center">
        No categories created
        <div class="d-flex justify-content-center">
            <router-link to="/add_category" class="btn btn-primary btn-sm">Add Category</router-link>
        </div>
        </div>
         <div v-else>
        <div v-for="category in categories" :key="category.c_id" class="row g-4 mb-4" v-if="category.is_approved">
                <div class="col-12">
                    <div class="card bg-light">
                        <div class="card-header">
                            <h5 class="card-title mb-0">{{ category.c_name }}</h5>
                        </div>
                        <div class="card-body">                            
                            <router-link :to="'/edit_category/' + category.c_id" class="btn btn-warning btn-sm">Edit Category</router-link>
                            <router-link :to="'/delete_category/' + category.c_id" class="btn btn-danger btn-sm">Delete Category</router-link>
                        </div>
                        <div class="card-deck">
                            <div v-for="product in products" :key="product.p_id" v-if="product.section === category.c_id">
                                <div class="card mb-4 shadow-sm">
                                    <div class="card-body">
                                        <h5 class="card-title">{{ product.p_name }}</h5>                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>                
            </div>
            <div class="d-flex justify-content-center">
                <router-link to="/add_category" class="btn btn-primary btn-sm">Add Category</router-link>
            </div>
        </div>
        <div v-if="!products || products.length === 0" class="text-center">
            No products created
            <!-- Add a button to add a product if needed -->
        </div>
    </div>
    `,
}