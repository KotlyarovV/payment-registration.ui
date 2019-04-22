import React, {Component} from "react";
import 'react-drop-zone/dist/styles.css'
import PaymentFormCreateOrUpdateItem from "./PaymentFormCreateOrUpdateItem";

export default class CreateOrUpdatePaymentForm extends Component {
    constructor(props) {
        super(props);

        this.state =  CreateOrUpdatePaymentForm.createStartState();

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

    static createStartState = () => {
        const items = [];
        items.push({sum : '', comment : '', files : []});
        return   {
            form : {
                type : 1,
                items : items.map((item, i)=> {
                    return {...item, index : i}
                })}
        };
    };

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.formToUpdate !== undefined) {

            if (nextProps.show === false) {
                return CreateOrUpdatePaymentForm.createStartState();
            }

            if (prevState.form.id === undefined) {
                return {
                    form : {
                        type: nextProps.formToUpdate.type,
                        items: nextProps.formToUpdate.items.map((item, i) => {
                            return {...item, index: i}
                        }),
                        id: nextProps.formToUpdate.id,
                        name: nextProps.formToUpdate.applicant.name,
                        lastName: nextProps.formToUpdate.applicant.lastName,
                        surName: nextProps.formToUpdate.applicant.surname
                    }
                };
            }

            return prevState;
        } else {
            if (nextProps.show === false) {
                return CreateOrUpdatePaymentForm.createStartState();
            }

            return prevState;
        }

    }

    validate = (mapedForm) => {
      let validationResult = true;
      if (mapedForm.applicant.lastName === undefined || mapedForm.applicant.lastName.replace(" " , '').length === 0) {
          alert("Должна быть указана хотя бы фамилия");
          validationResult = false;
      }

      if (mapedForm.items.length === 0) {
          alert("Должна быть добавлена хотя бы одна заявка");
          validationResult = false;
      }

      if (mapedForm.items.some(i => i.comment === undefined || i.comment.replace(" " , '').length === 0)) {
          alert("У каждого пункта заявки должен быть комментарий");
          validationResult = false;
      }

        if (mapedForm.items.some(i => i.sum === undefined || i.sum === '')) {
            alert("У каждого пункта заявки должен быть проставлена стоимость");
            validationResult = false;
        }

      return validationResult;
    };

    mapForm() {
        const items = this.state.form.items
            .map((item, i) => {
                let itemToSend = {
                    comment : item.comment,
                    sum : item.sum,
                    sortOrder : i + 1,
                    files : item.files.map((f) => {

                        if (this.state.form.id === undefined) {
                            return {
                                fileInBase64 : f.fileInBase64,
                                extension : f.extension
                            }
                        }
                        else {
                            if (f.id !== undefined) {
                                return {id : f.id}
                            } else {
                                return {file : {
                                        fileInBase64 : f.fileInBase64,
                                        extension : f.extension
                                    }
                                }
                            }
                        }
                    })
                };

                if (item.id !== undefined) {
                    return {...itemToSend, id : item.id};
                } else {
                    return item;
                }
            });
        var form = {
            applicant : {
                name: this.state.form.name,
                lastName: this.state.form.lastName,
                surname: this.state.form.surName,
            },
            type : this.state.form.type,
            items : items
        };

        if (this.state.form.id !== undefined) {
            return {...form, id : this.state.form.id}
        }

        return form;
    }

    createForm() {

        let form = this.mapForm();

        if (!this.validate(form)) {
            return;
        }

        let request = {};

        if (this.state.form.id !== undefined) {
            request = {
                url : 'https://localhost:44379/paymentForm/' + this.state.form.id,
                method : 'put'
            }
        } else {
            request = {
                url : 'https://localhost:44379/paymentForm',
                method : 'post'
            }
        }

        fetch(request.url,
            {
                method: request.method,
                body: JSON.stringify(form),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                this.props.onHide();
            })
            .catch(error => this.setState({error}));
    }

    addItemForm = () => {
        const indexes = this.state.form.items.map(i => i.index);
        const maxIndex = indexes.length === 0 ? 0 : Math.max(...indexes, 0) + 1;
        this.setState((prevState) => ({
            form : {
                ...this.state.form,
                items : [...prevState.form.items, {sum : '', comment : '', files : [], index : maxIndex}]
            }
        }));
    };

    removeItemFunction = (i) => {
        const index = i;
        return  () => {
            const newItems = this.state.form.items.filter(item => item.index !== index);
            this.setState({form : {...this.state.form, items: newItems}});
        }
    };

    onCommentChangeFunction =  (index, str) => {
        const lastElement = this.state.form.items.filter(item => item.index === index)[0];
        lastElement.comment = str;
        const nonChanchedItems = this.state.form.items.filter(item => item.index !== index);
        const newItems = [...nonChanchedItems, lastElement].sort(this.sortFunction);
        this.setState({form : {...this.state.form, items : newItems}});
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
            const items = this.state.form.items.map((item) => {
                if (item.index === index) {
                    item.files = item.files.filter((file, i) => i !== fileIndex);
                    return item;
                } else {
                    return item;
                }
            });
            this.setState({form : {...this.state.form, items : items}});
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

              const items = this.state.form.items.map((item, j) => {
                  if (j === index) {
                    item.files.push(file);
                    return item;
                  } else {
                    return item;
                  }
              });
              this.setState({form : {...this.state.form, items : items}});
          };
        };
    };

    onSumChangeFunction = (i) => {
        const index = i;
        return (number) => {
            const lastElement = this.state.form.items.filter(item => item.index === index)[0];
            lastElement.sum = number;
            const nonChanchedItems = this.state.form.items.filter(item => item.index !== index);
            const newItems = [...nonChanchedItems, lastElement].sort(this.sortFunction);
            this.setState({form : {...this.state.form, items : newItems}});
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

    const items = this.state.form.items.map(item  => <PaymentFormCreateOrUpdateItem
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
                <input type='text' style={inputStyle} value={this.state.form.lastName} onChange={(event) => this.setState({form : {...this.state.form, lastName : event.target.value}})}/>
                <label>Имя</label>
                <input type='text' style={inputStyle} value={this.state.form.name} onChange={(event) => this.setState({form : {...this.state.form, name : event.target.value}})}/>
                <label>Отчество</label>
                <input type='text' style={inputStyle} value={this.state.form.surName} onChange={(event) => this.setState({form : {...this.state.form, surName : event.target.value}})}/>
                <label>
                    Тип
                </label>
                <select style={inputStyle} value={this.state.form.type} onChange={(event) => {
                    this.setState({form : {...this.state.form, type : event.target.value}})
                }}>
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