import React, {Component} from "react";
import PaymentForm from './PaymentForm'

export default class PaymentFormList extends Component {
    constructor(props) {
        super(props);
        this.state = {forms: []};
    }

    fetchForms() {
        fetch('https://localhost:44379/paymentForm')
            .then(response => response.json())
            .then(data =>
                this.setState({
                    forms: data
                }))
            .catch(error => this.setState({error}));
    }

    componentDidMount() {
        this.fetchForms();
    }

    onDeleteButton = (id) => {
        const idForDelete = id;
        return () => {
            fetch('https://localhost:44379/paymentForm/' + idForDelete,
                {
                    method: 'delete'
                })
                .then(r => this.fetchForms());
        }
    };

    render() {

        const listStyle = {
            display: 'flex',
            flexWrap: 'wrap'
        };

        const buttonStyle = {
            backgroundColor: '#4CAF50',
            border: 'none',
            padding: '30px 32 px',
            textAlign: 'center',
            textDecoration: 'none',
            display: 'inline-block',
            fontSize: '16px',
            marginBottom: '15px',
            width: '100%',
            height: '50px'
        };

        const forms = this.state.forms.sort((f) => -f.number).map((form) =>
            <PaymentForm
                form={form}
                onDeleteButtonClick={this.onDeleteButton(form.id)}/>);
        return (
            <div>
                <div>
                    <button style={buttonStyle}>Добавить</button>
                </div>
                <div style={listStyle}>
                    {forms}
                </div>
            </div>
        );
    }
}