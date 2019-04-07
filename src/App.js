import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class Position extends Component{

}

class Request extends Component {
  render() {
    return (
        <div>
          <div>
            {this.props.number}
          </div>
          <div>
            {this.props.date}
          </div>
          <div>
            {this.props.fio}
          </div>
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
