export const cart = {
    namespaced: true,
    state: {
        cart: [],
        cartTotal: 0
    },
    actions: {
        initialiseStore({ commit }) {
            commit('initialiseStore');
        },
        addToCart({ commit }, payload) {
            commit('addToCart', payload);
        },
        removeFromCart({ commit }, productId) {
            commit('removeFromCart', productId);
        },
        updateCart({ commit }, payload) {
            commit('updateCart', payload);
        },
        clearCart({ commit }) {
            commit('clearCart');
        }
    },
    mutations: {
        initialiseStore(state) {
            if (localStorage.getItem('cart')) {
                state.cart = JSON.parse(localStorage.getItem('cart'));
            }
            if (localStorage.getItem('cartTotal')) {
                state.cartTotal = parseFloat(localStorage.getItem('cartTotal'));
            }
        },
        addToCart(state, payload) {
            const existingProduct = state.cart.find(item => item.sku === payload.product.sku);

            if (existingProduct) {
                existingProduct.quantity += payload.quantity;
            } else {
                payload.product.quantity = payload.quantity;
                state.cart.push(payload.product);
            }

            //calculating the total
            state.cartTotal = state.cart.reduce((accumulator, object) => {
                return parseFloat(accumulator) + parseFloat(object.price * object.quantity);
            }, 0);

            //saving in web storage
            localStorage.setItem('cartTotal', JSON.stringify(state.cartTotal));
            localStorage.setItem('cart', JSON.stringify(state.cart));
        },
        removeFromCart(state, payload) {
            // Remove the item from the cart
            state.cart = state.cart.filter(item => item.sku !== payload.product.sku);

            // Calculating the total
            state.cartTotal = state.cart.reduce((accumulator, object) => {
                return parseFloat(accumulator) + parseFloat(object.price * object.quantity);
            }, 0);

            // Saving in web storage
            localStorage.setItem('cartTotal', JSON.stringify(state.cartTotal));
            localStorage.setItem('cart', JSON.stringify(state.cart));
        },
        updateCart(state, payload) {
            const product = state.cart.find(o => o.sku === payload.product.sku);
            if (product) {
                product.quantity = payload.product.quantity;

                //calculating the total
                state.cartTotal = state.cart.reduce((accumulator, object) => {
                    return parseFloat(accumulator) + parseFloat(object.price * object.quantity);
                }, 0);

                //saving in web storage
                localStorage.setItem('cartTotal', JSON.stringify(state.cartTotal));
                localStorage.setItem('cart', JSON.stringify(state.cart));
            }
        },
        clearCart(state) {
            state.cart = [];
            state.cartTotal = 0;

            //clearing the web storage
            localStorage.removeItem('cartTotal');
            localStorage.removeItem('cart');
        }
    }
};