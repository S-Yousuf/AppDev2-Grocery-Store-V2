export default {
    template: `
<div class="container">
    <h3 class="my-4">Cart</h3>
    <table class="table table-striped">
        <thead>
            <tr>
                <th scope="col">Product Name</th>
                <th scope="col">Quantity</th>
                <th scope="col">Price/Unit</th>
                <th scope="col">Total</th>
                <th scope="col"></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in cart" :key="item.p_id">                
                <td>{{ getProduct(item.p_id).p_name }}</td>
                <td>{{ item.quantity }} <span> </span>{{ getProduct(item.p_id).unit }}</td>
                <td>{{ item.price }}</td>
                <td>{{ item.quantity * item.price }}</td>                
                <td><router-link :to="'/review/' + item.p_id" class="btn btn-secondary btn-sm">Review</router-link></td>
            </tr>
        </tbody>
    </table>
    <h6 class="text-right">Grand Total: {{ grandTotal }} </h6> 
    <br>    
    <div class="d-grid gap-4 d-md-flex justify-content-md-end">
        <button class="btn btn-dark" @click="checkout" style="margin-right: 145px;">Checkout</button>
    </div>
</div>

    `,
    props: ['u_id'],
    data() {        
        return {
            token: localStorage.getItem('auth-token'),
            cart: [],
            products: [],
            grandTotal: 0,
        };
    },
    methods: {
        logProductId(productId) {
            console.log(productId);
            return productId;
        },
        async fetchCartItems() {
            const authToken = localStorage.getItem('auth-token');
            const response = await fetch('/api/cart/' + this.u_id, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            });
            if (!response.ok) {
                throw new Error('HTTP error ' + response.status);
            }
            const data = await response.json();
            console.log('Response data:', data);
            if (data.cart && Array.isArray(data.cart) && data.products && Array.isArray(data.products)) {
                this.cart = data.cart;
                this.products = data.products;
                this.calculateGrandTotal();
            } else {
                console.error('Unexpected data format:', data);
            }
        },
        getProduct(p_id) {
            return this.products.find(product => product.p_id === p_id);
        },
        calculateGrandTotal() {
            this.grandTotal = this.cart.reduce((total, item) => {
                return total + (item.quantity * item.price);
            }, 0);
        },
        async checkout() {
            const authToken = localStorage.getItem('auth-token');
            const response = await fetch('/api/checkout/' + this.u_id, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            });
            if (!response.ok) {
                throw new Error('HTTP error ' + response.status);
            }
            const data = await response.json();
            console.log('Response data:', data);
            if (data.message === 'Checkout Successful') {
                // Handle successful checkout
                this.cart = [];
                this.calculateGrandTotal();
                // Redirect to the checkout route
                this.$router.push({ name: 'checkout' });
            } else {
                // Handle error during checkout
                console.error('Checkout error:', data.message);
            }
        },
    },
    created() {
        this.fetchCartItems();
    },
};