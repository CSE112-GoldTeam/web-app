
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

function table() {
    $.get("/api/employee/"+"54ecaa24fb4974129dc2050d"+"/appointments/today", function( data ){
        $('#tblBody').empty();
        //current time to comare with database time to display in dashbaord
        var currDate = new Date();
        var curryear = currDate.getFullYear();
        var currmonth = currDate.getMonth()+1;
        var currdate =  currDate.getDate();
        var count = 0;
        //empty's the table 
        $('#tblBody').empty();
        //for loop to reload the table 
        for(var i=0; i<data.length; i++){
            $img = $('<img id="Image" src="http://placehold.it/50x50" />');
            var dbDate = new Date(data[i].date);
            //console.log("dbDate: "+dbDate.toISOString());
            var year = dbDate.getFullYear();
            var month = dbDate.getMonth()+1;
            var date =  dbDate.getDate();
            count++;
            var appDate = new Date(data[i].date);
            //parsing to get time
            var fhours = appDate.getHours();
            //console.log(fhours/12);
            if(fhours/12 < 1){
              var hours = ("0"+appDate.getHours()).slice(-2); //returns 0-
              var minutes = ("0"+appDate.getMinutes()).slice(-2); //returns 0-59
              var appTime = hours+":"+minutes + " AM";
             } 
             else{
              var pmHours = appDate.getHours()%12;

              if(pmHours === 0)
                pmHours = 12;

              var hours = ("0"+pmHours).slice(-2); //returns 0-
              var minutes = ("0"+appDate.getMinutes()).slice(-2); //returns 0-59
              var appTime = hours+":"+minutes + " PM";
            }   
            

            if (data[i].state == 'checkedIn' | data[i].state == 'roomed') {

                $form = $('<a href="/viewform/'+data[i]._id+'">View Forms</a>');

                if (data[i].state == 'checkedIn'){
                    $check = $('<input type="checkbox">').data("appid",data[i]._id);
                    $check.change(function(){
                        //console.log("updateState()");
                         $appid = $(this).data('appid');

                        $.ajax({
                            url :  '/api/appointments/'+$appid+'/state',
                            type : "PUT"
                        }).done(function( data ){
                            console.log("state changed: ");
                        })


                    
                    });

                    var cols = [count,data[i].fname + " " + data[i].lname,$form,appTime,data[i].state,$check,$img];
                }
                /**/
                else if(data[i].state == 'roomed') {    
                    $btn = $('<button class="btn btn-primary"><span class="glyphicon glyphicon-ok-sign" aria-hidden="true"></span></button>');
                     $btn.click(function() { 
                        console.log("this is not fun");
                        $.ajax({
                            url: '/api/appointments/'+data[i]._id+'/state',
                            type: "PUT",
                         }); 
                    });

                    var cols = [count,data[i].fname + " " + data[i].lname,$form,appTime,data[i].state,$btn,$img];

                }/**/
                else{
                    cols = [count,data[i].fname + " " + data[i].lname,$form,appTime,data[i].state,,$img];
                }
            }

            else {
                cols = [count,data[i].fname + " " + data[i].lname,,appTime,data[i].state,,$img];
            }
            
            insRow(cols);
        }//end of for loop       
          
    });//end of $get()
}//end of table()

function poll() {
    setTimeout(function(){
        table();

        poll();
    },1000);//checks every 1000 millisecond
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
