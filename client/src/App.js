import React, { Component } from 'react';
import axios from 'axios';

class App extends Component {
  // initialize our state
  state = {
    url: null,
    shortUrl: null,
    customShortUrl: null,
    errorMsg: null,
  };

  // our put method that uses our backend api
  // to create new entry into our data base
  putDataToDB = (url, customShortUrl) => {
    this.setState({ shortUrl: null });
    this.setState({ errorMsg: null });
    url && axios.post('http://localhost:3001/api/putData', {
      url,
      customShortUrl: customShortUrl,
    }).then((res)=>{
      if ( res.data.success ){
        this.setState({ shortUrl: res.data.shortUrl });
      } else {
        console.log(res.data.msg);
        this.setState({ errorMsg: res.data.msg });
      }
    }).catch(error => {
      console.log(error)
    });
  };

  render() {
    const { shortUrl, errorMsg } = this.state;
    return (
      <div className="main-container">
        <form>
          <h2>Enter a long URL to make tiny:</h2>        
          <div className="url-container">
          <input 
            onChange={(e) => this.setState({ url: e.target.value })} 
            className="url" 
            type="text" 
            id="url" 
            name="url"
          />
          <input 
            onClick={() => this.putDataToDB(this.state.url, this.state.customShortUrl.trim())}
            className="button" 
            type="button" 
            value="Make TinyURL!"
          />
        </div>
          <hr/>
        <div className="custom-alias">
            <span>Custom alias (optional):</span>          
          <input 
            onChange={(e) => this.setState({ customShortUrl: e.target.value })} 
            type="text" 
            id="alias" 
            name="alias" 
          />
          <p className="help">(May contain letters, numbers, and dashes.)</p>
        </div>
        {!shortUrl ? 
          null
          : 
          <div className="short-url">
            <span className="title">Your short url:</span>
            <a href={shortUrl} rel="noopener noreferrer" target="_blank">{shortUrl}</a>
          </div> 
        }
        {!errorMsg ? 
          null
          : 
          <div className="error-msg">
            {errorMsg}
          </div> 
        }
        </form>
      </div>
    );
  }
}

export default App;
