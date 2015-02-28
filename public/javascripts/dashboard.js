
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
    

        $.get("/api/appointments", function( data ){
            $('#tblBody').empty();
            //current time to comare with database time to display in dashbaord
            var currDate = new Date();
            var curryear = currDate.getFullYear();
            var currmonth = currDate.getMonth()+1;
            var currdate =  currDate.getDate();
            var count =0;
      
            console.log("Data results: " + data.length);
            
            $('#tblBody').empty();
            for(var i=0; i<data.length; i++){
                $img = $('<img id="Image" src="http://placehold.it/50x50" />');
                var dbDate = new Date(data[i].date);
                var year = dbDate.getFullYear();
                var month = dbDate.getMonth()+1;
                var date =  dbDate.getDate();
                 if (year==curryear && month == currmonth && date == currdate){
                    count++;
                    var appDate = new Date(data[i].date);
                    //parsing to get time
                    var hours = ("0"+appDate.getHours()).slice(-2); //returns 0-23
                    var minutes = ("0"+appDate.getMinutes()).slice(-2); //returns 0-59
                    var appTime = hours+":"+minutes;
                    if (data[i].state == 'checkedIn' | data[i].state == 'roomed') {

                        $form = $('<a href="/viewform/'+data[i]._id+'">View Forms</a>');

                        if (data[i].state == 'checkedIn'){
                            $check = $('<input type="checkbox">').data("appid",data[i]._id);
                            $check.change(function(){
                                console.log("updateState()");
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
                        else{
                            cols = [count,data[i].fname + " " + data[i].lname,$form,appTime,data[i].state,,$img];
                        }
                    }
                    else {
                        if (data[i].state == 'checkedIn'){
                            $check = $('<input type="checkbox">');
                            cols = [count,data[i].fname + " " + data[i].lname,,appTime,data[i].state,$check,$img];
                        }
                        else{
                            cols = [count,data[i].fname + " " + data[i].lname,,appTime,data[i].state,,$img];
                        }
                    }
                    
                    insRow(cols);
                }
            }       
              
        });
}

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
//business
    // "_id" : ObjectId("54eca953f2a2d47937757616"),
    // "companyName" : "Fred's Hospital",
    // "username" : "fred",
    // "password" : "password",
    // "email" : "fred@pickles.com",
    // "phone" : "(439) 203-3042",

//2nd business
    // "_id" : ObjectId("54eca979f2a2d47937757617"),
    // "companyName" : "Sacred Heart Hospital",
    // "username" : "kesling",
    // "password" : "password",
    // "email" : "thebigboss@example.com",
    // "phone" : "(895) 493-3042",




//employee
// "_id" : ObjectId("54ecaa24fb4974129dc2050c"),
//     "business" : ObjectId("54eca953f2a2d47937757616"),
//     "email" : "emily@shh.com",
//     "fname" : "Emily",
//     "lname" : "Hedges",
//     "password" : "password"
// }
// {
//     "_id" : ObjectId("54ecaa24fb4974129dc2050d"),
//     "business" : ObjectId("54eca953f2a2d47937757616"),
//     "email" : "bruce@shh.com",
//     "fname" : "Bruce",
//     "lname" : "Gordon",
//     "password" : "password"
// }
// {
//     "_id" : ObjectId("54ecaa5cfb4974129dc2050e"),
//     "business" : ObjectId("54eca979f2a2d47937757617"),
//     "email" : "trent@example.com",
//     "fname" : "Trent",
//     "lname" : "Andreas",
//     "password" : "password"
// }
// {
//     "_id" : ObjectId("54ecaa5cfb4974129dc2050f"),
//     "business" : ObjectId("54eca979f2a2d47937757617"),
//     "email" : "lisa@example.com",
//     "fname" : "Lisa",
//     "lname" : "Gordon",
//     "password" : "password"
// }






/////appointments
// {
//     "_id" : ObjectId("54ecb181fb4974129dc2057f"),
//     "business" : ObjectId("54eca953f2a2d47937757616"),
//     "employee" : ObjectId("54ecaa24fb4974129dc2050d"),
//     "date" : ISODate("2015-02-26T17:15:00Z"),
//     "fname" : "Frank",
//     "lname" : "St. John",
//     "dob" : "02/03/1986",
//     "email" : "Frank.St. John@example.com",
//     "state" : "scheduled"
// }
// {
//     "_id" : ObjectId("54ecb181fb4974129dc20580"),
//     "business" : ObjectId("54eca953f2a2d47937757616"),
//     "employee" : ObjectId("54ecaa24fb4974129dc2050c"),
//     "date" : ISODate("2015-02-26T18:30:00Z"),
//     "fname" : "Matt",
//     "lname" : "Swanson",
//     "dob" : "03/25/1989",
//     "email" : "Matt.Swanson@example.com",
//     "state" : "scheduled"
// }
// {
//     "_id" : ObjectId("54ecb181fb4974129dc20581"),
//     "business" : ObjectId("54eca953f2a2d47937757616"),
//     "employee" : ObjectId("54ecaa24fb4974129dc2050c"),
//     "date" : ISODate("2015-02-26T19:45:00Z"),
//     "fname" : "Mary",
//     "lname" : "Eide",
//     "dob" : "12/22/1961",
//     "email" : "Mary.Eide@example.com",
//     "state" : "scheduled"
// }
// {
//     "_id" : ObjectId("54ecb181fb4974129dc20582"),
//     "business" : ObjectId("54eca953f2a2d47937757616"),
//     "employee" : ObjectId("54ecaa24fb4974129dc2050d"),
//     "date" : ISODate("2015-02-26T20:15:00Z"),
//     "fname" : "Frank",
//     "lname" : "McDonald",
//     "dob" : "10/24/1989",
//     "email" : "Frank.McDonald@example.com",
//     "state" : "scheduled"
