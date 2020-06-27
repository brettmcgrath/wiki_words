const superagent = require('./node_modules/superagent')




const post_form = document.getElementById('post_form');


post_form.addEventListener('submit', function(event) {
    event.preventDefault();
    const form_data = document.getElementById('wiki_url').value; //THIS RIGHT HERE NEEDS TO BE JSON
    const form_json = { "url" : `${form_data}` } 
    console.log(`this is form json ${form_json}`);
    superagent
      .post('http://127.0.0.1:8080/wiki_url')
      .send(form_json)
      .set('Content-Type', 'application/json')
      .end((err, res) => {
         
        let text = res.body.words

        console.log(text)
        var lines = text.split(/[,\. ]+/g);
        text = "";
        var data = Highcharts.reduce(lines, function (arr, word) {
            var obj = Highcharts.find(arr, function (obj) {
                return obj.name === word;
            });
            if (obj) {
                obj.weight += 1;
            } else {
                arr.push({
                    name: word,
                    weight: 1
                });
            }
            return arr;
        }, []);
        
        Highcharts.chart('word-cloud', {
            series: [{
                type: 'wordcloud',
                data: data,
                name: 'Occurrences'
            }],
            title: {
                text: 'Wiki word cloud stuff'
            }
        });



      });
    });
 
