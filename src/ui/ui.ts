// Theme handling
window.onmessage = (event) => {
  const message = event.data.pluginMessage;
  
  if (message.type === 'theme-change') {
    // Check if we're in a Figma dark theme context
    const isDark = document.documentElement.classList.contains('figma-dark');
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }
};

// Check initial theme
const isDark = document.documentElement.classList.contains('figma-dark');
document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');

// Listen for theme changes
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.attributeName === 'class') {
      const isDark = document.documentElement.classList.contains('figma-dark');
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    }
  });
});

observer.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['class']
});

const applyButton = document.getElementById('apply');
if (applyButton) {
  applyButton.onclick = () => {
    const width = parseInt((document.getElementById('width') as HTMLInputElement).value);
    const height = parseInt((document.getElementById('height') as HTMLInputElement).value);

    if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
      parent.postMessage({ pluginMessage: { type: 'error', message: 'Please enter valid dimensions' } }, '*');
      return;
    }

    parent.postMessage({ 
      pluginMessage: { 
        type: 'apply-aspect-ratio',
        width,
        height
      }
    }, '*');
  };
} 