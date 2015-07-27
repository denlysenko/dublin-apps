/**
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

}(jQuery));