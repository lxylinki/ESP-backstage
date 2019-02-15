<template>
	<div class="nav">
		<ul class="asideMenu">
          	<li v-for="(item, index) in menuList">
				<div class="oneMenu" v-on:click="showToggle(item, index)">

	                <a class="oneMenuText" 
	                   style="display: inline-block; 
	                   		  width: 160px;" 
	                   v-bind:href='item.url'
	                   v-on:click.self.prevent='showPage(item.url)'>{{item.name}}</a> 

                	<div class="navbtn" 
                		   style="display: inline-block; 
                		          position: relative;
                		          margin-right: 20px;
                		          margin-top: 8px;"
                		   v-if="item.subItems.length>0">
                		<!--
                		<i v-show="!item.isSubShow" class="iconfont">&#xe601;</i>
                		<i v-show="item.isSubShow" class="iconfont">&#xe600;</i>-->
                		<i v-show="!item.isSubShow" class="iconfont">&#xe607;</i>
                		<i v-show="item.isSubShow" class="iconfont">&#xe608;</i>
					</div>
				</div>

				<Nav v-if="item.subItems.length>0 && item.isSubShow" 
					 v-bind:menuList='item.subItems'>	 	
				</Nav>

          	</li>
		</ul>
	</div>
</template>

<script type="text/javascript">
	export default {
		name: 'Nav',
		props:['menuList'],

		data(){
			return {			
			}
		},
		
		methods:{
	      showToggle(item, idx){
	        item.isSubShow = !item.isSubShow;
	        //close others
	        for(let i in this.menuList) {
	        	if(i != idx) {
	        		this.menuList[i].isSubShow = false;
	        	}
	        }
	      },

	      showPage(url){
	      	this.$router.push(url);
	      },

		},

		mounted(){
			//main menu highlight
			$(document).on('click', 'li', function(){
	      		$(this).addClass("highlight").siblings().removeClass("highlight");
	      		$(this).find('a').first().css("color", "black");
	      		$(this).siblings().find('a').css("color", "black");
	      		
	      		//clear other sub-highlights
	      		$(this).siblings().find('.oneMenu').removeClass('subhighlight');
	      		$(this).siblings().find('.oneMenu').find('.oneMenuText').removeClass('subtext-highlight');
	      	});

			//submenu text color
	      	$(document).on('click','.asideMenu .asideMenu .oneMenu .oneMenuText', function(){
	      		$(this).addClass('subtext-highlight').parent().parent().siblings().find('a').removeClass('subtext-highlight');
	      	});

	      	//submenu background color
	      	$(document).on('click','.asideMenu .asideMenu .oneMenu', function(){
	      		$(this).addClass('subhighlight').parent().siblings().find('.oneMenu').removeClass('subhighlight');
	      	});
		}
	}
</script>

<style type="text/css" scoped>

* {
	font-family: STXihei;
	font-size: 16px;
}

.asideMenu {
    margin: 0;
    padding: 0;
    width: 240px;
    background: #ffffff;
    height: 100%;
    overflow: hidden;
}

.oneMenu {
	text-align: left;
	line-height: 45px;
	/*border-top: 1px solid rgba(161, 161, 161, 0.5);*/
}

.highlight {
	background: #ffffff;
}

/*outmost main menu*/
.oneMenu:hover .oneMenuText{
	color: #6ab0ff !important;
}

/*only the last in main menu has bottom border*/
/*
li:last-child .oneMenu{
	border-bottom: 1px solid rgba(161, 161, 161, 0.5);
}*/

.oneMenuText {
	font-family: STXihei, "Microsoft YaHei";
	font-size: 16px;
}

/*subitems style*/
.asideMenu .asideMenu .oneMenu {
	text-align: left;
	line-height: 30px;
	background: #ffffff;
	border-top: none;
	border-bottom: none;
	border-right: none;
}

.asideMenu .asideMenu .oneMenu:hover {
	border-right: 4px solid #1890ff;
}

.asideMenu .asideMenu .oneMenu .oneMenuText {
	text-align: left;
	margin-left: 20px;
}

.asideMenu .asideMenu .oneMenu .oneMenuText:hover {
	/*color: #6ab0ff !important;*/
	color: #1890ff !important;
}

.subtext-highlight {
	/*color: #6ab0ff !important;*/
	color: #1890ff !important;
}

.subhighlight {
	background: #e6f7ff !important;
	border-right: 4px solid #1890ff !important;
}

li a:link, li a:hover, li a:active, li a:visited {
	color: black;
    display: block;
    padding: 8px 16px;
}

.navbtn {
	float: right;
	margin-right: 20px;
	margin-top: 120px;
	cursor: pointer;
}

.iconfont {
	color: #a1a1a1;
	text-align: right;
}

</style>