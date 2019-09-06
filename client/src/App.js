import React, { Component } from 'react';
import axios from 'axios';

class App extends Component {
  // initialize our state
  state = {
    data: [],
    id: 0,
    url: null,
    shortUrl: null,
    customShortUrl: null,
    errorMsg: null,
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null,
  };

  // when component mounts, first thing it does is fetch all existing data in our db
  // then we incorporate a polling logic so that we can easily see if our db has
  // changed and implement those changes into our UI
  componentDidMount() {
    // this.getDataFromDb();
    // if (!this.state.intervalIsSet) {
    //   let interval = setInterval(this.getDataFromDb, 9000);
    //   this.setState({ intervalIsSet: interval });
    // }
  }

  // never let a process live forever
  // always kill a process everytime we are done using it
  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  // just a note, here, in the front end, we use the id key of our data object
  // in order to identify which we want to Update or delete.
  // for our back end, we use the object id assigned by MongoDB to modify
  // data base entries

  // our first get method that uses our backend api to
  // fetch data from our data base
  getDataFromDb = () => {
    fetch('http://localhost:3001/api/getData')
      .then((data) => { return data.json(); })
      .then((res) => this.setState({ data: res.data }));
  };

  // our put method that uses our backend api
  // to create new query into our data base
  putDataToDB = (url, customShortUrl) => {
    let currentIds = this.state.data.map((data) => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }
    
    this.setState({ shortUrl: null });
    this.setState({ errorMsg: null });
    url && axios.post('http://localhost:3001/api/putData', {
      id: idToBeAdded,
      url,
      customShortUrl: customShortUrl,
    }).then((res)=>{
      if ( res.data.success ){
        //console.log("data from server=",res.data.shortUrl);
        this.setState({ shortUrl: res.data.shortUrl });
      } else {
        console.log(res.data.msg);
        this.setState({ errorMsg: res.data.msg });
      }
    }).catch(error => {
      console.log(error)
    });
  };

  // here is our UI
  // it is easy to understand their functions when you
  // see them render into our screen
  render() {
    const { shortUrl, errorMsg } = this.state;
    return (
      <div>
        {/* <ul>
          {data.length <= 0
            ? 'NO DB ENTRIES YET'
            : data.map((_data, index) => (
                <li key={index}>
                  <span> id: </span> {_data.id} <br/>
                  <span> url: </span> {_data.url} <br/>
                  <span> short url: </span> {_data.shortUrl} <br/>                
                </li>
              ))}
        </ul> */}

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
              onClick={() => this.putDataToDB(this.state.url, this.state.customShortUrl)}
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
            ''
            : 
            <div className="short-url">
              <span className="title">Your short url:</span>
              <a href={shortUrl} rel="noopener noreferrer" target="_blank">{shortUrl}</a>
            </div> 
          }
          {!errorMsg ? 
            ''
            : 
            <div className="error-msg">
              {errorMsg}
            </div> 
          }
         </form>
        </div>
      </div>
    );
  }
}

export default App;
