import React, {Component} from "react";
import { StyledDropZone } from 'react-drop-zone'
import 'react-drop-zone/dist/styles.css'

class PaymentFormCreateOrUpdateItem  extends Component{
    constructor(props) {
        super(props);
        this.state = {files : []};
    }

    addFile = (file, text) => {
        this.setState({ files: [...this.state.files, file] })
    };

    onChangeComment = (event) => {
        this.props.onCommentChange(event.target.value);
    };

    onChangeSum = (event) => {
      this.props.onSumChange(event.target.value);
    };

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
        const deleteButton = {
            width: '5%',
            height: '5%',
            border: '1px solid #ccc',
            borderRadius: '4px',
            position: 'absolute',
            marginLeft: '450px',
            marginTop: '-8px'
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
            width: '40%',
            height : '50px'
        };

        return (<div style={itemStyle}>
            <div>
                <label>Сумма</label>
                <input type='number' style={inputStyle} onChange={this.onChangeSum} value={this.props.sum}/>
                <label>Комментарий</label>
                <textarea onChange={this.onChangeComment} style={textAreaStyle} value={this.props.comment}/>
                <div>
                    <StyledDropZone onDrop={this.addFile} />
                    <ul>
                        {
                            this.state.files.map(file =>
                                <li>
                                    <button style={deleteButton}>Удалить</button><i className='fa fa-file' /> {file.name} [{file.type}]
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


export default class CreateOrUpdatePaymentForm extends Component {
    constructor(props) {
        super(props);

        const items = [];

        if (props.items !== undefined) {

        } else {
            items.push({sum : 0, comment : '', files : []});
        }

        this.state = {items : items.map((item, i)=> {
            return {...item, index : i}
            })};

        this.handleChange = this.handleChange.bind(this);
        this.createForm = this.createForm.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    createForm() {
        var form = {
            applicant : {
                name: this.state.name,
                lastName: this.state.lastName,
                surname: this.state.surName,
            },
            type : 1,
            items : []
        };

        console.log(JSON.stringify(form))


        fetch('https://localhost:44379/paymentForm',
            {
                method: 'post',
                body: JSON.stringify(form),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
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
        const indexes = this.state.items.map(i => i.index);
        const maxIndex = indexes.length === 0 ? 0 : Math.max(...indexes, 0) + 1;
        console.log(maxIndex + " create index");
        this.setState((prevState) => ({
            ...this.state,
            items : [...prevState.items, {sum : 0, comment : '', files : [], index : maxIndex}]
        }));
    };

    removeItemFunction = (i) => {
        const index = i;
        return  () => {
            console.log(index + " remove index");
            const newItems = this.state.items.filter(item => item.index !== index);
            this.setState({...this.state, items: newItems})
        }
    };

    onCommentChangeFunction = (i) => {
        const index = i;
        return (str) => {
            console.log(index);
            const lastElement = this.state.items.filter(item => item.index === index)[0];
            lastElement.comment = str;
            const newItems = this.state.items.filter(item => item.index !== index);
            this.setState({...this.state, items: [...newItems, lastElement]});
        }
    };

    onSumChangeFunction = (i) => {
        const index = i;
        return (number) => {
            const lastElement = this.state.items.filter(item => item.index === index)[0];
            lastElement.sum = number;
            const newItems = this.state.items.filter(item => item.index !== index);
            this.setState({...this.state, items: [...newItems, lastElement]});
        }
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

        const items = this.state.items.map(item  => <PaymentFormCreateOrUpdateItem
            item = {item}
            onRemove={this.removeItemFunction(item.index)}
            onCommentChange={this.onCommentChangeFunction(item.index)}
            comment ={item.comment}
            sum = {item.sum}
            onSumChange = {this.onSumChangeFunction(item.index)}/>);

        return (
            <div style={formBox}>
                <div style={paymentFormStyle}>
                    <label>Фамилия</label>
                    <input type='text' style={inputStyle} onChange={(event) => this.setState({...this.state, lastName : event.target.value})}/>
                    <label>Имя</label>
                    <input type='text' style={inputStyle} onChange={(event) => this.setState({...this.state, name : event.target.value})}/>
                    <label>Отчество</label>
                    <input type='text' style={inputStyle} onChange={(event) => this.setState({...this.state, surName : event.target.value})}/>
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