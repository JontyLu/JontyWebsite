/**
 * Created by lenovo on 2017/3/26.
 */

window.onload = function () {
    var divSet = document.getElementsByClassName("divBox");
    var htmlHeight = document.getElementsByTagName("body")[0].style.height = window.innerHeight -2 + "px";

    for (var i = 0; i< divSet.length; i++){
        divSet[i].style.height = window.innerHeight/2 + "px";
    }
};
window.onresize = function () {
    var divSet = document.getElementsByClassName("divBox");
    var htmlHeight = document.getElementsByTagName("body")[0].style.height = window.innerHeight + "px";
    var divHeight;
    for (var i = 0; i< divSet.length; i++){
        if(window.innerHeight <= 560  ){
            divSet[i].style.height = window.innerHeight + "px";

        }else{
            divSet[i].style.height = window.innerHeight/2 + "px";
        }
         }
};

/*
* 移动端滚动显示动画
* */
/*
document.getElementsByClassName("divBox").addEventListener("scroll",scrollAnimation);
function scrollAnimation(){
        var obj = document.getElementsByClassName("divBox");
        var topA = obj[this].offsetTop;
        var top =  document.documentElement.scrollTop;
        if ((topA - top) <=window.innerHeight){
            var child = obj[this].child("span");
            child.style.animation();
        }

}*/