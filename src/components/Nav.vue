<template>
	<div class="nav">
      	<li class="asideMenu" v-for="(item, index) in menuList">
			<div class="oneMenu" v-on:click="showToggle(item, index)">
                <a class="oneMenuText" v-on:click.self.prevent='showPage(item.url)'>{{item.name}}</a> 

            	<div class="navbtn" v-bind:class="{unclicked: !item.isSubShow, clicked: item.isSubShow}" v-if="item.subItems.length>0">
            		<i class="iconfont">&#xe607;</i>
				</div>
			</div>

			<transition name="sub-items">
				<Nav v-if="item.subItems.length>0 && item.isSubShow" 
					 v-bind:menuList='item.subItems'>
				</Nav>
			</transition>

      	</li>
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

			prepClickBehav(){
				$('.oneMenu').off('click').click(function(){
					$(this).addClass("highlight").parent().siblings().find('.oneMenu').removeClass("highlight");
					$(this).find('.oneMenuText').addClass('focused');
					$(this).parent().siblings().find('.oneMenuText').removeClass('focused');
				});

				//submenu text color
		      	$('.asideMenu .asideMenu .oneMenu .oneMenuText').off('click').click(function(){
		      		$(this).addClass('subtext-highlight').parent().parent().siblings().find('a').removeClass('subtext-highlight');
		      	});

		      	//submenu background color
		      	$('.asideMenu .asideMenu .oneMenu').off('click').click(function(){
		      		$(this).addClass('sub-highlight').parent().siblings().find('.oneMenu').removeClass('sub-highlight');
		      	});
			}
		},

		mounted(){
			this.prepClickBehav();
		}
	}
</script>

<style type="text/css" scoped>

* {
	font-family: STXihei;
	font-size: 16px;
}

.clicked {
	transform: rotate(180deg);
}

.unclicked {
	transform: rotate(0deg);
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
	height: 45px;
	width: 100%;
	display: flex;
	align-items: center;
	cursor: pointer;
	text-align: left;
}

.iconfont {
	color: #a1a1a1;
	text-align: right;
	font-size: 80%;
}


.highlight {
	background: #e6f7ff;
	color: #1890ff;
}

.oneMenu:hover .oneMenuText:not(.focused){
	color: #6ab0ff !important;
}


.oneMenuText {
	font-family: STXihei, "Microsoft YaHei";
	font-size: 16px;
	width: 90%;
	text-align: center;
	display: inline-block;
}


.asideMenu .asideMenu .oneMenu {
	box-sizing: border-box;
	text-align: left;
	border: none;
	padding-top: 5px;
	padding-left: 15px;
}

.asideMenu .asideMenu .oneMenu:hover {
	border-right: 4px solid #1890ff;
}

.asideMenu .asideMenu .oneMenu .oneMenuText {
	text-align: center;
}


.subtext-highlight {
	color: #1890ff !important;
}

.sub-highlight {
	background: #e6f7ff !important;
	border-right: 4px solid #1890ff !important;
}

.navbtn {
	float: right;
	cursor: pointer;
	margin-right: 10px;
	transition: all 1s ease 0s;
}

.sub-items-enter-active, .sub-items-leave-active {
	transition: all .5s;
}

.sub-items-enter, .sub-items-leave-to {
	max-height: 0;
}

.sub-items-enter-to, .sub-items-leave {
	max-height: 180px;
}
</style>