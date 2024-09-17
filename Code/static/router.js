import Home from './components/Home.js';
import Login from './components/login.js';
import Admin from './components/AdminHome.js';
import UsersHome from './components/UserHome.js';
import ManagerLogin from './components/ManagerLogin.js';
import Manager from './components/ManagerHome.js';
import UserRegister from './components/UserRegister.js';
import Users from './components/Users.js';
import Cart from './components/Cart.js';
import addCategory from './components/addCategory.js';
import addProduct from './components/addProduct.js';
import editCategory from './components/editCategory.js';
import deleteCategory from './components/deleteCategory..js';
import addToCart from './components/addToCart.js';
import actions from './components/actions.js';
import deleteProduct from './components/deleteProduct.js';
import review from './components/review.js';
import checkout from './components/checkout.js';

const routes = [
    {path: '/', component: Home, name: 'Home'},
    {path: '/login' , component: Login, name: 'Login'},
    {path: '/user', component: UsersHome, name: 'UserHome'},
    {path: '/manager-login', component: ManagerLogin, name: 'ManagerLogin'},
    {path: '/admin', component: Admin },
    {path: '/manager', component: Manager },
    {path: '/user-register', component: UserRegister},
    {path: '/users', component: Users },    
    {path: '/add_category', component: addCategory},
    {path: '/add_product/:c_id', component: addProduct},
    {path: '/action/:p_id', component: actions, props: true},
    {path: '/addToCart/:id', name:addToCart, component: addToCart, props: true},
    {path: '/delete_product/:p_id', name:'deleteProduct', component:deleteProduct, props: true},
    {path: '/checkout', name:'checkout', component: checkout},
    {path: '/review/:id', name:'review', component: review, props: true},

    { path: '/cart/:u_id',
      component: Cart,
      name: 'Cart',
      props: true, 
    },

    {
        path: '/edit_category/:id',
        name: 'editCategory',
        component: editCategory,
        props: true
    },
    
    {
        path: '/delete_category/:id',
        name: 'deleteCategory',
        component: deleteCategory,
        props: true
    },

];

export default new VueRouter({
    routes,
});
