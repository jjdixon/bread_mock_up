$(document).on('ready', function() {
    $('input[value="custom"]').trigger('click');
});

function formTableData(data, custom) {
    var level, firstrow;
    var rows = [];
    firstrow = true;
    if (data) {
        data.forEach(function(tour) {
            var tour_name, customer_name, address, city, state, visits, time,type;
            tour_name = tour["Tour"];
            customer_name = tour["Customer_Name"];
            address = tour["Address"];
            city = tour["City"];
            state = tour["State"];
            visits = tour["# of Visits"];
            time = tour["Serve Time"];
			type = tour["Type"];
            if (customer_name == "-----------------") {
                firstrow = true;
                level = 1;
            } else {
                level = 2;
            }
            if (custom) {
                if (!firstrow) {
                    row_html = '<tr class="level" data-level="1">' + '<td class="select"> <input type="checkbox"> </td>' + '<td class="customer_name">' + customer_name + '</td>' + '<td class="address">' + address + '</td>' + '<td class="city">' + city + '</td>' + '<td class="state">' + state + '</td>' + '<td class="visits">' + visits + '</td>' + '<td class="time">' + time + '</td><td>' +type+ '</td><td> </td></tr>';
                    rows.push(row_html);
                }
                firstrow = false;
            } else {
                row_html = '<tr class="level" data-level="' + level + '">' + ((level == 1) ? '<td> <button class="btn btn-default btn-expand"><span class="glyphicon glyphicon-plus"></span></button></td>' : '<td> </td>') + '<td class="tour_name">' + tour_name + '</td>' + '<td class="customer_name">' + customer_name + '</td>' + '<td class="address">' + address + '</td>' + '<td class="city">' + city + '</td>' + '<td class="state">' + state + '</td>' + '<td class="visits">' + visits + '</td>' + '<td class="time">' + time + '</td>' + '</tr>';
                firstrow = false;
                rows.push(row_html);
            }
        });
        return rows.join();
    } else {
        return '<tr class="level" data-level="1"><td colspan="12" style="text-align: center;">No Data</td></tr>';
    }
}
$(document).on('change', '.filter-radio', function(e) {
    var json;
    var boo;
    if (location.host) {
        if ($(this).val() == "custom") {
            row_html = '<th style="text-align:center; border: 1px solid black;">Select</th>' + '<th style="text-align:center; border: 1px solid black;">Customer</th>' + '<th style="text-align:center; border: 1px solid black;">Address</th>' + '<th style="text-align:center; border: 1px solid black;">City</th>' + '<th style="text-align:center; border: 1px solid black;">State</th>' + '<th style="text-align:center; border: 1px solid black;">Vists Per Month</th>' + '<th style="text-align:center; border: 1px solid black;">Last Visit</th><th>Visit Type</th><th>Comments</th>';
            $('#main-table thead').empty().append(row_html);
            boo = true;
            var url = "data/alpha.json";
        } else {
            row_html = '<th style="text-align:center; border: 1px solid black;">+/-</th>' + '<th style="text-align:center; border: 1px solid black;">Tour</th>' + '<th style="text-align:center; border: 1px solid black;">Customer</th>' + '<th style="text-align:center; border: 1px solid black;">Address</th>' + '<th style="text-align:center; border: 1px solid black;">City</th>' + '<th style="text-align:center; border: 1px solid black;">State</th>' + '<th style="text-align:center; border: 1px solid black;">Frequency</th>' + '<th style="text-align:center; border: 1px solid black;">Last Visit</th>';
            $('#main-table thead').empty().append(row_html);
            boo = false;
            var url = "data/tours.json";
        }
        $.ajax({
            type: "GET",
            dataType: "json",
            url: url,
            success: function(data) {
                $('#main-table tbody').empty().append(formTableData(data, boo));
            },
            error: function(err) {
                $('#main-table tbody').empty().append(formTableData("", boo));
            }
        });
    } else {
        json = data[$(this).val()];
        $('#main-table tbody').empty().append(formTableData(json, boo));
    }
});
$(document).on('click', '.btn-expand', function(e) {
    e.preventDefault();
    var row, button, level, level_selector, next_level, status;
    button = $(this);
    status = button.find('span').hasClass('glyphicon-plus') ? 'opening' : 'closing';
    button.find('span').toggleClass('glyphicon-plus glyphicon-minus');
    row = button.closest('.level');
    level = row.data('level');
    level_selector = '[data-level=' + level + ']';
    next_level = '[data-level=' + (level + 1) + ']';
    if (status === "opening") {
        row.nextUntil(level_selector, next_level).show();
    } else {
        for (var i = level; i > 0; i--) {
            level_selector += ',[data-level=' + i + ']';
        }
        var rows = row.nextUntil(level_selector);
        rows.find('.btn-expand .glyphicon-minus').toggleClass('glyphicon-plus glyphicon-minus');
        rows.hide();
    }
});
$(document).on('click', 'tr', function(e) {
    if ($('input[value="predefined"]').checked) {
        if ($(this).hasClass('selected')) {
            $('tr.selected').removeClass('selected');
        } else {
            $('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    } else {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            $(this).addClass('selected');
        }
    }
});

$(document).on('click', '.btn-success', function(e) {
	$('.hidden').removeClass('hidden');
});

$(document).on('click', '.update', function(e) {
	$('#addstop').addClass('hidden');
});

$(document).on('click','.walmart',function(e){
	$('#storePic').attr('src','images/mod_store.png');
});

$(document).on('click','.normalStore',function(e){
	$('#storePic').attr('src','images/normal_store.png');
});