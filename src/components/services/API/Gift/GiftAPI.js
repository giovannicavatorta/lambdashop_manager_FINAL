import axios from "axios";

class GiftService {

    state = {
        serverRequestURL: "http://localhost:5071/api/gifts",

        // Qui avendo inserito la BasicAuth su backend devo effettuare delle modifiche

        // user: "admin",
        // psw: "admin"
    }

    getAllGifts = () => {
        // Test per l'auth
        // let BasicAuthHeader = "Basic " + window.btoa(this.state.user + ":" + this.state.psw);
        return axios.get(`${this.state.serverRequestURL}/find/all`);
    }

    findGiftByCodice = (codice) => {
        return axios.get(`${this.state.serverRequestURL}/find/code/${codice}`);
    }

    findGiftByNome = (nome) => {
        return axios.get(`${this.state.serverRequestURL}/find/name/${nome}`);
    }

    findGiftByPunti = (prezzo) => {
        return axios.get(`${this.state.serverRequestURL}/find/price/${prezzo}`);
    }

    deleteGift = (id) => {
        return axios.delete(`${this.state.serverRequestURL}/delete/id/${id}`);
    }

    insertGift = (gift) => {
        return axios.post(`${this.state.serverRequestURL}/insert`, gift)
    }
}

export default new GiftService();