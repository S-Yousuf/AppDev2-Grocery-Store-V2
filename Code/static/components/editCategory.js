export default {
    props: ['id'],
    data() {
        return {
            category: {
                c_id: this.id,
                c_name: '',
            },
            token: localStorage.getItem('auth-token') 
        };
    },
    async created() {
        const response = await fetch(`/api/category/${this.category.c_id}`);
        const data = await response.json();
        this.category.c_name = data.c_name;
    },
    methods: {
        async saveCategory() {
            try {
                const response = await fetch(`/api/update_category/${this.category.c_id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${this.token}`,
                    },
                    body: JSON.stringify(this.category),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                this.$router.push('/admin');
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        },
        handleSubmit(event) {
            event.preventDefault();
            this.saveCategory();
        },
    },
    template: `
        <div class="container d-flex align-items-center" style="height: 100vh; position: relative; top: -200px; left:100px; ">
        <div class="card p-5">
            <h3 class="text-center">Edit Category</h3>
            <form class="row g-3" @submit.prevent="handleSubmit">
                <div class="col-auto">
                    <label for="c_name" class="visually-hidden">Category name</label>
                    <input type="text" class="form-control" id="c_name" v-model="category.c_name">
                </div>
                <div class="col-auto">
                    <button type="submit" class="btn btn-primary mb-3">Save</button>
                </div>
            </form>
        </div>
    </div>
    `,
};