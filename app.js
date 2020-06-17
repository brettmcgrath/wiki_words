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
  })
});


