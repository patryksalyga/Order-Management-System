<template>
  <div class="container">
    <input type="text" v-model="searchQuery" placeholder="Search products by name" class="form-control mb-3">
    <div v-for="(group, index) in chunkedProducts" :key="index" class="row">
      <div class="col-sm-4" v-for="product in group" :key="product._id">
        <router-link :to="`/productpage/${product._id}`">
        <div class="panel panel-default">
          <div class="panel-heading">{{ product.name }}</div>
          <div class="panel-body">
            <img :src="product.image ? require(`@/assets/${product.image}`) : require('@/assets/logo.png')" class="img-responsive" style="width:100%" alt="Image">
          </div>
          <div class="panel-footer">
            ${{ product.price }}
          </div>
        </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import ProductService from "@/services/productService"; 

export default {
    name: "HomePage",
    data() {
        return {
            products: [], // Store fetched products
            searchQuery: '', // Store search query
        };
    },
    computed: {
        filteredProducts() {
            const query = this.searchQuery.toLowerCase();
            return this.products.filter(product => product.name.toLowerCase().startsWith(query));
        },
        chunkedProducts() {
            const chunkSize = 3;
            const chunks = [];
            for (let i = 0; i < this.filteredProducts.length; i += chunkSize) {
                chunks.push(this.filteredProducts.slice(i, i + chunkSize)); // Create chunks of 3 products
            }
            return chunks;
        },
    },
    methods: {
        async fetchProducts() {
            try {
                const response = await ProductService.getAll();
                this.products = response.data; // Assuming response.data contains the array of products
            }
            catch (error) {
                console.error("Error fetching products:", error);
            }
        },
        startAutoUpdate() {
            this.autoUpdateInterval = setInterval(() => {
                this.fetchProducts();
            }, 60000);
        },
        stopAutoUpdate() {
            if (this.autoUpdateInterval) {
                clearInterval(this.autoUpdateInterval);
            }
        }
    },
    mounted() {
        this.fetchProducts();
        this.startAutoUpdate();
    },
    beforeUnmount() {
        this.stopAutoUpdate();
    },
};
</script>

<style>
.panel {
  margin-bottom: 20px;
}

.panel-footer{
  text-align: right;
}

.form-control {
  margin-bottom: 20px;
}
</style>