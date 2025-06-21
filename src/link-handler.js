function handleLinkClick(event) {
  console.log('Click detected on:', event.target.tagName, event.target.getAttribute('data-action'));
  // Check if the clicked element has the data-action="log" attribute
  if (event.target.matches('a[data-action="log"]')) {
    console.log('Link clicked:', event.target.dataset.data);
    event.preventDefault(); // Prevent default link behavior
  }
}
// Use event delegation - single listener handles all current and future links
document.addEventListener('click', handleLinkClick);
