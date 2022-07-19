import React, {Component} from "react";

export default class Logout extends Component {
    render() {
        return (
            <div className='LogoutComponent'>
                <h4>Logout eseguito!</h4>
                <img className="welcome" src={`../see-you-soon.png`} width="170" height="170" alt=""/>
            </div>
        )
    }
}