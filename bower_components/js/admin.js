$(function(){



    var otestAPI ={
        test:function(){
            $.ajax({
                url:"/test",
                type:'get',
                dataType:'jsonp',
                success:function(data){
                    console.log(data,data.length,data[0].name);
                    var html="";
                    for(var i=0; i< data.length; i++){
                        html +="<tr class='item-id-"+data[i]._id +"'>\
                            <td>"+ data[i].name+ "</td>  \
                        <td>"+data[i].content+ "</td>  \
                            <td>"+data[i].principal+ "</td> \
                        <td>"+data[i].finishtime+ "</td>  \
                            <td>"+new Date(data[i].meta.updateAt).Format("yyyy-MM-dd") +"</td>  \
                        <td><a target='_blank' href='../movie/"+data[i]._id +"'>查看</a></td>\
                            <td><a target='_blank' href='../admin/update/"+data[i]._id +"'>修改</a></td>  \
                        <td> \
                            <button type='button' data-id='"+data[i]._id +"' class='btn btn-danger del'> 删除</button>\
                        </td>\
                            <td>"+data[i].from.name+ "</td> \
                        </tr>";
                    }
                    $("#j-loglist tbody").html(html);


                }
            })
        },
        postlog:function(){
            console.log($("input[name='project[name]']")[0].value);
            $.ajax("/user/log",{
                type:"post",
                dataType:"json",
                cache: false,
                data:{
                    name:$("input[name='project[name]']")[0].value,
                    content:$("input[name='project[content]']")[0].value,
                    principal:$("input[name='project[principal]']")[0].value,
                    finishtime:$("input[name='project[finishtime]']")[0].value
                },
                success:function(data){
                    console.log("提交成功"+data)
                }
            })
        }
    }
    //otestAPI.test();
    $("h1").click(function(){
        otestAPI.test();
    })

    $("#logbtn").on("click",function(ev){
        ev.preventDefault();
        otestAPI.postlog();
    })

    var $loginFormObj = $(document.forms['login']);


    $loginFormObj.submit(function (ev) {
        console.log($loginFormObj.find("input[name='user[name]']").val(),$loginFormObj[0].elements['user[password]'].value)
        $.ajax({
            url:'/user/signin',
            type:'post',
            dataType:'json',
            data:{
                names: $loginFormObj[0].elements['user[name]'].value,
                passwords: $loginFormObj[0].elements['user[password]'].value
            },
            success:function(data){
                console.log(data,222)
                if(data.code == 1){
                   var html='<span>欢迎您，'+ $loginFormObj[0].elements['user[name]'].value +'</span><span>&nbsp;|&nbsp;</span><a href="/logout" class="navbar-link">登出</a>';
                   $(".navbar-text").html(html);
                    $('#signinModal').modal('hide')
                } else {
                    alert('用户名或密码错误');
                }
            }
        })

        ev.preventDefault();
    })

})

Date.prototype.Format = function(fmt)
{ //author: meizz
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
}

