import axios from "axios";
import authHeader from "./authHeader";

const API_URL = "http://localhost:3000/api/";

class StatusService{
    async getAll(){
        return axios.get( API_URL+"statuses" , { headers: authHeader() });
    }
    async getById(id){
        return axios.get( API_URL+"statuses/"+id , { headers: authHeader() });
    }
}

export default new StatusService();