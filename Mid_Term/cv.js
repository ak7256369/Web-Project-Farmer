$(document).ready(function() {
  $('.cv-section').removeClass('active');
  
  $('.cv-section-heading').hover(
    function() {
      $(this).closest('.cv-section').addClass('active');
    },
    function() {
      const section = $(this).closest('.cv-section');
      setTimeout(function() {
        if (!section.is(':hover')) {
          section.removeClass('active');
        }
      }, 300);
    }
  );
  
  $('.cv-section').hover(
    function() {
    },
    function() {
      $(this).removeClass('active');
    }
  );
  
  $('.cv-section-heading').on('click', function() {
    $(this).closest('.cv-section').toggleClass('active');
  });
});