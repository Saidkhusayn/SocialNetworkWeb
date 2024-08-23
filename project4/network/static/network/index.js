document.addEventListener("DOMContentLoaded", () => {
    const dom = document.querySelector('#post-form');
    const likeBtns = document.querySelectorAll('#like');
 
    if(dom!= null){
     dom.addEventListener('submit', create_post);
    }
 
    if(likeBtns.length){
     likeBtns.forEach(button => {
         button.addEventListener('click', like_unlike_post);
     })
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
 
 function like_unlike_post(event) {
    const icon = event.target.closest('button').firstElementChild;
    const postElement = event.target.closest('.post');
    const post_id = postElement.dataset.postId;
    const snapElm = event.target.closest('div').children[1];

    // Get the text content of snapElm and trim it
    const textContent = snapElm.textContent.trim();
    const firstWord = textContent.split(' ')[0];
    let updatedLikes = Number(firstWord);
    

    fetch(`/post/like/${post_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.isLiked) {
            icon.classList.replace("fa-regular", "fa-solid");
            updatedLikes = updatedLikes + 1; 
            snapElm.textContent = `${updatedLikes} Likes`;    
        } else {
            icon.classList.replace("fa-solid", "fa-regular");
            updatedLikes = updatedLikes - 1; 
            snapElm.textContent = `${updatedLikes} Likes`;
    
        }
    })
}
