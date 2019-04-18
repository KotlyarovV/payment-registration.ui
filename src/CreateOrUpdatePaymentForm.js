import React, {Component} from "react";

class PaymentFormCreateOrUpdateItem  extends Component{
    render() {

        const textAreaStyle = {
            border : '1px solid #4CAF50',
            fontSize: '20px',
            marginBottom : '15px',
            marginTop : '20px',
            width: '95%',
            height : '150px'
        };
        const itemStyle = {
            borderStyle : 'dotted',
            borderColor : 'green',
            display : 'flex',
            flexDirection : 'column',
            textAlign : 'center',
            padding : '20px',
            margin : '10px'
        };
        const inputStyle = {
            width: '95%',
            padding: '12px 20px',
            margin: '8px 30px',
            display: 'inline-block',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxSizing: 'border-box'
        };

        return (<div style={itemStyle}>
            <div>
                <label>Сумма</label>
                <input type='number' style={inputStyle}/>
                <label>Комментарий</label>
                <textarea style={textAreaStyle}/>
            </div>
        </div>);
    }

}


export default class CreateOrUpdatePaymentForm extends Component {
    constructor(props) {
        super(props);

        const items = [];

        if (props.items !== undefined) {

        } else {
            items.push({sum : 0, comment : '', files : []});
        }

        this.state = {items : items};

        this.handleChange = this.handleChange.bind(this);
        this.createForm = this.createForm.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    createForm() {

        //const items = this.items.

        var forms = {
            name : '',
            lastName : '',
            surname : '',
            type : 1
        };
        console.log(JSON.stringify(forms))


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

    }

    addItemForm = () => {
        this.setState((prevState) => ({
            items : [...prevState.items, {sum : 0, comment : '', files : []}]
        }));
    };


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
            borderStyle : 'dotted',
            borderColor : 'green',
            display : 'flex',
            flexDirection : 'column',
            textAlign : 'center',
            padding : '20px',
            margin : '10px'
        };

        const inputStyle = {
            width: '95%',
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

        const items = this.state.items.map(i => <PaymentFormCreateOrUpdateItem item = {i}/>);

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
                {items}
                <button style={addButtonStyle} onClick={this.addItemForm}>Добавить запись</button>
                <input type="submit" style={buttonStyle} value="Submit" onClick={this.createForm}/>
            </div>
        )
    }
}