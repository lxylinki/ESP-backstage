<template>
	<div id="expcatag">
		<div style="width: 100%; height: 35px;">
			<span style="color: #1890ff; font-weight: bold">|</span> 
			实验分类
		</div>

		<div class="selectclass">
			<div class="addbtndiv">
				<el-button class="addbtn" v-on:click="addCatag()">添加</el-button>
			</div>

			<div class="searchwindow expcatag-searchwindow">

				<input class="searchinput" 
						  v-model="search_state"
						  v-on:keydown="invokeSearch($event)"
						  placeholder="请搜索实验名称">
				</input>

				<div class="searchbtn expcatag-searchbtn" v-on:click="searchReq()">
					<i class="el-icon-search" ></i>
				</div>

			</div>
		</div>

		<!--
		<template>
		  <el-table
		    :data="list"
		    style="width: 100%;">
		    <el-table-column
		      prop="name"
		      label="实验名称"
		      min-width="100">
		    </el-table-column>
		    
		    <el-table-column
		      prop="level"
		      label="级别"
		      min-width="100">
		    </el-table-column>
		    		    
		     <el-table-column
		      prop="created_at"
		      label="创建时间"
		      min-width="100">
		    </el-table-column>

		     <el-table-column
		      prop="updated_at"
		      label="更新时间"
		      min-width="100">
		    </el-table-column>

		    <el-table-column
		      prop="operation"
		      label="操作"
		      min-width="100">

		      <template slot-scope="scope">

		      	<el-button  class="op" type="text" @click="editRow(scope.row)">
		      		<i class="iconfont">&#xe61a;</i>编辑
		      	</el-button>
		      	<el-button class="op" type="text" @click="deleteRow(scope.row)">
		      		<i class="iconfont">&#xe7e0;</i>删除
		      	</el-button>

		      </template>
		    </el-table-column>

		  </el-table>
		</template> -->

		<div style="height: 20px;"></div>

		<table class="tableheader">
			<thead >
			<tr>
				<th class="coltitle" style="width: 200px;">实验名称</th>
				<th class="coltitle" style="width: 200px;">级别</th>
				<th class="coltitle" style="width: 300px;">创建时间</th>
				<th class="coltitle" style="width: 300px;">更新时间</th>
				<th class="coltitle" style="width: 200px;">操作</th>
			</tr>
			</thead>
		</table>

		<RecTable v-bind:item_list="tableData"></RecTable>

	</div>
</template>

<script type="text/javascript">
	import global_ from '@/components/Global.js';
	import Utils from '@/components/Utils.js';
	import RecTable from './RecTable.vue';

	export default {
		components: {
			'RecTable': RecTable
		},

		data(){
			return {
				list: [],
				tableData: [],
				search_state:'',
				curPage: 1
			}
		},

		methods: {
			reqCatagList(){
				var api = global_.expcatag_list;
				let data = {
					'all': 1
				}
				this.$http.post(api, data).then((resp)=>{
					this.tableData = resp.body;

					//this.tableData[0].created_at = 1548148931;
					//this.tableData[0].updated_at = 1548149001;
					/*
					for(var i in this.tableData) {
						if(this.tableData[i].hasOwnProperty('sub_categories')) {
							for(var j in this.tableData[i].sub_categories) {
								this.tableData.splice(i+1, 0, this.tableData[i].sub_categories[j]);
							}
						}
					}*/
					this.filterData(this.curPage);
					console.log(resp.body);

				}, (err)=>{
					Utils.lalert('请求实验分类列表失败');
					console.log(err);
				});
			},

			filterData(page){
				this.list = this.tableData;
				this.curPage = page;				
			}
		},

		mounted(){
			this.reqCatagList();
		}
	}
</script>

<style type="text/css" scoped>
/*overwrite global setting*/
.selectclass {
	background: white;
}

.addbtndiv {
	display: inline-block;
	margin-top: 15px;
}

.tableheader {
	font-size: 14px;
	display: block;
	height: 40px;
	width: 100%;
	background: #f7f7f7;
}

.coltitle {
	line-height: 35px;
}

</style>