import React, {Component} from "react";

export default class PaymentFormItem extends Component {
    render() {
        const commentTextStyle = {
            lineHeight: '1.5',
            paddingBottom: '10px'
        };

        const files = this.props.item.files
            .map(f => <a href={`https://localhost:44379/files/${f.wayToFile}`} download={f.wayToFile}><img
                className="image-file" src={require("./img/file.png")}/></a>);

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