import React, { Component } from "react";
import { Link } from "react-router-dom";
import './HeaderComponent.css';
// Forzo l'update dell'header per renderlo dinamico
import { withRouter } from "react-router";
import AuthenticatorService from "../../services/authservice"


// Header, l'export default è alla fine per forzare l'update
class HeaderComponent extends Component {
    render() {
        console.log(AuthenticatorService.isLoggedIn());
        return(
            <div className='HeaderComponent'>
                <header className="section-header">
                    <section className="header-main border-bottom">
                        <div className="container">
                            <div className="row align-items-center">
                                
                                <div className="col-lg-3 col-sm-4 col-md-4 col-5">
                                    <Link className="brand-wrap" to="/welcome">
                                        <img className="welcome" src={`../shop.png`} width="60" height="60" alt=""/>
                                    </Link>
                                </div>
                                
                                <User></User>
                            </div>
                        </div>
                    </section>
                </header>

                <nav className="navbar justify-content-center navbar-main navbar-expand-lg border-bottom">
                    <Menu />
                </nav>
            </div>
        )
    }
}

// https://stackoverflow.com/questions/53539314/what-is-withrouter-for-in-react-router-dom
export default withRouter(HeaderComponent);

// Creo delle sottocomponenti che importo nell'header...

// Menu
const Menu = () => {
    return (
        <div className="navbar">
            <ul className="navbar-nav">
                <li className="nav-item">
                    <Link className="nav-link" to="/clienti">
                        <img className="clienti" src={`../man.png`} width="40" height="40" alt=""/><br />
                        Clienti
                    </Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/premi">
                        <img className="premi" src={`../giftbox.png`} width="40" height="40" alt=""/><br />
                        Premi
                    </Link>
                </li>
            </ul>
        </div>
    )
}

// User
const User = () => {
    return (
        <div className="col-lg-5 col-xl-4 col-sm-8 col-md-4 col-7">
            <div className="d-flex justify-content-end">
                <DinamicUserInfo></DinamicUserInfo>
            </div>
        </div>
    )
}

const DinamicUserInfo = () => {
    if (AuthenticatorService.isLoggedIn()) {
        return (
            <div className="text">
                <span className="text-muted">Ciao, {AuthenticatorService.getUserInformations()}! :)</span>
                <div> 
                    <Link className="nav-link" to="/logout" onClick={AuthenticatorService.clearUserInformations}>
                        <img className="logout" src={`../programmer.png`} width="40" height="40" alt=""/><br />
                        Logout
                    </Link>
                </div>
            </div>
        )
    }
    else {
        return (
            <div className="text">
                <div>
                    <Link className="nav-link" to="/login">
                        <img className="login" src={`../programmer.png`} width="40" height="40" alt=""/><br />
                        Accedi!
                    </Link>
                </div>
            </div>
        )
    }
}