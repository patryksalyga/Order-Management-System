import axios from "axios";
import authHeader from "./authHeader";
//import authService from "./authService";

const API_URL = "http://localhost:3000/api/";

class ProductService {
    async getAll(){
        //await authService.refresh();
        return axios.get( API_URL+"products", { headers: authHeader() } );
    }

    async getById(id){
        return axios.get( API_URL+"products/"+id, { headers: authHeader() } );
    }

    async seoDescription(id){
        return axios.get( API_URL+"products/"+id+"/seo-description", { headers: authHeader() } );
    }

    async update(id, data){
        return axios.put( API_URL+"products/"+id, data, { headers: authHeader() } );
    }
}

export default new ProductService();