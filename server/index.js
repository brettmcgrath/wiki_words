const express = require('express');
const cors = require('cors')
const parse = require('body-parser')
const superagent = require('superagent')

const app = express();
app.use(parse.json());
app.use(cors());

const port = 8080
app.listen(`${port}`, () => console.log(`listening at http://localhost:${port}`));
app.use(express.static('public'));


app.post('/wiki_url', (request, response) => {
  const url = request.body['url'];
  console.log(url);

  superagent
    .get(url)
    .end((error, res) => {
      console.log('FUUUUUUCCCKKKKKK')
      let page_number = Object.keys(res.body.query.pages)[0];
      let extract = res.body.query.pages[page_number].extract;
      console.log(res.body.query.pages["63948073"].revisions[1]['*']);
      response.send();
    })
});