var counts;
if(localStorage['checked'])
{
	counts=localStorage['counts'];
	chrome.browserAction.setBadgeBackgroundColor({"color":[255, 0, 0, 255]});
	if(localStorage['counts']>0)
	{
		chrome.browserAction.setBadgeText({"text": localStorage['counts']});
		}
	else chrome.browserAction.setBadgeText({"text": ""});
}
else
{
	counts=0;
	chrome.browserAction.setBadgeBackgroundColor({"color":[255, 0, 0, 255]});
	chrome.browserAction.setBadgeText({"text": 'sign'});
}

var x0=15;
var y0=50;
var c=document.getElementById("main");
if(c)
{
	var cxt=c.getContext("2d");
	cxt.fillStyle='grey';
	cxt.fillRect(0,0,140,105);
	}
var confirmed;

var d=new Date();
var year=d.getYear()+1900;
var semester=d.getMonth();
if(semester<4){
	year=String(year-1)+'-'+String(year);
	semester='1'
	}
else if(semester>9){
	year=String(year)+'-'+String(year+1);
	semester='1'
	}
else{
	year=String(year-1)+'-'+String(year);
	semester='2'
	}

var flag=0;
$('#main').mousemove(function (e) {
	if(flag==1)
	{
		x=e.clientX-x0;
		y=e.clientY-y0;
		cxt.globalCompositeOperation = "destination-out";
		cxt.beginPath();
		cxt.arc(x,y,8,0,Math.PI*2);
		cxt.strokeStyle = "rgba(250,250,250,0)";
		cxt.fill();
		cxt.globalCompositeOperation = "source-over";
		}
	})
$('#main').mousedown(function(e){
	e.preventDefault();
	flag=1
	})
$('#main').mouseup(function(e){
	e.preventDefault();
	flag=0
	})

$('#know').click(function (argument) {
	localStorage['check_'+id]=1;
	counts--;
	localStorage['counts']=counts;
	chrome.browserAction.setBadgeBackgroundColor({"color":[255, 0, 0, 255]});
	if(localStorage['counts']>0)
	{
		chrome.browserAction.setBadgeText({"text": localStorage['counts']});
		}
	else chrome.browserAction.setBadgeText({"text": ""});
	window.location.href="list.html";
})
$('#ignore').click(function (argument) {
	window.location.href="list.html";
})
$('#exit').click(function (argument) {
	localStorage.clear();
	window.location.href="sign_in.html";
})



// function login(user,pwd)
// {
	// $.get("http://electsys.sjtu.edu.cn/edu/index.aspx",'',function(data)
	// {
		// html=$(data);
		// viewstate = $("#__VIEWSTATE",html).val();
		// eventvalidation = $("#__EVENTVALIDATION",html).val();
		// post_data = {"__VIEWSTATE": viewstate, "__EVENTVALIDATION": eventvalidation, "txtUserName": user, "txtPwd": pwd, "rbtnLst_1": "1", "Button1": "登陆"};
		// $.post("http://electsys.sjtu.edu.cn/edu/index.aspx",post_data,function(data)
		// {
			// var html=$(data)
			// if(data.indexOf("frameset") > -1)
			// {
				// localStorage['checked']=1;
				// getList();
				// window.location.href='list.html';
				// }
			// else
			// {
				// $('#error').html('登录出错，请检查后重试')
				// }
			
			// },'html')
		// },'html');
	// }

function analysis(data)
{

	// localStorage['temp']=data;
	var dom = $(data);
	var score_tr_list = $("tr[style$=height\\:25px\\;]", dom);
	name=$('#lblXm',dom).text();
	if(name) localStorage['name']=$('#lblXm',dom).text();
//	var counts=0;
	var lessons=[];
	for(var x = 0; x < score_tr_list.length; x++){
		var tr = score_tr_list.slice(x,x+1);
		var id = tr.children().slice(0,1).text().trim();
		var name = tr.children().slice(1,2).text().trim();
		var score = tr.children().slice(3,4).text().trim();
		lessons.push(id);
		var str=id+','+name+','+score+','+year+','+semester;
		if(localStorage[id] != str) 
		{
			counts++;
			localStorage['counts']=counts;
			localStorage[id] = str;
			localStorage['check_'+id] = 0;
			window.location.reload();

		}
//		else if(!localStorage['check_'+id])
//		{
//			counts++;
//		}
		}
	//notice
	chrome.browserAction.setBadgeBackgroundColor({"color":[255, 0, 0, 255]});
	if(localStorage['counts']>0)
	{
		chrome.browserAction.setBadgeText({"text": localStorage['counts']});
		}
	else chrome.browserAction.setBadgeText({"text": ""});
	localStorage[String(year)+String(semester)]=lessons.join();
	if(!localStorage['checked'] || localStorage['checked']==0)
	{
		localStorage['checked']=1;
		window.location.href='list.html';
		}
	}

function init()
{
	
	$('#name').html(localStorage['name']);
	
	var lessons=localStorage[String(year)+String(semester)];
	if(!lessons)
	{
		$('#mainTable').append("<tr><th>还没出成绩哦，请耐心等待</th></tr>"+year+'/'+semester);
	}
	else
	{
		lessons=lessons.split(',');
		for(var i=0;i<lessons.length;i++)
		{
			var data=localStorage[lessons[i]].split(',');
			if(localStorage['check_'+lessons[i]]=='1')
				$('#mainTable').append("<tr><td>"+data[0]+'</td><td>'+data[1]+'</td><td>'+data[2]+'</td></tr>');
			else
				$('#mainTable').append("<tr><td>"+data[0]+'</td><td>'+data[1]+'</td><td><a href="#" id="'+data[0]+'">还未刮开</a>'+'</td></tr>');
			$('#'+data[0]).click(function()
					{
							localStorage['temp']=this.id;
							window.location.href='popup.html';
					});
		}
	}
}
function getList()
{
	if(localStorage['name'])
		init();
	$.get("http://electsys.sjtu.edu.cn/edu/index.aspx",'',function(data)
	{
		html=$(data);
		viewstate = $("#__VIEWSTATE",html).val();
		eventvalidation = $("#__EVENTVALIDATION",html).val();
		var user=localStorage['user'];
		var pwd=localStorage['pwd'];
		post_data = {"__VIEWSTATE": viewstate, "__EVENTVALIDATION": eventvalidation, "txtUserName": user, "txtPwd": pwd, "rbtnLst_1": "1", "Button1": "登陆"};
		$.post("http://electsys.sjtu.edu.cn/edu/index.aspx",post_data,function(data)
		{	
			if(data.indexOf("frameset") > -1)
			{
				$.get("http://electsys.sjtu.edu.cn/edu/StudentScore/B_StudentScoreQuery.aspx",'',function(data){
					html=$(data);
					viewstate = $("#__VIEWSTATE",html).val();
					eventvalidation = $("#__EVENTVALIDATION",html).val();
					$.post("http://electsys.sjtu.edu.cn/edu/StudentScore/B_StudentScoreQuery.aspx",{"__VIEWSTATE": viewstate, "__EVENTVALIDATION": eventvalidation,"txtKCDM": "", "ddlXN": year, "ddlXQ": semester, "btnSearch": "  查  询  "},function(res){analysis(res)},'html')}
					,'html');
				}
			else
			{
				html=$(data);
				localStorage['error']=$("#lblMessage",html).text();
				if(localStorage['error'])
				{
					$('#error').html(localStorage['error']);
					}
				else
				{
					$('#error').html("网络连接错误，请检查后重试");
					}
				}
			},'html')
		},'html');
	}
	
function submit()
{
	var username=$('#username').val();
	var password=$('#password').val();
	localStorage.clear();
	localStorage['user']=username;
	localStorage['pwd']=password;
	// alert(username)
	// login(username,password);
	getList();
	}
	
$("#submit").click(submit)
	
$('#password').keydown(function(e){
	if(e.which==13)
	{
		e.preventDefault();
		submit();
		}
	})
