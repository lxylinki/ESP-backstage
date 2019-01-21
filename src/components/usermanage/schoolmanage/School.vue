<template>
	<div id="school">
		<div style="width: 100%; height: 35px;">
			<span style="color: #1890ff; font-weight: bold">|</span> 
			学校管理
		</div>

		<div class="selectclass">
			<div class="addbtndiv">
				<el-button class="addbtn" v-on:click="addSchool()">添加</el-button>
			</div>

			<div class="searchwindow school-searchwindow">

				<input class="searchinput" 
						  v-model="search_state"
						  v-on:keydown="invokeSearch($event)"
						  placeholder="请搜索学校名称">
				</input>

				<div class="searchbtn school-searchbtn" v-on:click="searchReq()">
					<i class="el-icon-search" ></i>
				</div>

			</div>
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

		<template>
		  <el-table
		    :data="list"
		    style="width: 100%;">

			<el-table-column
			  label="序号"
			  type="index"
			  min-width="100">
			</el-table-column>
		    
		    <el-table-column
		      prop="name"
		      label="学校名称"
		      min-width="100">
		    </el-table-column>
		    	    
		    <el-table-column
		      prop="alias"
		      label="学校简称"
		      min-width="100">
		    </el-table-column>

		    <el-table-column
		      prop="login_num"
		      label="在线人数限制"
		      min-width="100">
		    </el-table-column>

		    <el-table-column
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
   		       	@setPage='loadPage'
   		       	></Pager>


	</div>
</template>

<script type="text/javascript">
	import Pager from '@/components/Pager.vue';
	import global_ from '@/components/Global.js';
	import Utils from '@/components/Utils.js';

	export default {
		components: {
			'Pager': Pager
		},

		data(){
			return {
				mod_name: 'school',
				search_state: '',
				list: [],
				tableData: [],
				curPage: 1,
				totalPage: 0,
				rowsPerPage: 10,
				loading: null,
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
			addSchool(){
				this.$router.push('/schooladd');
			},
			reqSchList(name, alias, page){
				var api = global_.school_list
						+ '?page=' 
						+ page 
						+ '&pagesize=' 
						+ this.rowsPerPage;	

				let data = {
					'search': {
						'name': name,
						'alias': alias
					}
				};

				this.$http.post(api, data).then((resp)=>{
					this.tableData = resp.body._list;
					this.totalPage = resp.body.total_page;
					this.filterData(page);

				}, (err)=>{
					Utils.lalert('请求学校列表失败');
					console.log(err);
				});			
			},

			filterData(page){
				this.list = this.tableData;
				this.curPage = page;
			},

			loadPage(page){
				this.reqSchList('', '', page);
			}
		},

		mounted(){
			this.reqSchList('','',1);
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
</style>