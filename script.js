var oper = "";
var result = "";
var ip1 ="";
var ip2= "";
var currval = "";
var memory ="";
var cleardisplay = false;
var lastresult = "";
var lastchar = "";

var MAX_LENGTH = 17;

function overflowCheck(){
	if($("#memory").text().length >= MAX_LENGTH)
	{
		var memstr = $("#memory").text();
		memstr = memstr.slice(1);	//left shifting for display-overflow handling
		$("#memory").text(memstr);
	}		
}

//called from "ac" click()
function reset(){	
	ip1 = "";
	ip2 = "";
	currval = "";
	oper = "";
	result = "";
	lastresult = "";
	lastchar = "";
}


function convertToNum(num){
	
	num = num.toString();
	var decimalindex = num.indexOf(".");
	
	if( decimalindex === -1)
	{
		num = parseInt(num);
	}
	else{
		/*
		parseFloat takes care of 
		- no digits after decimal point condition
		- also drops trailing zeroes
		*/
		num = parseFloat(num);
	}
	
	return num;
}

function calculate(a,b,operation){
	
	a = convertToNum(a);
	b = convertToNum(b);
	
	switch(operation)
	{
		case "+" :	result = a+b;break;
		case "-" :	result = a-b;break;
		case "*" :	result = a * b;
					break;
		case "/" :	result = a/b; break;
	}
	
	// Max digit limit reached or not check
	if(result.toString().length > MAX_LENGTH)
	{
		result = result.toString();
		var dotindex = result.indexOf(".");
		
		if(dotindex !== -1)
		{		
			var no_of_decimal = MAX_LENGTH - result.substr(0,dotindex).length -1;
			result = Number(result).toFixed(no_of_decimal);
			result = parseFloat(result).toString();	// remove trailing zeroes
			//alert(MAX_LENGTH + " " + no_of_decimal);
		}
		else{
			result = "MAX_LIMIT"
		}	
	}	
	
	return result;
}

function display(){
	
	if(result === "MAX_LIMIT")
	{
		$("#answer").text("MAX DIGIT LIMIT");
		$("#memory").text("");			
	}
	else if(result === "")
	{
		$("#answer").text("0");
		$("#memory").append("0");			
	}	
	else{
		$("#answer").text(result);
		//$("#memory").append(result);
		lastresult = result;
	}
	
	cleardisplay = true;	
	ip1 = "";
	ip2 = "";
	currval = "";
	oper = "";
	result = "";
	lastchar = "";
}

$(document).ready(function(){
	
	//$("#test").text("ip1: " + ip1+ " ip2: " +ip2+ " oper: "+oper + " currval: "+currval + " result: "+ result + "last: "+ lastresult);	
	
	$(".show").click(function(){
		var currchar = $(this).text();
		
		if(cleardisplay === true)
		{
			$("#memory").text("");
			$("#answer").text("");

			cleardisplay = false;
		}
		
		/* No need to display number or decimal from here*/
		if($(this).hasClass("num") || $(this).attr("id") ==="decimal")
		{
			return;
		}	
		
		/* chaining result  */
		if(($("#memory").text() === "") && $(this).hasClass("operator"))
		{
			$("#memory").append(lastresult);
			overflowCheck();
		}
		
		/* consecutive operator input*/
		if( $(this).hasClass("operator") && (lastchar === "+" || lastchar === "-" || lastchar === "*" || lastchar === "/" )){
			var memstr = $("#memory").text();
		   	memstr = memstr.slice(0,-1);	// remove last operator char
			$("#memory").text(memstr);
		}
		
		/* = without any operand */
		if($("#memory").text() === "" && $(this).text()=== "="){
		 	currchar = "";  
		 }
		
		$("#memory").append(currchar);
		overflowCheck();		
	});
		
	$(".operator").click(function(){		
				
		if(lastchar === "+" || lastchar === "-" || lastchar === "*" || lastchar== "/")
		{
			lastchar= $(this).text();
			oper = lastchar;
			return;
		}	
		
		if(currval !== "")
		{	
			if(ip1 === "")
				ip1 = currval;
			else if (ip2 === "")
				ip2 = currval;
			
			currval = "";
		}
		else{
			ip1= lastresult;
		}	
			
		if(ip1!== null && ip2 !== null && oper)
		{
			result = calculate(ip1,ip2,oper);
			if(result !== "MAX_LIMIT"){
				ip1 = result;
				ip2="";
				oper = "";
				currval = "";
			}	
			else{
				$("#answer").text("MAX DIGIT LIMIT");
				$("#memory").text("");	
				reset();
				cleardisplay = true;	
				return;
			}
		}
		
		
		lastchar= $(this).text();
		oper = lastchar;
			
	$("#test").text("ip1: " + ip1+ " ip2: " +ip2+ " oper: "+oper + " currval: "+currval + " result: "+ result + "last: "+ lastresult);
	});
	
	$("#decimal").click(function(){
		
		var digit  = ".";
		lastchar 	 = ".";
		
		currval = currval.toString();
		if(currval.indexOf(".") === -1)
		{
			if(currval === ""){	
				currval = "0.";
				$("#memory").append(currval);
				overflowCheck();
			}	
			else{				
				currval = currval.concat(digit);	
				$("#memory").append(digit);
				overflowCheck();
			}	
		}	
	});
	
	$(".num").click(function(){
	
		var digit  = $(this).text();
		
		currval = currval.toString();	
		if(currval.indexOf(".") === -1 && currval === "0"){
			currval = "";
			var txt = $("#memory").text().slice(0,-1); // remove the 0
			$("#memory").text(txt);
		}
		
		if(currval.length > MAX_LENGTH)
		{
			reset();
			$("#answer").text("MAX DIGIT LIMIT");
			$("#memory").text("");	
			cleardisplay = true;
			return;
		}
		
		currval = currval.concat(digit);
		$("#memory").append(digit);
		overflowCheck();
		lastchar = digit;
		
//$("#test").text("ip1: " + ip1+ " ip2: " +ip2+ " oper: "+oper + " currval: "+currval + " result: "+ result + "last: "+ lastresult);
	});
	
	$("#eq").click(function(){
		
		if(lastchar === "=")
			return;	
		
		if(currval !== "")
		{		
			if(ip1 === "")
				ip1 = currval;
			else if(ip2 === "")
				ip2 = currval;
			currval ="";
		}	
				
		if(ip1 === "" && ip2 === "" && result ==="")
		{
			result=0;
			display();
		}
		else if(ip1 !== "" && ip2 !== "" && oper)
		{
			result = calculate(ip1,ip2,oper);
			display();
		}
		else if(ip1 !=="" && ip2==="")
		{
			if(oper && lastresult !== "" && !(lastchar==="+" || lastchar==="-" || lastchar==="*" || lastchar==="/" ))
				result = calculate(lastresult,ip1,oper);
			else
				result = ip1 ;
			display();
		}
		
		lastchar = "=";		
//	$("#test").text("ip1: " + ip1+ " ip2: " +ip2+ " oper: "+oper + " currval: "+currval + " result: "+ result + "last: "+ lastresult);

	});
		
	$(".clear").click(function(){		
		if($(this).attr("id")==="ac"){
			reset();
			$("#memory").text("");
			$("#answer").text("");
			cleardisplay = false;

//$("#test").text("ip1: " + ip1+ " ip2: " +ip2+ " oper: "+oper + " currval: "+currval + " result: "+ result + "last: "+ lastresult);

		}
	});
	
	
	
});