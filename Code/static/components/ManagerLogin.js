export default {
    template: `
      <div class="box-container">
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; margin-top: -100px;">
      <div style="width: 300px; margin: auto; border: 0;">
          <h1 style="text-align: center;">Manager Login</h1>
          <form @submit.prevent="managerLogin">

              <div>
                  <label for="form-label" class="form-label" >Username</label>
                  <input v-model="cred.username" type="text" class="form-control" placeholder="Admin" name="username">

                  <label for="exampleInputPassword1" class="form-label" style="margin-top:10px;">Password</label>
                  <input v-model="cred.password" type="password" class="form-control" id="exampleInputPassword1" placeholder="Password" name="password">

                  <div style="display: flex; justify-content: center; margin-top: 10px;">
                      <button type="submit" id="btnm" class="btn btn-primary" style="margin-right: 5px;">Login</button>

                  </div>

              </div>
          </form>
      </div>
    </div>
  </div>
`,
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
        async managerLogin() {
            const res = await fetch('/manager-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.cred),
            })
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('auth-token', data.token)
                const tokenPayload = JSON.parse(atob(data.token.split('.')[1]))
                const role = tokenPayload.sub.role
                localStorage.setItem('role', role)

                if (role === 'admin') {
                    this.$router.push({ path: '/admin' })
                } else if (role === 'manager') {
                    this.$router.push({ path: '/manager' })
                }
                
            } else {
                this.error = data.message
            }
        },
    },
}
