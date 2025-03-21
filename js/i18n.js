// Multi-language support for Herb Match landing page
document.addEventListener('DOMContentLoaded', function() {
    // Default language
    let currentLanguage = 'en';
    
    // Try to load saved language preference
    const savedLanguage = localStorage.getItem('herbMatchLanguage');
    if (savedLanguage) {
        currentLanguage = savedLanguage;
    }
    
    // Set the language selector to the current language
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.value = currentLanguage;
        languageSelect.addEventListener('change', function() {
            changeLanguage(this.value);
        });
    }
    
    // Initial language load
    loadLanguage(currentLanguage);
    
    // Function to change the language
    function changeLanguage(lang) {
        currentLanguage = lang;
        localStorage.setItem('herbMatchLanguage', lang);
        loadLanguage(lang);
    }
    
    // Function to load language file and update content
    function loadLanguage(lang) {
        fetch(`locale/${lang}.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Language file not found');
                }
                return response.json();
            })
            .then(data => {
                updateContent(data);
            })
            .catch(error => {
                console.error('Error loading language file:', error);
                // Fallback to English if language file not found
                if (lang !== 'en') {
                    loadLanguage('en');
                }
            });
    }
    
    // Function to update content with translated text
    function updateContent(translations) {
        // Update all elements with data-i18n attribute
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[key]) {
                // For regular element content
                element.textContent = translations[key];
            }
        });
        
        // Update attributes with data-i18n attributes
        // For meta tags and other elements with attributes that need translation
        document.querySelectorAll('[data-i18n-attr]').forEach(element => {
            const attrData = element.getAttribute('data-i18n-attr').split(',');
            attrData.forEach(attr => {
                const [attrName, keyName] = attr.split(':');
                if (attrName && keyName && translations[keyName]) {
                    element.setAttribute(attrName, translations[keyName]);
                }
            });
        });
        
        // Update page title if translation exists
        if (translations.meta_title) {
            document.title = translations.meta_title;
        }
        
        // Update meta description if translation exists
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription && translations.meta_description) {
            metaDescription.setAttribute('content', translations.meta_description);
        }
    }
});