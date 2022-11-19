$('.multi-field-wrapper').each(function() {
    var $wrapper = $('.multi-fields', this);
    $(".add-field", $(this)).click(function(e) {
        $('.multi-field:first-child', $wrapper).clone(true).appendTo($wrapper).find('input').val('').focus();
    });
    
    $('.multi-field .remove-field', $wrapper).click(function() {
        if ($('.multi-field', $wrapper).length > 1)
            $(this).parent('.multi-field').remove();
    });
});


$('.multi-field-wrapper2').each(function() {
    var $wrapper = $('.multi-fields2', this);
    $(".add-field2", $(this)).click(function(e) {
        $('.multi-field2:first-child', $wrapper).clone(true).appendTo($wrapper).find('input').val('').focus();
    });
    
    $('.multi-field2 .remove-field2', $wrapper).click(function() {
            if ($('.multi-field2', $wrapper).length > 1)
                $(this).parent('.multi-field2').remove();
        });
});