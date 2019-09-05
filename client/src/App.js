import React, { Component } from "react";

class App extends Component {
  render() {
    return ( 
     <div className="main-container">
        <form>
          <h2>Enter a long URL to make tiny:</h2>        
          <div>
            <input className="url" type="text" id="url" name="url"/>
            <input className="button" type="button" value="Make TinyURL!"/>
          </div>
          <hr/>
          <div className="custom-alias">
            <span>Custom alias (optional):</span>
            <input type="text" id="alias" name="alias" />
            <p className="help">(May contain letters, numbers, and dashes.)</p>
          </div>
        </form>
     </div>
     );
  }
}

export default App;
