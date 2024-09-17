export default{
    props: ['p_id'],
    data() {
        return {
            product: {
                p_name: '',
                mfd: '',
                unit: '',
                rate: '',
                stock: ''
            },
            token: localStorage.getItem('auth-token')
        }
    },
    async created() {
        try {
            const response = await fetch(`/api/product/${this.p_id}`);
            const data = await response.json();
            this.product = data;
        } catch (error) {
            console.log(error);
        }
    },
    template: `
        <div class="d-flex justify-content-center align-items-center vh-75">
        <div class="card w-50">
            <div class="card-body">
                <form @submit.prevent="submitForm" class="px-3 py-4">
                    <div class="form-group">
                        <label for="p_name">Product Name:</label>
                        <input type="text" id="p_name" v-model="product.p_name" class="form-control">
                    </div>

                    <div class="form-group">
                        <label for="mfd">Manufacture Date/Best Before:</label>
                        <input type="date" id="mfd" v-model="product.mfd" class="form-control">
                    </div>

                    <div class="form-group">
                        <label for="unit">Units:</label>
                        <select id="unit" v-model="product.unit" class="form-control">
                            <option value="Kg">Kg</option>
                            <option value="Litre">Litre</option>
                            <option value="500 gm">500 gm</option>
                            <option value="500 ml">500 ml</option>
                            <option value="Dozen">Dozen</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="rate">Rate/unit</label>
                        <input type="number" id="rate" v-model="product.rate" class="form-control">
                    </div>

                    <div class="form-group">
                        <label for="stock">Quantity:</label>
                        <input type="number" id="stock" v-model="product.stock" class="form-control">
                    </div>

                    <div class="form-group text-center mt-3">
                        <button id="button" type="submit" class="btn btn-outline-warning">Edit</button>
                        <router-link :to="'/delete_product/' + product.p_id" type="button" class="btn btn-outline-danger">Delete</router-link>
                    </div>
                </form>
            </div>
        </div>
    </div>
    
    `,
    methods: {
        async submitForm() {
            try {
                const response = await fetch(`/api/update_product/${this.p_id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${this.token}`,
                    },
                    body: JSON.stringify(this.product)
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                console.log('Product updated successfully');
                this.$router.push('/manager');
                this.$router.go();
            } catch (error) {
                console.error('There has been a problem with your fetch operation:', error);
            }
        },
    }
}