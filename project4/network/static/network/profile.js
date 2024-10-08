document.addEventListener('DOMContentLoaded', () => {
    const followBtn = document.querySelector('.follow') || document.querySelector('.unfollow');
    const editBtn = document.querySelector('#edit');
    const targetUser = document.getElementById('user').dataset.user;

    if (followBtn) {
        followBtn.addEventListener('click', event => {
            const followers = document.querySelector('#user-info').children[0];

            const textContent = followers.textContent.trim();
            const firstWord = textContent.split(' ')[1];
            let updatedFollowers = Number(firstWord);

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
                    updatedFollowers = updatedFollowers + 1;
                    followers.innerHTML = `<strong>Followers:</strong> ${updatedFollowers}`
                } else {
                    followBtn.classList.replace('btn-outline-secondary', 'btn-outline-primary');
                    followBtn.classList.replace('unfollow', 'follow');
                    followBtn.textContent = 'Follow';
                    updatedFollowers = updatedFollowers - 1;
                    followers.innerHTML = `<strong>Followers:</strong> ${updatedFollowers}`
                }
            })
            
    })}
    
    if (editBtn) {
        document.querySelectorAll('#edit').forEach(button => {
            button.addEventListener('click', function editPost() {
                const postDiv = this.closest('.post');
                const post_id = postDiv.dataset.postId;
                
                let postContentP = postDiv.querySelector('#content');
                const existingTextarea = postDiv.querySelector('textarea');

                // If the textarea already exists, focus on it (in case user wants to re-edit before saving)
                if (existingTextarea) {
                    existingTextarea.focus();
                    return;
                }

                const textarea = document.createElement('textarea');
                textarea.value = postContentP ? postContentP.textContent : existingTextarea.value;
                const afterChild = postDiv.querySelector('small.text-muted');

                // Set any additional properties or styles on the textarea
                textarea.style.width = '100%';
                textarea.style.height = '100px';

                if (postContentP) {
                    postContentP.remove();
                } else if (existingTextarea) {
                    existingTextarea.remove();
                }

                postDiv.insertBefore(textarea, afterChild);
                this.textContent = 'Save';

                const saveEdit = () => {
                    const newP = document.createElement('p');
                    newP.className = 'mb-2';
                    newP.id = 'content';
                    newP.textContent = textarea.value;
                    textarea.remove();
                    postDiv.insertBefore(newP, afterChild);
                    this.innerHTML = '<i class="fa-solid fa-pen-to-square">';

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
                        if (!response.ok) {
                            throw new Error(`HTTP Error! Status: ${response.status}`);
                        }
                        if (response.status === 204) {
                            console.log('Post updated successfully.');
                            return;
                        }
                        return response.json();
                    })
                    .then(data => {
                        if (data) {
                            console.log(data);
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });       

                    this.removeEventListener('click', saveEdit);
                    this.addEventListener('click', editPost);
                };

                this.removeEventListener('click', editPost);
                this.addEventListener('click', saveEdit);

                         
            });
        });
    }
})