import React from 'react';

const Box = require('3box');

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      heading: '3Box Spaces #BuildBetter',
      backgroundColor: '',                                                      // Default values to display when no 3Box user settings loaded
      fontSize:'20px',
      text: 'Do You Control Your Own Data??',
      fontFamily: 'courier',
      ethAddress: '0x531b92991c4EC8Bb18E39E6180aa2350e434C42D',
      spacePublicData: [],
      spacePrivateData: [],
      isAuthenticated: false,
      isSpaceSync: false
    };

    this.loadPublic = this.loadPublic.bind(this);
    this.UpdateEthAddress = this.UpdateEthAddress.bind(this);
    this.Open3Box = this.Open3Box.bind(this);
    this.Logout3Box = this.Logout3Box.bind(this);
    this.setPublic = this.setPublic.bind(this);
    this.setPrivate = this.setPrivate.bind(this);
    this.openSpace = this.openSpace.bind(this);
    this.updatePublicKey = this.updatePublicKey.bind(this);
    this.updatePublicValue = this.updatePublicValue.bind(this);
    this.updatePrivateKey = this.updatePrivateKey.bind(this);
    this.updatePrivateValue = this.updatePrivateValue.bind(this);
    this.boxSyncComplete = this.boxSyncComplete.bind(this);
    this.spaceSyncComplete = this.spaceSyncComplete.bind(this);
  }

  async loadPublic() {
    // If you only need to display public space data for a user or multiple users in your application, you can use the static read-only get methods
    const spaceData = await Box.getSpace(this.state.ethAddress, 'spacesdemo')                 // spacesdemo is the name used for this Apps 3Box Data Space

    this.setState({
      backgroundColor: spaceData.backgroundColor,
      fontSize: spaceData.fontSize
    })
  }

  UpdateEthAddress(event) {
    this.setState({ethAddress: event.target.value});
  }

  boxSyncComplete(){
    // When you first authenticate the user's 3Box, all data might not be synced from the network yet.
    console.log('Oh yeah synchd for action');
    this.setState({isAuthenticated: true});
  }

  spaceSyncComplete(){
    // We advise against setting any data before this sync has happened.
    console.log('Space Sync');
    this.setState({isSpaceSync: true});
  }

  async Open3Box(){
    // First we need to get the ethereum provider & user address
    const accounts = await window.ethereum.enable();
    console.log(accounts[0]);

    // Then we initialize a new 3Box session
    const box = await Box.openBox(accounts[0], window.ethereum);
    this.setState({box: box});
    box.onSyncDone(this.boxSyncComplete);                                     // When you first authenticate the user's 3Box, all data might not be synced from the network yet.
  }

  async Logout3Box(){
    // Closes 3Box session
    this.state.box.logout();
    this.setState({
      isAuthenticated: false
    })
  }

  async openSpace(){
    // If the user already has a space with this name, your application will gain access to it; if the user does not have the space, this method will automatically create one for them.
    const space = await this.state.box.openSpace('spacesdemo', { onSyncDone: this.spaceSyncComplete });
    console.log('Space opened.')
    this.setState({space: space});
    this.getSpaceData();
  }

  async getSpaceData() {
    // This loads all public and private data from the spacesdemo space opened previously with openSpace()
    const spacePublicData = await this.state.space.public.all();
    const spacePrivateData = await this.state.space.private.all();

    console.log('Public Info: ');
    console.log(spacePublicData);
    console.log('Private Info: ');
    console.log(spacePrivateData);

    this.setState({
      spacePublicData: spacePublicData,
      spacePrivateData: spacePrivateData,
      backgroundColor: spacePublicData.backgroundColor,
      fontSize: spacePublicData.fontSize,
      text: spacePrivateData.text,
      fontFamily: spacePrivateData.fontFamily,
    })

  }

  async setPublic(){
    // Saves to the Spaces Public location. When saving data to a space, use a key to set a value. To perform these actions, you must first authenticate the space.
    console.log('Setting Public: ' + this.state.publicKey + ' ' + this.state.publicValue);
    await this.state.space.public.set(this.state.publicKey, this.state.publicValue);
    console.log('Data saved = should update gui, etc');
    this.getSpaceData();
  }

  async setPrivate(){
    // Saves to the Spaces Private location. When saving data to a space, use a key to set a value. To perform these actions, you must first authenticate the space.
    console.log('Setting Private: ' + this.state.privateKey + ' ' + this.state.privateValue);
    await this.state.space.private.set(this.state.privateKey, this.state.privateValue);
    console.log('Private Data saved = should update gui, etc');
    this.getSpaceData();
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

    let authenticate  = <button className="btn btn-primary" onClick={this.Open3Box}>Authenticate 3Box</button>;
    let openSpace;

    if(this.state.isAuthenticated){
      openSpace = <button className="btn btn-primary" onClick={this.openSpace}>Open App Space</button>;
      authenticate = <button className="btn btn-primary" onClick={this.Logout3Box}>Logout 3Box</button>;
    }

    let space;
    let publicData;
    let privateData;
    if(this.state.isSpaceSync){

      publicData = Object.keys(this.state.spacePublicData).map(k => {
        return <li key={k}>Key: {k} Value: {this.state.spacePublicData[k]}</li>
      });

      privateData = Object.keys(this.state.spacePrivateData).map(k => {
        return <li key={k}>Key: {k} Value: {this.state.spacePrivateData[k]}</li>
      });

      space =
        <div>
          <h3>Public Data</h3>
          <ul>
            {publicData}
          </ul>
          <input type="text" placeholder="Key" onChange={this.updatePublicKey} />
          <input type="text" placeholder="Value" onChange={this.updatePublicValue} />
          <button className="btn btn-primary" onClick={this.setPublic}>Set Public Data</button>

          <h3>Private Data</h3>
            <ul>
              {privateData}
            </ul>
          <input type="text" placeholder="Key" onChange={this.updatePrivateKey} />
          <input type="text" placeholder="Value" onChange={this.updatePrivateValue} />
          <button className="btn btn-primary" onClick={this.setPrivate}>Set Private Data</button>
        </div>

    }

    return (
      <div>
        <div style={{backgroundColor: this.state.backgroundColor}}>
          <div style={{fontFamily: this.state.fontFamily}}>
            <a href="https://docs.3box.io/" target="_blank"><h1>{this.state.heading}</h1></a>
            <p style={{fontSize: this.state.fontSize}}>{this.state.text}</p>
          </div>
        </div>

        <hr></hr>
        <h3>Try Me</h3>
        <input type="text" value={this.state.ethAddress} onChange={this.UpdateEthAddress} placeholder="Ethereum Address"/>
        <button className="btn btn-primary" onClick={this.loadPublic}>Load Public Data</button>

        <hr></hr>
        <h3>Get Personal</h3>
        {authenticate}
        <p/>
        {openSpace}
        {space}
      </div>
  )
  }
}

export default App;
