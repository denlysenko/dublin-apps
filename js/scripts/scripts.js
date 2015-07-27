$(function() { // this function adds shadow at the bottom of each image
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