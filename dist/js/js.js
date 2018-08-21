$(document).ready(function () {
    const body = $('.calendar__body');
    $('.calendar').on('mousemove', function (e) {
        $('.calendar__move').css({
            left: e.pageX - body.offset().left,
            top: e.pageY - body.offset().top
        })
    })
});
