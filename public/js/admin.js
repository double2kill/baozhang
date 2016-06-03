$(function(){
	$('.del').click(function(e) {
		var target = $(e.target)
		var id = target.data('id')
		var tr = $('.item-id-' + id)

		$.ajax({
			type: 'DELETE',
			url: '/admin/record/?id=' + id
		})
		.done(function(results){
			if(results.success === 1){
				if(tr.length > 0){
					tr.remove()
				}
			}
		})
	})

	$('.pay').click(function(e) {
		var target = $(e.target)
		var id = target.data('id')
		var tr = $('.item-id-' + id)
		$.ajax({
			type: 'POST',
			url: '/admin/record/needpaid/?id=' + id
		})
		.done(function(results){
			if(results.success === 1){
				if(tr.length > 0){
					target.parent().html("已结算")
				}
			}
		})
	})
})