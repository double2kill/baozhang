$(function () {
  $('.modify').click(function (e) {
    var target = $(e.target)
    var id = target.data('id')
    var tr = $('.item-id-' + id)

    var role = tr.find("option:selected").val()
    var rolename = tr.find("option:selected").text()

    $.ajax({
      type: 'POST',
      data: {
        id: id,
        role: role
      },
      url: '/user/admin/'
    })
    .done(function(results){
      if(results.success === 1){
        var _td = tr.children('td:nth-child(2)')
        _td.text(rolename)
        _td.addClass('success')
      }
    })
  })
})