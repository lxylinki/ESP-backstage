<template>
	<div id="explist">
		<div style="width: 100%; height: 35px;">
			<span style="color: #1281b2; font-weight: bold; font-size: 20px;">|</span> 
			<!--<span class="pagetitle">实验列表</span>-->
			实验列表
		</div>

		<div class="selectclass">

			<div class="statustitle">分类：</div>
			
			<div style="display: inline-block;">
				  <el-select v-model="catag_value" placeholder="请选择" v-on:change="filterCatag()">
				    <el-option
				      v-for="item in catag_options"
				      :key="item.id"
				      :label="item.name"
				      :value="item.id">
				    </el-option>
				  </el-select>
			</div>

			<div class="searchwindow explist-searchwindow">

				<input class="searchinput" 
						  v-model="search_state"
						  v-on:keydown="invokeSearch($event)"
						  placeholder="请搜索实验名称">
				</input>

				<div class="searchbtn explist-searchbtn" v-on:click="searchReq()">
					<i class="el-icon-search" ></i>
				</div>

			</div>


		</div>

		<div style="display: flex; justify-content: space-between; align-items: baseline;">
			<div class="addbtndiv">
				<el-button class="addbtn" v-on:click="addExp()">添加</el-button>
			</div>

			<div style="display: inline-block; float: right; margin: 10px;">
				<span>显示 </span>
					<select v-model="rowsPerPage" v-on:change="pageSizeChange()" style="width: 60px; height: 25px;">
						<option v-for="item in row_nums" v-bind:value="item.value">
							{{item.label}}
						</option>
					</select>
				<span> 条</span>
			</div>
		</div>

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
		      prop="id"
		      label="编号"
		      min-width="100">
		    </el-table-column>
		    		    
		     <el-table-column
		      prop="catagory"
		      label="所属分类"
		      min-width="100">
		    </el-table-column>

		     <el-table-column
		      prop="create_time"
		      label="创建时间"
		      min-width="200">
		    </el-table-column>

		     <el-table-column
		      prop="update_time"
		      label="更新时间"
		      min-width="200">
		    </el-table-column>

		    <el-table-column
		      prop="operation"
		      label="操作"
		      min-width="100">

		      <template slot-scope="scope">

		      	<el-button  class="op" type="text" @click="editRow(scope.row)">
		      		<i class="iconfont">&#xe61a;</i>编辑
		      	</el-button>
		      	<!--<el-button type="text" @click="tableData.splice(scope.$index, 1)">-->
		      	<!--<el-button class="op" type="text" @click="delRow(scope.$index)">-->
		      	<el-button class="op" type="text" @click="deleteRow(scope.row)">
		      		<i class="iconfont">&#xe7e0;</i>删除
		      	</el-button>

		      </template>
		    </el-table-column>

		  </el-table>
		</template>

	</div>
</template>

<script type="text/javascript">
	import global_ from '@/components/Global.js';
	import Utils from '@/components/Utils.js';

	export default {
		data(){
			return {
				mod_name: 'exp-list',
				loading: null,
				list: [],
				tableData: [],
				catag_options: [],
				catag_value: '',
				search_state: '',
				curPage: 1,
				rowsPerPage: 10,
				row_nums: [
					{
						label: '5',
						value: 5
					},
					{
						label: '10',
						value: 10
					},
					{
						label: '15',
						value: 15
					},
					{
						label: '20',
						value: 20
					},
					{
						label:'50',
						value: 50
					}
				],
			}
		},

		methods: {
			invokeSearch(e){
				if(e.keyCode == 13) {
					this.searchReq();
				}
			},

			searchReq(){
				//TODO: fetch full list and filter?
			},

			reqExpList(page){
				return new Promise((resolve, reject)=>{
					var api = global_.exp_list
							 + '?page=' 
							 + page 
							 + '&pagesize=' 
							 + this.rowsPerPage;

					this.$http.post(api, {}).then((resp)=>{
						layer.close(this.loading);
						resolve(resp);

					}, (err)=>{
						layer.close(this.loading);
						Utils.err_process.call(this, err, '请求实验列表失败');
					});
				});
			},

			reqData(page) {
				asyncReq.call(this);
				async function asyncReq(){
					let resp = await this.reqExpList(page);

					this.tableData = resp.body._list;

					var catags = resp.body.categories;			
					for(let i in this.tableData) {
						let item = this.tableData[i];
						item.catagory = catags[item.cid].name;
						item.create_time = Utils.convTime(item.created_at);
						item.update_time = Utils.convTime(item.updated_at);
					}

					this.totalPage = resp.body.total_page;
					this.filterData(this.curPage);
				}
			},

			reqCatagList(){
				var api = global_.expcatag_list;
				let data = {
					'all': 1
				}
				this.$http.post(api, data).then((resp)=>{
					this.catag_options = resp.body;
					this.catag_options.unshift({'id': null, 'name': '全部分类'});
					this.catag_value = null;
				}, (err)=>{
					Utils.err_process.call(this, err, '请求实验分类列表失败');
				});				
			},

			addExp(){
				this.$router.push('/expadd');
			},

			filterData(page){
				this.list = this.tableData;
				this.curPage = page;
			},

			filterCatag(){
				if(!this.catag_value) {
					this.list = this.tableData;
				} else {
					this.list = this.tableData.filter(item => item.cid === this.catag_value);
				}
			}
		},

		beforeMount(){
			this.loading = layer.load(1, {shade: false});
		},

		mounted(){
			//Utils.check_status.call(this);
			this.reqCatagList();
			this.reqData(1);
		}
	}
</script>

<style type="text/css" scoped>
.selectclass {
	background: white;
}

.addbtndiv {
	display: inline-block;
	margin-bottom: 15px;
}

.statustitle {
	display: inline-block; 
	line-height: 60px;
}

.explist-searchwindow {
	position: relative;
	top: 15px;
	margin-top: 0px;
}
</style>