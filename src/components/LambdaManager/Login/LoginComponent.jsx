import React, {Component} from "react";
import "./LoginComponent.css";
// Importo il servizio di auth
import AuthenticatorService from "../../services/authservice.js";

// Componente per il login
export default class LoginComponent extends Component {

    state = {
        userID: '',
        password: '',
        loggedIn: false,
        notLogged: false
    }

    // Metodo login
    login = () => {
        console.log(this.state.userID + ' ' + this.state.password);

        // Gestisco l'autenticazione
        AuthenticatorService.authenticateUser(this.state.userID, this.state.password)
        // Se utente e psw sono corretti, allora
        .then(() => {
            AuthenticatorService.setUserInformations(this.state.userID, this.state.password);
            this.props.history.push("/welcome");
        })
        // Altrimenti faccio come prima e setto notLogged, loggedIn
        .catch(() => {
            this.setState({loggedIn: false});
            this.setState({notLogged: true});
        })
    }

    // Metodo per cambiare lo state in base a quanto scritto nelle textbox User e Password
    gestMod = (event) => {
        this.setState(
            {
                // Modifico i valori nello state prendendo i 'name' dei textbox.
                // Ovviamente la condizione è che il 'name' della textbox
                // coincida con i nomi delle variabili nello state
                [event.target.name]: event.target.value
            }
        )
    }

    // Inizializzo i textbox e il bottone 'Accedi'
    render() {
        return (
            <div>
                <h4>Ciao! Per accedere all'app di gestione del negozio, devi prima eseguire l'accesso.</h4>
                <p>Nome Utente: <input type='text' name='userID' value={this.state.userID} onChange={this.gestMod}/></p>
                <p>Password: <input type='password' name='password' value={this.state.password} onChange={this.gestMod}/></p>
                <button type='button' className='btn btn-primary' onClick={this.login}>Accedi</button>
                <ConnectionWrongMessage notLogged={this.state.notLogged}/>
            </div>
        )
    }
}

// Componente funzionale per segnalare un login errato
function ConnectionWrongMessage(props) {
    if (props.notLogged) {
        return (
            <div className='alert alert-danger'>
                Dati errati.
            </div>
        )
    }

    else return null;
}