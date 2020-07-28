const express = require('express');
const cors = require('cors')
const parse = require('body-parser')
const superagent = require('superagent')
const Diff = require('diff');

//Sets up express use for API routing and CORS library to prevent CORS issues when running locally
const app = express();
app.use(parse.json());
app.use(cors());

const port = 8080
app.listen(`${port}`, () => console.log(`listening at http://localhost:${port}`));
app.use(express.static('public'));


let revision_list = []; //an array of revisions to be populated after GET request to Wikipedia API


//Listens for POST request from broswer with Wikipedia URL and converts it into a query for GET request below
app.post('/wiki_url', (request, response) => {
    let page = request.body['url']
    let url = page.replace(/\/wiki\//, "/w/api.php?format=json&action=query&rvprop=content&rvlimit=500&rvdir=newer&prop=revisions&titles=")
    

//GET request to Wikipedia API
    superagent
        .get(url)
        .end((error, res) => {
            let page_number = Object.keys(res.body.query.pages)[0]; //page number assigned to that particular wikipedia article
            let revisions = res.body.query.pages[page_number].revisions; //accesses revisions object for particular Wikipedia article

            //iterates through revisions and adds them to revision_list array
            Object.keys(revisions).forEach(function (i) {
                let revs = revisions[i]['*'];
                revision_list.push(revs);
            });
            
            //Uses diff library to find the added and removed words from a revision and the revision preceding it
            let difference = "";
            for (var i = 0; i < revision_list.length; i++) {
                Diff.diffWords(revision_list[i], revision_list[++i])
                .forEach(function(part){
                let removed = part.removed //boolean value
                let added = part.added //boolean value
                if (added || removed) {
                    difference += part.value + ' ';
                };
            });
        };
            //Uses data cleaning function (see below) to remove unwanted characters and text before converting to JSON to send back to client
            let word_data = clean(difference);
            let words_json = { "words" : `${word_data}` } 
        
            //Sends JSON of cleaned text back to client
            response.send(words_json);
            console.log(`revisions for ${page} received, cleaned, and sent to browser`);
            
        
        });
    
    });


//Uses regex to clean data of unwanted words, characters, text
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
    .replace(/\n/gim, ' ') //replace new lines with a single space
    .replace(/  +/gim, ' ') //replace multiple spacings with one
    .replace(/\'[s]/gim, " ") //replace apostrophe
    .replace(/\’[s]/gim, "") //replace apostrophe type 2
    .replace(/[^\w\d\-]/gim, " ")
    .replace(/[^\w-]/gim, " ") //replaces all non-word characters but - 
    
    //specific words to be removed from data visualizations
    let replace_array = [/\bthe\b/igm, /\ba\b/igm, /\bof\b/igm, /\bfor\b/igm, /\bbut\b/igm, /\bof\b/igm, /\bin\b/igm, 
        /\babout\b/igm, /\bon\b/igm, /\bthat\b/igm, /\bis\b/igm, /\bare\b/igm, /\band\b/igm, /\bto\b/igm, /\bas\b/igm, 
        /\bat\b/igm, /\bher\b/igm, /\bit\b/igm, /\bhave\b/igm, /\bhas\b/igm, /\bhad\b/igm, /\bonly\b/igm, /\bbe\b/igm,
        /\bhe\b/igm, /\bshe\b/igm, /\ban\b/igm, /\bit\b/igm, /\bif\b/igm, /\bmore\b/igm, /\bwhen\b/igm, /\bwhere\b/igm,
        /\bwere\b/igm, /\bwhere\b/igm, /\bhow\b/igm, /\btheir\b/igm, /\bthere\b/igm, /\bgo\b/igm, /\bgoes\b/igm, /\bwent\b/igm,
        /\bahed\b/igm, /\bvery\b/igm, /\bmuch\b/igm, /\bcom\b/igm, /\bs\b/igm, /\bwas\b/igm, /\bfrom\b/igm, /\bwho\b/igm, /\bwhich\b/igm,
        /\bor\b/igm, /\bthem\b/igm, /\bdo\b/igm, /\bthey\b/igm, /\bhis\b/igm, /\bwith\b/igm, /\bnot\b/igm, /\bgood\b/igm]


    for (let i = 0; i < replace_array.length; i++) {
            text = text.replace((replace_array[i]), '')
    }
    return text.trim();
 };