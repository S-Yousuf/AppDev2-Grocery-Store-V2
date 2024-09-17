export default {
    data() {
        return {
            categoryName: '',
            token: localStorage.getItem('auth-token'),
            role: localStorage.getItem('role'),
        }
    },
    template: `<div class="container d-flex justify-content-center">
    <div class="col-6">
        <h3 class="mb-3 text-center">Creating a new category</h3>
        <form class="row g-3" method="POST" @submit.prevent="addCategory">
            <div class="col-12 d-flex justify-content-between align-items-center">
                <label for="c_name" class="form-label mb-0">Category Name</label>
                <input type="text" class="form-control" placeholder="Category name" v-model="categoryName" style="width: 70%;">
            </div>
            <div class="col-12 d-flex justify-content-center">
                <button type="submit" class="btn btn-primary mb-3">Save</button>
            </div>
        </form>
    </div>
</div>`,
    methods: {
        async addCategory() {
            try {
                const response = await fetch('/api/add_category', {
                    method: 'POST',
                    headers: {
                        "Authorization": `Bearer ${this.token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ c_name: this.categoryName }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                this.categoryName = '';
                if (this.role === 'manager') this.$router.push('/manager');
                else this.$router.push('/admin');
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        },
    },

}