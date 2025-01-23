<template>
  <div class="jumbotron">
    <div class="container text-center">
      <h1>Online Store</h1>
      <p>Mission, Vission & Values</p>
    </div>
  </div>
  <nav class="navbar navbar-inverse">
    <div class="container-fluid">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <img src="./assets/logo.png" class="navbar-brand">
      </div>
      <div class="collapse navbar-collapse" id="myNavbar">
        <ul class="nav navbar-nav">
          <li class="active"><router-link :to="{ name: 'HomePage' }">Home</router-link></li>
        </ul>
        <ul class="nav navbar-nav navbar-right">
          <li v-if="currentUser"><router-link :to="{ name: 'OrderPage' }"><span class="glyphicon glyphicon-user"></span> Orders </router-link></li>
          <li v-if="currentUser"><router-link :to="{ name: 'CheckoutPage' }"><span class="glyphicon glyphicon-shopping-cart"></span> Cart</router-link></li>
          <li v-if="currentUser && currentUser.role === 'EMPLOYEE'"><router-link to="./src/settingspage"><span class="glyphicon glyphicon-cog"></span> Settings </router-link></li>
          <li v-if="currentUser"><a href="#" @click="logout"><span class="glyphicon glyphicon-log-out"></span> Logout</a>
          </li>
          <li v-if="!currentUser"><router-link to="./src/loginpage"><span class="glyphicon glyphicon-log-in"></span>
              Login</router-link></li>
          <li v-if="!currentUser"><router-link to="./src/registerpage"><span class="glyphicon glyphicon-user"></span>
              Register</router-link></li>
        </ul>
      </div>
    </div>
  </nav>
  <div class="container">
    <router-view />
  </div><br><br>

  <footer class="container-fluid text-center">
    <p>@ 2025, Natalia Nykiel, Patryk Sałyga </p>
  </footer>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

// Access Vuex store and Vue Router
const store = useStore();
const router = useRouter();

const currentUser = computed(() => store.state.auth.user);
if (!currentUser.value) {
  router.push('/loginpage');
}

const logout = () => {
  store.dispatch('cart/clearCart');
  store.dispatch('auth/logout');
  router.push('/loginpage');
};

onMounted(async () => {
  await store.commit('cart/initialiseStore');
});
</script>

<style scoped>
/* Remove the navbar's default rounded borders and increase the bottom margin */
.navbar {
  margin-bottom: 50px;
  border-radius: 0;
}

/* Remove the jumbotron's default bottom margin */
.jumbotron {
  margin-bottom: 0;
}

/* Add a gray background color and some padding to the footer */
footer {
  background-color: #f2f2f2;
  padding: 25px;
}
</style>