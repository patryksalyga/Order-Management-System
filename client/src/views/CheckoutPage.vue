<template>
    <div class="container">
        <div class="row w-100">
            <div class="col-lg-12 col-md-12 col-12">
                <h3 class="display-5 mb-2 text-center">Shopping Cart</h3>
                <p class="mb-5 text-center">
                    <i class="text-info font-weight-bold">{{ items }}</i> items in your cart
                </p>
                <table id="shoppingCart" class="table table-condensed table-responsive">
                    <thead>
                        <tr>
                            <th style="width:60%">Product</th>
                            <th style="width:12%">Price</th>
                            <th style="width:10%">Quantity</th>
                            <th style="width:16%"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(product, index) in products" :key="index">
                            <td data-th="Product">
                                <div class="row">
                                    <div class="col-md-9 text-left mt-sm-2">
                                        <h4>{{ product.name }}</h4>
                                    </div>
                                </div>
                            </td>
                            <td data-th="Price">${{ product.price.toFixed(2) }}</td>
                            <td data-th="Quantity">
                                <input type="number" class="form-control form-control-lg text-center"
                                    v-model.number="product.quantity" min="1">
                            </td>
                            <td class="actions" data-th="">
                                <div class="text-right">
                                    <button class="btn btn-white border-secondary bg-white btn-md mb-2"
                                        @click="updateProduct(index)">
                                        <i class="fas fa-sync"></i>
                                        <span class="glyphicon glyphicon-ok"></span>
                                    </button>
                                    <button class="btn btn-white border-secondary bg-white btn-md mb-2"
                                        @click="removeProduct(index)">
                                        <span class="glyphicon glyphicon-remove"></span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="float-right text-right">
                    <h4>Subtotal:</h4>
                    <h1>{{ total }}</h1>
                </div>
            </div>
        </div>
        <div class="row mt-4 d-flex align-items-center">
            <div class="col-sm-6 order-md-2 text-right">
                <button class="btn btn-primary gradient-custom-4 mb-4 btn-lg pl-5 pr-5"
                    @click="createOrder()">Checkout</button>
            </div>
            <div class="col-sm-6 mb-3 mb-m-1 order-md-1 text-md-left align-middle">
                <a href="catalog.html">
                    <i class="fas fa-arrow-left mr-2"></i> Continue Shopping</a>
            </div>
        </div>
    </div>
</template>

<style scoped>
@media (min-width: 1025px) {
    .h-custom {
        height: 100vh !important;
    }
}

.card-registration .select-input.form-control[readonly]:not([disabled]) {
    font-size: 1rem;
    line-height: 2.15;
    padding-left: .75em;
    padding-right: .75em;
}

.card-registration .select-arrow {
    top: 13px;
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

<script>
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import OrderService from '@/services/orderService';

export default {
    name: 'CheckoutPage',
    data() {
        return {
            items: 3,
            total: "$0.00",
            products: [

            ],
            request: []
        };
    },
    methods: {
        fetchProducts() {
            // Logic to fetch the products from the cart
            console.log('Fetching products from the cart');
            this.products = [];

            this.items = this.$store.state.cart.cart.length;

            for (let i = 0; i < this.items; i++) {
                this.products.push(this.$store.state.cart.cart[i]);
            }

            this.total = "$" + this.$store.state.cart.cartTotal.toFixed(2);
        },
        async updateProduct(index) {
            // Logic to update the product quantity
            console.log(`Updated product at index ${index}`);

            console.log(this.products[index]);

            await this.$store.dispatch('cart/updateCart', { product: this.products[index] });
            toast('Cart updated', { autoClose: 1000 });
            this.fetchProducts();
        },
        async removeProduct(index) {
            // Logic to remove the product from the cart
            await this.$store.dispatch('cart/removeFromCart', { product: this.products[index] });
            toast('Removed from cart', { autoClose: 1000 });
            console.log(`Removed product at index ${index}`);
            this.fetchProducts();
        },
        async createOrder() {
            // Logic to create an order
            console.log('Creating order');
            this.request = {
                products: this.products.map(product => ({
                    product: product.sku,
                    quantity: product.quantity
                }))
            };
            await OrderService.create(this.request);
            toast('Order created', { autoClose: 1000 });
            await this.$store.dispatch('cart/clearCart');
            this.fetchProducts();
        }
    },
    mounted() {
        this.fetchProducts();
    },
    computed: {
        currentUser() {
            return this.$store.state.auth.user;
        },
    },
}
</script>