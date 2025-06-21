function handleClick(event) {
  console.log('Click detected on:', event.target.text, event.target.getAttribute('data-action'));
  if (event.target.matches('a[data]')) {
    handleLinkClick(event);
  }
}

  function isMarkdownOrHtmlExtension(href) {
    const lowerHref = href.toLowerCase()
    return lowerHref.endsWith('.md') || 
           lowerHref.endsWith('.markdown') || 
           lowerHref.endsWith('.html') || 
           lowerHref.endsWith('.htm')
  }

function handleLinkClick(event) {  // the clicked element has the data="url" attribute
  const targetUrl = event.target.getAttribute('data');
//   console.log('Link clicked:', targetUrl);
  
  // Get the base href to determine current document location
  const base = document.querySelector('base');
  if (base) {
    const baseHref = base.href;
    // console.log('Base href:', baseHref);
    
    // Extract directory from base href
    // Convert from: https://file+.vscode-resource.vscode-cdn.net/c%3A/dev/opens/vscode-markdown-notes/test/test.md
    // To get directory: c:/dev/opens/vscode-markdown-notes/test/
    const urlParts = baseHref.split('/');
    // console.log('URL parts:', urlParts);
    
    // Reconstruct the file path from URL parts (skip protocol, empty, and host)
    const pathParts = urlParts.slice(3); // Skip "https:", "", "file+.vscode-resource.vscode-cdn.net"
    const fullPath = pathParts.join('/');
    const decodedPath = decodeURIComponent(fullPath); // Decode URL encoding
    const currentDirectory = decodedPath.substring(0, decodedPath.lastIndexOf('/') + 1);
    // console.log('Full path:', fullPath);
    // console.log('Decoded path:', decodedPath);
    console.log('Current directory:', currentDirectory);
        // Process the escaped file spec into a normal file path
    const fileSpec = decodeURIComponent(targetUrl);
    // console.log('File spec:', fileSpec);
    
    // Convert to path relative to current directory
    let targetPath;
    if (fileSpec.startsWith('/') || fileSpec.includes(':')) {
      // Absolute path, use as-is
      targetPath = fileSpec;
    } else {
      // Relative path, combine with current directory
      targetPath = fileSpec;
    }
      // Normalize path (remove ./ and redundant separators)
    targetPath = targetPath.replace(/\/\.\//g, '/').replace(/\/+/g, '/');
    
    console.log('Target path:', targetPath);
    
    // Try to create a relative path from the current document
    // Convert absolute path back to relative for browser navigation
    const relativePath = targetPath //.replace(currentDirectory, './');    console.log('Relative path:', relativePath);
    
    // Create a temporary anchor element and trigger a click
    // This might work better than direct navigation
    const tempLink = document.createElement('a');
    tempLink.href = relativePath;
    tempLink.target = '_blank';
    tempLink.style.display = 'none';
    document.body.appendChild(tempLink);
    
    console.log('Attempting to click temporary link with href:', tempLink.href);
    tempLink.click();
    
    // Clean up
    document.body.removeChild(tempLink);
    
  } else {
    console.log('No base element found');
  }
  
  event.preventDefault(); // Prevent default link behavior
}
// Use event delegation - single listener handles all current and future links
// Log the current URI
// Can send messages back to your extension
//vscode.postMessage({ command: 'linkClicked', href: targetUrl });
// const vscode = acquireVsCodeApi(); // can't.
const base = document.querySelector('base');
if (base) console.log('Base href:', base.href);

document.addEventListener('click', handleClick);
