import React, {Component} from "react";
import './FooterComponent.css';

export default class FooterComponent extends Component {

    render() {
        return ( 
            <div className="FooterComponent">
                <footer className="footer text-xs-center">
                    <p className="text-muted">
                        <small>&copy; 2022 by Giovanni Cavatorta</small>
                    </p>
                </footer>
            </div>
        )
    }
}