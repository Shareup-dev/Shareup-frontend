 import jQuery from 'jquery' ;
 
import NProgress from 'nprogress';

function testScript(){
	jQuery(document).ready(function($) {
	
		"use strict";
		
	//------- Notifications Dropdowns
	  /*$('.top-area > .setting-area > li').on("click",function(){
		$(this).siblings().children('div').removeClass('active');
		$(this).children('div').addClass('active');
		return;
	  });*/
	 $(".noti").on("click", function(){
		$(".dropdowns").toggleClass("active");
		 
		 return;
	 });

	 $(".gap, .mssg, .user-img, span.main-menu, .ti-search").on("click",function(){
		 $(this).removeClass('active');
		$(".dropdowns").removeClass('active');
		 });
     
	 //
	 $(".mssg").on("click", function(){
		$(".dropdownsmsg").toggleClass("active");
		 
		 return;
	 });

	 $(".gap, .noti, .user-img, span.main-menu, .ti-search").on("click",function(){
		 $(this).removeClass('active');
		$(".dropdownsmsg").removeClass('active');
		 
		
	 });
	//--- user setting dropdown on topbar	
	// $('.user-img').on('click', function() {
	// 	$('.user-setting').toggleClass("active");
	// 	return;
	// });	
	// $(".gap, .noti, .mssg, span.main-menu, .ti-search").on("click",function(){
	// 	$(this).removeClass('active');
	//    $(".user-setting").removeClass('active');
		
	   
	// });
	$(".ti-search").on("click", function(){
		$(".searched, .form-search").toggleClass("active");
		 
		 return;
	 });

	 $(".gap, .noti, .user-img, span.main-menu").on("click",function(){
		 $(this).removeClass('active');
		$(".searched, .form-search").removeClass('active');
		 
		
	 });


	/* $(".comments").on("click", function(){
		$(".coment-area").addClass("active");
		 return;
	 });

  $(".central-meta item").on("click",function(){
		 $(this).removeClass('active');
		$(".coment-area").removeClass('active');
		 
});*/
	//notification 
	/* $('.noti').on('click', function() {
		$('.dropdowns').toggleClass("active");
		return;
	});	
//message
	$('.mssg').on('click', function() {
		$('.dropdownsmsg').toggleClass("active");
		return;
	});	*/
	
	//------- remove class active on body
	$("body *").not('.top-area > .setting-area > li').on("click", function() {
		$(".top-area > .setting-area > li > div").removeClass('active');
		return;		
	 });	
	 
	//--- side message box	
	$('.friendz-list > li, .chat-users > li').on('click', function() {
		$('.chat-box').addClass("show");
		return false;
	});	
		$('.close-mesage').on('click', function() {
			$('.chat-box').removeClass("show");
			return false;
		});	
		
	//------ scrollbar plugin
		if ($.isFunction($.fn.perfectScrollbar)) {
			$('.dropdowns, .twiter-feed, .invition, .followers, .chatting-area, .peoples, #people-list, .chat-list > ul, .message-list, .chat-users, .left-menu').perfectScrollbar();
		}
	
	/*--- socials menu scritp ---*/
		$('.trigger').on("click", function() {
			$(this).parent(".menu").toggleClass("active");
		  });	
		
	/*--- emojies show on text area ---*/	
		$('.add-smiles > span').on("click", function() {
			$(this).parent().siblings(".smiles-bunch").toggleClass("active");
		  });
	 $('.add-dropdown > span').on("click", function() {
			$(this).parent().siblings(".drop-options").toggleClass("active");
		  });
	// delete notifications
	$('.notification-box > ul li > i.del').on("click", function(){
		$(this).parent().slideUp();
		return false;
	  }); 	
	
	/*--- socials menu scritp ---*/	
		$('.f-page > figure i').on("click", function() {
			$(".drop").toggleClass("active");
		  });
	
	//===== Search Filter =====//
		(function ($) {
		// custom css expression for a case-insensitive contains()
		jQuery.expr[':'].Contains = function(a,i,m){
		  return (a.textContent || a.innerText || "").toUpperCase().indexOf(m[3].toUpperCase())>=0;
		};
	
		function listFilter(searchDir, list) { 
		  var form = $("<form>").attr({"class":"filterform","action":"#"}),
		  input = $("<input>").attr({"class":"filterinput","type":"text","placeholder":"Search Contacts..."});
		  $(form).append(input).appendTo(searchDir);
	
		  $(input)
		  .change( function () {
			var filter = $(this).val();
			if(filter) {
			  $(list).find("li:not(:Contains(" + filter + "))").slideUp();
			  $(list).find("li:Contains(" + filter + ")").slideDown();
			} else {
			  $(list).find("li").slideDown();
			}
			return false;
		  })
		  .keyup( function () {
			$(this).change();
		  });
		}
	
	//search friends widget
		$(function () {
		  listFilter($("#searchDir"), $("#people-list"));
		});
		}(jQuery));	
	
	//progress line for page loader
		$('body').show();
		NProgress.start();
		setTimeout(function() { NProgress.done(); $('.fade').removeClass('out'); }, 2000);
		
	//--- bootstrap tooltip	
		//$(function () {
		//  $('[data-toggle="tooltip"]').tooltip();
		//});
		
	// Sticky Sidebar & header
		if($(window).width() < 769) {
			jQuery(".sidebar").children().removeClass("stick-widget");
		}
	
		if ($.isFunction($.fn.stick_in_parent)) {
			$('.stick-widget').stick_in_parent({
				parent: '#page-contents',
				offset_top: 60,
			});
	
			
			$('.stick').stick_in_parent({
				parent: 'body',
				offset_top: 0,
			});
			
		}
		
	/*--- topbar setting dropdown ---*/	
		$(".we-page-setting").on("click", function() {
			$(".wesetting-dropdown").toggleClass("active");
		  });	
		  
	/*--- topbar toogle setting dropdown ---*/	
	$('#nightmode').on('change', function() {
		if ($(this).is(':checked')) {
			// Show popup window
			$(".theme-layout").addClass('black');	
		}
		else {
			$(".theme-layout").removeClass("black");
		}
	});
	
	//chosen select plugin
	if ($.isFunction($.fn.chosen)) {
		$("select").chosen();
	}
	
	//----- add item plus minus button
	if ($.isFunction($.fn.userincr)) {
		$(".manual-adjust").userincr({
			buttonlabels:{'dec':'-','inc':'+'},
		}).data({'min':0,'max':20,'step':1});
	}	
		
	if ($.isFunction($.fn.loadMoreResults)) {	
		$('.loadMore').loadMoreResults({
			displayedItems: 3,
			showItems: 1,
			button: {
			  'class': 'btn-load-more',
			  'text': 'Load More'
			}
		});	
	}
		//===== owl carousel  =====//
		if ($.isFunction($.fn.owlCarousel)) {
			$('.sponsor-logo').owlCarousel({
				items: 6,
				loop: true,
				margin: 30,
				autoplay: true,
				autoplayTimeout: 1500,
				smartSpeed: 1000,
				autoplayHoverPause: true,
				nav: false,
				dots: false,
				responsiveClass:true,
					responsive:{
						0:{
							items:3,
						},
						600:{
							items:3,
	
						},
						1000:{
							items:6,
						}
					}
	
			});
		}
		
	// slick carousel for detail page
		if ($.isFunction($.fn.slick)) {
		$('.slider-for-gold').slick({
			slidesToShow: 1,
			slidesToScroll: 1,
			arrows: false,
			slide: 'li',
			fade: false,
			asNavFor: '.slider-nav-gold'
		});
		
		$('.slider-nav-gold').slick({
			slidesToShow: 3,
			slidesToScroll: 1,
			asNavFor: '.slider-for-gold',
			dots: false,
			arrows: true,
			slide: 'li',
			vertical: true,
			centerMode: true,
			centerPadding: '0',
			focusOnSelect: true,
			responsive: [
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 1,
					infinite: true,
					vertical: false,
					centerMode: true,
					dots: false,
					arrows: false
				}
			},
			{
				breakpoint: 641,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 1,
					infinite: true,
					vertical: true,
					centerMode: true,
					dots: false,
					arrows: false
				}
			},
			{
				breakpoint: 420,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 1,
					infinite: true,
					vertical: false,
					centerMode: true,
					dots: false,
					arrows: false
				}
			}	
			]
		});
	}
		
	//---- responsive header
		
	/*$(function() {
	
		//	create the menus
	$('#menu').mmenu();
		$('#shoppingbag').mmenu({
			navbar: {
				title: 'General Setting'
			},
			offCanvas: {
				position: 'right'
			}
		});
	
		//	fire the plugin
		$('.mh-head.first').mhead({
			scroll: {
				hide: 200
			}
			
		});
		$('.mh-head.second').mhead({
			scroll: false
		});
	
		
	});	*/	
	
	//**** Slide Panel Toggle ***//
		  $("span.main-menu").on("click", function(){
			$(".side-panel").toggleClass("active");
			  $(".theme-layout").addClass('active');
			  return false;
		  });
	
		  $('.gap, .noti, .mssg, .user-img, .ti-search').on("click",function(){
			  $(this).removeClass('active');
			 $(".side-panel").removeClass('active');
			  
			 
		  });
	
		  
	// login & register form
	$('button.signin').on("click", function(){
        $('.login-reg-bg').addClass('show');
        return false;
        });
        
        $('.already-have').on("click", function(){
        $('.login-reg-bg').removeClass('show');
        return false;
        });
		
		
	//----- count down timer		
		if ($.isFunction($.fn.downCount)) {
			$('.countdown').downCount({
				date: '11/12/2018 12:00:00',
				offset: +10
			});
		}
	
	/** Post a Comment **/
	jQuery(".post-comt-box textarea").on("keydown", function(event) {
	
		if (event.keyCode == 13) {
			var comment = jQuery(this).val();
			var parent = jQuery(".showmore").parent("li");
			var comment_HTML = '<li><div class="comet-avatar"><img src="images/resources/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png" alt=""></div><div class="we-comment"><div class="coment-head"><h5><a href="time-line.html" title="">You</a></h5><span>1 year ago</span><a class="we-reply" href="#" title="Reply"><i class="fa fa-reply"></i></a></div><p>'+comment+'</p></div></li>';
			$(comment_HTML).insertBefore(parent);
			jQuery(this).val('');
		}
	}); 
	
	//inbox page 	
	//***** Message Star *****//  
		$('.message-list > li > span.star-this').on("click", function(){
			$(this).toggleClass('starred');
		});
	
	
	//***** Message Important *****//
		$('.message-list > li > span.make-important').on("click", function(){
			$(this).toggleClass('important-done');
		});
	
		
	
	// Listen for click on toggle checkbox
		$('#select_all').on("click", function(event) {
		  if(this.checked) {
			  // Iterate each checkbox
			  $('input:checkbox.select-message').each(function() {
				  this.checked = true;
			  });
		  }
		  else {
			$('input:checkbox.select-message').each(function() {
				  this.checked = false;
			  });
		  }
		});
	
	
		$(".delete-email").on("click",function(){
			$(".message-list .select-message").each(function(){
				  if(this.checked) {
					  $(this).parent().slideUp();
				  }
			});
		});
	
	// change background color on hover
		$('.category-box').hover(function () {
			$(this).addClass('selected');
			$(this).parent().siblings().children('.category-box').removeClass('selected');
		});
		
		
	//------- offcanvas menu 
	
		const menu = document.querySelector('#toggle');  
		const menuItems = document.querySelector('#overlay');  
		const menuContainer = document.querySelector('.menu-container');  
		const menuIcon = document.querySelector('.canvas-menu i');  
	
		function toggleMenu(e) {
			menuItems.classList.toggle('open');
			menuContainer.classList.toggle('full-menu');
			menuIcon.classList.toggle('fa-bars');
			menuIcon.classList.add('fa-times');
			e.preventDefault();
		}
	
		if( menu ) {
			menu.addEventListener('click', toggleMenu, false);	
		}
		
	// Responsive nav dropdowns
		$('.offcanvas-menu li.menu-item-has-children > a').on('click', function () {
			$(this).parent().siblings().children('ul').slideUp();
			$(this).parent().siblings().removeClass('active');
			$(this).parent().children('ul').slideToggle();
			$(this).parent().toggleClass('active');
			return false;
		});	
		
		var scrollDuration = 300;
		// paddles
		var leftPaddle = document.getElementsByClassName('left-paddle');
		var rightPaddle = document.getElementsByClassName('right-paddle');
		// get items dimensions
		var itemsLength = $('.slideitem').length;
		var itemSize = $('.slideitem').outerWidth(true);
		// get some relevant size for the paddle triggering point
		var paddleMargin = 20;
		
		// get wrapper width
		var getslideWrapperSize = function() {
			return $('.slide-wrapper').outerWidth();
		}
		var slideWrapperSize = getslideWrapperSize();
		// the wrapper is responsive
		$(window).on('resize', function() {
			slideWrapperSize = getslideWrapperSize();
		});
		// size of the visible part of the menu is equal as the wrapper size 
		var slideVisibleSize = slideWrapperSize;
		
		// get total width of all menu items
		var getslideSize = function() {
			return itemsLength * itemSize;
		};
		var slideSize = getslideSize();
		// get how much of menu is invisible
		var slideInvisibleSize = slideSize - slideWrapperSize;
		
		// get how much have we scrolled to the left
		var getslidePosition = function() {
			return $('.slide').scrollLeft();
		};
		
		// finally, what happens when we are actually scrolling the menu
		$('.slide').on('scroll', function() {
		
			// get how much of menu is invisible
			slideInvisibleSize = slideSize - slideWrapperSize;
			// get how much have we scrolled so far
			var slidePosition = getslidePosition();
		
			var slideEndOffset = slideInvisibleSize - paddleMargin;
		
			// show & hide the paddles 
			// depending on scroll position
			if (slidePosition <= paddleMargin) {
				$(leftPaddle).addClass('hidden');
				$(rightPaddle).removeClass('hidden');
			} else if (slidePosition < slideEndOffset) {
				// show both paddles in the middle
				$(leftPaddle).removeClass('hidden');
				$(rightPaddle).removeClass('hidden');
			} else if (slidePosition >= slideEndOffset) {
				$(leftPaddle).removeClass('hidden');
				$(rightPaddle).addClass('hidden');
		}
		
			// print important values
			$('#print-wrapper-size span').text(slideWrapperSize);
			$('#print-menu-size span').text(slideSize);
			$('#print-menu-invisible-size span').text(slideInvisibleSize);
			$('#print-menu-position span').text(slidePosition);
		
		});
		
		// scroll to left
		$(rightPaddle).on('click', function() {
			$('.slide').animate( { scrollLeft: slideInvisibleSize}, scrollDuration);
		});
		
		// scroll to right
		$(leftPaddle).on('click', function() {
			$('.slide').animate( { scrollLeft: '0' }, scrollDuration);
		});

//story scroll

		var scrollDurationstry = 300;
		// paddles
		var leftPaddlestry = document.getElementsByClassName('left-paddlestry');
		var rightPaddlestry = document.getElementsByClassName('right-paddlestry');
		// get items dimensions
		var itemsLengthstry = $('.slideitemstry').length;
		var itemSizestry = $('.slideitemstry').outerWidth(true);
		// get some relevant size for the paddle triggering point
		var paddleMarginstry = 30;
		
		// get wrapper width
		var getslideWrapperSizestry = function() {
			return $('.slide-wrapperstry').outerWidth();
		}
		var slideWrapperSizestry = getslideWrapperSizestry();
		// the wrapper is responsive
		$(window).on('resize', function() {
			slideWrapperSizestry = getslideWrapperSizestry();
		});
		// size of the visible part of the menu is equal as the wrapper size 
		var slideVisibleSizestry = slideWrapperSizestry;
		
		// get total width of all menu items
		var getslideSizestry = function() {
			return itemsLengthstry * itemSizestry;
		};
		var slideSizestry = getslideSizestry();
		// get how much of menu is invisible
		var slideInvisibleSizestry = slideSizestry - slideWrapperSizestry;
		
		// get how much have we scrolled to the left
		var getslidePositionstry = function() {
			return $('.slidestry').scrollLeft();
		};
		
		// finally, what happens when we are actually scrolling the menu
		$('.slidestry').on('scroll', function() {
		
			// get how much of menu is invisible
			slideInvisibleSizestry = slideSizestry - slideWrapperSizestry;
			// get how much have we scrolled so far
			var slidePositionstry = getslidePositionstry();
		
			var slideEndOffsetstry = slideInvisibleSizestry - paddleMarginstry;
		
			// show & hide the paddles 
			// depending on scroll position
			if (slidePositionstry <= paddleMarginstry) {
				$(leftPaddlestry).addClass('hidden');
				$(rightPaddlestry).removeClass('hidden');
			} else if (slidePositionstry < slideEndOffsetstry) {
				// show both paddles in the middle
				$(leftPaddlestry).removeClass('hidden');
				$(rightPaddlestry).removeClass('hidden');
			} else if (slidePositionstry >= slideEndOffsetstry) {
				$(leftPaddlestry).removeClass('hidden');
				$(rightPaddlestry).addClass('hidden');
		}
		
			// print important values
			$('#print-wrapper-size span').text(slideWrapperSizestry);
			$('#print-menu-size span').text(slideSizestry);
			$('#print-menu-invisible-size span').text(slideInvisibleSizestry);
			$('#print-menu-position span').text(slidePositionstry);
		
		});
		
		// scroll to left
		$(rightPaddlestry).on('click', function() {
			$('.slidestry').animate( { scrollLeft: slideInvisibleSizestry}, scrollDurationstry);
		});
		
		// scroll to right
		$(leftPaddlestry).on('click', function() {
			$('.slidestry').animate( { scrollLeft: '0' }, scrollDurationstry);
		});
// HangGift
// var $slider = $('.slider'); // class or id of carousel slider
// var $slide = 'img'; // could also use 'img' if you're not using a ul
// var $transition_time = 1000; // 1 second
// var $time_between_slides = 4000; // 4 seconds
// var $interval=0 ;
// function slides(){
//   return $slider.find($slide);
// }

// slides().fadeOut();

// // set active classes
// slides().first().addClass('active');
// slides().first().fadeIn($transition_time);

// // auto scroll 
// $interval = setInterval(
//   function(){
// 	var $i = $slider.find($slide + '.active').index();

// 	slides().eq($i).removeClass('active');
// 	slides().eq($i).fadeOut($transition_time);

// 	if (slides().length == $i + 1) $i = -1; // loop to start

// 	slides().eq($i + 1).fadeIn($transition_time);
// 	slides().eq($i + 1).addClass('active');
//   }
//   , $transition_time +  $time_between_slides 
// );

	

	});//document ready end
	
	
	
	
	
}
export {testScript}