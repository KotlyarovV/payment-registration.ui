import React, {Component} from "react";
import PaymentFormItem from './PaymentFormItem'

export default class PaymentForm extends Component {

    static prepareDate(date) {
        let milliseconds = Date.parse(date);
        let d = new Date(milliseconds);
        let month = d.getMonth() < 10 ? `0${d.getMonth()}` : d.getMonth();
        return `${d.getDate()}.${month}.${d.getFullYear()}`;
    }

    render() {

        const formStyle = {
            borderStyle: 'solid',
            borderRadius: '5px',
            borderColor: 'green',
            padding: '2px 16px',
            width: '380px',
            height: 'auto'
        };

        const figureStyle = {
            height: 'auto'
        };

        const paymentItems = this.props.form.items.map(i => <PaymentFormItem item={i}/>);

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
                                <button className="add" onClick={this.props.onUpdate}>UPDATE</button>
                                <button className="add" onClick={this.props.onDeleteButtonClick}>DELETE</button>
                            </div>
                        </div>
                    </div>

                </figure>
            </div>
        )
    }
}