import axios from "axios";
import authHeader from "./authHeader";

const API_URL = "http://localhost:3000/api/";

class OrderService{
    async getAll(){
        return axios.get( API_URL+"orders" , { headers: authHeader() });
    }

    async getOrdersByUser(){
        return axios.get( API_URL+"orders/user" , { headers: authHeader(), withCredentials: true });
    }

    async getById(id){
        return axios.get( API_URL+"orders/"+id , { headers: authHeader() });
    }

    async create(order){
        return axios.post( API_URL+"orders", order , { headers: authHeader() , withCredentials: true});
    }

    async update(id, status){
        return axios.patch( API_URL+"orders/"+id, status , { headers: authHeader() });
    }

    async createReview(id, review){
        return axios.post( API_URL+"orders/"+id+"/opinions", review , { headers: authHeader() , withCredentials: true});
    }
}

export default new OrderService();