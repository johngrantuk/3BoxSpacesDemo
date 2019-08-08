import React from 'react';
import './App.css';

const Box = require('3box');

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      heading: 'What If I Told You',
      backgroundColor: '',
      fontSize:'50px',
      text: 'You Could Control Your Own Data??',
      fontFamily: 'courier',
      ethAddress: '0xf8b908e7DBb3a0f2581aa8F1962f9360e10DC059'
    };
    this.loadPublic = this.loadPublic.bind(this);
    this.UpdateEthAddress = this.UpdateEthAddress.bind(this);
    this.Open3Box = this.Open3Box.bind(this);
    this.setPublic = this.setPublic.bind(this);
    this.setPrivate = this.setPrivate.bind(this);
    this.openSpace = this.openSpace.bind(this);
    this.updatePublicKey = this.updatePublicKey.bind(this);
    this.updatePublicValue = this.updatePublicValue.bind(this);
    this.updatePrivateKey = this.updatePrivateKey.bind(this);
    this.updatePrivateValue = this.updatePrivateValue.bind(this);
  }

  async componentDidMount() {

  }

  componentWillUnmount() {

  }

  async loadPublic() {
    const profile = await Box.getProfile('0xf8b908e7DBb3a0f2581aa8F1962f9360e10DC059');
    console.log(profile);

    const spaceList = await Box.listSpaces('0xf8b908e7DBb3a0f2581aa8F1962f9360e10DC059');
    console.log(spaceList);

    const spaceData = await Box.getSpace('0xf8b908e7DBb3a0f2581aa8F1962f9360e10DC059', 'pizza')
    console.log(spaceData)    // { PublicTestSpaceData: "LaddyDaaaa" }
    console.log(spaceData.backgroundColor)
    this.setState({backgroundColor: spaceData.backgroundColor})
  }

  UpdateEthAddress(event) {
    this.setState({value: event.target.value});
  }

  syncComplete(){
    console.log('Oh yeah synchd for action')
  }

  async Open3Box(){
    const accounts = await window.ethereum.enable();
    console.log(accounts[0]);
    const box = await Box.openBox(accounts[0], window.ethereum);
    this.setState({box: box});
    box.onSyncDone(this.syncComplete);
  }

  async openSpace(){
    const space = await this.state.box.openSpace('pizza', { onSyncDone: () => console.log('Space Sync') });
    this.setState({space: space})
  }

  async setPublic(){
    console.log('Setting Public: ' + this.state.publicKey + ' ' + this.state.publicValue);
    await this.state.space.public.set(this.state.publicKey, this.state.publicValue);
    console.log('Data saved = should update gui, etc')
  }

  async setPrivate(){
    console.log('Setting Private: ' + this.state.privateKey + ' ' + this.state.privateValue)
  }

  updatePublicKey(event) {
    this.setState({publicKey: event.target.value});
  }

  updatePublicValue(event) {
    this.setState({publicValue: event.target.value});
  }

  updatePrivateKey(event) {
    this.setState({privateKey: event.target.value});
  }

  updatePrivateValue(event) {
    this.setState({privateValue: event.target.value});
  }

  render(){

      return (
        <div>
          <div style={{backgroundColor: this.state.backgroundColor}}>
            <div style={{fontFamily: this.state.fontFamily}}>
              <h1>{this.state.heading}</h1>
              <p style={{fontSize: this.state.fontSize}}>{this.state.text}</p>
            </div>
          </div>

          <hr></hr>

          <input type="text" value={this.state.ethAddress} onChange={this.UpdateEthAddress} placeholder="Ethereum Address"/>
          <button className="btn btn-primary" onClick={this.loadPublic}>Load Public Data</button>

          <hr></hr>
          <button className="btn btn-primary" onClick={this.Open3Box}>Open 3Box</button>
          <p/>
          <button className="btn btn-primary" onClick={this.openSpace}>Open App Space</button>

          <h3>Public Data</h3>
          <input type="text" placeholder="Key" onChange={this.updatePublicKey} />
          <input type="text" placeholder="Value" onChange={this.updatePublicValue} />
          <button className="btn btn-primary" onClick={this.setPublic}>Set Public Data</button>

          <h3>Private Data</h3>
          <input type="text" placeholder="Key" onChange={this.updatePrivateKey} />
          <input type="text" placeholder="Value" onChange={this.updatePrivateValue} />
          <button className="btn btn-primary" onClick={this.setPrivate}>Set Private Data</button>
        </div>
    )
  }
}

export default App;
