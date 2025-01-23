import axios from "axios";
//import authHeader from "./authHeader";

const API_URL = "http://localhost:3000/api/";

class AuthService {
  login(user) {
    return axios
      .post(API_URL + "auth", {
        usr: user.username,
        pwd: user.password },
        { withCredentials: true }) // This is the important part
      .then((response) => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(user) {
    return axios.post(API_URL + "register", {
      usr: user.name,
      pwd: user.passwd,
      mail: user.email,
      num: user.number,
    })
  }

  // refresh() {
  //   console.log("REFRESHING TOKEN");
  //   return axios
  //     .get(API_URL + "refresh")
  //     .then((response) => {
  //       if (response.data.accessToken) {
  //         // Store the new access token in localStorage
  //         localStorage.setItem("user", JSON.stringify(response.data));
  //       }
  //       console.log("New Access Token:", response.data.accessToken);
  //       return response.data;
  //     })
  //     .catch((error) => {
  //       console.error("Token refresh failed:", error);
  //       throw error; // Propagate the error if refresh fails
  //     });
  // }
  
}

export default new AuthService();
