import React, { Component } from "react";
import "./CustomerComponent.css";
import CustomersService from "../../services/API/Customer/CustomerAPI.js";
import AuthenticatorService from "../../services/authservice"

export default class CustomerComponent extends Component {

    state = {
        userPermission: AuthenticatorService.getUserInformations(),
        clienti: [
            /*
            {codice: 1001, nome:'Giovanni Cavatorta', punti:'1997', data:'05/07/2021'},
            {codice: 1002, nome:'Riccardo Allodi', punti:'4200', data:'02/10/2021'},
            {codice: 1003, nome:'Federico Stighezza', punti:'6198', data:'04/09/2021'},
            {codice: 1004, nome:'Isacco Newton', punti:'10001', data:'05/10/2021'}
            */
        ],
        ricercaNome: "",
        ricercaPunti: 0,
        errorWebAPI: false,
        errorMessage: "",
        okMessage: null
    }

    componentDidMount() {
        this.searchAll();
    }

    handleResponse = (response) => {
        console.log(response);
        this.setState({
            clienti: response.data
        });
    }

    handleError = (error) => {
        console.log(error.response.data.message);

        this.setState({
            errorMessage: error.response.data.message,
            errorWebAPI: true
        });
    }

    render() {
        return (
            <div className='CustomerComponent'>
                <h1>Clienti registrati</h1>

                <div>
                    <label>Filtra clienti per nome (case sensitive):</label><br></br>
                    <input name="ricercaNome" type="text" onChange={this.gestMod} defaultValue={this.state.ricercaNome}/>
                    <button className="btn btn-primary" type="button" onClick={this.searchNome}><i className="fa fa-search"></i></button>

                    <br />

                    <label>Filtra per monte punti minimo:</label><br></br>
                    <input name="ricercaPunti" type="number" min="0" max="1000000" step="500" onChange={this.gestMod} defaultValue={this.state.ricercaPunti} onKeyDown={(event) => {event.preventDefault();}}/>
                    <button className="btn btn-primary" type="button" onClick={this.searchPunti}><i className="fa fa-search"></i></button>
                    
                    {/* Se la variabile okMessage non è null, allora mostra il messaggio sopra la tabella */}
                    {this.state.okMessage && <div className="alert alert-success">{this.state.okMessage}</div>}
                    
                    {/* Tabella clienti, con relativo .css nel file associato */}
                    <table id="clienti" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>Codice Cliente</th>
                                <th>Nome</th>
                                <th>Punti</th>
                                <th>E-Mail</th>
                                <th>Indirizzo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.clienti.map (
                                    /* Specifico anche l'index, per poter eliminare */
                                    (cliente, index) => 
                                    /* Devo specificare un key come segnalato dal warning: associo il codice cliente */
                                    <tr key={cliente.codice}>
                                        <td>{cliente.codice}</td>
                                        <td>{cliente.nome}</td>
                                        <td>{cliente.punti}</td>
                                        <td>{cliente.email}</td>
                                        <td>{cliente.indirizzo}</td>
                                        {/* Se l'utente è "admin", attivo i bottoni di modifica/elimina */}
                                        { this.state.userPermission === "admin" &&
                                            <div>
                                                <td>
                                                    {/* Modifico indice: avendo un parametro devo usare una lambda per evitare 
                                                        l'avvio del metodo al caricamento... */}
                                                    <button className="btn btn-warning table-buttons" onClick={e => this.editCliente(cliente.codice)}>Modifica</button>
                                                </td>
                                                <td>
                                                    {/* Elimino indice: avendo un parametro devo usare una lambda per evitare 
                                                        l'avvio del metodo al caricamento... */}
                                                    <button className="btn btn-warning table-buttons" 
                                                        onClick={e => window.confirm(`Sei sicuro di voler eliminare il cliente ${cliente.codice}?`)
                                                        && this.deleteCliente(cliente.id)}>Elimina
                                                    </button> {/* Prima: cliente.codice */}
                                                </td>
                                            </div>
                                        }
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                    
                    {/* Se l'utente è admin... */}
                    { this.state.userPermission === "admin" &&
                        <div>
                            {/* Bottone per l'inserimento di un nuovo cliente */}
                            <button type="button" onClick={this.insertCliente} className="btn btn btn-warning">Aggiungi un nuovo cliente</button>
                        </div>
                    }
                    
                    <ErrorWebAPIMessage errorWebAPI={this.state.errorWebAPI} errorMessage={this.state.errorMessage}></ErrorWebAPIMessage>
                </div>

                <div>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                </div>
            </div>
        )
    }

    // Gestisco la modifica del codice nella textbox
    gestMod = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    // Ricerca tutti
    searchAll = () => {
        // Svuoto lo state
        this.setState({clienti: [], errorWebAPI: false});

        CustomersService.getAllCustomers()
            .then(response => this.handleResponse(response))
            .catch(error => this.handleError(error));
    }
    
    // Ricerca
    searchNome = () => {
        // Controllo che il campo non sia vuoto
        if (containsAnyLetter(this.state.ricercaNome)) {
            // Svuoto lo state e l'okMessage
            this.setState({clienti: [], errorWebAPI: false, okMessage: ""});
            // Log a console per check
            console.log("Ricerco " + this.state.ricercaNome);
            // Chiamo il servizio
            CustomersService.findCustomerByNome(this.state.ricercaNome)
                .then(response => this.handleResponse(response))
                .catch(error => this.handleError(error));
        }
        else this.searchAll();
    }

    // Ricerca
    searchPunti = () => {
        // Controllo che il campo non sia rimasto a 0 o settato a NaN (textbox vuota)
        if (!this.state.ricercaPunti >= 0) {
            // Svuoto lo state e l'okMessage
            this.setState({clienti: [], errorWebAPI: false, okMessage: ""});
            // Log a console per check
            console.log("Cerco gli utenti con almeno " + this.state.ricercaPunti);
            // Chiamo il servizio
            CustomersService.findCustomerByPunti(this.state.ricercaPunti)
                .then(response => this.handleResponse(response))
                .catch(error => this.handleError(error));
        }
        else this.searchAll();
    }

    // Modifico un cliente
    editCliente = (codice_cliente) => {
        
        console.log("Modifico cliente " + codice_cliente + ".");

        this.props.history.push(`/edit_cliente/${codice_cliente}`);
    }

    // Inserisco un cliente
    insertCliente = () => {
        console.log("Accedo alla pagina di inserimento cliente...");
        // Push alla nuova pagina: inserisco 
        this.props.history.push(`/insert_cliente/-1`);
    }

    // Elimino un cliente
    deleteCliente = (codice_cliente) => {
        
        console.log("Elimino cliente " + codice_cliente + ".");

        // Prima usavo il codice secondario, ma non essendo univoco creava problemi... Uso l'ID del mongo. Sicurezza?
        CustomersService.deleteCustomer(codice_cliente)
            .then(response => {
                this.setState({okMessage: `Eliminazione del cliente eseguita!`});
                this.searchAll();
            })
            .catch(error => this.handleError(error));
    }
}

// Componente funzionale per visualizzare errore in ricerca cliente
// Messaggio di errore ricerca cliente
function ErrorWebAPIMessage(props) {
    if (props.errorWebAPI) {
        return <div className="alert alert-danger" role="alert"><h5>{props.errorMessage}</h5></div>
    }

    else return null;
}

// Funzione per controllare che i campi di inserimento contengano almeno una lettera
function containsAnyLetter(str) {
    return /[a-zA-Z]/.test(str);
}