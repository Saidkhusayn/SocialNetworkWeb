document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('.follow') || document.querySelector('.unfollow');
    
    if (button) {
        button.addEventListener('click', () => {
            if (button.classList.contains('follow')) {
                button.classList.replace('follow', 'unfollow');
                button.classList.replace('btn-outline-primary', 'btn-outline-secondary');
                button.textContent = 'Unfollow';
            } else {
                button.classList.replace('unfollow', 'follow');
                button.classList.replace('btn-outline-secondary', 'btn-outline-primary');
                button.textContent = 'Follow';
            }
        });
    }
});




