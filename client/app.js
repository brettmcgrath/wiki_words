const superagent = require('./node_modules/superagent')



let new_array = []
const post_form = document.getElementById('post_form');


post_form.addEventListener('submit', function(event) {
    event.preventDefault();
    const form_data = document.getElementById('wiki_url').value; 
    const form_json = { "url" : `${form_data}` } 
    console.log(`this is form json ${form_json}`);
    superagent
      .post('http://127.0.0.1:8080/wiki_url')
      .send(form_json)
      .set('Content-Type', 'application/json')
      .end((err, res) => {
         
        let text = res.body.words

        
        let metadata = text.split(/ +/gim).reduce((obj, item) => {
            if (!obj[item]) {
                obj[item] = 0;
            }
            obj[item] +=1;
            return obj;
        }, {});
        
        //console.log(Object.keys(metadata).length);



        sorted_keys = Object.keys(metadata).sort(function(a,b){return metadata[b]-metadata[a]})
        console.log(sorted_keys);   



     

        // function total()
        let reducer = (accumulator, currentValue) => accumulator + currentValue;
        let total = Object.values(metadata).reduce(reducer)

        for (var i = 0; i < Object.keys(metadata).length; i++) {
            if (Object.keys(metadata)[i] == sorted_keys[0]) {
            new_array.push({name: Object.keys(metadata)[i], y: (Object.values(metadata)[i]/total)*100, sliced: true, selected: true})
            console.log("pushed")
            } else {
                new_array.push({name: Object.keys(metadata)[i], y: (Object.values(metadata)[i]/total)*100})
                console.log("ok")
            }
        }

        for (var i = 0; i < Object.keys(metadata).length; i++) {
        console.log(new_array[i])
        }



        let word_count = Object.values(metadata).reduce((total, amount) => total + amount);
        //console.log(word_count)


        //console.log(text)
        let lines = text.split(/[,\. ]+/g);
        text = "";
        let data = Highcharts.reduce(lines, function (arr, word) {
            let obj = Highcharts.find(arr, function (obj) {
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
                text: 'Word cloud of most commonly revised words'
            }
        });



        Highcharts.chart('container', {
            chart: {
              plotBackgroundColor: null,
              plotBorderWidth: null,
              plotShadow: false,
              type: 'pie'
            },
            title: {
              text: 'Percentage distribution of words'
            },
            tooltip: {
              pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            accessibility: {
              point: {
                valueSuffix: '%'
              }
            },
            plotOptions: {
              pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                  enabled: true,
                  format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                }
              }
            },
            series: [{
              name: 'occurence',
              colorByPoint: true,
              data: new_array
            }]
          });
    
        //Add below to reset numbers
        //   total = 0
        //   new_array = []

      });
    });
 




    