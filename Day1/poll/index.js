console.log("script loaded")

var get_data_btn = document.getElementById('getdata');
var content_div = document.getElementById('content');

console.log(get_data_btn, content_div);

get_data_btn.addEventListener('click', function(){
    console.log("button clicked");

    var myxhr = new XMLHttpRequest();

    // open connection between me and the server 
    myxhr.open('GET', 'http://localhost:8000/api/skills'); 

    // send request to the server 
    myxhr.send();

    // display response in the html 
    myxhr.onreadystatechange = function(){
        console.log("state changed, ", this.readyState)
        if(myxhr.status === 200 && myxhr.readyState === 4){
            console.log('data', myxhr.responseText)
            var response = JSON.parse(myxhr.responseText);
            content_div.innerHTML = ''; 

            response.forEach(function(skill) {
                var card = document.createElement('div');
                card.className = 'card';

                var title = document.createElement('h2');
                title.textContent = skill.name;

                var id = document.createElement('p');
                id.textContent += 'ID: ' + skill.id;

                card.appendChild(title);
                card.appendChild(id);

                content_div.appendChild(card);
            });
        } else if(myxhr.status === 404 && myxhr.readyState === 4){
            content_div.innerHTML = `<h4 style='color:red'>Connection failed</h1>`;
        }
    }
});
