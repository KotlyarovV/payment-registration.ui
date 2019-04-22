import React, {Component} from "react";
import { StyledDropZone } from 'react-drop-zone'
import 'react-drop-zone/dist/styles.css'

class PaymentFormCreateOrUpdateItem  extends Component{
    constructor(props) {
        super(props);
        this.onChangeSum = this.onChangeSum.bind(this);
    }

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
            width: 'auto',
            height: '5%',
            border: '1px solid #ccc',
            borderRadius: '4px',
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
                <textarea onChange={this.props.onCommentChange} style={textAreaStyle} value={this.props.comment}/>
                <div>
                    <StyledDropZone onDrop={this.props.onAddFile} />
                    <ul>
                        {
                            this.props.files.map((file, i) =>
                                <li>
                                    <button style={deleteButton} onClick={() => {this.props.onDeleteFile(i)}}>Удалить</button>
                                    <i className='fa fa-file'/> {file.name}
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

        if (props.formToUpdate !== undefined) {
            this.state = {
                type : props.formToUpdate.type,
                items : props.formToUpdate.items,
                id : props.formToUpdate.id,
                name : props.applicant.name,
                lastName: props.lastName,
                surname: props.surName
            };
        } else {
            items.push({sum : 0, comment : '', files : []});
            this.state = {type : 1, items : items.map((item, i)=> {
                    return {...item, index : i}
                })};
        }



        this.handleChange = this.handleChange.bind(this);
        this.createForm = this.createForm.bind(this);
        this.addItemForm = this.addItemForm.bind(this);
        this.removeItemFunction = this.removeItemFunction.bind(this);
        this.onCommentChangeFunction = this.onCommentChangeFunction.bind(this);
        this.onSumChangeFunction = this.onSumChangeFunction.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    createForm() {

        const items = this.state.items
            .map((item, i) => {
                return {
                    comment : item.comment,
                    sum : item.sum,
                    sortOrder : i + 1,
                    files : item.files.map((f) => {
                        return {
                            fileInBase64 : f.fileInBase64,
                            extension : f.extension
                        }
                    })
                }
            });

        var form = {
            applicant : {
                name: this.state.name,
                lastName: this.state.lastName,
                surname: this.state.surName,
            },
            type : this.state.type,
            items : items
        };

        console.log(JSON.stringify(form));

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
                this.props.onHide();
                return response.json();
            })
            .then(function (data) {
             })
            .catch(error => this.setState({error}));

    }

    addItemForm = () => {
        const indexes = this.state.items.map(i => i.index);
        const maxIndex = indexes.length === 0 ? 0 : Math.max(...indexes, 0) + 1;
        this.setState((prevState) => ({
            ...this.state,
            items : [...prevState.items, {sum : '', comment : '', files : [], index : maxIndex}]
        }));
    };

    removeItemFunction = (i) => {
        const index = i;
        return  () => {
            const newItems = this.state.items.filter(item => item.index !== index);
            this.setState({...this.state, items: newItems})
        }
    };

    onCommentChangeFunction =  (index, str) => {
        const lastElement = this.state.items.filter(item => item.index === index)[0];
        lastElement.comment = str;
        const nonChanchedItems = this.state.items.filter(item => item.index !== index);
        const newItems = [...nonChanchedItems, lastElement].sort(this.sortFunction);
        this.setState({...this.state, items: newItems});
    };

    sortFunction = (item1, item2) => {
        if (item1.index < item2.index) {
            return -1;
        } else if (item1.index > item2.index){
            return 1;
        } else {
            return 0;
        }
    };

    onDeleteFile = (itemIndex) => {
        const index = itemIndex;
        return (fileIndex) => {
            const items = this.state.items.map((item) => {
                if (item.index === index) {
                    item.files = item.files.filter((file, i) => i !== fileIndex);
                    return item;
                } else {
                    return item;
                }
            });

            this.setState({...this.state, items : items});
        }
    };

    onAddFile = (i) => {
      const index = i;
      return (file) => {

          var reader = new FileReader();
          reader.readAsDataURL(file);
          const name = file.name;
          reader.onload = () => {

              const result = reader.result;
              const base64Index = result.search("base64,");
              const base64 = result.substring(base64Index + 7);
              const lastDotNumber = name.lastIndexOf('.');
              let extension = '';

              if (lastDotNumber !== -1) {
                  extension = name.substring(lastDotNumber + 1);
              }

              const file = {
                  fileInBase64 : base64,
                  name : name,
                  extension : extension
              };

              const items = this.state.items.map((item, j) => {
                  if (j === index) {
                    item.files.push(file);
                    return item;
                  } else {
                    return item;
                  }
              });

              this.setState( {...this.state, items});
          };
        };
    };

onSumChangeFunction = (i) => {
    const index = i;
    return (number) => {
        const lastElement = this.state.items.filter(item => item.index === index)[0];
        lastElement.sum = number;
        const nonChanchedItems = this.state.items.filter(item => item.index !== index);
        const newItems = [...nonChanchedItems, lastElement].sort(this.sortFunction);
        this.setState({...this.state, items: newItems});
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
        onCommentChange={(event) => {this.onCommentChangeFunction(item.index, event.target.value)}}
        comment ={item.comment}
        sum = {item.sum}
        onSumChange = {this.onSumChangeFunction(item.index)}
        onAddFile = {this.onAddFile(item.index)}
        files = {item.files}
        onDeleteFile={this.onDeleteFile(item.index)}/>);

    if(!this.props.show){
        return null;
    }

    return (
        <div style={formBox}>
            <button style={buttonStyle} onClick={this.props.onHide}>Отменить добавление</button>
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
                <select style={inputStyle} onChange={(event) => this.setState({...this.state, type : event.target.value})}>
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