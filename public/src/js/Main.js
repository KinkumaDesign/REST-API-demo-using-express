import $ from 'jquery'
import React from 'react'
import ReactDOM from 'react-dom'
import { AppData } from './model/AppData'
import { AppView } from './view/AppView'

class Main {
    appData = new AppData();

    constructor(){
        ReactDOM.render(
            <AppView appData={ this.appData } />,
            document.getElementById('container')
        );
    }
}

window.Main = Main;
