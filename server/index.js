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


app.post('/wiki_url', (request, response) => {
  const url = request.body['url'];
  console.log(url);

  superagent
    .get(url)
    .end((error, res) => {
      let page_number = Object.keys(res.body.query.pages)[0];
      let extract = res.body.query.pages[page_number].extract;
      console.log(res.body.query.pages["63948073"].revisions[10]['*']); //Write a for loop to iterate through the second to last item in the sequence to get the text blobs for 500 entires at a time
      response.send();
    })
});



//for testing purposes
const one = "On 13 May 2020, Breonna Taylor, an [[emergency medical technician]], was allegedly shot during a [[narcotics]] [[investigation]] where [[Louisville Metro Police Department]] officers entered her [[apartment]] unannounced.  The investigation was supposedly centered around a '[[trap house]]' over 16 km away from the residence of the victim, as well as the two people that police believed were distributing [[controlled substances]].<ref>https://www.usatoday.com/story/news/nation/2020/05/13/breonna-taylor-not-target-louisville-police-investigation-when-shot/5181690002/</ref> The boyfriend of Taylor, Kenneth Walker, discharged his [[firearm]] first, injuring a law enforement officer.  Walker's lawyer stated that Walker thought that someone was entering the residence illegally, and that Walker acted only in self-defense.  Walker now faces criminal charges of first-degree assault and attempted murder of a police officer.<ref>https://www.courier-journal.com/story/news/crime/2020/05/13/breonna-taylor-lawyer-says-louisville-police-need-to-get-story-straight/5183137002/</ref>"
const two = "On 13 May 2020, 26 y o Breonna Taylor, an [[emergency medical technician]], was allegedly shot eight times<ref>https://www.washingtonpost.com/nation/2020/05/11/family-seeks-answers-fatal-police-shooting-louisville-woman-her-apartment/</ref> during a [[narcotics]] [[investigation]] where [[Louisville Metro Police Department]] officers Jonathan Mattingly, Brett Hankison and Myles Cosgrove<ref>https://www.usatoday.com/story/news/nation/2020/05/12/breonna-taylor-killing-family-hires-attorney-ahmaud-arbery-case/3114440001/</ref> entered her [[apartment]] in [[Louisville]], [[Kentucky]] united states unannounced.  The investigation was supposedly centered around a '[[trap house]]' over 16 km away from the residence of the victim, as well as the two people that police believed were distributing [[controlled substances]].<ref>https://www.usatoday.com/story/news/nation/2020/05/13/breonna-taylor-not-target-louisville-police-investigation-when-shot/5181690002/</ref> The boyfriend of Taylor, Kenneth Walker, allegedly discharged his [[firearm]] first, injuring a law enforement officer.  Walker's lawyer stated that Walker thought that someone was entering the residence illegally, and that Walker acted only in self-defense.  Walker now faces criminal charges of first-degree assault and attempted murder of a police officer.<ref>https://www.courier-journal.com/story/news/crime/2020/05/13/breonna-taylor-lawyer-says-louisville-police-need-to-get-story-straight/5183137002/</ref> Attorney Ben Crump stated that “they already had the person they were searching for in custody.”<ref>https://www.wave3.com/2020/05/12/breonna-taylor-was-killed-botched-police-raid-attorney-says/</ref>"
const three = "Some words to fill in a text blob. This is stuff I am writing."
const four = "Hello, this is a test just to fill in some text that I need to have written for the fourth text blob."

   // let new_stuff = cleaner_text.split(/^[\w][\.+]/); //filters URLS in text
    
let websites = [];
let clean_array = [];
let words = [];


 function clean(text) {
    //this function takes a string of words and cleans out anything that isn't a space, number or letter
    let text1 = text.replace(/<ref>/igm, ' ') //takes <ref> out of links and lets preceeding word free of URL
    let text2 = text1.replace(/<\/ref>/igm,  ' ') //takes out end of URL freeing up the end
    let text3 = text2.replace(/\/ref/igm,  ' ') //takes out end of URL freeing up the end
    let text4 = text3.replace(/[.]ref/igm,  ' ') //takes out end of URL freeing up the end
    let text5 = text4.replace(/[^\w\s\d\.\:\/]/gim, ''); //replaces [[ , > and other junk characters with space
    let text_array = text5.split(/\s+/)    //splits a paragraph string into an array of individual words
    // for (i=0; i < cleaner_text_array.length; i++) {
        //if (cleaner_text_array[i].match(/^\w+[.]+\w+/gi)) { //filters URLS from array
        for (element of text_array) {
            if (element.match(/http/gim)) { //finds URLS
                websites.push(element); //puts the uncleaned URLs into an array called websites
            }
        
        }
        let text_string = text_array.join(" ") //makes text string instead of array
        let no_urls = text_string.replace(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/gim, ' ');
        let no_periods = no_urls.replace(/\./gim, '');
        let almost_array = no_periods.split(/\s+/)
        for (element of almost_array) {
            if (element.match(/http/gim)) {
                continue;
            } else {
                words.push(element)
            }
        

        
        }
        let final_array = no_periods.split(/\s+/);
        console.log(websites)
 };

//clean(one);

//JS Diff stuff below...this stuff gets the difference between two text blob
function find_diff(text1, text2) {
    diff_log = " "
    const difference = Diff.diffWords(text1, text2);
    const words = difference[0]["value"] //TO DO: iterate through the [0] to get value for each value object in arrays
    for (i=0; i < difference.length; i++) {
        diff_log += (" " + difference[i]["value"] + " ");
        }

    console.log(diff_log);
}

clean(two);