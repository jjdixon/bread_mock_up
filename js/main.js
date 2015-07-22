	var today = new Date();
	var tomorrow = new Date(today);
	tomorrow.setDate(today.getDate()+1);
$(document).on('ready', function() {
    $('input[value="predefined"]').trigger('click');

	//document.getElementById('date').innerHTML += today.toDateString();
	  $('#banner-fade').bjqs({
            height      : 320,
            width       : 620,
			automatic 	: false,
			showcontrols : false,
            responsive  : true
          });
		  
	 $('[data-toggle="tooltip"]').tooltip()	  
	 loadSurveyJSON('data/surveys.json','surveys_open');
	  loadSurveyJSON('data/surveys.json','surveys_closed');
	  loadPricingJSON('data/pricing.json','pricing_table');
});


function formTableData(data, custom, alltours,simulateDate) {
    var level, firstrow, tourName;
    var rows = [];
	var switchNum = 0;
    firstrow = true;
    if (data) {
        data.forEach(function(tour) {
            var tour_name, customer_name, address, city, state, visits, time;
            tour_name = tour["Tour"];
            customer_name = tour["Customer_Name"];
            address = tour["Address"];
            city = tour["City"];
            state = tour["State"];
            visits = tour["# of Visits"];
            time = tour["Serve Time"];
            if (customer_name == "-----------------") {
                firstrow = true;
                level = 1;
            } else {
                level = 2;
            }
            if (custom) {
                if (!firstrow) {
                    row_html = '<tr class="level" data-level="1">' + '<td class="select"> <input type="checkbox"> </td>' + '<td class="customer_name">' + customer_name + '</td>' + '<td class="address">' + address + '</td>' + '<td class="city">' + city + '</td>' + '<td class="state">' + state + '</td>' + '<td class="visits">' + visits + '</td>' + '<td class="time">' + time + '</td>' + '</tr>';
                    rows.push(row_html);
                }
                firstrow = false;
            } else {
				if(alltours){
				row_html = '<tr class="level" data-level="' + level + '">' + ((level == 1) ? '<td> <button class="btn btn-default btn-expand"><span class="glyphicon glyphicon-plus"></span></button></td>' : '<td> </td>') + '<td class="tour_name">' + tour_name + '</td>' + '<td class="customer_name">' + customer_name + '</td>' + '<td class="address">' + address + '</td>' + '<td class="city">' + city + '</td>' + '<td class="state">' + state + '</td>' + '<td class="visits">' + visits + '</td>' + '<td class="time">' + time + '</td>' + '</tr>';
                firstrow = false;
                rows.push(row_html);
				}
				else{
				
				switchNum = today.getDay() + simulateDate;
				console.log(switchNum);
				switch (switchNum) {
				case 1: tourName = "M"; break;
				case 2: tourName = "R"; break;
				case 3: tourName = "T"; break;
				case 4: tourName = "W"; break;
				default: tour = "M";
				}
				console.log(tourName);
				if(tour_name == tourName){
                row_html = '<tr class="level" data-level="' + level + '">' + ((level == 1) ? '<td> <button class="btn btn-default btn-expand"><span class="glyphicon glyphicon-plus"></span></button></td>' : '<td> </td>') + '<td class="tour_name">' + tour_name + '</td>' + '<td class="customer_name">' + customer_name + '</td>' + '<td class="address">' + address + '</td>' + '<td class="city">' + city + '</td>' + '<td class="state">' + state + '</td>' + '<td class="visits">' + visits + '</td>' + '<td class="time">' + time + '</td>' + '</tr>';
                firstrow = false;
                rows.push(row_html);
				}
				}
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
            row_html = '<th style="text-align:center; border: 1px solid black;">Select</th>' + '<th style="text-align:center; border: 1px solid black;">Customer</th>' + '<th style="text-align:center; border: 1px solid black;">Address</th>' + '<th style="text-align:center; border: 1px solid black;">City</th>' + '<th style="text-align:center; border: 1px solid black;">State</th>' + '<th style="text-align:center; border: 1px solid black;">Vists Per Month</th>' + '<th style="text-align:center; border: 1px solid black;">Service Time</th>';
            $('#main-table thead').empty().append(row_html);
            boo = true;
            var url = "data/alpha.json";
        } else {
            row_html = '<th style="text-align:center; border: 1px solid black;">+/-</th>' + '<th style="text-align:center; border: 1px solid black;">Tour</th>' + '<th style="text-align:center; border: 1px solid black;">Customer</th>' + '<th style="text-align:center; border: 1px solid black;">Address</th>' + '<th style="text-align:center; border: 1px solid black;">City</th>' + '<th style="text-align:center; border: 1px solid black;">State</th>' + '<th style="text-align:center; border: 1px solid black;">Visits Per Month</th>' + '<th style="text-align:center; border: 1px solid black;">Service Time</th>';
            $('#main-table thead').empty().append(row_html);
            boo = false;
            var url = "data/tours.json";
        }
        $.ajax({
            type: "GET",
            dataType: "json",
            url: url,
            success: function(data) {
                $('#main-table tbody').empty().append(formTableData(data, boo, false,0));
            },
            error: function(err) {
                $('#main-table tbody').empty().append(formTableData("", boo,false,0));
            }
        });
    } else {
        json = data[$(this).val()];
        $('#main-table tbody').empty().append(formTableData(json, boo,false,0));
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

$(document).on('click', '#showtours', function(e) {
    var json;
    var boo;
    if (location.host) {
     
            row_html = '<th style="text-align:center; border: 1px solid black;">+/-</th>' + '<th style="text-align:center; border: 1px solid black;">Tour</th>' + '<th style="text-align:center; border: 1px solid black;">Customer</th>' + '<th style="text-align:center; border: 1px solid black;">Address</th>' + '<th style="text-align:center; border: 1px solid black;">City</th>' + '<th style="text-align:center; border: 1px solid black;">State</th>' + '<th style="text-align:center; border: 1px solid black;">Visits Per Month</th>' + '<th style="text-align:center; border: 1px solid black;">Service Time</th>';
            $('#main-table thead').empty().append(row_html);
            boo = false;
            var url = "data/tours.json";
        
        $.ajax({
            type: "GET",
            dataType: "json",
            url: url,
            success: function(data) {
                $('#main-table tbody').empty().append(formTableData(data, boo, true,0));
            },
            error: function(err) {
                $('#main-table tbody').empty().append(formTableData("", boo,true,0));
            }
        });
    } else {
        json = data[$(this).val()];
        $('#main-table tbody').empty().append(formTableData(json, boo, true,0));
    }
});

$(document).on('click', '#simulate', function(e) {
    var json;
    var boo;
	document.getElementById('date').innerHTML = "Today is " + tomorrow.toDateString();
    if (location.host) {
     
            row_html = '<th style="text-align:center; border: 1px solid black;">+/-</th>' + '<th style="text-align:center; border: 1px solid black;">Tour</th>' + '<th style="text-align:center; border: 1px solid black;">Customer</th>' + '<th style="text-align:center; border: 1px solid black;">Address</th>' + '<th style="text-align:center; border: 1px solid black;">City</th>' + '<th style="text-align:center; border: 1px solid black;">State</th>' + '<th style="text-align:center; border: 1px solid black;">Visits Per Month</th>' + '<th style="text-align:center; border: 1px solid black;">Service Time</th>';
            $('#main-table thead').empty().append(row_html);
            boo = false;
            var url = "data/tours.json";
        
        $.ajax({
            type: "GET",
            dataType: "json",
            url: url,
            success: function(data) {
                $('#main-table tbody').empty().append(formTableData(data, boo, false,1));
            },
            error: function(err) {
                $('#main-table tbody').empty().append(formTableData("", boo,false,1));
            }
        });
    } else {
        json = data[$(this).val()];
        $('#main-table tbody').empty().append(formTableData(json, boo, false,1));
    }
});

/*******************
CREATE SURVEY TABLES
******************/
function loadSurveyJSON(url,tableID){
	var json;
	$.ajax({
		type: "GET",
		datatype: "json",
		url: url,
		success: function(data) {
			var tableHTML = formSurveyTable(data);
			
			$('#'+tableID+' tbody').empty().append(tableHTML);
		},
		error: function  err() {
		console.log("json failed");
		}
		});
		
}

function loadPricingJSON(url,tableID){
	var json;
	$.ajax({
		type: "GET",
		datatype: "json",
		url: url,
		success: function(data) {
			var tableHTML = formPricingTable(data);
			
			$('#'+tableID+' tbody').empty().append(tableHTML);
		},
		error: function  err() {
		console.log("json failed");
		}
		});
		
}

function formSurveyTable(data){
	var tableHTML;
	var rows=[];
	
	if(data){
		data.forEach(function(entry){
		tableHTML = '<tr><td><a href='+((entry.Type == "Tracker") ? '"comacsurvey.html">' : '"pricesurvey.html">')+entry.Title+'</a></td><td>'+entry.Type+'</td><td>'+entry.Start_Date+'</td><td>'+entry.Close_Date+
		'</td><td>'+entry.Author+'</td></tr>';
		rows.push(tableHTML);
		});
	}
	return rows.join();
}

function formPricingTable(data){
	var tableHTML;
	var rows=[];
	
	if(data){
		data.forEach(function(entry){
		tableHTML = '<tr><td>'+entry.company+'</td><td>'+entry.Item+'</td><td>'+entry.price+'</td><td><select class="input-control"><option>Select Type</option>'+
		'<option>Feature</option> <option>TPR</option><option>EDLP</option></select></td></tr>';
		rows.push(tableHTML);
		});
	}
	return rows.join();
}



