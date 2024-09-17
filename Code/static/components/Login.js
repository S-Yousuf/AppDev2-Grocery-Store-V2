export default {
    template: `<div style="display: flex; justify-content: center; align-items: center; height: 100vh; margin-top: -100px;">   
    <div style="width: 300px; margin: auto; border: 0;">
        <h1 style="text-align: center;">User Login</h1>
        <form @submit.prevent="login">

            <div>
                <label for="autoSizingInputGroup" class="form-label">Username</label>
                <div class="input-group">
                    <div class="input-group-text">@</div>
                    <input type="text" class="form-control" id="username" placeholder="Username" v-model="cred.username">
                </div>
                
                <div class="mb-3">
                    <label for="exampleInputPassword1" style="margin-top:10px;" class="form-label">Password</label>
                    <input type="password" class="form-control" id="password" placeholder="Password" v-model="cred.password">
                </div>
                
                <div style="display: flex; justify-content: center; margin-top: 10px;">
                    <button type="submit" class="btn btn-primary" style="margin-right: 5px;">Login</button>
                    <router-link to="/user-register" button type="button" class="btn btn-warning" style="margin-left: 5px;">Register</router-link>
                </div>
            </div>
        </form>
    </div>
</div>`,

    data() {
        return {
            cred: {
                username: null,
                password: null,
            },
            error: null,
        }
    },
    methods: {
        async login(){
            const res = await fetch('/user-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.cred),
            })
            const data = await res.json()
            if(res.ok){
                localStorage.setItem('auth-token', data.token)
                localStorage.setItem('role', 'customer')
                localStorage.setItem('user_id', data.user_id)
                this.$router.push({ path: '/user'})
            } else {
                this.error = data.message
            }
        },
    },
}