import React, {Component} from 'react';
import './App.css';
import CreateOrUpdatePaymentForm from './CreateOrUpdatePaymentForm.js'


class PaymentFormItem extends Component{
    render() {
        const commentTextStyle = {
            lineHeight : '1.5',
            paddingBottom: '10px'
        };

        const files = this.props.item.files
            .map(f => <a href={`https://localhost:44379/files/${f.wayToFile}`} download={f.wayToFile}><img className="image-file" src={require("./img/file.png")}/></a>);

        return (
            <div className="payment">
                <div>
                    <div>
                        Сумма {this.props.item.sum} руб.<br/>
                    </div>
                    <div style={commentTextStyle}>
                        Комментарий: {this.props.item.comment}<br/>
                    </div>
                    {files}
                </div>
            </div>
        );
    }
}

class PaymentForm extends Component{

    static prepareDate(date) {
        let milliseconds = Date.parse(date);
        let d = new Date(milliseconds);
        let month = d.getMonth() < 10 ? `0${d.getMonth()}` : d.getMonth();
        return `${d.getDate()}.${month}.${d.getFullYear()}`;
    }

    render() {

        const formStyle = {
            borderStyle : 'solid',
            borderRadius : '5px',
            borderColor : 'green',
            padding : '2px 16px',
            width : '380px',
            height : 'auto'
        };

        const figureStyle = {
            height : 'auto'
        };

        const paymentItems = this.props.form.items.map(i => <PaymentFormItem item = {i}/>);

        return (
            <div style={formStyle}>
                <figure style={figureStyle}>
                    <div className="wrapper-part-info">
                        <div className="part-info">
                            <b>Заявка номер {this.props.form.number}</b> <br/>
                            Дата {PaymentForm.prepareDate(this.props.form.date)}<br/>
                            Тип {this.props.form.type}<br/>
                            Полная сумма {this.props.form.items.reduce((a, b) => a + b.sum, 0)} руб.<br/>
                            {this.props.form.applicant.lastName}&nbsp;
                            {this.props.form.applicant.name}&nbsp;
                            {this.props.form.applicant.surname}
                            <div>
                                {paymentItems}
                            </div>
                            <div>
                                <button className="add">UPDATE</button>
                                <button className="add" onClick={this.props.onDeleteButtonClick}>DELETE</button>
                            </div>
                        </div>
                    </div>

                </figure>
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
            display : 'flex',
            flexWrap : 'wrap'
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

        const forms = this.state.forms.sort((f) => - f.number).map((form) =>
            <PaymentForm
                form={form}
                onDeleteButtonClick = {this.onDeleteButton(form.id)}/>);
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

class App extends Component {
  render() {
      return (
         // <PaymentFormList/>
          <CreateOrUpdatePaymentForm/>
      );
  }
}

export default App;
