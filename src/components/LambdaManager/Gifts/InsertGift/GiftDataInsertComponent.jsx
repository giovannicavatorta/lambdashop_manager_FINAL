import React, { Component } from "react";
import './GiftDataInsertComponent.css';
import GiftAPI from "../../../services/API/Gift/GiftAPI";
import { Form, Formik, Field, ErrorMessage } from "formik";

// Commento di test per GitHub

export default class GiftDataInsertComponent extends Component {
    state = {
        id: '',
        codice: '',
        nome: '',
        descrizione: '',
        prezzo: '',
        okMessage: null,
        errMessage: null
    }

    // Ottengo i dati cliente dal DB, ereditando i parametri dalla pressione sul tasto "modifica"
    componentDidMount() {
        // Qui inserisco un controllo sul codice cliente inserito: se risulta == -1, allora sono in un caso di
        // inserimento e non lancerò la ricerca. Diversamente, sto cercando di modificare un cliente:
        // a quel punto, lancerò la ricerca del cliente a prescindere.
        let codice_inserito = this.props.match.params.codice;
        if(codice_inserito !== "-1") {
            // Richiamo il metodo di ricerca
            GiftAPI.findGiftByCodice(this.props.match.params.codice)
            .then(response => this.handleResponse(response))
            .catch(error => this.handleError(error));
        }
    }

    render() {
        let {id, codice, nome, descrizione, prezzo} = this.state;
        return (
            <section className="container">
                <div className="card">
                    <div className="card-body">
                        <h3 className="card-title mb-4">Dati del premio</h3>
                        <Formik
                            // Setto le variabili iniziali che andranno a popolare il form
                            initialValues={{id, codice, nome, descrizione, prezzo}}
                            // Per vedere lo state aggiornato con le variabili del premio attuale
                            enableReinitialize={true}
                            // Al click di salvataggio, chiamo saveChanges
                            onSubmit={this.saveChanges}
                            // Validazione
                            validate={this.validate}
                        >
                            {
                                (props) => (
                                    <Form>
                                        {/* Qui inserisco i messaggi di conferma/errore */}
                                        {this.state.okMessage && <div className="alert alert-success"><h6>{this.state.okMessage}</h6></div>}
                                        {this.state.errMessage && <div className="alert alert-danger"><h6>{this.state.errMessage}</h6></div>}
                                        <div>
                                            <label>Codice:</label>
                                            <Field type="text" name="codice"></Field>
                                            <ErrorMessage name="codice" component="span"></ErrorMessage>
                                            <br></br>
                                            <label>Nome:</label>
                                            <Field type="text" name="nome"></Field>
                                            <ErrorMessage name="nome" component="span"></ErrorMessage>
                                            <br></br>
                                            <label>Descrizione:</label>
                                            <Field type="text" name="descrizione"></Field>
                                            <ErrorMessage name="descrizione" component="span"></ErrorMessage>
                                            <br></br>
                                            <label>Prezzo:</label>
                                            <Field type="text" name="prezzo"></Field>
                                            <ErrorMessage name="prezzo" component="span"></ErrorMessage>
                                        </div>
                                        
                                        <div>
                                            <button type="submit" className="btn btn-primary">Salva le modifiche</button>
                                            {/* Qui andrebbe inserio un button type "reset", ma dava problemi. Impostando "onReset" all'inizio si buggava.
                                            Quindi risolvo con un type "button", ma devo inserire l'onClick */}
                                            <button type="button" onClick={this.annulla} className="btn btn btn-warning">Indietro</button>
                                        </div>
                                    </Form>
                                )
                            }
                        </Formik>
                    </div>
                </div>
            </section>
        )
    }

    handleResponse = (response) => {
        console.log(response);
        this.setState({
            id: response.data[0].id,
            codice: response.data[0].codice,
            nome: response.data[0].nome,
            descrizione: response.data[0].descrizione,
            prezzo: response.data[0].prezzo
        });
    }

    // Gestione degli errori: restituisco l'eventuale messaggio dell'API SpringBoot
    handleError = (error) => {
        console.log(error.response.data.message);
        this.setState({errMessage: error.response.data.message});
    }

    saveChanges = (values) => {
        // Salvo il cliente chiamando la insert da backend, ma prima chiedo conferma
        if(window.confirm("Confermi l'aggiunta del premio?")){
            GiftAPI.insertGift({
                codice: values.codice,
                nome: values.nome,
                descrizione: values.descrizione,
                prezzo: values.prezzo
            })
            .then(() => {
                this.setState({okMessage: "Caricamento dati completato."})
            })
            .catch(error => this.handleError(error));
        }
    }

    // Annulla
    annulla = () => {
        console.log("Operazione annullata");
        // Torno indietro
        this.props.history.push(`/premi`);
    }

    validate = (values) => {
        let errors = {}
        
        if(!values.codice) {
            errors.codice = "Manca il codice premio!"
        }

        else if(values.codice.length !== 4) {
            errors.codice = "Il codice premio deve essere di 4 caratteri."
        }

        if(!values.nome) {
            errors.nome = "Manca il nome!"
        }

        else if(values.nome.length < 6) {
            errors.nome = "Il nome deve essere di almeno 6 caratteri."
        }

        if(!values.prezzo) {
            errors.prezzo = "Non hai inserito il prezzo!"
        }

        else if (values.prezzo < 0) {
            errors.punti = "Il prezzo non può essere negativo!"
        }

        if(!values.descrizione) {
            errors.descrizione = "Non hai inserito una descrizione!"
        }

        return errors;
    }
}