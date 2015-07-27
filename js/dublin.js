/**
* This module makes menu collapsible. Collapsible items must have attribute 'data-collapse=collapse'
* Arguments:
* element {selector, element} - element to make collapsible
* options {plain object} - additional options for callopse effect
* HTML structure:
* <ul data-collapse="collapse">
*  <li>
* 	<a href="#block1" data-toggle="collapse"></a>
*		<ul id="block1" class="panel-collapse">
*			<li></li>
*		</ul>
*	</li>
*	</ul>
**/
(function($) {
	'use strict';

	var Collapse = function(element, options) {
		var self = this;
		this.$element = $(element);
		this.options = $.extend({}, Collapse.DEFAULTS, options);
		this.panel = '.panel-collapse';
	};
	
	Collapse.DEFAULTS = {
		duration: 400
	};

	Collapse.prototype.show = function($target) {
		this.$element.find('.opened').removeClass('opened')
				.find(this.panel).slideUp(this.options.duration);
		$target.stop().slideDown(this.options.duration);
		$target.parent().addClass('opened');
	};

	Collapse.prototype.hide = function($target) {
		$target.stop().slideUp(this.options.duration, function() {
			$target.parent().removeClass('opened');
		});
	};

	Collapse.prototype.toggle = function($target) {
		var $parent = $target.parent();
		this[$parent.hasClass('opened') ? 'hide' : 'show']($target);
	};

	Collapse.prototype.getTargetFromTrigger = function($trigger) {
		var id = $trigger.attr('href');
		return this.$element.find(id);
	}

	$(window).on('load', function() {
		$('[data-collapse="collapse"]').each(function() {
			var collapse = new Collapse(this);
			$(this).on('click', '[data-toggle="collapse"]', function() {
				var $this = $(this),
						$target = collapse.getTargetFromTrigger($this);
				collapse.toggle($target);
				return false;
			})
		})
	})
	
}(jQuery));;/**
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
}(jQuery));/**
* This module makes tab-panel
* element {element} element to make tabs
* HTML:
* <div class="tabpanel">
*		<ul class="tabpanel-nav">
*			<li><a href="#tab-1"></a></li>
*		</ul>
*		<div class="tab-content">
*			<div id="tab-1"></div>
*		</div>
*	</div>
*	CSS:
*	.tab-pane {display: none;}
*	.tab-pane.active {display: block;}
**/
(function($){

	var Tab = function(element) {
		this.$element = $(element);
	};

	Tab.TRANSITION_DURATION = 300;

	Tab.prototype.show = function(target) {
		var $this = this.$element,
				$targetLi = $(target).closest('li'),
				$activeLi = $this.find('.tabpanel-nav').find('.active'),
				activeSelector = $activeLi.find('a').attr('href'),
				targetSelector = $(target).attr('href');

		if($targetLi.hasClass('active')) return;		

		$activeLi.removeClass('active');
		$targetLi.addClass('active');
		$this.find(activeSelector).removeClass('active').fadeOut(0, function(){
			$this.find(targetSelector).fadeIn(Tab.TRANSITION_DURATION).addClass('active');
		});
	};

	$(window).on('load', function() {
		$('.tabpanel').each(function() {
			var tab = new Tab(this);
			$(this).on('click', '[data-toggle="tab"]', function() {
				tab.show(this);
				return false;
			})
		}); 
	});

}(jQuery));;
;(function($){

	'use strict';

	var Tooltip = function(element, options) {
		this.$element = $(element);
		this.options = $.extend({}, Tooltip.DEFAULTS, options);
	};

	Tooltip.DEFAULTS = {
		offsetFromElem: 10
	};

	Tooltip.prototype.makeTooltipElem = function() {
		this.tooltipElem = $('<span>').addClass('tooltip')
                             .html(this.options.html)
                             .appendTo('body');
	};

	Tooltip.prototype.show = function() {
		this.makeTooltipElem();
		var $elem = this.$element,
				self = this;
		
    this.positionTooltip($elem);

    $(window).on('scroll.tooltip', function(){
    	self.positionTooltip($elem);
    });
	};

	Tooltip.prototype.destroy = function() {
		this.tooltipElem.remove();
		$(window).off('scroll.tooltip');
	};

	Tooltip.prototype.positionTooltip = function(elem) {
		var coords = elem.offset(),
		offsetFromElem = this.options.offsetFromElem,
		$tooltipElem = this.tooltipElem, 
    left = coords.left + elem.outerWidth() + offsetFromElem,
    top = coords.top;

    $tooltipElem.css({
      top: top,
      left: left
    })   
	};

	var validator = {

		data: {},

		types: {},
		
		onKeyDown: function() {
			var $this = $(this),
					tooltip = $this.data('tooltip'),
					$button = $this.closest('form').find('[type="submit"]');
			if(tooltip) {
				tooltip.destroy();
				$(this).removeData('tooltip').removeClass('has-error');
				$button.removeAttr('disabled').removeClass('disabled');
			}
		},
		
		validate: function(form) {
			var $form = $(form),
					inputs = $('input, textarea', $form),
					value,
					self = this,
					valid = true,
					$button = $('[type="submit"]', $form);
					
			inputs.each(function() {
				var $this = $(this),
						name = $this.attr('name'), 
						validation = $this.attr('data-validate'),
						checker,
						result,
						value = $this.val(),
						type,
						tooltip = $this.data('tooltip');

				if(!validation) return;		
				type = (validation.indexOf(' ') !== -1) ? validation.split(' ') : validation;
				
				if($.isArray(type)) {
					var types = type, len = types.length, i;

					for(i = 0; i < len; i++) {
						type = 'is' + types[i];
						checker = self.types[type];
						if(!checker) return;
						result = checker.validate(value);
						if(!result) {
							if(!tooltip) {
								tooltip = new Tooltip($this, {html: checker.instructions + name});
								tooltip.show();
								$this.addClass('has-error').data('tooltip', tooltip);
								break;
							}
							$button.attr('disabled', 'disabled').addClass('disabled');
							valid = false;
						}
					}
				} else {
					type = 'is' + type;
					checker = self.types[type];
					if(!checker) return;
					result = checker.validate(value);
					if(!result) {
						if(!tooltip) {
							tooltip = new Tooltip($this, {html: checker.instructions + name});
							tooltip.show();
							$this.addClass('has-error').data('tooltip', tooltip);
						}
						$button.attr('disabled', 'disabled').addClass('disabled');
						valid = false;
					}
				}
			});		
			return valid;
		}
	};

	validator.types.isrequired = {
		validate: function(value) {
			return value !== '';
		},
		instructions: 'Enter '
	};

	validator.types.isnumber = {
		validate: function(value) {
			return !isNaN(value);
		},
		instructions: 'Enter number for '
	};

	$(function() {
		$('form').each(function() {
			$(this).on('submit', function() {
				if(!validator.validate(this)) return false;
			}).on('keydown', 'input, textarea', validator.onKeyDown);
		});
	});

}(jQuery));;/**
* This module makes custom number picker for input
**/

;(function($){
	'use strict';

	var CustomNumber = function(element, options) {
		this.$element = $(element);
		this.options = $.extend({}, CustomNumber.DEFAULTS, options);
		this.addListeners();
		this.$element.find('input').attr('autocomplete', 'off');
	};

	CustomNumber.DEFAULTS = {
		min: 0,
		max: 100,
		controlUp: '.number-control.up',
		controlDown: '.number-control.down'
	};

	CustomNumber.prototype.addListeners = function() {
		this.$element.on('click', this.options.controlUp, $.proxy(this.add, this))
				.on('click', this.options.controlDown, $.proxy(this.distract, this))
				.on('focusin', $.proxy(this.onFocus, this))
				.on('focusout', $.proxy(this.onBlur, this));
	};

	CustomNumber.prototype.add = function() {
		var $input = this.$element.find('input'),
				currentValue = $input.val();
		if($input.is(':not(:focus)')) $input.focus();		
		++currentValue;		
		if(currentValue > this.options.max || isNaN(currentValue)) return;
		if(currentValue < 10) currentValue = '0' + currentValue;
		$input.val(currentValue);
		$(this.$element).triggerHandler({
			type: 'change',
			value: currentValue
		});
		return false; 
	};

	CustomNumber.prototype.distract = function() {
		var $input = this.$element.find('input'),
				currentValue = $input.val();
		if($input.is(':not(:focus)')) $input.focus();	
		--currentValue;		
		if(currentValue < this.options.min || isNaN(currentValue)) return;
		if(currentValue < 10) currentValue = '0' + currentValue;
		$input.val(currentValue);
		$(this.$element).triggerHandler({
			type: 'change',
			value: currentValue
		});
		return false;
	};

	CustomNumber.prototype.onFocus = function() {
		var self = this;
		$(document).on('keydown.customNumber', function(e) {
			switch(e.which) {
				case 38:
					self.add();
					break;

				case 40:
					self.distract();
					break;	
			}
		})
	};

	CustomNumber.prototype.onBlur = function() {
		$(document).off('keydown.customNumber');
	};

	$(window).on('load', function() {
		 $('.custom-number').each(function(){
			return new CustomNumber(this);
		});
	});

}(jQuery));;/**
* Makes modals
**/

;(function($){

	var Modal = function(element, options) {
		this.$element = element;
		this.options = $.extend({}, Modal.DEFAULTS, options);
		this.$overlay = $(this.options.overlay);
		this.$overlay.on('click', $.proxy(this.hide, this));
		$(this.options.dismiss).on('click', $.proxy(this.hide, this));
	};

	Modal.DEFAULTS = {
		overlay: '#overlay',
		dismiss: '[data-dismiss="modal"]',
		transitionDuration: 150
	};

	Modal.prototype.show = function($target) {
		var self = this,
				$overlay = this.$overlay,
				shown = $('.modal-open'),
				duration = this.options.transitionDuration;

		if(shown.length) this.hide();		

		self.adjustOverlay($overlay);
		$overlay.fadeIn(duration, function() {
			self.adjustDialog($target);
			$target.slideDown(duration).addClass('modal-open');
		});

		$(document).on('keydown.modals', function(e) {
			if(e.which === 27) self.hide(); //esc key
		});

		$(window).on('resize.modals', function() {
			self.adjustOverlay($overlay);
			self.adjustDialog($target);
		});
	};

	Modal.prototype.hide = function() {
		var $this = $('.modal-open'),
				$overlay = this.$overlay,
				self = this,
				duration = this.options.transitionDuration;;

		$this.removeClass('modal-open').slideUp(duration);
		$overlay.fadeOut(duration);		
		
		$(document).off('keydown.modals');
		$(window).off('resize.modals');
	};

	Modal.prototype.adjustOverlay = function(elem) {
		elem.css({
			'width': $(window).width(),
			'height': $(document).height()
		});
	};

	Modal.prototype.adjustDialog = function(elem) {
		var top = Math.round($(window).height()/2 - elem.outerHeight()/2),
				left = Math.round($(window).width()/2 - elem.outerWidth()/2);
		elem.css({
			'top': top,
			'left': left
		});
	};

	$(window).on('load', function() {
		$('.modal').each(function() {
			var modal = new Modal(this);
			$(this).data('modal', modal); // saving link on modal object with method data() to call methods of modal object afterwards
		});
	//после отправки каждой формы на сервер и получения ответа, загружать следующее окно	
		$(document).on('click', '[data-toggle="modal"]', function(e){
			var id = $(this).attr('data-target'),
					$target = $(id),
					modal = $target.data('modal'), //retrieve modal object saved earlier
					node = this.nodeName,
					$form = $(this).closest('form'),
					tooltips;
			// if(node === 'BUTTON') {
			// 	$form.triggerHandler('submit');
			// 	tooltips = $(document).find('.tooltip');
			// 	if(tooltips.length) {
			// 		return;
			// 	} else {
			// 		//e.preventDefault();
			// 		modal.show($target);
			// 	}
			// } else {
				modal.show($target);
				return false;
			//}
		})
	})

}(jQuery));;$(function() { // this function adds shadow at the bottom of each image
	$('div.carousel-item > img').each(function() {
		$(this).clone().addClass('shadow').insertAfter($(this));
	});
	$('#main-nav').on('click', 'a', function() { // prevents transfer to the page when user is clicking on an active link
		if($(this).closest('li').hasClass('active')) return false;
	});

	function calcTotal() { // this function calculates total amount relative to quantity
		var value = $('input', '.custom-number').val(),
				price = 77.50,
				total = value * price,
				amountBar = $('.amount > span');
		amountBar.text(total.toFixed(2) + ' $');		
	}

	calcTotal();
	$('.custom-number').on('change', calcTotal);
});