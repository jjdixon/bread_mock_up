
var desiredURL = "images/desiredStar.png";
var executedURL = "images/executedStar.png";
var starOffset = 14;

var goldenPath = { "Breakfast Meats": [52,194], "Cream Cheese": [52,120], "OJ": [73,120], "Milk-Table": [122,41], "Milk-Breakfast": [154,41], "Eggs-Table": [262,45], "Eggs-Perimeter": [282,14], "Fresh Meats-Thin": [410,45],
					"Fresh Meats-Bun": [493,45], "Sliced Meats-Thin": [532,40], "Sliced Meats-Bun": [564,40], "Delicatessen-Thin": [606,70], "Delicatessen-Bun": [606,119], "Promo End Cap": [300,84], "Prepared Meats": [576,154]
					
 };

$(document).on('ready', function(){
	

  $('input[value="last_4_weeks"]').trigger('click');
 // $('#priorities').trigger('click');
	
 setTimeout(function() {
        $("#priorities").trigger('click');
    },5);
	
	
	/*var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");
	var x = 0;
	var y = 0;
	while( x < 640){
		ctx.beginPath();
		ctx.moveTo(x,0);
		ctx.lineTo(x,480);
		ctx.stroke();
		x=x+10;
	}
	while(y < 480){
		ctx.beginPath();
		ctx.moveTo(0,y);
		ctx.lineTo(640,y);
		ctx.stroke();
		y=y+10;
	
	}*/
	intializePermanentDisplayTable();
	loadJSON('data/mainstream.json');
});
 		


function log(msg) {
  setTimeout(function() {
    throw new Error(msg);
  }, 0);
}


function formWorkWithTable(data) {
	var rows_t1=[];
	var rows_t2=[];
	var prod,cat,seg,mc,onhands,net,ret,retu,netdol,lin, row_html;
	var line = 0;
	var blank_row = '<tr><td colspan="8" style="line-height:19px;">&nbsp;</td></tr>'
	var table1_lines = 0;
	var table2_lines = 0;
	var next_table = true;
	var table1_blanks = 0;
	var table2_blanks = 0;
	var first = true;
	if(data){
		data.forEach(function(product){
		prod = product.Prod;
		cat = product.Cat;
		seg = product.Seg;
		mc = product.MC;
		onhands = product["On Hands"];
		net = product.Net
		ret = product.Ret
		retu = product.RetU
		netdol = product.NetDol
		lin = product.Lin
		table = product.Table
		if((table==2) && first) { 
		
		next_table = false;
		first = false;
		}
		
		if((table == 1) && (prod =="SEG")){
		table1_blanks++;
		}
		else if((table == 2) && (prod=="SEG")){
		table2_blanks++;
		}
		
		row_html = ((prod == "SEG") ? (((line != 0) && next_table) ? blank_row+'<tr class="seg-row"><td class = "seg-cell">'+seg : '<tr class="seg-row"><td class = "seg-cell">'+seg+'</td>' ) : '<tr><td>'+prod)+'</td>'+
		'<td><input class="workwithinput" type="text"></td>'+
		'<td>'+net+'</td>'+
		'<td>'+ret+'</td>'+
		'<td>'+retu+'</td>'+
		'<td id="'+"net"+table+line+'">'+netdol+'</td>'+
		'<td><input class="workwithinput linear" type="text" id="'+"lin"+table+line+'" value="0"></td>'+
		'<td id="'+"linper"+table+line+'">'+'0'+'</td></tr>'
		
		if(line<25 && table == 1){
		rows_t1.push(row_html);
		}
		else {
		rows_t2.push(row_html);
		}
		if(table == 1) {
		table1_lines++;
		}
		else {
		table2_lines++;
		}
		line++;
		next_table =true
		});
		
	}
	//console.log(table1_lines,table1_blanks,table2_lines,table2_blanks)
	if((table1_lines+table1_blanks) < (table2_lines+table2_blanks)){
	for(i=table1_lines+table1_blanks; i < table2_lines+table2_blanks; i++){
	rows_t1.push(blank_row);
	}
	}
	else if((table1_lines+table1_blanks) > (table2_lines+table2_blanks)){
	for(x=table2_lines+table2_blanks; x < table1_lines+table1_blanks; x++){
	rows_t2.push(blank_row);
	}
	}
	return [rows_t1.join(),rows_t2.join()]
}

function formTableData(data) {
  var rows = [];
  var zeroScan = " zeroscan";
  var zeroGross = " zerogross";
  var firstPn = 0;
  var firstBL2 = 0;
  var firstPL4 = 0;
  var firstBL4 = 0;
  var num = 0;

  if(data){
    data.forEach(function(product){
      var name, level, pl_4, bl_4, bl_2, pn, upc, row_html;
      var zeroIssue = "";
	
	  num = Math.floor((Math.random() * 100));

      pl_4 = product["Product Level 4"];
      bl_4 = product["Brand Level 4"];
      bl_2 = product["Brand Level 2"];
      pn = product["Product Name"];
     // upc = product["UPC 10"];
      if(pn){
   
          name = pn;
          level = 4;
          firstPn = firstPn + 1;

        
   
      } else if(bl_2) {
        name = bl_2;
        level = 3;
        firstBL2 = firstBL2 + 1;
      } else if(bl_4) {
        name = bl_4;
        level = 2;
        firstBL4 = firstBL4 + 1;
      } else if(pl_4){
        name = pl_4;
        level = 1;
        firstPL4 = firstPL4 + 1;
      } else {
        return;
      }

      if( ( (level == 4) && (firstPn == 3) ) || ( (level == 3) && (firstBL2 == 1) ) || ( (level ==2) && (firstBL4 == 1) ) || ((level == 1) && (firstPL4 == 1))){
        zeroIssue = zeroScan;
        //log("test1"+ zeroIssue);
      }
      if( ((level == 4) && (firstPn == 30)) || ((level == 3) && (firstBL2 == 8)) || ((level ==2) && (firstBL4 == 5)) || ((level == 1) && (firstPL4 == 2))){
        zeroIssue = zeroGross;
      }
      if(name == "Totals"){
        row_html = '<tr class="level" data-level="'+level+'">'+
        '<td></td>'+
        '<td class="category'+zeroIssue+'"><a href="#graph" rel="modal:open">'+name+'</a></td>'+
        '<td class="unit-mix">'+product.mix+'</td>'+
        '<td class="avg-net">'+product.average+'</td>'+
        '<td class="nu-growth">'+product.growth+'</td>'+
        '<td class="ret">'+product.returnPercent+'</td>'+
        '<td class="avg-ret">'+product.returnUnits+'</td>'+
        //'<td class="vcm-nu">'+product.vcm+'</td>'+
        '<td class="five-day-order">--</td>'+
        '<td class="day-order">-</td>'+
        '<td class="day-order">-</td>'+
        '<td class="day-order">-</td>'+
        '<td class="day-order">-</td>'+
        '<td class="day-order">-</td>'+
        '<td class="issues-last-visit"></td>'+
        '<td class="issues-today"></td>'+
        '<td class="on-hand"></td>'+
        '</tr>';
      }
      else{
        row_html = '<tr class="level" data-level="'+level+'">'+
        '<td><button class="btn btn-default btn-expand"><span class="glyphicon glyphicon-plus"></span></button></td>'+
        '<td class="category'+zeroIssue+'"><a href="#graph" rel="modal:open">'+name+'</a></td>'+
        '<td class="unit-mix">'+product.mix+'</td>'+
        '<td class="avg-net">'+product.average+'</td>'+
        '<td class="nu-growth">'+product.growth+'</td>'+
        '<td class="ret">'+product.returnPercent+'</td>'+
        '<td class="avg-ret">'+product.returnUnits+'</td>'+
        //'<td class="vcm-nu">'+product.vcm+'</td>'+
        '<td class="five-day-order" style="background-color: #339933;">'+num+'</td>'+
        '<td class="day-order" style="background-color: #339933;">'+Math.ceil((num * 0.15))+'<br>15%</td>'+
        '<td class="day-order" style="background-color: #339933;">'+Math.ceil((num * 0.20))+'<br>20%</td>'+
        '<td class="day-order" style="background-color: #339933;">'+Math.ceil((num * 0.15))+'<br>15%</td>'+
        '<td class="day-order" style="background-color: #339933;">'+Math.ceil((num * 0.15))+'<br>15%</td>'+
        '<td class="day-order" style="background-color: #339933;">'+Math.ceil((num * 0.35))+'<br>35%</td>'+
        ((((firstPL4 == 1)|| (firstBL4 == 1) || (firstBL2 == 1)) && (firstPn < 2)) ? '<td><button type="button" class="btn btn-default" data-container="body" data-toggle="popover" data-placement="left" data-content="OOS: No OOC: Yes Comment: Shelf looks great" data-original-title="" title="">Yes</button></td>' : '<td></td>')+
        // '<td class="issues-last-visit"><button type="button" class="btn btn-default" data-container="body" data-toggle="popover" data-placement="left" data-content="OOS: Yes; Out of Code: Yes; Comment: Shelf condition poor.">Yes</button></td>'+
        '<td class="issues-today">'+((level == 4) ? '<button type="button" data-toggle="modal" data-target="#issue" style="color:#000000">Add</button>' : "" )+'</td>'+
        '<td class="on-hand">'+((level == 4) ? '<input type="number" name="onhands" value="0" maxlength="4" style="width:60px;color:#000000" >' : "" )+'</td>'+
        '</tr>';
      }
      rows.push(row_html);
    });
    return rows.join();
  } else {
    return '<tr class="level" data-level="1"><td colspan="12" style="text-align: center;">No Data</td></tr>';
  }
}

function loadJSON(url){
	var json;
	if(location.host) {
	$.ajax({
		type: "GET",
		datatype: "json",
		url: url,
		success: function(data) {
			var tables = formWorkWithTable(data);
		
			$('#MSleft tbody').empty().append(tables[0]);
			$('#MSright tbody').empty().append(tables[1]);
		},
		error: function err() {
		
		}
		});
	}
}

$(document).on('change', '.filter-radio', function(e) {
  var json;
  if(location.host) {
    var url = "data/"+ $(this).val() +".json";
    $.ajax({
      type: "GET",
      dataType: "json",
      url: url,
      success: function(data)  {
        $('#main-table tbody').empty().append(formTableData(data));       
        $('[data-toggle="popover"]').popover();
		//$("table").freezeHeader();
      },
      error: function(err) {
        //Call with empty string to put No Data
        $('#main-table tbody').empty().append(formTableData(""));
		
		$('[data-toggle="popover"]').popover();
      }
    });

  } else {
    json = data[$(this).val()];
    $('#main-table tbody').empty().append(formTableData(json));
  }
});

//Toggle the five day order and day order columns
$(document).on('change', '.order-radio', function(e) {
  //used to output to console so i know that i got here
  log("got here");
  //$("#five-day").toggle("five-day-order");



  // $(".five-day-order").toggle();
  // $(".day-order").toggle();

  $('#main-table').toggleClass('show-prompt-order');

  //var cols = document.getElementsByClassName('five-day-order');
  //for(i=0; i < cols.length; i++){
  //if(cols[i].style.display == "inline"){
  //cols[i].style.display = 'none';
  //	}
  //else {
  //	cols[i].style.display = 'inline';
  //}
  //}
  //var orders = document.getElementsByClassName('day-order');
  //for(i=0; i < orders.length; i++){
  //if(order[i].style.display == "none"){
  //orders[i].style.display = 'inline';
  //}
  //else{
  //orders[i].style.display = 'none';
  //}
  //}
});


$(document).on('click', '.btn-expand', function(e) {
  e.preventDefault();

  var row, button, level, level_selector, next_level, status;

  button = $(this);
  status = button.find('span').hasClass('glyphicon-plus') ? 'opening' : 'closing';
  button.find('span').toggleClass('glyphicon-plus glyphicon-minus');
  row = button.closest('.level');
  level = row.data('level');
  level_selector = '[data-level='+level+']';
  next_level = '[data-level='+(level+1)+']';

  // if opening find all next level rows until it hits a row with the same level
  // ie if the row is level 2, find all level 3 rows until the next level 2

  //if closing see if the next row of the same level exists, if not, find the next available row that exists
  //find all rows with lower levels before it hits any with a higher level
  //ie if the row level is 2, find all rows with levels 3 and 4 until it hits another 2, unless it hits a 1 first
  //if the level is 3, find all 4s until another 3 unless it hits a 2 or 1 first
  if(status === "opening") {
    row.nextUntil(level_selector,next_level).show();
  } else {
    for(var i=level;i > 0;i--){
      level_selector += ',[data-level='+i+']';
    }
    var rows = row.nextUntil(level_selector);
    rows.find('.btn-expand .glyphicon-minus').toggleClass('glyphicon-plus glyphicon-minus');
    rows.hide();
  }
});

$(document).on('click', '#workview', function(e) {
	//document.getElementById("tabs").toggleClass('hidden');
	$('#tabs').toggleClass('hidden');
	$('#shelfdata').toggleClass('hidden');
	//document.getElementById("shelfdata").toggleClass('hidden');
});

$(document).on('click', '#normalview', function(e) {
	//document.getElementById("tabs").toggleClass('hidden');
	$('#tabs').toggleClass('hidden');
	$('#shelfdata').toggleClass('hidden');
	//document.getElementById("shelfdata").toggleClass('hidden');
});

function closewindow() {   
	$.modal.close();
    return false;
}

/** OLD GOLDEN PATH 
$(document).on('change', '#desired', function(e) {
document.getElementById("goldenpath").src="images/Golden_Path_2.jpg";
});
$(document).on('change', '#executed', function(e) {
document.getElementById("goldenpath").src="images/Golden_Path_3.jpg";
});*/

 $(document).on('click', '#addrow_permanent', function(e) {
newhtml= '<tr><td><select class="form-control"><option>Select Type</option><option>Premium Bread Display</option><option>Main Stream Bread Display'+
'</option><option>Breakfast Display</option><option>Box Cake Display</option><option>IWP Cake Disay</option><option>Thin/Bun Display</option>'+
'<option>Roll Display</option><option>Combination</option></select></td><td><select class="form-control"><option>Select Location</option>'+
'<option>Cream Cheese</option><option>Deli Sliced Meats</option><option>Fresh Hamburger Meat</option><option>Hot Dogs</option>'+
'<option>Milk Section</option><option>Juice Section</option><option>Eggs / Bacon</option><option>Prepared Meals</option><option>Packaged Meats</option>'+
'</select></td><td><div class="input-group" style="margin: 0 auto;">     <input id="desired" type="checkbox"></div></td><td>'+
'<div class="input-group" style="margin: 0 auto;"><input id="executed" type="checkbox"></div></td><td style="text-align: center;vertical-align:middle;">'+
'<span class="glyphicon glyphicon-camera"></span></td></tr>';
$('#permanent-table tbody').append(newhtml);	
});

/***************************
FOR GENERATING GOLDEN PATH INTERACTIVE MAP
*****************************/

function intializePermanentDisplayTable(){
	var goldenHTML = "";
	for(i=0; i < 7; i++){
		goldenHTML +='<tr><td><select class="form-control"><option>Select Type</option><option>Premium Bread Display</option><option>Main Stream Bread Display</option><option>Breakfast Display</option><option>Box Cake Display</option>'+
		'<option>IWP Cake Disay</option><option>Thin/Bun Display</option><option>Roll Display</option><option>Combination</option></select></td><td><select class="form-control" id="location'+i+'"><option>Select Location</option>'+
		'<option>Breakfast Meats</option><option>Cream Cheese</option><option>OJ</option><option>Milk-Table</option><option>Milk-Breakfast</option><option>Eggs-Table</option><option>Eggs-Perimeter</option><option>Fresh Meats-Thin</option><option>Fresh Meats-Bun</option>'+
		'<option>Sliced Meats-Thin</option><option>Sliced Meats-Bun</option><option>Delicatessen-Thin</option><option>Delicatessen-Bun</option><option>Promo End Cap</option><option>Prepared Meats</option></select></td><td><div class="input-group" style="margin: 0 auto;">'+
		'<input class="desired" id="desired'+i+'" type="checkbox"></div></td><td><div class="input-group" style="margin: 0 auto;"><input class="executed" id="executed'+i+'" type="checkbox">'+
		'</div></td><td style="text-align: center;vertical-align:middle;"><span class="glyphicon glyphicon-camera"></span></td></tr>';
	}
	$('#permanent-table tbody').append(goldenHTML);
}

/*function returnLocation(e){
	var locID,location;
	var re = /\D+([0-9]+)/;
	currentID= $(this).attr('id');
	locID =  re.exec(currentID)[1];
	location = $('#location'+locID).val();
	return location;
}*/

/*Adding Desired Star*/
$(document).on('click','.desired', function(e){
	var locID,location;
	var re = /\D+([0-9]+)/;
	currentID= $(this).attr('id');
	locID =  re.exec(currentID)[1];
	location = $('#location'+locID).val();
	
	if($(this).prop('checked') && (document.getElementById(location+'desired') == null)){
	var x = goldenPath[location][0]-14;
	var y = goldenPath[location][1]-14;
	document.getElementById("golden").innerHTML += '<img class="" src="'+desiredURL+'" id="'+location+'desired" style= "position:absolute;top:'+y+'px;left:'+x+'px;" />';
	}
	//else if(document.getElementById(location+'desired').classList.contains("hidden")){
	//document.getElementById(location+'desired').classList.remove("hidden");
	//}
	else{
	
	document.getElementById(location+'desired').classList.toggle("hidden");
	}
	
});

/*Adding Executed Star*/
$(document).on('click','.executed', function(e){
	var locID,location;
	var re = /\D+([0-9]+)/;
	currentID= $(this).attr('id');
	locID =  re.exec(currentID)[1];
	location = $('#location'+locID).val();
	
	//If desired is check, uncheck it.
	if ($('#desired'+locID).prop('checked')) { 
	$('#desired'+locID).prop('checked',false);
	//$('#'+location+'desired').toggleClass('hidden');
	document.getElementById(location+'desired').classList.toggle("hidden");
	}
	
	if($(this).prop('checked') && (document.getElementById(location+'executed') == null)){
	var x = goldenPath[location][0]-14;
	var y = goldenPath[location][1]-14;
	document.getElementById("golden").innerHTML += '<img src="'+executedURL+'" id="'+location+'executed" style= "position:absolute;top:'+y+'px;left:'+x+'px;" />';
	}
		else{
	
	document.getElementById(location+'executed').classList.toggle("hidden");
	}
	
});

/*CUSTOM FUNCTIONALITY FOR WORK WITH*/
$(document).on('change','.linear',function(e){
	var re= /\D+([0-9]+)/;
	var id = re.exec($(this).attr('id'));
	var netdollars = document.getElementById('net'+id[1]).innerHTML;
	var linearft = document.getElementById('lin'+id[1]).value;
	console.log(linearft,parseInt(linearft),netdollars,parseInt(netdollars),$('#lin'+id).val();
	document.getElementById("linper"+id[1]).innerHTML = (parseInt(netdollars)/parseInt(linearft)).toFixed(2);
});

