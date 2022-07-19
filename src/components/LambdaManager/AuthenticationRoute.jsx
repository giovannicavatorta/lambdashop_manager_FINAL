import React, { Component } from "react";
import { Redirect, Route } from "react-router-dom";
import AuthenticatorService from "../services/authservice.js";

export default class AuthenticationRoute extends Component {

    render() {
        // Se si è loggati, il sistema restituisce la rotta originaria con tutte le proprietà originarie...
        if (AuthenticatorService.isLoggedIn()) { return <Route {...this.props}></Route> }
        // ... altrimenti ci riporta al login.
        else { return <Redirect to="/login"></Redirect> }
    }
    
}