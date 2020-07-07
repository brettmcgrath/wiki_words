# Wiki_words

### Premise

  - Full stack JavaScript application
  - Uses the Wikipedia API to access the added and deleted content of up to 500 Wikipedia revisions
  - Designed to give data visualizations showing possible trends in the most added and removed words in     Wikipedia revisions for the purpose of possibly detecting areas of contention or merely overusage of     certain words.

### Code Louisville Requirements Fulfilled

  - Retrieve data from an external API and display data in your app (such as with fetch() or with AJAX)
  - Create a form and save the response (on click of Submit button) to an external file or API
  - Create a dictionary or list, populate it with several values, retrieve at least one value, and use       it in your program
  - Analyze text and display information about it (ex: how many words in a paragraph)
  - Visualize data in a graph, chart, or other visual representation of data

  
### Installation
Wiki_words was constructed using [Node.js](https://nodejs.org/) v12.16.3

To run this application, install all node modules for the server and client seperately in their respective directories 
```sh
$ cd server
$ npm install
```

```sh
$ cd client
$ npm install
```

Open a command prompt, cd into the server directory, and run a node instance of index.js
```sh
$ cd server
$ node index.js
```
The server runs on http://localhost:8080

### Directions for program use
- Open client/index.html with your browser of choice (has only been tested using latest versions Mozilla Firefox and Google Chrome)
- Enter a valid Wikipedia URL (the main readable page ie. https://en.wikipedia.org/wiki/Apple_sauce) into the search bar and click the submit button. 
- A word cloud and pie chart will populate in the browser document displaying words from the added and removed content of the last 500 revisions.
