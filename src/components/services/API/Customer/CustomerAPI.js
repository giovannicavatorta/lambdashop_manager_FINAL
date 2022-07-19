import axios from "axios";

class CustomersService {
    
    state = {
        serverRequestURL: "http://localhost:5071/api/customers",

        // Qui avendo inserito la BasicAuth su backend devo effettuare delle modifiche

        // user: "admin",
        // psw: "admin"
    }

    getAllCustomers = () => {
        // Test per l'auth
        // let BasicAuthHeader = "Basic " + window.btoa(this.state.user + ":" + this.state.psw);
        return axios.get(`${this.state.serverRequestURL}/find/all`);
    }

    findCustomerByCodice = (codice) => {
        return axios.get(`${this.state.serverRequestURL}/find/code/${codice}`);
    }

    findCustomerByNome = (nome) => {
        return axios.get(`${this.state.serverRequestURL}/find/name/${nome}`);
    }

    findCustomerByPunti = (punti) => {
        return axios.get(`${this.state.serverRequestURL}/find/points/${punti}`);
    }

    deleteCustomer = (id) => {
        return axios.delete(`${this.state.serverRequestURL}/delete/id/${id}`);
    }

    insertCustomer = (customer) => {
        return axios.post(`${this.state.serverRequestURL}/insert`, customer)
    }
}

export default new CustomersService();