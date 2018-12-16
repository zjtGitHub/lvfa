
var target = 0;
var browerHeight = 0;
var aSideLis=[];
var currentPage = 1;

//检测浏览器窗口大小的函数
function client() {
    if(window.innerWidth != null)  // ie9 +  最新浏览器
    {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        }
    }
    else if(document.compatMode === "CSS1Compat")  // 标准浏览器
    {
        return {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight
        }
    }
    return {   // 怪异浏览器
        width: document.body.clientWidth,
        height: document.body.clientHeight

    }
}

//页面滚动函数
function scrollHeight(){
	var timer = null;
	var position=0;
	timer = setInterval(scroll,30);
	function scroll(){
		var step = (target - position)>0?Math.ceil((target - position)/10):Math.floor((target - position)/10);
		position = position + step;
		if (position == target) {
			// clearInterval(timer);
			bindMouseWheel();

			//渲染li标签圆点
			for (var i = 0; i < aSideLis.length; i++) {
				aSideLis[i].className = "";
			}
			page = Math.floor(target/browerHeight);
			if (page < 0) {
				page = 0;
			}else if(page >4){
				page=4;
			}
			aSideLis[page].className = "current";

		}
		window.scrollTo(0,position);
	}
}


/*
现在五大浏览器（IE、Opera、Safari、Firefox、Chrome）中Firefox 使用detail，
其余四类使用wheelDelta；两者只在取值上不一致，代表含义一致，
detail与wheelDelta只各取两个 值，detail只取±3，wheelDelta只取±120，
其中正数表示为向上，负数表示向下
*/
function mouseWheel(e){
	unBindMouseWheel();
	var event = e || window.event;
	var direction = (event.wheelDelta ||  event.detail) > 0?"down":"up";
	switch(direction){
		case "up":
			target += browerHeight;
			if (target >= browerHeight*4) {
				target = browerHeight*4;
			}
			break;
		case "down":
			target -= browerHeight;
			if (target <= 0) {
				target = 0;
			}
			break;
		default:
			break;
	}
	e.preventDefault();
}

/*
 绑定事件的封装，
 		事件监听 滚轮事件

谷歌 addEventListener onmousewheel

IE attachEvent onmousewheel

FF addEventListener DOMMouseScroll*/

function addEvent(obj,xEvent,fn) {
    if(obj.attachEvent){
      obj.attachEvent('on'+xEvent,fn);
    }else{
      obj.addEventListener(xEvent,fn,false);
    }
}

function delEvent(obj,xEvent,fn) {
    if(obj.attachEvent){
      obj.detachEvent('on'+xEvent,fn);
    }else{
      obj.removeEventListener(xEvent,fn,false);
    }
}


function bindMouseWheel(){
	addEvent(document,'mousewheel',mouseWheel);
  	addEvent(document,'DOMMouseScroll',mouseWheel);
}

function unBindMouseWheel(){
	delEvent(document,'mousewheel',mouseWheel);
  	delEvent(document,'DOMMouseScroll',mouseWheel);
}

//初始化页面右边的页面导航小圆点
function initAsides(){
	//招到aside下面的所有a标签
	aSideLis = document.getElementsByTagName("aside")[0].getElementsByTagName("a");

	//对aSideLis下的a标签绑定点击事件
	for (var i = 0; i < aSideLis.length; i++) {
		aSideLis[i].index = i;
		aSideLis[i].onclick = function(){
			for (var j = 0; j < aSideLis.length; j++) {
				aSideLis[j].className = "";
			}
			this.className = "current";	
			target = this.index * browerHeight;
		}
	}
}


//初始化第3页面的图片滚动事件
function initP3(){
	var preBtn =  document.getElementById("nextLeft");
	var nextBtn =  document.getElementById("nextRight");
	var scrollItems =  document.getElementById("scrollItems");
	var imgs = scrollItems.getElementsByTagName("img");
	var div = scrollItems.getElementsByTagName("div");
	var currentImage = 1;
	var lastImage=1;
	var bigTargetWidth = 400;
	var smallTargetWidth = 300;

	//给左右两个箭头绑定点击事件
	preBtn.onclick = function(){
		target +=  310;
		if (target > 310) {
			target = 310;
		}else{
			lastImage = currentImage;
			currentImage--;
			scaleDiv();
		}
		// alert(currentImage);
	}

	nextBtn.onclick = function(){
		target -=  310;
		if (target < -930) {
			target = -930;
		}else{
			lastImage = currentImage;
			currentImage++;
			scaleDiv()
		}
		// alert(currentImage);
	}

	// 给每张图片绑定点击事件
	for (var i = 0; i < imgs.length; i++) {
		imgs[i].index = i;
		imgs[i].onclick = function(){
			if (this.index < currentImage) {
				lastImage = currentImage;
				currentImage--;
				scaleDiv();
				target +=  310;
			}else if(this.index > currentImage){
				lastImage = currentImage;
				currentImage++;
				scaleDiv();
				target -=  310;
			}
		}
	}	

	function scaleDiv(){
			var smallScaleWidth = bigTargetWidth;//需要缩小的div原始尺寸是大图片的大小
			var bigScaleWidth = smallTargetWidth;//需要放大的div原始尺寸是小图片的大小
			var timer = setInterval(scale,30);
			
			function scale(){
				//将被选中的图片放大，失去焦点的图片变小
				// smallScaleWidth = smallScaleWidth+Math.floor((smallTargetWidth-smallScaleWidth)/40);
				if(smallScaleWidth > smallTargetWidth){
					smallScaleWidth-=5;
				}
				div[lastImage].style.width = smallScaleWidth+"px";


				// bigScaleWidth = bigScaleWidth+Math.ceil((bigTargetWidth-bigScaleWidth)/40);
				if(bigScaleWidth < bigTargetWidth){
					bigScaleWidth+=5;
				}
				div[currentImage].style.width = bigScaleWidth+"px";

				if( smallScaleWidth <= smallTargetWidth && bigScaleWidth >= bigTargetWidth){
					clearInterval(timer);
				}
			}
	}

	var timer = null; var target = 0; var position = 0;

	timer = setInterval(function(){
			position = position + (target - position)/10;
			scrollItems.style.left = position+"px";
	},30);
}

//初始化第4页的图片滚动事件
function initP4(){
	var p4LittleImgs = document.getElementById("p4-scroll").getElementsByTagName("img");
	for (var i = 0; i < p4LittleImgs.length; i++) {
		p4LittleImgs[i].index = i;
		p4LittleImgs[i].onclick = function(){
			for (var j = 0; j < p4LittleImgs.length; j++) {
				p4LittleImgs[j].className = "gray";
				p4LittleImgs[j].parentNode.nextElementSibling.style.backgroundColor = "";
			}
			this.className = "";
			this.parentNode.nextElementSibling.style.backgroundColor = "orange";
			//整个页面的背景图片更换
			document.getElementById("p4").style.backgroundImage = "url(images/p4-bck"+(this.index+1)+".jpg)"
		}
	}
}
window.onresize = function() {
    browerHeight = client().height;
    target = page*browerHeight;
}

window.onload = function(){
	// window.scrollTo(0,1000); // 屏幕滑动
	browerHeight = client().height;
	scrollHeight();
	initAsides();
	//第三页的图片左右滚动效果
	initP3();

	// 第四页小图标绑定点击事件
	initP4();




}