document.addEventListener("DOMContentLoaded", () => {
   const dom = document.querySelector('#post-form');

   if(dom!= null){
    dom.addEventListener('submit', create_post);
   }
});

function create_post(event) {
    event.preventDefault();

    const content = document.querySelector('#post-content').value;

    // Get CSRF token from the hidden input
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    fetch('/posts', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify({
            content: content,
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error('Error:', data.error);
        } else {
            console.log('Success:', data.message);
            document.querySelector('#post-content').value = '';
        }
    })
    .catch((error) => {
        console.error('Fetch Error:', error);
    });
}