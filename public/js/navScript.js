document.addEventListener('DOMContentLoaded', function () {
    let currentLocation = window.location.pathname; // Get the current URL path
  
    console.log(currentLocation);
    // Get all the links in the navigation menu
    let navLinks = document.querySelectorAll('#navbarText a');
    console.log(navLinks);
    // Loop through the links and add the "active" class to the matching link
    for (let i = 0; i < navLinks.length; i++) {
      let link = navLinks[i];
  
      // Compare the link's href attribute to the current URL
      if (link.getAttribute('href') === currentLocation) {
        link.style.backgroundColor = "#FF385C";
      }
    }
  });
  
