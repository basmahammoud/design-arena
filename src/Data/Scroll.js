window.addEventListener('scroll', () => {
    const blockContainer = document.querySelector('.block_container');
    const scrollPosition = window.scrollY;
  
    if (scrollPosition > 100) {
      blockContainer.classList.add('scrolled');
    } else {
      blockContainer.classList.remove('scrolled');
    }
  });
  