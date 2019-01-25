<template>
	<div class="rectablerows">
			<tr class="recrow" v-for="(item, idx) in item_list">
				<div class="recrowcontent" >
					<td class="name"><div class="nametext">{{item.name}}</div></td>
					<td class="level">{{item.level}}</td> 
					<td class="created_at">{{tconv(item.created_at)}}</td>
					<td class="updated_at">{{tconv(item.updated_at)}}</td>
					<!--<td class="cid">{{item.id}}</td>-->
					<td class="operation">
				      	<el-button  class="op edit" type="text" @click="editRow(item)">
				      		<i class="iconfont">&#xe61a;</i>编辑
				      	</el-button>						
				      	<el-button class="op delete" type="text" @click="deleteRow(item)">
				      		<i class="iconfont">&#xe7e0;</i>删除
				      	</el-button>						
					</td>
				</div>

				<RecTable v-if="item.hasOwnProperty('sub_categories')" 
						  v-bind:item_list="item.sub_categories">
				</RecTable>
			</tr>	
	</div>
</template>

<script type="text/javascript">
	import Utils from '@/components/Utils.js';
	import store from '@/vuex/store.js';
	import global_ from '@/components/Global.js';

	export default {
		name: 'RecTable',
		props:['item_list', 'mod_name', 'current_page', 'search_state'],
		methods: {
			tconv(ntime){
				return Utils.convTime(ntime);
			},

			editRow(row){
				this.$store.commit('sign', this.mod_name);
				this.$store.commit('setEdit', true);
				this.$store.commit('pickRow', row);
				this.$store.commit('setCurPage', this.current_page);
				this.$store.commit('setCurSearch', this.search_state);
				this.$router.push('/expcatagedit');
			},

			deleteRow(row){
				var _this = this;
				Utils.lconfirm("确定删除实验分类？", function(){_this.delCatag(row)});
			},

			delCatag(row){
				var api = global_.expcatag_delete;
				let data = {
					'id': row.id
				}
				this.$http.post(api, data).then((resp)=>{
					Utils.lalert('删除实验分类成功');
					this.$emit('refreshPage', this.current_page);
					//this.loadPage(this.curPage);

				}, (err)=>{
					Utils.err_process.call(this, err, '删除实验分类失败');
				});
			}

		}
	}
</script>

<style type="text/css" scoped>
* {
	font-size: 14px;
}

td {
	height: 42px;
	vertical-align: middle;
	text-align: center;
}

.name {
	text-align: left !important;
	padding-left: 20px;
}

.nametext {
	width: 120px;
	text-overflow: ellipsis;
	overflow: hidden; 
	white-space: nowrap;
}

.edit, .delete {
	display: inline-block;
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
	color: #333333;
	margin: 0;
}
.recrowcontent:hover {
	background: #f7f8fc;
}

/*sub item*/
.recrow .recrow .recrowcontent .name{
	padding-left: 20px;
}

.recrow .recrow .recrowcontent .name .nametext {
	width: 100px;
	padding-left: 20px;
}

.recrow .recrow .recrowcontent {
	color: #757575;
}

.op {
	bottom: 0px;
}

</style>