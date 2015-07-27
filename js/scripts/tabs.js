/**
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

}(jQuery));