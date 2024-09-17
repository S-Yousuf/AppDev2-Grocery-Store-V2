import axios from 'axios';

export default{
    data() {
        return {
            query: '',
            products: [],
        };
    },
    methods: {
        async search() {
            const response = await axios.get('/api/search', { params: { q: this.query } });
            this.products = response.data.product;
        },
    },
    template: `
      <div>
    <h4>Search Results for "{{ query }}"</h4>
    <div class="container" id="product"></div>
    <table class="table">
      <tr>
        <th>Product Name</th>
        <th>Expiry/Best Before Date</th>
        <th>Price</th>
        <th>Stock Available</th>
        <th>Add to Cart</th>
      </tr>
      <tr v-for="p in products" :key="p.id">
        <td>{{ p.p_name }}</td>
        <td>{{ p.mfd }}</td>
        <td>{{ p.rate }}/{{ p.unit }}</td>
        <td>{{ p.stock }}</td>
        <td><a :href="'/addToCart/' + p.p_id" class="btn btn-outline-dark">Buy</a></td>
      </tr>
    </table>
  </div>

    `,
}