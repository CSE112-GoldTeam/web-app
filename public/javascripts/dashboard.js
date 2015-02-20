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


