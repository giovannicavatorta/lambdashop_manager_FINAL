import React, { Component } from "react";
import "./GiftComponent.css";
import GiftService from "../../services/API/Gift/GiftAPI.js";
import AuthenticatorService from "../../services/authservice"

export default class GiftComponent extends Component {

    state = {
        userPermission: AuthenticatorService.getUserInformations(),
        premi: [],
        ricercaNome: "",
        ricercaPrezzo: 0,
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
            premi: response.data
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
            <div className='GiftComponent'>
                <h1>Premi disponibili</h1>

                <div>
                    <label>Quanti punti ha accumulato il cliente?</label><br></br>
                    <input name="ricercaPrezzo" type="number" min="0" max="1000000" onChange={this.gestMod} defaultValue={this.state.ricercaPrezzo}/>
                    <button className="btn btn-primary" type="button" onClick={this.searchPunti}><i className="fa fa-search"></i></button>
                    
                    {/* Se la variabile okMessage non è null, allora mostra il messaggio sopra la tabella */}
                    {this.state.okMessage && <div className="alert alert-success">{this.state.okMessage}</div>}
                    
                    {/* Tabella premi, con relativo .css nel file associato */}
                    <table id="premi" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>Codice Premio</th>
                                <th>Nome</th>
                                <th>Descrizione</th>
                                <th>Costo in punti</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.premi.map (
                                    /* Specifico anche l'index, per poter eliminare */
                                    (premio, index) => 
                                    /* Devo specificare un key come segnalato dal warning: associo il codice premio */
                                    <tr key={premio.codice}>
                                        <td>{premio.codice}</td>
                                        <td>{premio.nome}</td>
                                        <td>{premio.descrizione}</td>
                                        <td>{premio.prezzo}</td>
                                        {/* Se l'utente è "admin", attivo i bottoni di modifica/elimina */}
                                        { 
                                            this.state.userPermission === "admin" &&
                                            <div>
                                                <td>
                                                    {/* Modifico indice: avendo un parametro devo usare una lambda per evitare 
                                                        l'avvio del metodo al caricamento... */}
                                                    <button className="btn btn-warning table-buttons" onClick={e => this.editPremio(premio.codice)}>Modifica</button>
                                                </td>
                                                <td>
                                                    {/* Elimino indice: avendo un parametro devo usare una lambda per evitare 
                                                        l'avvio del metodo al caricamento... */}
                                                    <button className="btn btn-warning table-buttons" 
                                                        onClick={e => window.confirm(`Sei sicuro di voler eliminare il premio ${premio.codice}?`)
                                                        && this.deletePremio(premio.id)}>Elimina
                                                    </button> {/* Prima: premio.codice */}
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
                            <button type="button" onClick={this.insertPremio} className="btn btn btn-warning">Aggiungi un nuovo premio</button>
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
        this.setState({premi: [], errorWebAPI: false});

        GiftService.getAllGifts()
            .then(response => this.handleResponse(response))
            .catch(error => this.handleError(error));
    }
    
    // Ricerca
    searchNome = () => {
        // Controllo che il campo non sia vuoto
        if (containsAnyLetter(this.state.ricercaNome)) {
            // Svuoto lo state e l'okMessage
            this.setState({premi: [], errorWebAPI: false, okMessage: ""});
            // Log a console per check
            console.log("Ricerco " + this.state.ricercaNome);
            // Chiamo il servizio
            GiftService.findGiftByNome(this.state.ricercaNome)
                .then(response => this.handleResponse(response))
                .catch(error => this.handleError(error));
        }
        else {
            this.searchAll();
        }
    }

    // Ricerca
    searchPunti = () => {
        // Controllo che il campo non sia rimasto a 0 o settato a NaN (textbox vuota)
        if (this.state.ricercaPrezzo > 0) {
            // Svuoto lo state e l'okMessage
            this.setState({premi: [], errorWebAPI: false, okMessage: ""});
            // Log a console per check
            console.log("Cerco i premi che costano al massimo " + this.state.ricercaPrezzo + " punti");
            // Chiamo il servizio: aggiungo 1 per fixare il less than di mongo velocemente
            GiftService.findGiftByPunti(this.state.ricercaPrezzo)
                .then(response => this.handleResponse(response))
                .catch(error => this.handleError(error));
        }
        else {
            this.searchAll();
        }
    }

    // Modifico un premio
    editPremio = (codice_premio) => {
        
        console.log("Modifico premio " + codice_premio + ".");

        this.props.history.push(`/edit_premio/${codice_premio}`);
    }

    // Inserisco un premio
    insertPremio = () => {
        console.log("Accedo alla pagina di inserimento premio...");
        // Push alla nuova pagina: inserisco 
        this.props.history.push(`/insert_premio/-1`);
    }

    // Elimino un premio
    deletePremio = (codice_premio) => {
        
        console.log("Elimino premio " + codice_premio + ".");
        
        // Prima usavo il codice secondario, ma non essendo univoco creava problemi... Uso l'ID del mongo. Sicurezza?
        GiftService.deleteGift(codice_premio)
            .then(response => {
                this.setState({okMessage: `Eliminazione del premio eseguita!`});
                this.searchAll();
            })
            .catch(error => this.handleError(error));
    }
}

// Componente funzionale per visualizzare errore in ricerca premio
// Messaggio di errore ricerca premio
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