document.addEventListener('DOMContentLoaded', function() {
  // Get all navigation links
  const navLinks = document.querySelectorAll('nav ul li a');

  // Attach click event listener to each navigation link
  navLinks.forEach(link => {
    link.addEventListener('click', function(event) {
      // Prevent default link behavior
      event.preventDefault();

      // Get the href attribute of the clicked link
      const href = link.getAttribute('href');

      // Navigate to the corresponding page
      window.location.href = href;
    });
  });
});
