import React from 'react';
import logo from './logo.svg';
import './App.css';

const Box = require('3box');

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {toppings: 'Cheese'};
  }

  async componentDidMount() {
    const profile = await Box.getProfile('0xf8b908e7DBb3a0f2581aa8F1962f9360e10DC059');
    console.log(profile);
  }

  componentWillUnmount() {

  }



  render(){

      return (
        <div>
          <h1>Did someone say pizza?</h1>
          <h2>{this.state.toppings}</h2>
        </div>
    )
  }
}

export default App;
