export function initScrollEffect() {
    const scrollImage = document.getElementById('scroll-image');

    if (scrollImage) {
        window.addEventListener('scroll', () => {
            // Determine scroll threshold (e.g., 100px)
            if (window.scrollY > 100) {
                scrollImage.classList.add('hidden');
            } else {
                scrollImage.classList.remove('hidden');
            }
        });
    }
}
