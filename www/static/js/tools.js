function Certification(revwhich)
{
    var req=new window.XMLHttpRequest;
    var sid=localStorage.getItem("SessionID");
    req.open('GET',"/ZcmCertification?"+sid,false);
    req.send(null); 
    if(revwhich==1)
        return req.getResponseHeader("UserRole");
    if(revwhich==2)
    {
        var username=req.getResponseHeader("UserName");
        if($.browser.mozilla)
            username=decodeURIComponent(username);        
        return username;
    }
    if(revwhich==3)
        return req.getResponseHeader("UserID");
    if(revwhich==4)
        return req.getResponseHeader("ServerIP");
    if(revwhich==5)
        return req.getResponseHeader("ClientIP");
    if(revwhich==6)
        return req.getResponseHeader("Mac");
    if(revwhich==99)
        return req.getResponseHeader("Others");
    return req.getAllResponseHeaders();
}

var result=[];
function Prase_web(t,flag)
{
	var k=-1;
	if(flag==0)
	{
		k=t.indexOf("|");
		if(k>=0)
		{
			// result=t.substr(0,k);
            result.push(t.substr(0,k));
			t=t.substr(k+1);
			if (t.length > 0) {
                Prase_web(t, 0)
            }
		}
		else t="";
	}
	else if(flag==1)
	{
		k=t.indexOf("[");
		if(k>=0)
		{
			t=t.substr(k+1);
			k=t.indexOf("]");
			if(k>=0)
			{
			    result=t.substr(0,k);
			    t=t.substr(k+1);
			}
			else t="";
		}
		else t="";
    }
    result = result.slice(-9);
	return result;
}

function ltrim(s)
{
    return s.replace(/(^\s*)/g,"");
}


function rtrim(s)
{
    return s.replace(/(\s*$)/g,"");
}

function trim(s)
{
    return rtrim(ltrim(s));
}

function AppendIcon(tapp)
{
	Deskpanel.addIconOne(tapp,tapp.asc);
}

function DeleteIcon(tapp)
{
	Deskpanel.delIconOne(tapp,tapp.asc);
}

function CloseWindow(appid)
{
    Windows.closeWindow(appid);
}

function AddApp(appname)
{
    for(var i=0;i<APPDATA.length;i++)
    {
        if(APPDATA[i].fid==appname)
        {
            var iisurl = "/ZcmDB?"+localStorage.getItem("SessionID")+"&app.db|1|insert into app(icon,name,url,sonmenu,asc,fid,user) values('"+APPDATA[i].icon+"','"+APPDATA[i].name+"','"+APPDATA[i].url+"','',"+APPDATA[i].asc+",'"+APPDATA[i].fid+"','"+localStorage.getItem("UserID")+"');select max(appid) from app;|";
            function onAddApp(revstr)
	        {
	            var record=new Object();
	            var table=new Object();	
                if (revstr.indexOf("Success") >= 0)
                {
                    table.str=revstr;
                    record.str = Prase(table, 1);
                    record.str = Prase(table, 1);
                    APPDATA[i].appid=Prase(record, 0);
                    AppendIcon(APPDATA[i],APPDATA[i].asc);
                    alert("添加应用程序成功!");
                }
                else alert("添加应用程序失败！");
            }
            $.ajax({
                url: iisurl,
                type: 'GET',
                dataType: 'text',
                success: onAddApp
            });
            return;
        }
	};
}

function DelApp(appname)
{
    for(var i=0;i<APPDATA.length;i++)
    {
        if(APPDATA[i].fid==appname)
        {
            var record=new Object();
	        var table=new Object();
            var iisurl = "/ZcmDB?"+localStorage.getItem("SessionID")+"&app.db|0|select appid from app where asc="+APPDATA[i].asc+" and fid='"+APPDATA[i].fid+"' and user='"+localStorage.getItem("UserID")+"';|";
            function onGetAppid(revstr)
	        {
	            table.str=revstr;
		        record.str = Prase(table, 1);
                APPDATA[i].appid = Prase(record, 0);               
                iisurl = "/ZcmDB?"+localStorage.getItem("SessionID")+"&app.db|1|delete from app where appid='"+APPDATA[i].appid+"';|";
                alert(iisurl);
                function onDelApp(revstr1)
	           {
                    if (revstr1.indexOf("Success") >= 0)
                    {
                        DeleteIcon(APPDATA[i],APPDATA[i].asc);
                        alert("删除应用程序成功!");
                    }
                    else alert("删除应用程序失败！");
                }
                $.ajax({
                    url: iisurl,
                    type: 'GET',
                    dataType: 'text',
                    success: onDelApp
                });
            }
            $.ajax({
                url: iisurl,
                type: 'GET',
                dataType: 'text',
                success: onGetAppid
            });
            
            return;
        }
	};
}