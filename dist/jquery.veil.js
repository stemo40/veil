/*
* jQuery Veil Plugin 1.0 (works with jQuery 1.10+)
*
* This is a jQuery modal window plugin somewhat based on the Zurb jQuery Reveal Plugin 1.0
* which is deprecated, no longer is developed or supported and does not work
* with the the latest version of jQuery.
*
* jQuery Veil has updated the basic concept and added some new features.
* New features list:
* 1. Set the Height of the dialog
* 2. Set the Width of the dialog
* 3. Set the source of the optional iframe
* 4. Set the top position of the dialog
* 5. Set the left position of the dialog
* 6. New 'slide' animation
* 7. New frosted glass background
* See the example file for more info
*/
;(function ( $ ) {
	"use strict",

	$.fn.veil = function( options ) {

		/*--------------------------
		Default settings
		--------------------------*/
		var settings = $.extend({
			animation					: 'pop', 					// fade, pop, slide, none
			closeclass				: 'close-veil',		// close class
			animationspeed		: 300, 						// animation speed
			opacity						: 50,							// opacity of the modal background
			width							: 600, 						// width of the dialog
			height						: 400, 						// height of the dialog
			closeonbgclick		: false, 					// closes on background click
			bgcolor						: null, 					// color of the modal background
			blurid 						: null, 					// ID that blurs the background
			source						: null, 					// source file for the optional iframe
			top								: null, 					// position of the top of the dialog
			left							: null, 					// position of the left side of the dialog
			title							: null, 					// Title of the dialog
			onClose						: null, 					// on Close callback function
			onOpen						: null 					 	// on Open callback function
		}, options );

		return this.each( function() {

			/*---------------------------
			Global Variables
			----------------------------*/
			var mid = $(this).data('veil-id');
			var modal = $('#' + mid);
			var locked = false;
			var modalBG = $('.veil-modal-bg');
			var topMeasure  = parseInt(modal.css('top'));
			var topOffset = modal.height() + topMeasure;

			/*----------------------------
			Click Function
			-----------------------------*/
			$(this).click(function(e) {
				e.preventDefault();

				/*----------------------------
				Source, Width & Height of dialog
				-----------------------------*/
				if ($(this).data('veil-src') != undefined) {
					var source = $(this).data('veil-src');
				}else {
					var source = settings.source;
				}
				if ($(this).data('veil-width') != undefined) {
					var w = $(this).data('veil-width');
				}else {
					var w = settings.width;
				}
				if ($(this).data('veil-height') != undefined) {
					var h = $(this).data('veil-height');
				}else {
					var h = settings.height;
				}
				var hh = h;

				if ($(this).data('veil-title') != undefined) {
					hh = hh+48;
					var title = '<span id="veil-title"><div class="veil-title">'+ $(this).data('veil-title') +'</div><a class="close-veil close-veil-title"></a></span>';
				}else if (settings.title != null) {
					var title = '<span id="veil-title"><div class="veil-title">'+ settings.title +'</div><a class="close-veil close-veil-title"></a></span>';
				}else {
					var title = null;
				}
				if (modal.find('.veil-footer').length) {
					hh = hh+42;
				}

				/*----------------------------
				Set the size of the dialog
				-----------------------------*/
				$(".veil-modal-container").css( {
					'width':w+'px',
					'height':hh+'px'
				});
				if (title != null){
					$(".veil-modal-container").prepend(title);
				}else{
					$('#veil-title').remove();
				}

				$('.veil-frame').html('<iframe src="'+source+'" width="'+w+'" height="'+h+'" id="veil-iframe" frameborder="0" />');


				/*----------------------------
				Set several veriables based on
				data tag or settings
				----------------------------*/
				if ($(this).data('veil-opacity') != undefined) {
					var mOpacity = $(this).data('veil-opacity')/100;
				}else {
					var mOpacity = settings.opacity/100;
				}
				if ($(this).data('veil-animation') != undefined) {
					var anim = $(this).data('veil-animation');
				}else {
					var anim = settings.animation;
				}
				if ($(this).data('veil-animationspeed' != undefined)) {
					var speed = $(this).data('veil-animationspeed');
				}else {
					var speed = settings.animationspeed;
				}
				if ($(this).data('veil-closeclass') != undefined) {
					var dismiss = $(this).data('veil-closeclass');
				}else {
					var dismiss = settings.closeclass;
				}
				if ($(this).data('veil-closeonbgclick') != undefined) {
					var closeonbg = $(this).data('veil-closeonbgclick');
				}else {
					var closeonbg = settings.closeonbgclick;
				}

				/*---------------------------
				Dialog Position
				----------------------------*/
				var winHeight = window.innerHeight;
				var wh = winHeight/2;
				var mh = hh/2;
				var docTop = $(document).scrollTop();
				if ($(this).data('veil-top') != undefined) {
					var modalTop = $(this).data('veil-top');
				}else if (settings.top != null) {
					var modalTop = settings.top;
				}else {
					var modalTop = wh-mh;
				}
				if ($(this).data('veil-left') != undefined){
					var modalLeft = $(this).data('veil-left');
				}else {
					var modalLeft = settings.left;
				}

				/*---------------------------
				Create Modal BG
				----------------------------*/
				if ($(this).data('veil-bgcolor') != undefined) {
					var bgcolor = $(this).data('veil-bgcolor');
				}else if (settings.bgcolor != null) {
					var bgcolor = settings.bgcolor;
				}else {
					var bgcolor = null;
				}
				if(modalBG.length == 0) {
					modalBG = $('<div class="veil-modal-bg" />').insertAfter(modal).css({
						'opacity':mOpacity,
						'background': bgcolor
					});
					if (bgcolor == null) {
						modalBG.addClass('glass');
					}
				}
				if ($(this).data('veil-blurid') != undefined){
					var blurID = $(this).data('veil-blurid');
				}else {
					var blurID = settings.blurid;
				}

				/*---------------------------
				Entrance Animations
				----------------------------*/
				modal.on('veil:open', function () {

					if ( $.isFunction( settings.onOpen ) )	{
						settings.onOpen.call( this );
					}
					modalBG.off('click.modalEvent');
					$('.' + dismiss).off('click.modalEvent');
					if(!locked) {
						lockModal();
						if(anim == "pop") {
							modal.css({
								'top': docTop-topOffset,
								"margin-left": modalLeft + 'px',
								'opacity' : 0
							}).show();
							modalBG.fadeIn(speed/2);
							modal.delay(speed/2).animate({
								"top": modalTop + 'px',
								"margin-left": modalLeft + 'px',
								"opacity" : 1
							}, speed,unlockModal());
						}
						if(anim == "fade") {
							modal.css({
								"top": modalTop + 'px',
								"margin-left": modalLeft + 'px',
								'opacity' : 0
							}).show();
							modalBG.fadeIn(speed/2);
							modal.delay(speed/2).animate({
								"opacity" : 1
							}, speed,unlockModal());
						}
						if(anim == "slide") {
							modal.css({
								"top": wh + 'px',
								"margin-left": modalLeft + 'px',
								'height':1+'px'
							}).show().animate({
								"top": modalTop + 'px',
								'height':hh+'px'
							},speed);
							modalBG.fadeIn(speed/2);
							unlockModal();
						}
						if(anim == "none") {
							modal.css({
								"top": modalTop + 'px',
								"margin-left": modalLeft + 'px'
							}).show();
							modalBG.show();
							unlockModal();

						}
					}


					if (blurID != null) {
						$(blurID).addClass('blur');
					}
					modal.off('veil:open');

				});
				modal.trigger('veil:open')

				/*--------------------------
				Closing Animation
				---------------------------*/
				modal.on('veil:close', function ()	{
					if(!locked)	{
						lockModal();
						if(anim == "pop")	{
							modalBG.delay(speed).fadeOut(speed);
							modal.animate({
								"top":  docTop-topOffset + 'px',
								"opacity" : 0
							}, speed/2, function() {
								modal.css({
									'top':modalTop,
									'opacity' : 1
								}).hide();
								unlockModal();
							});
						}
						if(anim == "fade") {
							modalBG.delay(speed).fadeOut(speed);
							modal.animate({
								"opacity" : 0
							}, speed, function() {
								modal.css({
									'opacity' : 1,
									'top' : topMeasure
								}).hide();
								unlockModal();
							});
						}
						if(anim == "slide"){
							modal.animate({
								'top':wh+'px',
								'height':0+'px'
							},speed, function()	{
								modal.delay(speed).hide();
							});
							modalBG.delay(speed).fadeOut(speed);
							unlockModal();
						}
						if(anim == "none")	{
							modal.hide();
							modalBG.hide();
							unlockModal();
						}
						$(blurID).removeClass('blur');
						$('.veil-title').remove();
						modal.off('veil:close');
					}


					if ( $.isFunction( settings.onClose ) ){
						setTimeout(function(){settings.onClose.call( this )},speed+300);
					}

				});

				/*---------------------------
				Open and add Closing Listeners
				----------------------------*/
				//Open Modal Immediately
				modal.trigger('veil:open')

				//Close Modal Listeners
				var closeButton = $('.' + dismiss).bind('click.modalEvent', function() {
					modal.trigger('veil:close')
				});
				// close on background click
				if(closeonbg) {
					modalBG.css({"cursor":"pointer"})
					modalBG.bind('click.modalEvent', function () {
						modal.trigger('veil:close')
					});
				}
				$('body').keyup(function(e)	{
					if(e.which===27) { modal.trigger('veil:close'); } // 27 is the keycode for the Escape key
				});
				// close button
				$('.veil-close').click(function() {
					modal.trigger('veil:close');
				});
				// iframe close button
				$('#veil-iframe').load(function(){
					$(this).contents().find('.veil-close').click(function() {
						modal.trigger('veil:close');
					});
				});
				function unlockModal() {
					locked = false;
				}
				function lockModal() {
					locked = true;
				}
			});

		});
	};



}( jQuery ));