import React, { Component } from "react";
//import { Link } from "react-router-dom";
import AuthenticatorService from "../../services/authservice.js";

// Pagina di benvenuto
export default class WelcomeComponent extends Component {

    render() {
        return (
            <div className='WelcomeComponent'>
                <h4>Bentornato, {AuthenticatorService.getUserInformations()}!</h4>
                {/* <p>Ciao {this.props.match.params.userID}! Clicca <Link to='/clienti'>qui</Link> per vedere i clienti disponibili.</p> */}
                <p> Per navigare, scegli fra le sezioni qui sopra. Buon lavoro!</p>
                <img className="welcome" src={`../shop.png`} width="300" height="300" alt=""/>
            </div>
        )
    }

    // Creo metodo di gestione risposta: devo estrapolare il "data" dalla risposta dell'API
    handleAPIResponse = (risposta) => {
        this.setState({ messaggio: risposta.data });
    }

    // Creo metodo di gestione errore
    handleAPIError = (errore) => {
        console.log(errore.response.data.message);
    }
}