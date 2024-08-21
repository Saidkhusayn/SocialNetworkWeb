document.addEventListener('DOMContentLoaded', () => {
    const followBtn = document.querySelector('.follow') || document.querySelector('.unfollow');

    if (followBtn) {
        followBtn.addEventListener('click', () => {
            const currentUser = document.getElementById('currentUser').dataset.user;
            const targetUser = document.getElementById('user').dataset.user;

            fetch(`/profile/${targetUser}`, {
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
    })
