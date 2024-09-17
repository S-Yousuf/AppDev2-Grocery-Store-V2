export default{
    data() {
        return {
            product: {
                p_name: '',
                mfd: '',
                rate: '',
                unit: '',
                stock: '',
                section: ''
            },
            categories: [],
            token: localStorage.getItem('auth-token')
        }
    },
    template: `
<div class="d-flex justify-content-center align-items-center vh-75">
    <div class="card w-50">
        <div class="card-body">
            <form @submit.prevent="submitForm" class="px-3 py-4">
                <div class="form-group">
                    <label for="p_name">Product Name:</label>
                    <input type="text" id="p_name" v-model="product.p_name" required class="form-control">
                </div><br>

                <div class="form-group">
                    <label for="mfd">Expiry / Best Before Date:</label>
                    <input type="date" id="mfd" v-model="product.mfd" required class="form-control">
                </div><br>

                <div class="form-group">
                    <label for="unit" class="mb-2">Units:</label>
                    <select name="unit" id="unit" v-model="product.unit" required class="form-control">
                    <option value="Kg">Kg</option>
                    <option value="Litre">Litre</option>
                    <option value="500 gm">500 gm</option>
                    <option value="500 ml">500 ml</option>
                    <option value="Dozen">Dozen</option>
                    </select>
                </div><br>

                <div class="form-group">
                    <label for="rate" class="mb-2">Rate/unit</label>
                    <input type="number" id="rate" v-model="product.rate" required class="form-control">
                </div> <br>

                <div class="form-group">
                    <label for="stock" class="mb-2">Quantity:</label>
                    <input type="number" id="stock" v-model="product.stock" required class="form-control">
                </div> <br>

                <div class="form-group text-center">
                    <h6 class="mb-2">Assign Category</h6>
                    <label for="category" class="mb-2"></label>
                    <select name="c_name" id="category" v-model="product.section" required class="form-control">
                        <option v-for="cat in categories" :value="cat.c_id" :key="cat.c_id">{{ cat.c_name }}</option>
                    </select>
                </div>

                <div class="form-group text-center mt-3">
                    <button id="button" type="submit" class="btn btn-outline-success">Save</button>
                </div>
            </form>
        </div>
    </div>
</div>
    `,
    async created() {
        try {
            const response = await fetch('/api/categories');
            this.categories = await response.json();
            this.product.section = this.$route.params.c_id;
        } catch (error) {
            console.log(error);
        }
    },
    methods: {
        async submitForm() {
            try {
                const response = await fetch('/api/add_product/' + this.product.section, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${this.token}`,
                    },
                    body: JSON.stringify(this.product)
                });
                const data = await response.json();
                console.log(data);
                this.$router.push('/manager');
            } catch (error) {
                console.log(error);
            }
        }
    }
}