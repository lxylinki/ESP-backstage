<template>
	<div class="recselect">
		<tr class="select-item" v-for="item in item_list">
			<div class="select-text" v-on:click="selectCatag(item)">{{item.name}}</div>

			<RecSelect v-show="item.hasOwnProperty('sub_categories')"
			           v-bind:item_list="item.sub_categories" >
			</RecSelect>
		</tr>
	</div>
</template>

<script type="text/javascript">
	export default {
		name: 'RecSelect',
		props:['item_list'],
		methods: {
			selectCatag(item) {
				this.$emit('makechoice', item);
			}
		},
		mounted() {
			$(document).on('click', 'li.select-item', function(){
				$(this).addClass("highlight").siblings().removeClass("highlight");
			});	
		}
	}
</script>

<style type="text/css" scoped>

.select-item {
	font-size: 14px;
	margin: 5px;
	height: 30px;
	line-height: 30px;
}

.select-item .recselect {
	margin-left: 10px;
	color: #cccccc;
}

.select-item:hover {
	background: #f7f8fc;
}

.highlight {
	background: #f7f8fc;
}
.select-text {
	width: 100%;
}
</style>