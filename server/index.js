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


let revision_list = [];

app.post('/wiki_url', (request, response) => {
    let page = request.body['url']
    let url = page.replace(/\/wiki\//, "/w/api.php?format=json&action=query&rvprop=content&rvlimit=500&rvdir=newer&prop=revisions&titles=")
    console.log(url)





    superagent
        .get(url)
        .end((error, res) => {
            let page_number = Object.keys(res.body.query.pages)[0]; //page number assigned to that particular wikipedia article
            //let extract = res.body.query.pages[page_number].extract;
            //let len = res.body.query.pages[page_number].revisions.length;
            let revisions = res.body.query.pages[page_number].revisions; 
            //[10]['*']);     this is the last part that it takes to get to the text of the revisions
            //find_diff(res.body.query.pages["63948073"].revisions[i]['*']), (res.body.query.pages["63948073"].revisions[i+1]['*']);

            Object.keys(revisions).forEach(function (i) {
                let revs = revisions[i]['*'];
                revision_list.push(revs);
            });
            
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
            
            let word_data = clean(difference);
            let words_json = { "words" : `${word_data}` } 
            //console.log(words_json)
        
            console.log(difference + word_data + "x")
            
            response.send(words_json);
            
        
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
    .replace(/\n/gim, ' ') //replace new lines with a single space
    .replace(/  +/gim, ' ') //replace multiple spacings with one
    .replace(/\'[s]/gim, " ")
    .replace(/\’[s]/gim, "")
    

    let replace_array = [/\bthe\b/igm, /\ba\b/igm, /\bof\b/igm, /\bfor\b/igm, /\bbut\b/igm, /\bof\b/igm, /\bin\b/igm, /\babout\b/igm, /\bon\b/igm, /\bthat\b/igm, /\bis\b/igm, /\bare\b/igm, /\band\b/igm, /\bto\b/igm, /\bas\b/igm, /\bat\b/igm]
    for (let i = 0; i < replace_array.length; i++) {
            text = text.replace((replace_array[i]), '')
    }
    return text;
 };