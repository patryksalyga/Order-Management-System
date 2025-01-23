import axios from "axios";
import authHeader from "./authHeader";

const API_URL = "http://localhost:3000/api/";

class InitService {
  async getInit(file) {
    return await axios.post(API_URL + "init", file, { headers: authHeader() });
  }
}

export default new InitService();