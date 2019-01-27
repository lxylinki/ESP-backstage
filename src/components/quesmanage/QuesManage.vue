<template>
	<div id="quesmanage">
		<div style="width: 100%; height: 35px;">
			<span style="color: #1890ff; font-weight: bold">|</span> 
			试题管理
		</div>
		<div style="height: 20px;"></div>

		<div class="selectclass">
			<div style="display: inline-block; width: 20px;"></div>
			<div class="pickexptitle">实验： </div>
			<div style="display: inline-block;">
				  <el-select v-model="exp_value" filterable placeholder="请搜索实验名称" v-on:change="filterSearchData(1)">
				    <el-option
				      v-for="item in exp_options"
				      :key="item.id"
				      :label="item.name"
				      :value="item.id">
				    </el-option>
				  </el-select>		
			</div>
			<div style="display: inline-block; width: 20px;"></div>
			<div class="pickquestype">题型： </div>
			<div style="display: inline-block;">
				  <el-select v-model="qtype_value" placeholder="请选择题型" v-on:change="filterSearchData(1)">
				    <el-option
				      v-for="item in qtype_options"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select>					
			</div>

			<div class="searchwindow quesmng-searchwindow">

				<input class="searchinput" 
						  v-model="search_state"
						  v-on:keydown="invokeSearch($event)"
						  placeholder="请搜索试题名称">
				</input>

				<div class="searchbtn quesmng-searchbtn" v-on:click="filterSearchData(1)">
					<i class="el-icon-search" ></i>
				</div>

			</div>
		</div><!--selectclass-->

		<div style="display: flex; justify-content: space-between; align-items: baseline;">
			<div class="addbtndiv">
				<el-button class="addbtn" v-on:click="addQues()">添加</el-button>
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
		      prop="question"
		      label="试题名称"
		      min-width="100"
		      :show-overflow-tooltip="true">
		    </el-table-column>
		    
		    <el-table-column
		      prop="exp_catag"
		      label="实验分类"
		      min-width="100">
		    </el-table-column>
		    		    
		     <el-table-column
		      prop="type"
		      label="题型"
		      min-width="100">
		      <template slot-scope="scope">
		      	<span v-if="scope.row.type == 1">单选</span>
		      	<span class="notinuse" v-if="scope.row.type == 2">多选</span>
		      </template>
		    </el-table-column>

		     <el-table-column
		      prop="create_time"
		      label="创建时间"
		      min-width="100">
		    </el-table-column>

		     <el-table-column
		      prop="update_time"
		      label="更新时间"
		      min-width="100">
		    </el-table-column>

		    <!--<el-table-column
		      prop=""
		      label="作者"
		      min-width="100">
		    </el-table-column>-->

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
		</template>

		<div style="height: 40px;"></div>
   		<Pager 	v-bind:current_page='curPage' 
   				v-bind:pages='totalPage'
   		       	@setPage='filterSearchData'></Pager>

	</div>
</template>

<script type="text/javascript">
	import Utils from '@/components/Utils.js';
	import global_ from '@/components/Global.js';
	import Pager from '@/components/Pager.vue';

	export default {
		components: {
			'Pager': Pager
		},

		data(){
			return {
				mod_name: 'ques-manage',
				loading: null,
				rowsPerPage: 10,
				totalRow: 0,
				curPage: 1,
				search_state:'',
				exp_value:'',
				qtype_value:'',
				list:[],
				tableData:[],
				exp_options:[],
				qtype_options:[
					{
						label: '全部',
						value: null
					},
					{
						label: '单选',
						value: 1
					},
					{
						label: '多选',
						value: 2
					}				
				],
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
			invokeSearch(e) {
				if(e.keyCode == 13) {
					this.filterSearchData(1);
				}
			},
			addQues(){
				this.$router.push('/quesadd');
			},

			pageSizeChange(){
				this.filterSearchData(1);
			},

			reqQuesList(page){
				asyncReq.call(this);
				async function asyncReq(){
					let resp = await Utils.reqExpList.call(this);
					this.exp_options = resp.body._list;
					this.exp_options.unshift({'name': '所有实验', 'id': null});

					var api = global_.ques_list
							+ '?page=' 
							+ page 
							+ '&pagesize=' 
							+ this.rowsPerPage;

					this.$http.post(api, {}).then((resp)=>{
						var total_exp = resp.body.total;
						this.totalRow = resp.body.total;
						var full_list_api = api + '&pagesize='+ total_exp;

			     		this.$http.post(full_list_api, {}).then((resp)=>{
							this.tableData = resp.body._list;
							for(let i in this.tableData) {
								let item = this.tableData[i];
								item.exp_catag = this.findExp(this.exp_options, item.eid).name;
								item.create_time = Utils.convTime(item.created_at);
								item.update_time = Utils.convTime(item.updated_at);
							}
							this.filterSearchData(this.curPage);
							layer.close(this.loading);
			     			
			     		}, (err)=>{
			     			layer.close(this.loading);
			     			Utils.err_process.call(this, err, '请求试题列表失败');
				     		console.log(err);
			     		});						

					}, (err)=>{
						Utils.err_process.call(this, err, '请求试题列表失败');
						layer.close(this.loading);
						console.log(err);
					});
				}
			},

			findExp(exp_list, eid){
				for (let i in exp_list) {
					if(exp_list[i].id === eid) {
						return exp_list[i];
					}
				}
				return null;
			},

			searchReq(data){
				var result = [];
				if(!this.search_state) {
					result = data;

				} else {
					result = data.filter( item => item.question.indexOf(this.search_state) != -1 );
				}
				this.totalRow = result.length;
				return result;
			},

			filterSearchData(page){
				var search_res;

				//filter by qtype
				if (!this.qtype_value) {
					search_res = this.searchReq(this.tableData);
				} else {
					search_res = this.searchReq(this.tableData).filter(item => item.type == this.qtype_value);
				}
				this.totalRow = search_res.length;

				//filter by exp
				if(!this.exp_value) {
					this.list = search_res.slice(this.rowsPerPage*(page-1), this.rowsPerPage*page);

				} else {
					var	search_exp_res = search_res.filter(item => item.eid == this.exp_value);
					this.list = search_exp_res.slice(this.rowsPerPage*(page-1), this.rowsPerPage*page);
					this.totalRow = search_exp_res.length;
				}
				this.curPage = page;
			},
		},
		
		computed: {
			totalPage(){
				return Math.ceil(this.totalRow / this.rowsPerPage);
			}
		},

		beforeMount(){
			this.loading = layer.load(1, {shade: false});
		},

		mounted(){
			this.reqQuesList(1);
		}
	}
</script>

<style type="text/css" scoped>
.selectclass {
	background: white;
}

.pickexptitle {
	display: inline-block; 
	line-height: 70px;
}

.pickquestype {
	display: inline-block;
}
</style>