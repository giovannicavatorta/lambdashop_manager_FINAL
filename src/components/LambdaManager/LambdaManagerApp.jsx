import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import "./LambdaManagerApp.css";
import WelcomeComponent from './Welcome/WelcomeComponent';
import CustomerComponent from './Customers/CustomerComponent';
import GiftComponent from './Gifts/GiftComponent';
import LoginComponent from './Login/LoginComponent';
import LogoutComponent from './Logout/LogoutComponent';
import HeaderComponent from './Header/HeaderComponent';
import FooterComponent from './Footer/FooterComponent';
import CustDataInsertComponent from './Customers/InsertCustomer/CustDataInsertComponent';
import CustDataEditComponent from './Customers/EditCustomer/CustDataEditComponent';
import GiftDataInsertComponent from './Gifts/InsertGift/GiftDataInsertComponent';
import GiftDataEditComponent from './Gifts/EditGift/GiftDataEditComponent';
import AuthenticationRoute from './AuthenticationRoute';

// Classe di default
export default class LambdaManagerApp extends Component {

    render() {
        // Setup del routing.
        // 'exact' per evitare sovrapposizioni;
        // '.../:blabla per parametrizzare un route, e passare un parametro
        return (
            <div className='LambdaManagerApp'>
                <Router>
                    <HeaderComponent/>
                    <Switch>
                        {/* Per evitare "duplicati" uso "exact" */}
                        <Route path='/' exact component={LoginComponent}/>
                        <Route path='/login' component={LoginComponent}/>
                        <Route path='/logout' component={LogoutComponent}/>
                        {/* Per quanto riguarda i contenuti che richiedono il login
                            uso l'AuthenticationRouter */}
                        <AuthenticationRoute path='/welcome' component={WelcomeComponent}/>
                        <AuthenticationRoute path='/clienti' component={CustomerComponent}/>
                        <AuthenticationRoute path='/premi' component={GiftComponent}/>
                        <AuthenticationRoute path='/edit_cliente/:codice' component={CustDataEditComponent}/>
                        <AuthenticationRoute path='/insert_cliente/:codice' component={CustDataInsertComponent}/>
                        <AuthenticationRoute path='/edit_premio/:codice' component={GiftDataEditComponent}/>
                        <AuthenticationRoute path='/insert_premio/:codice' component={GiftDataInsertComponent}/>
                        <Route component={ErrorComponent}/>
                    </Switch>
                    <FooterComponent></FooterComponent>
                </Router>
            </div>
        )
    }
}

// Componente per notificare un errore di routing
function ErrorComponent() {
    return (
        <div>
            <h2>Errore, pagina non trovata! :(</h2>
            <br />
            <img className="error" src={`../error.png`} width="300" height="300" alt=""/>
        </div>
    )
}