import React, {Component} from 'react';
import './App.css';
import PaymentFormList from "./PaymentFormList.js";
import CreateOrUpdatePaymentForm from './CreateOrUpdatePaymentForm'


class App extends Component {
    render() {
        return (
             <PaymentFormList/>
            //<CreateOrUpdatePaymentForm/>
        );
    }
}

export default App;