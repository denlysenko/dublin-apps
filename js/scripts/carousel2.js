/**
* Makes carousel
* Arguments:
* element {selector, element} element applied carousel effect to
* options {plain object}
* options.slide {boolean} to make sliding infinite
* options.slideInterval {number} interval of changing slides in milliseconds 
* options.slidingDuration {number} duration of slide effect
*	options.isCycle {boolean} if this option is set to true the first item will come after the last one. If this 
* option is set to false carousel will stop when the last item is shown and relative control will be disabled 
* HTML structure:
* <div class="carousel">
*		<div class="carousel-inner">
*			<div class="carousel-item"></div>
*		</div>
*		<a class="left carousel-control" href="#" data-slide="prev" role="button"></a>
*   <a class="right carousel-control" href="#" data-slide="next" role="button"></a>
*	</div>   
* CSS:
* .carousel { overflow: hidden;}
* .carousel-inner {	position: relative;	width: 30000em; }
* .carousel-item { position: relative; float: left; width: px; }
**/

(function($) {
	'use strict';

	var Carousel = function(element, options) {
		this.options = $.extend({}, Carousel.DEFAULTS, options);
		return this.options.isCycle ? new CarouselCycling(element, this.options) : new CarouselNonCycling(element, this.options);
	};

	Carousel.DEFAULTS = {
		slide: true,
		slideInterval: 4000,
		slidingDuration: 800,
		isCycle: true,
		minScreen: null
	};

	CarouselCycling.prototype.next = CarouselNonCycling.prototype.next = function() {
		this.slide('next');
	};

	CarouselCycling.prototype.prev = CarouselNonCycling.prototype.prev = function() {
		this.slide('prev');
	};

	CarouselCycling.prototype.init = CarouselNonCycling.prototype.init = function() {
		var self = this;
		this.$items = this.$element.find('.carousel-item');
		this.$slider = this.$element.find('.carousel-inner');
		this.$controls = this.$element.find('.carousel-control');
		this.step = Math.round(this.$items.first().outerWidth(true));
	};

	function CarouselCycling(element, options) {
		this.$element = $(element);
		this.options = options;
		this.init();
		this.runTimer = null;
		this.$items.last().insertBefore(this.$items.first());
		this.$slider.css('left', -this.step);
		var self = this,
				minScreen = this.options.minScreen;
		if(this.options.slide){
			if($(window).width() > minScreen) this.run(); // stops sliding if width of window is less than screen-xs-min when page is loaded 
			this.$element.hover(function() { // stops sliding when cursor is over element including control buttons
				self.pause();
			}, function() { // runs sliding when cursor is out of element
				self.run();
			});
			$(window).on('resize', function() { // stops sliding if width of window is less than screen-xs-min 
				if($(window).width() < minScreen) self.pause()
				else self.run();	
				//self.step = Math.round(self.$items.first().outerWidth(true)); // recalculating step and adjusting item when window size is changed
				//self.$slider.css('left', -self.step);
			})
		}
	}

	CarouselCycling.prototype.slide = function(direction) {
		var $slider = this.$slider,
				step = this.step;
		switch(direction) {
			case 'prev':
				var left = parseInt($slider.css('left')) - step;
				$slider.filter(':not(:animated)').animate({
					left: left
				}, this.options.slidingDuration ,function() {
					var $first = $slider.children().first(),
							$last = $slider.children().last();
					$first.insertAfter($last);
					$slider.css('left', -step);
				});
				break;
			case 'next':
				var left = parseInt($slider.css('left')) + step;
				$slider.filter(':not(:animated)').animate({
					left: left
				}, this.options.slidingDuration ,function() {
					var $first = $slider.children().first(),
							$last = $slider.children().last();
					$last.insertBefore($first);
					$slider.css('left', -step);
				});
				break;
		}		
	};

	CarouselCycling.prototype.run = function() {
		var self = this;
		if(!this.runTimer) {
			this.runTimer = setInterval(function() {
				self.next();
			}, this.options.slideInterval);
		}	
	};

	CarouselCycling.prototype.pause = function() {
		if(this.runTimer) {
			clearInterval(this.runTimer);
			this.runTimer = null;
		}
	};

	function CarouselNonCycling(element, options) {
		this.$element = $(element);
		this.options = options;
		this.init();
		this.currentLeft = 0;
		this.max = (this.$items.length - 2) * this.step;
		this.$controls.filter('.right').addClass('disabled');
	}

	CarouselNonCycling.prototype.slide = function(direction) {
		var $leftControl = this.$controls.filter('.left'),
				$rightControl = this.$controls.filter('.right'),
				$slider = this.$slider,
				step = this.step,
				max = this.max;
		switch(direction) {
			case 'next':
				$leftControl.removeClass('disabled');
				if(this.currentLeft === 0) return;
				
				this.currentLeft += step;
				$slider.filter(':not(:animated)').animate({
					left: this.currentLeft
				}, this.options.slidingDuration);

				if(this.currentLeft === 0) $rightControl.addClass('disabled');
				break;
			case 'prev':
			$rightControl.removeClass('disabled');
			if(this.currentLeft < -max) return;
			
			this.currentLeft -= step;
			$slider.filter(':not(:animated)').animate({
				left: this.currentLeft
			}, this.options.slidingDuration);

			if(this.currentLeft === (-max - step)) $leftControl.addClass('disabled');
			break;	
		}
	};

	$(window).on('load', function() {
		$('.carousel').each(function() {
			var carousel = new Carousel(this, {minScreen: 768});
				$(this).on('click', '[data-slide="next"]', function() {
						carousel.next();
						return false;
					})
					.on('click', '[data-slide="prev"]', function() {
						carousel.prev();
						return false;
					});

		});
	});
}(jQuery))