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
	
}(jQuery));