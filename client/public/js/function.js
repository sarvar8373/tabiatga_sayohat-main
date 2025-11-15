(function ($) {
  "use strict";

  jQuery(document).ready(function ($) {
    // === 1. Hero Slider ===
    if ($("#welcome-slide").length) {
      $("#welcome-slide").owlCarousel({
        autoplay: false,
        items: 1,
        loop: true,
        mouseDrag: false,
        lazyLoad: true,
        autoplayHoverPause: false,
        smartSpeed: 2000,
        margin: 0,
        nav: false,
        navText: [
          '<i class="fal fa-arrow-left"></i>',
          '<i class="fal fa-arrow-right"></i>',
        ],
        dots: false,
        singleItem: true,
        animateIn: "fadeIn",
        animateOut: "fadeOut",
      });
    }

    // meanmenu
    if ($(".gene-nav").length) {
      jQuery(".gene-nav").meanmenu();
    }

    // counterup
    if ($(".counter").length) {
      $(".counter").counterUp({
        delay: 10,
        time: 2000,
      });
    }

    // partner slider
    if ($(".partner-wrap").length) {
      $(".partner-wrap").owlCarousel({
        autoplay: 5000,
        loop: true,
        autoplayHoverPause: false,
        smartSpeed: 500,
        nav: false,
        navText: [
          '<i class="fal fa-arrow-left"></i>',
          '<i class="fal fa-arrow-right"></i>',
        ],
        dots: false,
        items: 6,
        margin: 30,
        responsiveClass: true,
        responsive: {
          0: { items: 2 },
          600: { items: 3 },
          768: { items: 3 },
          991: { items: 4 },
          1200: { items: 6 },
        },
      });
    }

    // More sliders...
    if ($(".adv-similar-detail-wrap").length) {
      $(".adv-similar-detail-wrap").owlCarousel({
        autoplay: 5000,
        loop: true,
        autoplayHoverPause: false,
        smartSpeed: 500,
        items: 3,
      });
    }

    // Cart Plus Minus
    var CartPlusMinus = $(".cart-plus-minus");
    CartPlusMinus.prepend('<div class="dec qtybutton">-</div>');
    CartPlusMinus.append('<div class="inc qtybutton">+</div>');

    $(".qtybutton").on("click", function () {
      var $button = $(this);
      var oldValue = $button.parent().find("input").val();

      if ($button.text() === "+") {
        var newVal = parseFloat(oldValue) + 1;
      } else {
        newVal = oldValue > 0 ? parseFloat(oldValue) - 1 : 1;
      }

      $button.parent().find("input").val(newVal);
    });

    // Range slider
    if ($(".slider-product-sorting").length) {
      $(".slider-product-sorting").slider({
        range: true,
        min: 0,
        max: 1000,
        values: [200, 600],
      });
    }

    // isotope
    $(".isotope_wrap").imagesLoaded(function () {
      $(".isotope_wrap").isotope({
        itemSelector: ".isotope_item",
        percentPosition: true,
      });
    });

    // scroll up
    $.scrollUp({
      scrollText: '<i class="fal fa-arrow-alt-up"></i>',
      scrollSpeed: 900,
      animation: "fade",
    });
  });

  // Menu active
  var current_page_URL = location.href;
  $(".gene-nav ul li a").each(function () {
    var target_URL = $(this).prop("href");
    if (target_URL === current_page_URL) {
      $(this).parent("li").addClass("active");
    }
  });

  // Sticky header
  $(function () {
    var header = $("#header"),
      triggerPoint = 200;

    $(window).on("scroll", function () {
      if ($(window).scrollTop() >= triggerPoint) {
        header.addClass("navbar-fixed-top sticky fadeInTop");
      } else {
        header.removeClass("navbar-fixed-top sticky fadeInTop");
      }
    });
  });

  // Preloader
  $(window).on("load", function () {
    $(".preloader-wrap").fadeOut(500);
  });
})(jQuery);
