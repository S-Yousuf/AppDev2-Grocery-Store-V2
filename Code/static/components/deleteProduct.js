export default {
    props: ['p_id'],
    data() {
        return {
            p_id: this.p_id,
            token: localStorage.getItem('auth-token') 
        };
    },
    methods: {
        async deleteProduct() {
            try {
                const response = await fetch(`/api/update_product/${this.p_id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${this.token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                console.log('Product deleted successfully');
                this.$router.push('/manager');
            } catch (error) {
                console.error('There has been a problem with your fetch operation:', error);
            }
        },
        handleClick(answer) {
            if (answer === 'yes') {
                this.deleteProduct();
            } else {
                this.$router.push('/manager');
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