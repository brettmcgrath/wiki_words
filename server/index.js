const express = require('express');
const cors = require('cors')
const parse = require('body-parser')
const superagent = require('superagent')
const Diff = require('diff');

const app = express();
app.use(parse.json());
app.use(cors());

const port = 8080
app.listen(`${port}`, () => console.log(`listening at http://localhost:${port}`));
app.use(express.static('public'));


let urls = []; //a list of all websites listed 
let words = [];
let words_str = "";
let revision_list = [];
let difference = "";
let references = [];
let final_text = "";
let array47 = [];
let text_array = [];

app.post('/wiki_url', (request, response) => {
  const url = request.body['url'];
  //console.log(url);

  superagent
    .get(url)
    .end((error, res) => {
        let page_number = Object.keys(res.body.query.pages)[0]; //page number assigned to that particular wikipedia article
        //let extract = res.body.query.pages[page_number].extract;
        //let len = res.body.query.pages[page_number].revisions.length;
        let revisions = res.body.query.pages[page_number].revisions; 
        //[10]['*']);     this is the last part that it takes to get to the text of the revisions
        //find_diff(res.body.query.pages["63948073"].revisions[i]['*']), (res.body.query.pages["63948073"].revisions[i+1]['*']);
        response.send();


        Object.keys(revisions).forEach(function (i) {
            let revs = revisions[i]['*'];
            revision_list.push(revs);
        });
        
        let revision_str = revision_list.join(" ");
            // console.log(clean(revision_str))


        for (var i = 0; i < revision_list.length; i++)
            Diff.diffWords(revision_list[i], revision_list[++i])
            .forEach(function(part){
            let removed = part.removed //boolean value
            let added = part.added //boolean value
            if (added || removed) {
                difference += part.value + ' ';
                
            };
        });
        console.log(clean(difference))
        //console.log(difference)
     });
    
});



 function clean(text) {
    text = text.replace(/\<r.*?>/igm, ' ')
    .replace(/\<\/r.*?>/igm, ' ') //takes out any potential straggling /ref
    .replace('web|url',  ' ')
    .replace('|url',  ' ')
    .replace('|language=en-US|work=', ' ')
    .replace(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/gim, ' ')
    .replace(/\[\[.*?\]\]/gim, ' ') //replace [[stuff]]
    .replace(/{{.*?\}}/gim, ' ') //replace {{stuff}}
    .replace(/\|/igm, ' ') //takes out | and replaces with a space
    .replace('== References ==', ' ') //Replaces references tag
    .replace(/[\.\:\;\,\"\'\>\<\-\+\=\”\“\/]/gim, ' ') //removes periods, :, commands and ; from string
    .replace('date=', ' ')
    .replace('name=', ' ')
    .replace('reflist', ' ')
    .replace('rfs', ' ')
    .replace(/https?/, ' ')
    .replace(/\n/g, ' ') //replace new lines with a single space
    .replace(/  +/g, ' ') //replace multiple spacings with one
    .replace(/\'[s]/gim, " ")
    .replace(/\’[s]/gim, "")
    

    let replace_array = [" a ", " the ", " for ", " but ", " s ", " The ", " of ", " in ", " about ", " On ", " that ", " is ", " are "]
    for (let i = 0; i < replace_array.length; ++i) {
        if (text.includes(replace_array[i])) {
            text = text.replace((replace_array[i]), ' ')
            }
    }
    return text;
 };