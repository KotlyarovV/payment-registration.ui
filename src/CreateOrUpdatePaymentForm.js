import React, {Component} from "react";

export default class CreateOrUpdatePaymentForm extends Component {
    constructor(props) {
        super(props);

        this.state = {form: {}};

        this.handleChange = this.handleChange.bind(this);
        this.createForm = this.createForm.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    createForm() {
        console.log(JSON.stringify(this.state.form));
        console.log(this.state.form);
        fetch('https://localhost:44379/paymentForm',
            {
                method: 'post',
                body: JSON.stringify(this.state.form)
            })
            .then(function (response) {
             //   console.log(response)
                return response.json();
            })
            .then(function (data) {
               // console.log(data);
            })
            .catch(error => this.setState({error}));
        ;
    }



    render() {

        const formBox = {
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center',
            borderStyle : 'solid',
            borderRadius : '5px',
            borderColor : 'green',
            padding: '50px',
            margin: '10px'
        };

        const paymentFormStyle = {
            borderStyle : 'solid none solid none',
            borderColor : 'green',
            padding : '20px'
        };

        const inputStyle = {
            width: '100%',
            padding: '12px 20px',
            margin: '8px 30px',
            display: 'inline-block',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxSizing: 'border-box'
        };

        const buttonStyle = {
            backgroundColor : '#4CAF50',
            border : 'none',
            padding: '30px 32 px',
            textAlign: 'center',
            textDecoration: 'none',
            display: 'inline-block',
            fontSize: '16px',
            marginBottom : '15px',
            width: '100%',
            height : '50px'
        };

        const addButtonStyle = {
            backgroundColor : '#4CAF50',
            textAlign: 'center',
            align : 'center',
            textDecoration: 'none',
            display: 'inline-block',
            width: '200px',

            height: '50px',
            marginLeft : 'calc(50% - 100px)',
            marginBottom: '10px',
            marginTop: '10px'
        };


        return (
            <div style={formBox}>
                <div style={paymentFormStyle}>
                    <label>Фамилия</label>
                    <input type='text' style={inputStyle}/>
                    <label>Имя</label>
                    <input type='text' style={inputStyle}/>
                    <label>Отчество</label>
                    <input type='text' style={inputStyle}/>
                    <label>
                        Тип
                    </label>
                    <select style={inputStyle}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                    </select>
                </div>
                <div>
                    <div>
                        <label>Сумма</label>
                        <input type='number' style={inputStyle}/>
                        <label>Комментарий</label>
                        <input type={}/>
                    </div>

                </div>
                <button style={addButtonStyle}>Добавить запись</button>
                <input type="submit" style={buttonStyle} value="Submit" onClick={this.createForm}/>
            </div>
        )
    }
}