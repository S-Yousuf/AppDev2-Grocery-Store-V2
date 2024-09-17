export default {
    template: ` 
  <div style="font-family: Arial, sans-serif;">
    <h2 style="color: #333;">Users</h2>
    <table class="table" style="width: 100%; margin-bottom: 20px;">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Username</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in allUsers" :key="user.id">
          <th scope="row">{{ index + 1 }}</th>
          <td>{{ user.username }}</td> 
          <td>
            <button type="button" class="btn btn-outline-dark btn-sm" v-if='!user.is_approved' @click="approveUser(user.id)">Approve</button>
          </td>
        </tr>
      </tbody>
    </table>
    <br> <br>  <br>

    <h2 style="color: #333;">Category Requests</h2>
    <table class="table" style="margin-top: 20px;">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Category Name</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(category, index) in categoryRequests" :key="category.id" v-if="!category.is_approved">
          <th scope="row">{{ index + 1 }}</th>
          <td style="color: #333; font-weight: bold;">{{ category.c_name }}</td>
          <td>
            <button type="button" class="btn btn-outline-dark btn-sm" @click="approveCategory(category.c_id)">Approve</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
`,
    data() {
        return {
            allUsers: [],
            categoryRequests: [],
            token: localStorage.getItem('auth-token'),
            error: null,
        }
    },
    methods: {
        async fetchCategories() {
            const res = await fetch('/api/categories', {
                method: 'GET',
            });
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            this.categoryRequests = data;
        },

        async approveCategory(c_id) {
            const res = await fetch(`/api/approve_category/${c_id}`, {
                method: 'PUT', // Use PUT method to update existing resource
                headers: {
                    "Authorization": `Bearer ${this.token}`,
                },
            });
            const data = await res.json();
            if (res.ok) {
                alert(data.message);
                // Refresh category requests
                this.fetchCategories();
            }
        },

        async approveUser(id) {
            const res = await fetch(`/admin/approve/store-manager/${id}`, {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${this.token}`,
                },
            });
            const data = await res.json();
            if (res.ok) {
                alert(data.message);
            }
        },
    },

    async mounted() {
        this.token = localStorage.getItem('auth-token')

        if (this.token) {
            try {
                const res = await fetch('/users', {
                    method: 'GET',
                    headers: {
                        "Authorization": `Bearer ${this.token}`,
                    },
                })
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const data = await res.json()
                this.allUsers = data.users
                this.fetchCategories();
            } catch (error) {
                console.log('Fetch error: ', error);
            }
        } else {
            console.log('No token found');
        }
    },
}