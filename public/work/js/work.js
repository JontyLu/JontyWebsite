/**
 * Created by lenovo on 2017/4/8.
 */

$(function(){
    var $loginBox = $("#loginBox");
    var $registerBox = $("#registerBox");
    var $userInfo = $("#userInfo");

    //切换到注册面板
    $loginBox.find("a.colMint").on("click",function(){
        $registerBox.show();
        $loginBox.hide();
    });

    //切换到登录面板
    $registerBox.find("a.colMint").on("click",function(){
        $loginBox.show();
        $registerBox.hide();
    });


    //注册
    $registerBox.find("button").on("click",function(){
       //通过Ajax提交请求
        $.ajax({
            //提交方法
            type: "post",
            url: "/api/user/register",
            //发送到服务器的数据
            data: {
                //从registerBox中选出属性为username的内容
                username: $registerBox.find("[name='username']").val(),
                password: $registerBox.find("[name='password']").val(),
                repassword: $registerBox.find("[name='repassword']").val()
            },
            dataType: "json",
            success: function(result){
                console.log(result);
            }
        });
    });

    //登陆
    $loginBox.find("button").on("click",function(){
        //通过Ajax提交请求
        $.ajax({
           //提交方法
            type: "post",
            url: "/api/user/login",
            data: {
                username: $loginBox.find("[name='username']").val(),
                password: $loginBox.find("[name='password']").val()
            },
            dataType: "json",
            success: function(result){
                if(result.code == 4){
                    /*setTimeout(function(){
                        $loginBox.hide();
                        $userInfo.show();
                        //显示登陆用户的信息
                        $userInfo.find(".username").html(result.userInfo.username);
                        $userInfo.find(".info").html("你好，欢迎光临你的博客");
                    },1000);*/
                    //重新加载页面
                    window.location.reload();
                }
            }
        });
    });

    $("#logout").on("click",function(){
        $.ajax({
            url: "/api/user/logout",
            success: function(result){
                if(!result.code){
                    window.location.reload();
                }
            }
        });
    });
});