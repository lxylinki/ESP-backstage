<template>
	<div class="rectablerows">
			<li class="recrow" v-for="(item, idx) in item_list">
				<div class="recrowcontent" >
					<td class="name"><div class="nametext">{{item.name}}</div></td>
					<td class="level">{{item.level}}</td> 
					<td class="created_at">{{tconv(item.created_at)}}</td>
					<td class="updated_at">{{tconv(item.updated_at)}}</td>

					<td class="operation">
				      	<el-button  class="op edit" type="text" @click="editRow(scope.row)">
				      		<i class="iconfont">&#xe61a;</i>编辑
				      	</el-button>						
				      	<el-button class="op delete" type="text" @click="deleteRow(scope.row)">
				      		<i class="iconfont">&#xe7e0;</i>删除
				      	</el-button>						
					</td>
				</div>

				<RecTable v-if="item.hasOwnProperty('sub_categories')" 
						  v-bind:item_list="item.sub_categories">
				</RecTable>
			</li>	
	</div>
</template>

<script type="text/javascript">
	import Utils from '@/components/Utils.js';
	export default {
		name: 'RecTable',
		props:['item_list'],
		methods: {
			tconv(ntime){
				return Utils.convTime(ntime);
			}
		}
	}
</script>

<style type="text/css" scoped>
* {
	font-size: 14px;
}

td {
	height: 40px;
	text-align: center;
	vertical-align: middle;
}

.nametext {
	width: 100px;
	margin: 0 auto;
	text-align: left;
}

.edit, .delete {
	display: inline-block;
}

.name {
	-webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
	width: 200px;
}
.level {
	width: 200px;
}
.created_at {
	width: 300px;
}
.updated_at {
	width: 300px;
}
.operation {
	width: 200px;
}
.recrowcontent{
	border-bottom: 1px solid rgba(215, 215, 215, 0.4);
}
.recrowcontent:hover {
	background: #f7f8fc;
}

/*sub item*/
.recrow .recrow .recrowcontent .name{
	padding-left: 30px;
}

.recrow .recrow .recrowcontent {
	color: #cccccc;
}
</style>