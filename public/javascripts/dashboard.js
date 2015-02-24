function dateToString(date) {
	var monthNames = [ "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December" ];
    var month = date.getMonth() ;
    var day = date.getDate();
    var dateOfString = (("" + month).length < 2 ? "" : "") +  monthNames[month] + " ";
    dateOfString += (("" + day).length < 2 ? "0" : "") + day + " ";
    dateOfString += date.getFullYear();
    return dateOfString;


}
function getDate(){
	var currentdate = new Date();
	var datetime= "";
	datetime += dateToString(currentdate );;

	console.log("Date: " + datetime);
	$header = $('<h1/>');
	$header.append(datetime);
	$('#currentDate').replaceWith($header);
}
function startTime() {
    var today=new Date();
    var h=today.getHours();
    var m=today.getMinutes();
    var s=today.getSeconds();
    var dn="AM";
	if (h>12){
		dn="PM";
		h=h-12;
	}
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('txt').innerHTML = "Current Time: " +h+":"+m+":"+s+ " "+ dn;
    var t = setTimeout(function(){startTime()},500);
}

function checkTime(i) {
    if (i<10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}


function poll() {
    setTimeout(function(){
        $('#tblBody').empty();
        //var cols=['1','Test ','views','9:30 am', 'Roomed','checkbox','img'];
        $.get("/api/appointments", function( data ){
            console.log("Appintment Data: " + data[1].fname);

            var hours,minutes,appTime;
            for(var i=0; i<data.length; i++){
                $img = $('<img id="Image" src="http://placehold.it/50x50" />');
                $form = $('<a href="/viewform/'+data[i].business+'">View Forms</a>');
                var appDate = new Date(data[i].date);
                hours = ("0"+appDate.getHours()).slice(-2); //returns 0-23
                minutes = ("0"+appDate.getMinutes()).slice(-2); //returns 0-59
                appTime = hours+":"+minutes;
                
                
                if (data[i].state == 'checkedIn'){
                    $check = $('<input type= checkbox>');
                    var cols = [i+1,data[i].fname + " " + data[i].lname,$form,appTime,data[i].state,$check,$img];
                }
                else{
                    var cols = [i+1,data[i].fname + " " + data[i].lname,$form,appTime,data[i].state,,$img];
                }
                
                insRow(cols);
            }
      
               
            
        });

        poll();
    },2000);//checks every 1000 millisecond
}

// JQuery Insert Row
function insRow(cols) {
  $row = $('<tr/>'); // Create a r

  // Loop through data
  for (var i = 0; i < cols.length; i++) {
    $col = $('<td/>'); // Create a column
    $col.append(cols[i]); // Append column data to column
    $row.append($col); // Append column to row
  }

  $('#tblBody').append($row); // Append to top of element using prepend
}