<template>
  <div class="row">
    <div class="col-md-6 d-flex justify-content-center">
      <img :src="product.image || 'https://dummyimage.com/600x700/dee2e6/6c757d.jpg'" alt="Product image"
        class="card-img-top mb-5 mb-md-0" />
    </div>
    <div class="col-md-6">
      <div class="text-section">
        <p class="text-muted">{{ product.sku }}</p>
        <h1>{{ product.name }}</h1>
        <p class="lead">${{ product.price }}</p>
        <p>{{ product.description }}</p>
        <div v-if="role === 'USER'" class="form-group">
          <label for="quantity">Quantity</label>
          <input type="number" class="form-control" id="quantity" v-model="quantity" />
        </div>
        <button v-if="role === 'USER'" class="btn btn-primary gradient-custom-4" @click="addToCart">Add to Cart</button>
        <router-link :to="`/editpage/${product.sku}`"><button v-if="role === 'EMPLOYEE'" class="btn btn-primary gradient-custom-4">Edit</button></router-link>
      </div>
    </div>
  </div>
</template>

<script>
import ProductService from '@/services/productService';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  name: 'ProductPage',
  data() {
    return {
      product: {
        image: 'https://dummyimage.com/600x700/dee2e6/6c757d.jpg', // Default image URL
        sku: 'BST-498',
        name: 'Shop item template',
        price: 40.00,
        description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium at dolorem quidem modi.
                      Nam sequi consequatur obcaecati excepturi alias magni, accusamus eius blanditiis delectus ipsam minima
                      ea iste laborum vero?`,
      },
      quantity: 1, // Default quantity
      role: "",
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  mounted() {
    if (!this.currentUser) {
      this.$router.push('/loginpage');
    }
    this.role = this.currentUser.role;
    this.loadProduct();
  },
  methods: {
    async loadProduct() {
      try {
        const productId = this.$route.params.productId;
        // console.log(productId);
        // Fetch the product details using the productId
        const response = await ProductService.getById(productId);
        // console.log(response.data);
        this.product.sku = response.data._id;
        this.product.name = response.data.name;
        this.product.price = response.data.price;
        this.product.description = response.data.description;
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    },
    async addToCart() {
      this.product.quantity = this.quantity;

      await this.$store.dispatch('cart/addToCart', { product: this.product, quantity: this.quantity });
      toast('Added to cart', { autoClose: 1000 });

    },
    updateProduct() {
      this.$router.push({ name: 'EditProductPage', params: { productId: this.product.sku } });
    },
  },
}
</script>

<style scoped>
.container {
  height: 100vh;
}

.row {
  width: 100%;
}

.col-md-6 {
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-section {
  padding: 3rem;
  /* Adjust the padding value as needed */
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
}

.gradient-custom-4 {
  /* fallback for old browsers */
  background: #84fab0;

  /* Chrome 10-25, Safari 5.1-6 */
  background: -webkit-linear-gradient(to right, rgba(132, 250, 176, 1), rgba(143, 211, 244, 1));

  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  background: linear-gradient(to right, rgba(132, 250, 176, 1), rgba(143, 211, 244, 1));
}
</style>