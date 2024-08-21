document.addEventListener('DOMContentLoaded', () => {
    const followBtn = document.querySelector('.follow') || document.querySelector('.unfollow');
    const editBtn = document.querySelector('#edit');
    const currentUser = document.getElementById('currentUser').dataset.user;
    const targetUser = document.getElementById('user').dataset.user;

    if (followBtn) {
        followBtn.addEventListener('click', () => {
            fetch(`/profile/${targetUser}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('HTTP error! Status: ${response.status}');
                }
                return response.json();
            })
            .then(data => {
                if (data.isFollowing) {
                    followBtn.classList.replace('btn-outline-primary', 'btn-outline-secondary');
                    followBtn.classList.replace('follow', 'unfollow');
                    followBtn.textContent = 'Unfollow';
                } else {
                    followBtn.classList.replace('btn-outline-secondary', 'btn-outline-primary');
                    followBtn.classList.replace('unfollow', 'follow');
                    followBtn.textContent = 'Follow';
                }
            })
            
    })}
    
    if(editBtn){
        document.querySelectorAll('.i-btn').forEach(button => {
            button.addEventListener('click', function() {
                
                const postDiv = this.closest('.post');
                const post_id = postDiv.dataset.postId;
                const postContentP = postDiv.querySelector('#content');
                const textarea = document.createElement('textarea');
                textarea.value = postContentP.textContent;
                
                // Set any additional properties or styles on the textarea
                textarea.style.width = '100%';
                textarea.style.height = '100px';

                postContentP.replaceWith(textarea);
                this.textContent = 'Save';

                this.addEventListener('click', function saveEdit() {
                    const newP = document.createElement('p');
                    newP.className = 'mb-2';
                    newP.textContent = textarea.value;
                    textarea.replaceWith(newP);
                    this.innerHTML = '<i class="fa-solid fa-pen-to-square">'

                // Modify database to include changes
                fetch(`/profile/edit/${post_id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    }, 
                    body: JSON.stringify ({
                        content: textarea.value,
                    })
                })
                .then(response => {
                    if(!response.ok){
                        throw new Error(`HTTP Error! Status: ${response.status}`)
                    }
                    else {
                        return response.json()
                    }

                })
                .then(data => {
                    console.log(data)
                })

                });
            });
        });
        
    }
})