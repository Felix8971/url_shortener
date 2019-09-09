# url_shortener

A code challenge made with node.js, mongodb, express, react.js

### Pre-requirements
- node & npm 
- Make sure to enable CORS on your browser since we are calling our own APIs via our own machine. 
  [Here](https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?hl=en) a great plug-in to do it.

### To get started

1. `git clone https://github.com/Felix8971/url_shortener.git`
2. run `cd url_shortener; npm install` 
3. run `cd client; npm install` 
4. run `cd ..` 
5. run `npm start` (wait for the message "You can now view client in the browser.")
6. visit <http://localhost:3000/> 

### Vulnerabilties
Test all the untrusted data coming from the user
We can use a tool like https://app.snyk.io to find vulnerabilities in our npm packages.
  
### scalability
We can split our data into smaller chunks, then spread those chunks around onto different servers.
Idea: The right cluster (used to save the data) can be choosen according to the first letter found in shortUrl.
 