import React, {Component} from "react";
import {StyledDropZone} from "react-drop-zone";

export default class PaymentFormCreateOrUpdateItem extends Component {
    constructor(props) {
        super(props);
        this.onChangeSum = this.onChangeSum.bind(this);
    }

    onChangeSum = (event) => {
        this.props.onSumChange(event.target.value);
    };

    render() {

        const textAreaStyle = {
            border: '1px solid #4CAF50',
            fontSize: '20px',
            marginBottom: '15px',
            marginTop: '20px',
            width: '95%',
            height: '150px'
        };
        const itemStyle = {
            borderStyle: 'dotted',
            borderColor: 'green',
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center',
            padding: '20px',
            margin: '10px'
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
        const deleteButton = {
            width: 'auto',
            height: '5%',
            border: '1px solid #ccc',
            borderRadius: '4px',
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
            width: '40%',
            height: '50px'
        };

        return (<div style={itemStyle}>
            <div>
                <label>Сумма</label>
                <input type='number' style={inputStyle} onChange={this.onChangeSum} value={this.props.sum}/>
                <label>Комментарий</label>
                <textarea onChange={this.props.onCommentChange} style={textAreaStyle} value={this.props.comment}/>
                <div>
                    <StyledDropZone onDrop={this.props.onAddFile}/>
                    <ul>
                        {
                            this.props.files.map((file, i) =>
                                <li>
                                    <button style={deleteButton} onClick={() => {
                                        this.props.onDeleteFile(i)
                                    }}>Удалить
                                    </button>
                                    <i className='fa fa-file'/> {file.name ? file.name : file.wayToFile}
                                </li>
                            )
                        }
                    </ul>
                </div>
                <button style={buttonStyle} onClick={this.props.onRemove}>Удалить запись</button>
            </div>
        </div>);
    }

}