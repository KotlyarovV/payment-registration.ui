import React, {Component} from "react";
import PaymentForm from './PaymentForm'
import CreateOrUpdatePaymentForm from "./CreateOrUpdatePaymentForm";

export default class PaymentFormList extends Component {
    constructor(props) {
        super(props);
        this.state = {forms: [], showModal : false};
    }

    addForm = () => {
        this.setState({ ...this.state, show: true });
    };

    updateForm = (form) => {
        this.setState({...this.state, show : true, formToUpdate : form});
    };

    hideAddOrUpdateComponent = () => {
      this.setState({...this.state, show:false});
    };

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
        const forms = this.state.forms.sort((f) => - f.number).map((form) =>
            <PaymentForm
                form={form}
                onDeleteButtonClick={this.onDeleteButton(form.id)}
                addForm={this.handleShow}
                onUpdate = {() => this.updateForm(form)}
                />);
        return (
            <div>
                <CreateOrUpdatePaymentForm
                show = {this.state.show}
                style = {{position : 'fixed'}}
                onHide = {this.hideAddOrUpdateComponent}
                formToUpdate = {this.state.formToUpdate}/>
                <div style={{position : 'fixed', width : '100%'}}>
                    <div>
                        <button style={buttonStyle} onClick={this.addForm}>Добавить</button>
                    </div>
                    <div style={listStyle}>
                        {forms}
                    </div>
                </div>
            </div>
        );
    }
}