import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class Position extends Component{

}


class PaymentForm extends Component{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                {this.props.number}
                {this.props.applicant.name}
                {this.props.type}
            </div>
        )
    }
}

class CreatePaymentForm extends Component{
    constructor(props) {
        super(props);

        this.state = {value: ''};

        this.handleChange = this.handleChange.bind(this);
        this.createForm = this.createForm.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    createForm() {

        fetch('https://localhost:44379/paymentForm',
            {
                method : 'post',
                body : JSON.stringify(this.state.form)
            })
            .then(function (response) {
                console.log();
                return response.json();
            })
            .then(function (data) {
                console.log(data);
            })
    }

    render() {
        return (
            <div>
                <label>
                    Name:
                    <input type="text" value={this.state.value} onChange={this.handleChange} />
                </label>
                <input type="submit" value="Submit" onClick={this.createForm()}/>
            </div>
        )
    }
}

class PaymentFormList extends Component{
    constructor(props) {
        super(props);
        this.state = { forms : []};
    }
    fetchForms(){
        fetch('https://localhost:44379/paymentForm')
            .then(response => response.json())
            .then(data =>
                this.setState({
                        forms : data
                    }))
            .catch(error => this.setState({error}));
    }

    componentDidMount() {
        this.fetchForms();
    }

    render() {

        const forms = this.state.forms.map((form) => <PaymentForm
            number={form.number}
            type = {form.type}
            applicant = {form.applicant}/>)
        return (
          <div>
              {forms}
              {this.state.error}
          </div>
        );
    }
}

class App extends Component {
  render() {
      /*
    return (

      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );*/
      return (
          //<PaymentFormList/>
          <CreatePaymentForm/>
      );
  }
}

export default App;
