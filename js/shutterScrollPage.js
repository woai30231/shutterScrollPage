/****
*插件代码开始
****/

function ShutterScroll(){
	this.init.apply(this,arguments);
};
ShutterScroll.prototype = {
	init : function(id){
		var _that = this;
		this.wrap = (typeof id === "string")?document.getElementById(id):id;
		this.oUl = this.wrap.getElementsByTagName("ul")[0];
		this.oLi = this.oUl.getElementsByTagName("li");
		this._image = this.oUl.getElementsByTagName("img");
		//初始left位置
		this.leftInstance = 0;
		//页面钢加载进来的时候就要算出li的宽度
		this.initWidthAndHeight();
		//窗口改变时候也要执行
		this.addEvent.call(_that,"resize",window,function(){
			_that.initWidthAndHeight();
		});
		this.addAnimation();
		// this.gone();
		var clearIntervalId = setInterval(function(){
			_that.leftGo();
		},3000);
		this.wrap.onmouseover = function(){
			clearInterval(clearIntervalId);
		};
		this.wrap.onmouseout = function(){
			clearIntervalId = setInterval(function(){
				_that.leftGo();
			},3000);
		};
	},
	initWidthAndHeight : function(){
		var _that = this;
		var wrapWidth = this.wrap.offsetWidth;
		this.oUl.style.width = (wrapWidth *this.oLi.length) + 'px';
		var arr = [];
		for(var i = 0,len = this.oLi.length;i<len;i++){
			this.oLi[i].style.width = wrapWidth + 'px';
			arr.push(this._image[i].offsetHeight);
		};
		var lineHeight = Math.max.apply(Math,arr);
		this.wrap.style.height = lineHeight + 'px';
		for(var j = 0,len = this.oLi.length;j<len;j++){
			this.oLi[j].style.lineHeight = lineHeight + 'px';
		};
	},
	addEvent : function(type,dom,handler){
		return  dom.addEventListener?dom.addEventListener(type,handler,false):dom.attachEvent("on"+type,handler);
	},
	addAnimation : function(){
		var _that = this;
		for(var i=0,len = this.oLi.length;i<len;i++){
				(function(n){
					var arr = ["Webkit","Moz","Ms","O",""];
					for(var m =0,_len=arr.length;m<_len;m++){
						_that.oLi[n].style[arr[m]+'Transition'] = "opacity 1s,left 1s";
						_that._image[n].style[arr[m]+"Transition"] = "opacity 1s,left 1s";
					};
				})(i);				
		};
	},
	gone : function(){
		var _that = this;
		for(var i=0,len = this.oLi.length;i<len;i++){
			(function(n){
				_that.oLi[n].style.opacity = 0;
				_that._image[n].style.opacity = 0;
			})(i);
		};
	},
	currentLi : function(num){
		var _that = this;
		if(typeof num === "number"){
			this.oLi[num].style.opacity = 1;
			this._image[num].style.opacity = 1;
		};
	},
	leftGo : function(){
		this.leftInstance += this.wrap.offsetWidth;
		this.gone();
		if(this.leftInstance<= (this.wrap.offsetWidth * (this.oLi.length - 1)) && this.leftInstance >=0){
			this.oUl.style.left = -this.leftInstance + 'px';
			var tempNum = Math.floor(this.leftInstance/this.oLi[0].offsetWidth)
			this.currentLi(tempNum);
		}else{
			this.leftInstance = 0;
			this.oUl.style.left = 0 + 'px';
			this.currentLi(0);
		};
	}
}


/****
*插件代码结束
****/


//插件调用开始
window.onload = function(){
	var shutterScroll = new ShutterScroll("shutterScrollPage");
};
