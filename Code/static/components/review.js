export default {
    props: ['id'],
    data() {
        return {
            u_id: localStorage.getItem('user_id'),
            product: {
                p_id: '',
                p_name: '',
                mfd: '',
                unit: '',
                rate: '',
                stock: '',
            },
            quantity: 1,  // Add a quantity data property
            total: 0,  
        };
    },
    methods: {        
        async fetchProduct() {
            const authToken = localStorage.getItem('auth-token');
            const response = await fetch('/api/product/' + this.id, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            });
            if (!response.ok) {
                throw new Error('HTTP error ' + response.status);
            }
            this.product = await response.json();
        },
        async submitForm() {
            const authToken = localStorage.getItem('auth-token');
            const response = await fetch('/api/update_cart/' + this.id, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    u_id: this.u_id,
                    p_id: this.product.p_id,
                    quantity: this.quantity, 
                    price: this.product.rate,  
                    total: this.total,  
                }),
            });
            if (!response.ok) {
                throw new Error('HTTP error ' + response.status);
            }
            this.product = await response.json();
            this.$router.push({ name: 'Cart', params: { u_id: this.u_id } });
        },
        async deleteProduct() {
            const authToken = localStorage.getItem('auth-token');
            const response = await fetch('/api/update_cart/' + this.id, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            });
            if (!response.ok) {
                throw new Error('HTTP error ' + response.status);
            }           
            this.$router.push({ name: 'Cart', params: { u_id: this.u_id } });
        },
    },
    created() {
        if (this.id) {
            this.fetchProduct();
        } else {
            console.error('ID is undefined');
        }
    },
    watch: {
        quantity() {
            this.total = this.quantity * this.product.rate;  // Update the total whenever the quantity changes
        },
    },
    template: `
            <div id="main" class="container" style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);">
    <h3> {{ product.p_name }} </h3>
    <br>

    <form  @submit.prevent="submitForm" style="display: flex; flex-direction: column; align-items: center;">

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
                    <input type="number" v-model="quantity" min="1" required class="form-control">
                </div>
            <div class="col-sm-2">
            <span class="form-control-plaintext"> /{{ product.unit}} </span>
            </div>
        </div>
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

        <div class="form-group" style="display: flex; justify-content: space-between;">
            <button id="button" type="submit" class="btn btn-outline-warning" style="margin-right: 10px;">Edit</button>
            <button @click="deleteProduct" type="button" class="btn btn-outline-danger">Delete</button>
        </div>

    </form>
  </div>             
                    
`
}