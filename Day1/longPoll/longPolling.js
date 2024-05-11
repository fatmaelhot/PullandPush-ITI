console.log("script loaded");

var contentDiv = document.getElementById('content');

function longPoll() {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', 'http://localhost:8000/api/skills', true);

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.readyState === 4) {
            console.log('data', xhr.responseText)
            var response = JSON.parse(xhr.responseText);
            contentDiv.innerHTML = ''; 

            response.forEach(function (skill) {
                var card = document.createElement('div');
                card.className = 'card';

                var title = document.createElement('h2');
                title.textContent = skill.name;

                var id = document.createElement('p');
                id.textContent = 'ID: ' + skill.id;

                card.appendChild(title);
                card.appendChild(id);

                contentDiv.appendChild(card);
            });
        } else {
            console.error('Request failed with status:', xhr.status);
        }
        
        setTimeout(longPoll, 2000); 

    };

    xhr.onerror = function () {
        console.error('An error occurred during the request.');
        setTimeout(longPoll, 5000); 
    };

    xhr.send();
}

longPoll();