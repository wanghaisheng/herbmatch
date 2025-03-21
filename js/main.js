document.addEventListener('DOMContentLoaded', function() {
    // Countdown timer functionality
    setupCountdown();
    
    // Smooth scrolling for anchor links
    setupSmoothScrolling();
    
    // Lazy loading for images
    setupLazyLoading();
});

function setupCountdown() {
    const hoursElement = document.getElementById('countdown-hours');
    const minutesElement = document.getElementById('countdown-minutes');
    const secondsElement = document.getElementById('countdown-seconds');
    
    if (!hoursElement || !minutesElement || !secondsElement) return;
    
    // Set initial time (24 hours from now)
    let countDownDate = new Date();
    countDownDate.setHours(countDownDate.getHours() + 24);
    
    // Try to get saved countdown date from localStorage
    const savedDate = localStorage.getItem('herbMatchCountdown');
    if (savedDate) {
        countDownDate = new Date(parseInt(savedDate));
        
        // If the saved date is in the past, set a new one
        if (countDownDate < new Date()) {
            countDownDate = new Date();
            countDownDate.setHours(countDownDate.getHours() + 24);
            localStorage.setItem('herbMatchCountdown', countDownDate.getTime().toString());
        }
    } else {
        // Save the date to localStorage
        localStorage.setItem('herbMatchCountdown', countDownDate.getTime().toString());
    }
    
    // Update the countdown every second
    const countdownInterval = setInterval(function() {
        // Get current date and time
        const now = new Date().getTime();
        
        // Find the distance between now and the countdown date
        const distance = countDownDate - now;
        
        // Time calculations for hours, minutes and seconds
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Display the result
        hoursElement.textContent = hours.toString().padStart(2, '0');
        minutesElement.textContent = minutes.toString().padStart(2, '0');
        secondsElement.textContent = seconds.toString().padStart(2, '0');
        
        // If the countdown is finished, reset it
        if (distance < 0) {
            countDownDate = new Date();
            countDownDate.setHours(countDownDate.getHours() + 24);
            localStorage.setItem('herbMatchCountdown', countDownDate.getTime().toString());
        }
    }, 1000);
}

function setupSmoothScrolling() {
    // Get all anchor links that point to an ID on the page
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Prevent default anchor click behavior
            e.preventDefault();
            
            // Get the target element
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            // Scroll to the target smoothly
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
}

function setupLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            img.src = img.dataset.src;
            img.loading = 'lazy';
            img.classList.add('lazy-loaded');
        });
    } else {
        // Fallback for browsers that don't support native lazy loading
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const lazyImage = entry.target;
                        lazyImage.src = lazyImage.dataset.src;
                        lazyImage.classList.add('lazy-loaded');
                        imageObserver.unobserve(lazyImage);
                    }
                });
            });
            
            lazyImages.forEach(image => imageObserver.observe(image));
        } else {
            // Fallback for browsers without IntersectionObserver
            let active = false;
            
            const lazyLoad = function() {
                if (active === false) {
                    active = true;
                    
                    setTimeout(() => {
                        lazyImages.forEach(lazyImage => {
                            if ((lazyImage.getBoundingClientRect().top <= window.innerHeight && lazyImage.getBoundingClientRect().bottom >= 0) && getComputedStyle(lazyImage).display !== 'none') {
                                lazyImage.src = lazyImage.dataset.src;
                                lazyImage.classList.add('lazy-loaded');
                                
                                lazyImages = lazyImages.filter(image => image !== lazyImage);
                                
                                if (lazyImages.length === 0) {
                                    document.removeEventListener('scroll', lazyLoad);
                                    window.removeEventListener('resize', lazyLoad);
                                    window.removeEventListener('orientationchange', lazyLoad);
                                }
                            }
                        });
                        
                        active = false;
                    }, 200);
                }
            };
            
            document.addEventListener('scroll', lazyLoad);
            window.addEventListener('resize', lazyLoad);
            window.addEventListener('orientationchange', lazyLoad);
        }
    }
}