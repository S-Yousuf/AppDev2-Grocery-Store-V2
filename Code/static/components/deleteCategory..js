export default {
    props: ['id'],
    data() {
        return {
            categoryId: this.id, 
            token: localStorage.getItem('auth-token')
        };
    },
    methods: {
        async deleteCategory() {
            try {
                const response = await fetch(`/api/delete_category/${this.categoryId}`, {
                    method: 'DELETE',
                    headers: {
                        "Authorization": `Bearer ${this.token}`,
                    },                   
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                this.$router.push('/admin');
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        },
        handleClick(answer) {
            if (answer === 'yes') {
                this.deleteCategory();
            } else {
                this.$router.push('/admin');
            }
        },
        handleSubmit(event) {
            event.preventDefault();
        },
    },
    template: `
        <div class="container py-4 py-xl-5 mx-auto col-xl-3">
            <h3>Are you sure?</h3>
            <br>
            <form @submit.prevent="handleSubmit">
                <button type="submit" class="btn btn-danger" @click="handleClick('yes')">Yes</button>
                <button type="submit" class="btn btn-info" @click="handleClick('no')">No</button>
            </form>
        </div>
    `,
}