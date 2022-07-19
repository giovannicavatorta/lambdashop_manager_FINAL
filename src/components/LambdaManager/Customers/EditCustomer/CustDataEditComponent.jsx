import React, { Component } from "react";
import './CustDataEditComponent.css';
import CustomerAPI from "../../../services/API/Customer/CustomerAPI";
import { Form, Formik, Field, ErrorMessage } from "formik";

export default class CustDataEditComponent extends Component {
    state = {
        id: '',
        codice: '',
        nome: '',
        punti: '',
        email: '',
        indirizzo: '',
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
            CustomerAPI.findCustomerByCodice(this.props.match.params.codice)
            .then(response => this.handleResponse(response))
            .catch(error => this.handleError(error));
        }
    }

    render() {
        let {id, codice, nome, punti, email, indirizzo} = this.state;
        return (
            <section className="container">
                <div className="card">
                    <div className="card-body">
                        <h3 className="card-title mb-4">Dati cliente</h3>
                        <Formik
                            // Setto le variabili iniziali che andranno a popolare il form
                            initialValues={{id, codice, nome, punti, email, indirizzo}}
                            // Per vedere lo state aggiornato con le variabili del cliente attuale
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
                                            <Field type="text" name="codice" disabled="disabled"></Field>
                                            <br />
                                            <label>Nome:</label>
                                            <Field type="text" name="nome"></Field>
                                            <ErrorMessage name="nome" component="span"></ErrorMessage>
                                            <br></br>
                                            <label>Punti:</label>
                                            <Field type="text" name="punti"></Field>
                                            <ErrorMessage name="punti" component="span"></ErrorMessage>
                                            <br></br>
                                            <label>E-Mail:</label>
                                            <Field type="text" name="email"></Field>
                                            <ErrorMessage name="email" component="span"></ErrorMessage>
                                            <br></br>
                                            <label>Indirizzo:</label>
                                            <Field type="text" name="indirizzo"></Field>
                                            <ErrorMessage name="indirizzo" component="span"></ErrorMessage>
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
            punti: response.data[0].punti,
            email: response.data[0].email,
            indirizzo: response.data[0].indirizzo
        });
    }

    // Gestione degli errori: restituisco l'eventuale messaggio dell'API SpringBoot
    handleError = (error) => {
        console.log(error.response.data.message);
        this.setState({errMessage: error.response.data.message});
    }

    saveChanges = (values) => {
        // Salvo il cliente chiamando la insert da backend, ma prima chiedo conferma
        if(window.confirm("Confermi le modifiche?")){
            CustomerAPI.insertCustomer({
                id: values.id,
                codice: values.codice,
                nome: values.nome,
                punti: values.punti,
                email: values.email,
                indirizzo: values.indirizzo
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
        this.props.history.push(`/clienti`);
    }

    validate = (values) => {
        let errors = {}

        // Qui commento il controllo relativo al codice secondario non univoco. Non serve,
        // il campo è disabled dunque non modificabile
        /*
        if(!values.codice) {
            errors.codice = "Manca il codice cliente!"
        }

        else if(values.codice.length !== 4) {
            errors.codice = "Il codice cliente deve essere di 4 caratteri."
        }
        */

        if(!values.nome) {
            errors.nome = "Manca il nome!"
        }

        else if(values.nome.length < 6) {
            errors.nome = "Il nome deve essere di almeno 6 caratteri."
        }

        if(!values.punti) {
            errors.punti = "Non hai inserito i punti!"
        }

        else if (values.punti < 0) {
            errors.punti = "I punti non possono essere negativi!"
        }

        if(!values.email) {
            errors.email = "Non hai inserito l'email!"
        }

        if (!values.indirizzo) {
            errors.indirizzo = "Non hai inserito l'indirizzo!"
        }

        return errors;
    }
}