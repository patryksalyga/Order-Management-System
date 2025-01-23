<template>
    <div class="row">
        <div class="col-md-12">
            <div class="text-section">
                <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text" class="form-control" id="name" v-model="product.name" />
                </div>
                <div class="form-group">
                    <label for="price">Price</label>
                    <input type="number" class="form-control" id="price" v-model="product.price" />
                </div>
                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea class="form-control" id="description" v-model="product.description"></textarea>
                    <button class="btn btn-secondary" @click="generateDescription">Generate Description</button>
                    <button class="btn btn-secondary" @click="revertDescription">Revert to Original Description</button>
                </div>
                <router-link :to="`/productpage/${product.sku}`">
                    <button class="btn btn-primary btn-block btn-lg gradient-custom-4 text-body"
                        @click="updateProduct">Edit</button>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import ProductService from '@/services/productService';
export default {
    data() {
        return {
            product: {
                sku: '',
                name: '',
                price: 0,
                description: '',
            },
            quantity: 0,
            role: 'EMPLOYEE' // Assuming role is set somewhere in your application
        };
    },
    mounted() {
        // Fetch product data and set it to this.product
        // Assuming you have a method to fetch product data
        this.fetchProductData();
    },
    methods: {
        async fetchProductData() {
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
                this.originalDescription = response.data.description; // Store original description
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        },
        async generateDescription() {
            // Logic to generate description
            const response = await ProductService.seoDescription(this.product.sku);
            this.product.description = response.data;
        },
        async updateProduct() {
            // Logic to update product 
            const data = {
                name: this.product.name,
                price: this.product.price,
                description: this.product.description
            };

            const response = await ProductService.update(this.product.sku, data);
            console.log(response);
        },
        revertDescription() {
            this.product.description = this.originalDescription; // Revert to original description
        }
    }
};
</script>

<style>
.text-section {
    margin-top: 20px;
}

.form-group {
    margin-bottom: 15px;
}

.gradient-custom-4 {
    /* fallback for old browsers */
    background: #84fab0;

    /* Chrome 10-25, Safari 5.1-6 */
    background: -webkit-linear-gradient(to right, rgba(132, 250, 176, 1), rgba(143, 211, 244, 1));

    /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    background: linear-gradient(to right, rgba(132, 250, 176, 1), rgba(143, 211, 244, 1));
}

button{
    margin-right: 10px;
}
</style>