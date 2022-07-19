import axios from "axios";

class AuthenticatorService {

    // Creo uno state con user e psw hardcoded (temp per test))
    /*
    state = {
        user: "admin",
        psw: "admin"
    }
    */

    // Gestisco l'autenticazione interfacciandomi con il backend
    state = {
        serverURL: "http://localhost:5071/api"
    }

    // Definisco una funzione che mi ritorni la stringa corretta per la BasicAuth,
    // da inserire nell'header delle richieste.
    getBAuthHeader = (user, psw) => {
        return "Basic " + window.btoa(user + ":" + psw);
    }

    // Ottengo la stringa OK da backend (se i dati sono corretti - altrimenti: 401)
    // inserendo nell'header della richiesta i dati di login
    authenticateUser = (user, psw) => {
        return axios.get(`${this.state.serverURL}/gifts/auth`,
        {
            // Aggiungo nell'header le specifiche di autenticazione
            // ottenute tramite la lambda preposta
            headers: {authorization: this.getBAuthHeader(user, psw)}
        });
    }

    // Metodo di salvataggio nel session storage
    setUserInformations = (user, psw) => {
        // Salvo nel session storage [Parametri: nome(str), params(funzione)]
        sessionStorage.setItem("user", user);
        // Richiamo l'interceptor per gli header di basicauth
        this.setupAxiosInterceptors(this.getBAuthHeader(user, psw));
    }

    // Ottengo info utente (nome da mostrare a video)
    getUserInformations = () => {
        return sessionStorage.getItem("user");
    }

    // Metodo di rimozione info utente dal session storage
    clearUserInformations = () => {
        sessionStorage.removeItem("user");
    }

    // BOOL: controllo se l'utente è loggato
    isLoggedIn = () => {
        let user = this.getUserInformations();
        // Strict check
        if (user === null) return false;
        else return true;
    }

    // Creo un metodo di axios (interceptor) che genera un 
    // BasicAuthHeader (come commentato "old" hard-coded nelle API).
    // Lo richiamo nel momento stesso in cui vado a salvare le info dell'utente nel session storage,
    // quindi in setUserInformations
    // https://axios-http.com/docs/interceptors
    // Non funziona del tutto correttamente: L'header non viene aggiornato, mantiene i dati dell'utente precedente...
    // FIX "BRUTTO" --> Si potrebbe commentare e settare "a mano" l'header per ogni chiamata ai servizi...
    // Non sarebbe però scalabile
    setupAxiosInterceptors(BAuthHeader) {
        axios.interceptors.request.use(
            (config) => {
                // Verifico che l'utente si loggato per creare l'interceptor...
                if (this.isLoggedIn()) {
                    config.headers.authorization = BAuthHeader
                }
                return config;
            }
        )
    }
}

export default new AuthenticatorService();