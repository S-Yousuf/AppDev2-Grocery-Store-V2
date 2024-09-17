export default {
    template: `<div style="display: flex; justify-content: center; align-items: center; height: 100vh; margin-top: -50px;">   
    <div style="width: 300px; margin: auto; border: 0;">
        <form @submit.prevent="registerUser">
            <h1 style="text-align: center;">User Register</h1>

            <div class="mb-3">
                <label class="form-label" for="specificSizeInputName">Name</label>
                <input v-model="cred.name" type="text" class="form-control" id="specificSizeInputName" placeholder="Jane Doe">
            </div>

            <div class="col-auto">
                <label class="visually-hidden" for="autoSizingInputGroup">Username</label>
                <div class="input-group">
                    <div class="input-group-text">@</div>
                    <input v-model="cred.username" type="text" class="form-control" id="autoSizingInputGroup" placeholder="Username" name="username">
                </div>
            </div>

            <div class="mb-3" style="margin-top: 10px;">
                <label for="exampleInputPassword1" class="form-label">Password</label>
                <input v-model="cred.password" type="password" class="form-control" id="exampleInputPassword1" name="password" placeholder="password">
            </div>

            <div id="passwordHelpBlock" class="form-text" >
                Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special
                characters, or emoji.
            </div>

            <div class="mb-3 form-check" style="margin-top: 10px;">
                <input type="checkbox" class="form-check-input" id="exampleCheck1">
                <label class="form-check-label" for="exampleCheck1">Remember Me</label>
            </div>

            <div style="display: flex; justify-content: center; margin-top: 10px;">
                <button type="submit" class="btn btn-primary">Submit</button>
            </div>
        </form>
    </div>
</div>`,
    data(){
        return {
            cred: {
                name: null,
                username: null,
                password: null,
            },
            error: null,
        }
    },
    methods: {
        async registerUser(){
            const res = await fetch('/user-register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.cred),
            });
            const data = await res.json();
            if (!res.ok){
                throw new Error(data.message || 'Failed to register user');
            }
            this.$router.push({ path: '/login' });
        },
    },
}