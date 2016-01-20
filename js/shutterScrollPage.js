/****
*插件代码开始
****/

function ShutterScroll(){
	this.init.apply(this,arguments);
};
ShutterScroll.prototype = {
	init : function(id,options){
		var _that = this;
		this.wrap = (typeof id === "string")?document.getElementById(id):id;
		this.oUl = this.wrap.getElementsByTagName("ul")[0];
		this.oLi = this.oUl.getElementsByTagName("li");
		this._image = this.oUl.getElementsByTagName("img");
		this.options = {
			//定义是否使用指示导航
			_switchNav : true,
			//定义是否使用左右按钮
			_button : true,
			//初始选择那张图片最开始显示,大小小于li的总数，默认为0
			_initLi : 0,
			//共开发者选择幻灯片切换效果,默认是渐隐
			_effect : "opacity"
		};
		for(var i in options){
			this.options[i] = options[i];
		};
		//定义一个属性用来存储新增加的导航
		this.newNav = null;
		//定义一个属性用来存储新导航下的li标签
		this.newNavLi = null;
		if(this.options._switchNav){
			this.addSwitchNav();
		};
		this._easeRelationship();
		//插件左边按钮
		this.leftButton = null;
		//插件右边按钮
		this.rightButton = null;
		if(this.options._button){
			this.addLeftRightButton();
		};		
		//随时获取ul的位置
		this._tempLeft = 0;
		//初始left位置
		this.leftInstance = 0;
		//定义一个数组用于切换当前显示的图片
		this.switchArr = null;
		this._mainSwitchFun();
		//页面钢加载进来的时候就要算出li的宽度
		this.initWidthAndHeight();
		//窗口改变时候也要执行
		this.gone();
		this.addEvent.call(_that,"resize",window,function(){
			_that.initWidthAndHeight();
		});
		this.addAnimation();
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
		this.currentLi(this.options._initLi);
		this.currentNewLi(this.options._initLi);
		this.newNavLiClick();
		// this.addCss3Skew();
	},
	initWidthAndHeight : function(){
		var _that = this;
		var wrapWidth = this.wrap.offsetWidth;
		this.oUl.style.width = wrapWidth + 'px';
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
		this.oUl.style.height = lineHeight + 'px';
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
						_that.css3Compatible(_that.oLi[n],"Transition","opacity 1s,left 1s,-webkit-transform 1s,-moz-transform 1s,-ms-transform 1s, -o-transform 1s,transform 1s");
						_that.css3Compatible(_that._image[n],"Transition","opacity 1s,left 1s,-webkit-transform 1s,-moz-transform 1s,-ms-transform 1s, -o-transform 1s,transform 1s");
					};
				})(i);				
		};
	},
	gone : function(){
		var _that = this;
		for(var i=0,len = this.oLi.length;i<len;i++){
			(function(n){
				if(_that.options._effect == "opacity"){
					_that.oLi[n].style.opacity = 0;
					_that._image[n].style.opacity = 0;
				}else if(_that.options._effect == "skew"){
					this.css3Compatible(this.oLi[n],'Transform',"skewX(45deg)");
					this.css3Compatible(this._image[n],'Transform',"skewX(45deg)");
				}
			})(i);
		};
	},
	currentLi : function(num){
		var _that = this;
		if(typeof num === "number"){
			if(this.options._effect == "opacity"){
				console.log("opacity");
				this.oLi[num].style.opacity = 1;
				this._image[num].style.opacity = 1;
			}else if(this.options._effect == "skewx"){
				console.log("skewx");
				for(var i = 0,len = _that.oLi.length;i<len;i++){
					(function(n){
						_that.oLi[n].style.opacity = 0;
						_that._image[n].style.opacity = 0;
						_that.css3Compatible(_that.oLi[n],'Transform',"skewX(45deg)");
						_that.css3Compatible(_that._image[n],'Transform',"skewX(45deg)");
					})(i);
				};
				this.oLi[num].style.opacity = 1;
				this._image[num].style.opacity = 1;
				this.css3Compatible(this.oLi[num],'Transform',"skewX(0deg)");
				this.css3Compatible(this._image[num],'Transform',"skewX(0deg)");
			};
		};
	},
	leftGo : function(){
		var _that = this;
		this.gone();
		var tempNum = _that._mainSwitchCurrentLi();
		this.currentLi(tempNum);
		this.currentNewLi(tempNum);
	},
	//修复最开始的窗口放生onresize时，插件的显示问题
	_mainSwitchFun : function(){
		var arr = [];
		for(var i = 0,len = this.oLi.length;i<len;i++){
			(function(n){
				arr.push(n);
			})(i);
		};
		this.switchArr = arr;
		return arr;
	},
	_mainSwitchCurrentLi : function(){
		var _that = this;
		this.switchArr.push(_that.switchArr.shift());
		//因为最开始就切换了一次，也就是说，此时的this.switchArr[0]返回的是数字this.oLi.length;为了让他从第一个开始走，所以应该返回
		return this.switchArr[0];
	},
	addSwitchNav : function(){
		var _that = this;
		this.newNav = document.createElement("ul");
		this.newNav.className = "switchNav";
		for(var i = 0,len = this.oLi.length;i<len;i++){
			(function(n){
				var li = document.createElement("li");
				_that.newNav.appendChild(li);
			})(i);
		};
		this.wrap.appendChild(this.newNav);
		var navWidth = this.newNav.offsetWidth;
		this.newNav.style.marginLeft = -navWidth/2+'px';
	},
	getPos : function(dom){
		var _that = this;
		var tempLeft = 0;
		if(window.getComputedStyle){
			tempLeft = window.getComputedStyle(dom,false).left;
		}else if(dom.currentStyle){
			tempLeft = dom.currentStyle.left;
		}else{
			tempLeft = dom.style.left ;
		};
		return tempLeft;
	},
	currentNewLi : function(num){
		var _that = this;
		if(this.newNavLi == 0 || !this.newNavLi){
			return;
		};
		for(var i = 0, len = _that.newNavLi.length;i<len;i++){
			(function(n){
				var arr = _that.newNavLi[n].className.replace(/(^\s+)|(\s+$)/g,'').split(/\s+/);
				if(arr.indexOf("active")>=0){
					var _num = arr.indexOf("active");
					arr.splice(_num,1);
					var tempArr = arr.join(' ');
					_that.newNavLi[n].className = tempArr;
				};				
			})(i);
		};
		_that.newNavLi[num].className += ' active';		
	},
	newNavLiClick : function(){
		var _that = this;
		if(this.newNavLi == 0 || !this.newNavLi){
			return;
		};
		for(var i = 0,len = _that.newNavLi.length;i<len;i++){
			(function(n){
					_that.newNavLi[n].onclick = function(){
					_that.gone();
					_that.currentLi(n);
					_that.currentNewLi(n);
				};
			})(i);
		};
	},
	//定义一个方法，用来接触插件中某些属性的强媾和关系，增加灵活性
	_easeRelationship : function(){
		var _that = this;
		if(this.newNav){
			this.newNavLi = this.newNav.getElementsByTagName("li");
		};
	},
	//增加左右按钮
	addLeftRightButton : function(){
		var _that = this;
		this.leftButton = document.createElement("span");
		this.rightButton = document.createElement("span");
		this.leftButton.className += "leftButton";
		this.rightButton.className += "rightButton";
		this.wrap.appendChild(_that.leftButton);
		this.wrap.appendChild(_that.rightButton);
		this.css3Compatible(this.leftButton,"Transition","opacity 1s");
		this.css3Compatible(this.rightButton,"Transition","opacity 1s");
		this.leftButton.onclick = function(){
			_that.gone();
			_that.switchArr.push(_that.switchArr.shift());
			_that.currentLi(_that.switchArr[0]);
			_that.currentNewLi(_that.switchArr[0]);
		};
		this.rightButton.onclick = function(){
			_that.gone();
			_that.switchArr.unshift(_that.switchArr.pop());
			_that.currentLi(_that.switchArr[0]);
			_that.currentNewLi(_that.switchArr[0]);
		};
	},
	//定义一个方法用来实现css3属性兼容加入
	css3Compatible : function(dom,attribute,value){
		var _that = this;
		var arr = ["Webkit","Moz","Ms","O",""];
		for(var i = 0,len = arr.length;i<len;i++){
			dom.style[arr[i]+attribute] = value;
		};
	},
	//增加一个css3效果
	// addCss3Skew : function(){
	// 	var _that = this;
	// 	for(var i = 0,len = this.oLi.length;i<len;i++){
	// 		(function(n){
	// 			_that.css3Compatible(_that.oLi[n],"Transform","skewX(45deg)");
	// 			_that.css3Compatible(_that._image[n],"Transform","skewX(45deg)");
	// 		})(i);
	// 	};
	// }
};


/****
*插件代码结束
****/


/*****
*插件使用方法介绍开始
1、插件默认支持指示导航，只要把传递给构造函数的对象属性_switchNav设置为假，即可关闭指示导航
2、插件默认支持左右按钮，只要把传递给构造函数的对象属性_button设置为假，即可关闭左右按钮
3、插件默认从第一张图片开始播放，可把传递给构造函数的对象属性_initLi设置为不超过总数的任一个数字，即可从当前数字开始播放
4、插件支持多种切换效果，默认效果是渐隐效果，可以通过设置传递给构造函数的对象属性_effect重置，当前可设置的值为:opacity,slewx

*插件使用方法介绍结束
*****/

//插件调用开始
window.onload = function(){
	var shutterScroll = new ShutterScroll("shutterScrollPage",{
		_switchNav : "这里不填空就行",
		_button : null,
		_initLi : 2,
		_effect : "skewx"
	});
};
