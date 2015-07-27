/**
* Creates and shows tooltip
**/

;(function($) {
	'use strict';

	var Tooltip = function(element, options) {
		this.$element = $(element);
		this.options = $.extend({}, Tooltip.DEFAULTS, options);
		this.$element.on('mouseenter', $.proxy(this.show, this))
				.on('mouseleave', $.proxy(this.destroy, this));
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
				$tooltipElem = this.tooltipElem,
				offsetFromElem = this.options.offsetFromElem;
		
    var coords = $elem.offset(); 
    var left = coords.left + $elem.outerWidth() + offsetFromElem;
    var top = coords.top;
    //if(left < $(window).scrollLeft()) left = $(window).scrollLeft();
    //if(top < $(window).scrollTop()) top = coords.top + $elem.height() + offsetFromElem;
    $tooltipElem.css({
      top: top,
      left: left
    })     
	};

	Tooltip.prototype.destroy = function() {
		this.tooltipElem.remove();
	};

	$('input').each(function(){
		new Tooltip(this, {html: 'Tooltip'})
	})

}(jQuery));