mobiscroll.setOptions({
    locale: mobiscroll.localeEs,
    theme: 'ios',
    themeVariant: 'light'
});

var formatDate = mobiscroll.util.datetime.formatDate;
var now = new Date();
var endDate;
var monthColors = [{
        background: '#b2f1c080',
        start: '2022-01-01T00:00',
        end: '2022-01-31T00:00',
        cellCssClass: 'md-book-rental-bg-off',
        recurring: {
            repeat: 'yearly',
            month: 1,
            day: 1
        }
    }, {
        background: '#b2f1c080',
        start: '2022-02-01T00:00',
        end: '2022-02-28T00:00',
        cellCssClass: 'md-book-rental-bg-off',
        recurring: {
            repeat: 'yearly',
            month: 2,
            day: 1
        }
    }, {
        background: '#b2f1c080',
        cellCssClass: 'md-book-rental-bg-off',
        recurring: {
            repeat: 'yearly',
            month: 2,
            day: 29
        }
    }, {
        background: '#a3cdff80',
        start: '2022-03-01T00:00',
        end: '2022-03-31T23:59',
        cellCssClass: 'md-book-rental-bg-pre',
        recurring: {
            repeat: 'yearly',
            month: 3,
            day: 1
        }
    }, {
        background: '#a3cdff80',
        start: '2022-04-01T00:00',
        end: '2022-04-30T00:00',
        cellCssClass: 'md-book-rental-bg-pre',
        recurring: {
            repeat: 'yearly',
            month: 4,
            day: 1
        }
    },
    {
        background: '#a3cdff80',
        start: '2022-05-01T00:00',
        end: '2022-05-31T00:00',
        cellCssClass: 'md-book-rental-bg-pre',
        recurring: {
            repeat: 'yearly',
            month: 5,
            day: 1
        }
    }, {
        background: '#f7f7bb80',
        start: '2022-06-01T00:00',
        end: '2022-06-30T00:00',
        cellCssClass: 'md-book-rental-bg-in',
        recurring: {
            repeat: 'yearly',
            month: 6,
            day: 1
        }
    },
    {
        background: '#f7f7bb80',
        start: '2022-07-01T00:00',
        end: '2022-07-31T00:00',
        cellCssClass: 'md-book-rental-bg-in',
        recurring: {
            repeat: 'yearly',
            month: 7,
            day: 1
        }
    }, {
        background: '#f7f7bb80',
        start: '2022-08-01T00:00',
        end: '2022-08-31T00:00',
        cellCssClass: 'md-book-rental-bg-in',
        recurring: {
            repeat: 'yearly',
            month: 8,
            day: 1
        }
    }, {
        background: '#f7f7bb80',
        start: '2022-09-01T00:00',
        end: '2022-09-30T00:00',
        cellCssClass: 'md-book-rental-bg-in',
        recurring: {
            repeat: 'yearly',
            month: 9,
            day: 1
        }
    }, {
        background: '#b2f1c080',
        start: '2022-10-01T00:00',
        end: '2022-10-31T23:59',
        cellCssClass: 'md-book-rental-bg-off',
        recurring: {
            repeat: 'yearly',
            month: 10,
            day: 1
        }
    }, {
        background: '#b2f1c080',
        start: '2022-11-01T00:00',
        end: '2022-11-30T00:00',
        cellCssClass: 'md-book-rental-bg-off',
        recurring: {
            repeat: 'yearly',
            month: 11,
            day: 1
        }
    }, {
        background: '#b2f1c080',
        start: '2022-12-01T00:00',
        end: '2022-12-31T00:00',
        cellCssClass: 'md-book-rental-bg-off',
        recurring: {
            repeat: 'yearly',
            month: 12,
            day: 1
        }
    }
];
var myCalendar = mobiscroll.datepicker('#demo-book-rental-months-ahead', {
    controls: ['calendar'],
    select: 'range',
    display: 'inline',
    calendarType: 'month',
    calendarSize: 6,
    min: '2022-02-23T00:00',
    showRangeLabels: false,
    inRangeInvalid: false,
    rangeEndInvalid: true,
    renderCalendarHeader: function () {
        return '<div mbsc-calendar-nav></div>' +
            '<div class="md-book-rental-header">' +
            '<div class="md-book-rental-zone md-book-rental-pre">pre-season</div>' +
            '<div class="md-book-rental-zone md-book-rental-in">in-season</div>' +
            '<div class="md-book-rental-zone md-book-rental-off">off-season</div>' +
            '<div class="md-book-rental-zone md-book-rental-booked">booked</div>' +
            '<div mbsc-calendar-prev></div>' +
            '<div mbsc-calendar-today></div>' +
            '<div mbsc-calendar-next></div>' +
            '</div>';
    }
});

function getColors(start, end) {
    return [{
        date: start,
        cellCssClass: 'vacation-check-in'
    }, {
        date: end,
        cellCssClass: 'vacation-check-out'
    }, {
        start: new Date(start.getFullYear(), start.getMonth(), start.getDate() + 1),
        end: new Date(end.getFullYear(), end.getMonth(), end.getDate() - 1),
        background: '#ffbaba80',
        cellCssClass: 'vacation-booked'
    }];
}

mobiscroll.util.http.getJson('https://trial.mobiscroll.com/getrentals/?year=' + now.getFullYear() + '&month=' + now.getMonth(), function (data) {
    var prices = data.prices;
    var bookings = data.bookings;
    var labels = [];
    var invalids = [];
    var colors = [];
    var endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0);

    for (var i = 0; i < prices.length; ++i) {
        var price = prices[i];
        var booked = bookings.find(function (b) { return formatDate('YYYY-M-D', new Date(b.checkIn)) === price.date; });
        if (booked) {
            var checkIn = new Date(booked.checkIn);
            var checkOut = new Date(booked.checkOut);
            var newCheckOut = new Date(checkOut.getFullYear(), checkOut.getMonth(), checkOut.getDate() - 1);
            colors = colors.concat(getColors(checkIn, checkOut));
            labels.push({
                start: checkIn,
                end: newCheckOut,
                text: 'booked',
                textColor: '#888'
            });
            invalids.push({
                start: checkIn,
                end: newCheckOut
            });
            endDate = checkOut;
        } else if (new Date(price.date) >= endDate) {
            labels.push({
                date: new Date(price.date),
                text: price.text,
                textColor: price.textColor
            });
        }
    }
    myCalendar.setOptions({ labels: labels, invalid: invalids, colors: colors.concat(monthColors) });
}, 'jsonp');