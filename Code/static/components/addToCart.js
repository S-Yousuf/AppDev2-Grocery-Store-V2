export default {
    props: ['id'],
    data() {
        return {
            token: localStorage.getItem('auth-token'),
            productID: this.$route.params.id,
            u_id: localStorage.getItem('user_id'),
            product: {},
            quantity: 1,
        };
    },
    computed: {
        total() {
            return this.product.rate * this.quantity;
        },
        isOutOfStock() {
            return this.product.stock <= 0;
        },
        isQuantityExceedsStock() {
            return this.quantity > this.product.stock;
        },
    },
    methods: {
        async addToCart() {
            const response = await fetch(`/api/add_to_cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${this.token}`,
                },
                body: JSON.stringify({
                    u_id: this.u_id,
                    p_id: this.productID,
                    quantity: this.quantity,
                    price: this.product.rate,
                    total: this.total,
                }),
            });

            if (response.ok) {
                this.$router.push('/user');
            }
        },
    },
    async created() {
        try {
            const response = await fetch(`/api/product/${this.$route.params.id}`);
            const data = await response.json();
            this.product = data;
        } catch (error) {
            console.log('Fetch error: ', error);
        }

    },
    template: ` 
<div id="main" class="container" style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);">
    <h3> {{ product.p_name }} </h3>
    <br>

    <form @submit.prevent="addToCart" style="display: flex; flex-direction: column; align-items: center;">

        <div class="form-group">
            <label for="">Availability:
                <span :class="{'text-success': product.stock > 0, 'text-danger': product.stock <= 0}">
                {{ product.stock > 0 ? 'In Stock' : 'Out of Stock' }}
                </span>
            </label>
        </div>
        <br>

        <div class="form-group row">
            <label for="quantity" class="col-sm-2 col-form-label">Quantity:</label>
            <div class="col-sm-8">
            <input type="number" v-model="quantity" required class="form-control">
            </div>
            <div class="col-sm-2">
            <span class="form-control-plaintext"> /{{ product.unit}} </span>
            </div>
        </div>
        <p v-if="isQuantityExceedsStock" class="text-danger">The selected quantity exceeds the product's stock.</p>
        <br>
        
        <div class="form-group">
        <label for="rate">Price:</label>
        <input type="number" :value="product.rate" disabled><span>  Rs/-</span>
        </div>
        <br>

        <div class="form-group">
        <label for="total">Total:</label>
        <input type="number" name="total" id="total" :value="total" disabled>
        </div>
        <br>

        <button type="submit" class="btn btn-success" :disabled="isOutOfStock || isQuantityExceedsStock">Buy</button>

    </form>
  </div>
  `,
};
    