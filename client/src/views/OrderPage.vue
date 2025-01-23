<template>
    <div>
        <div class="modal fade" id="orderStatusUpdate" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
            aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Update Order</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <label for="statusUpdate">Select New Status:</label>
                        <select id="statusUpdate" v-model="selectedUpdate">
                            <option value="676056a5fb1e278d5d011a33">Pending</option>
                            <option value="676056a5fb1e278d5d011a34">Approved</option>
                            <option value="676056a5fb1e278d5d011a36">Completed</option>
                            <option value="676056a5fb1e278d5d011a35">Cancelled</option>
                        </select>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary gradient-custom-4" @click="updateProduct()"
                            data-dismiss="modal">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="rateOrder" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
            aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Rate your order</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <label for="rating">Select Rating:</label>
                        <div id="rating" class="star-rating">
                            <span v-for="star in 5" :key="star" class="star" :class="{ 'selected': star <= selectedRating }"
                                @click="setRating(star)">
                                ★
                            </span>
                        </div>
                        <br>
                        <label for="comment">Comment:</label><br>
                        <textarea id="comment" v-model="comment" class="large-textarea"></textarea>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary gradient-custom-4" @click="createReview()"
                            data-dismiss="modal">Send</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="header">
            <h2>Orders</h2>
            <div>
                <label for="statusFilter">Filter by Status:</label>
                <select id="statusFilter" v-model="selectedStatus" @change="filterOrders">
                    <option value="">All</option>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                </select>
            </div>
        </div>
        <div class="orders" v-if="filteredOrders.length">
            <div v-for="order in filteredOrders" :key="order.id" class="order-table">
                <h3>Order ID: {{ order._id }}</h3>
                <h4>Order Status: {{ order.name }}</h4>
                <h4>Order Date: {{ order.date }}</h4>
                <table>
                    <thead>
                        <tr>
                            <th style="width:70%">Product</th>
                            <th style="width:18%">Price</th>
                            <th style="width:12%">Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(product, index) in order.products" :key="index">
                            <td data-th="Product">
                                <div class="row">
                                    <div class="col-md-9 text-left mt-sm-2">
                                        <h5>{{ product.name }}</h5>
                                    </div>
                                </div>
                            </td>
                            <td data-th="Price">${{ product.price.toFixed(2) }}</td>
                            <td data-th="Quantity">{{ product.quantity }}</td>
                        </tr>
                    </tbody>
                </table>
                <div v-if="order.rating">
                    <p style="font-weight: bolder;">Rating:</p>
                    <div class="star-rating">
                        <span v-for="star in 5" :key="star" class="star" :class="{ 'selected': star <= order.rating }">
                            ★
                        </span>
                    </div>
                    <p style="font-weight: bolder;">Comment:</p>
                    <p style="font-style: oblique;">{{ order.review }}</p>
                </div>
                <button v-if="role === 'EMPLOYEE' && (order.name === 'PENDING' || order.name === 'APPROVED')"
                    class="btn btn-success btn-block btn-lg gradient-custom-4 text-body" data-toggle="modal"
                    data-target="#orderStatusUpdate" @click="updateOrderId(order._id)">Update Order</button>
                <button v-if="role === 'USER' && (order.name === 'COMPLETED' || order.name === 'CANCELLED') && !order.rating"
                    class="btn btn-success btn-block btn-lg gradient-custom-4 text-body" data-toggle="modal"
                    data-target="#rateOrder" @click="updateOrderId(order._id)">Rate your Order</button>
            </div>
        </div>
        <p v-else>No orders found.</p>
    </div>
</template>

<script>
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

import orderService from '@/services/orderService';
import productService from '@/services/productService';
import statusService from '@/services/statusService';


export default {
    name: "OrderPage",
    data() {
        return {
            role: "",
            orders: [],
            selectedStatus: "",
            selectedUpdate: "",
            filteredOrders: [],
            orderId: "",
            selectedRating: 0,
            comment: '',
            rating: 0
        }
    },
    computed: {
        currentUser() {
            return this.$store.state.auth.user;
        }
    },
    mounted() {
        this.role = this.currentUser.role;
        this.fetchOrders();
    },
    methods: {
        fetchOrders() {
            if (this.role === 'EMPLOYEE') {
                orderService.getAll()
                    .then(response => {
                        this.orders = response.data;
                        this.fetchProductNames();
                        this.fetchOrderNames();
                        this.formatDate();
                        this.filterOrders();
                    })
                    .catch(error => {
                        console.error('Failed to fetch orders:', error);
                    });
            } else if (this.role === 'USER') {
                orderService.getOrdersByUser()
                    .then(response => {
                        this.orders = response.data;
                        this.fetchProductNames();
                        this.fetchOrderNames();
                        this.formatDate();
                        this.filterOrders();

                        console.log(this.orders);
                    })
                    .catch(error => {
                        console.error('Failed to fetch user orders:', error);
                    });
            }
        },
        fetchProductNames() {
            this.orders.forEach(order => {
                order.products.forEach(product => {
                    productService.getById(product.product)
                        .then(response => {
                            product.name = response.data.name;
                        })
                        .catch(error => {
                            console.error('Failed to fetch product:', error);
                        });
                });
            });
        },
        fetchOrderNames() {
            this.orders.forEach(order => {
                statusService.getById(order.status)
                    .then(response => {
                        order.name = response.data.name;
                    })
                    .catch(error => {
                        console.error('Failed to fetch order:', error);
                    });
            });
        },
        formatDate() {
            this.orders.forEach(order => {
                const date = new Date(order.createdAt);
                order.date = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
            });
        },
        filterOrders() {
            if (this.selectedStatus) {
                this.filteredOrders = this.orders.filter(order => order.name === this.selectedStatus);
            } else {
                this.filteredOrders = this.orders;
            }
        },
        updateOrderId(orderId) {
            this.orderId = orderId;
        },
        updateProduct() {
            // Logic to update product quantity or other details
            console.log(`Updating product status ${this.selectedUpdate} in order ${this.orderId}`);

            this.selectedUpdate = {
                status: this.selectedUpdate
            };

            orderService.update(this.orderId, this.selectedUpdate)
                .then(() => {
                    toast('Status updated', { autoClose: 1000 });
                    this.fetchOrders();
                })
                .catch(() => {
                    toast('Failed to update order status', { autoClose: 1000 });
                });
        },
        setRating(star) {
            this.selectedRating = star;
        },
        createReview() {
            // Logic to create a review
            console.log(`Rating: ${this.selectedRating}, Comment: ${this.comment}`);
            const review = {
                rat: this.selectedRating,
                des: this.comment
            };

            orderService.createReview(this.orderId, review)
                .then(() => {
                    toast('Review created', { autoClose: 1000 });
                    this.fetchOrders();
                })
                .catch(() => {
                    toast('Failed to create review', { autoClose: 1000 });
                });
        }
    }
}
</script>

<style scoped>
.header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
}

.order-table {
    margin-bottom: 20px;
    border: 1px solid #ddd;
}

table {
    border: 1px solid #ddd;
    width: 100%;
}

.gradient-custom-4 {
    /* fallback for old browsers */
    background: #84fab0;

    /* Chrome 10-25, Safari 5.1-6 */
    background: -webkit-linear-gradient(to right, rgba(132, 250, 176, 1), rgba(143, 211, 244, 1));

    /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    background: linear-gradient(to right, rgba(132, 250, 176, 1), rgba(143, 211, 244, 1));
}

.star-rating {
    display: flex;
    flex-direction: row;
}

.star {
    font-size: 2rem;
    cursor: pointer;
    color: #ccc;
}

.star.selected {
    color: #f39c12;
}

.large-textarea {
    width: 100%;
    height: 150px;
    /* Adjust the height as needed */
    resize: vertical;
    /* Allow vertical resizing */
}

.orders > div{
    padding: 20px;
}
</style>