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

				<div class="searchbtn expcatag-searchbtn" v-on:click="list=searchReq(tableData)">
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


		<div style="height: 45px;"></div>

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

		<RecTable v-bind:item_list="list"
				  v-bind:mod_name="mod_name"
				  v-bind:current_page="curPage"
				  v-bind:search_state="search_state"
				  @refreshPage='reqCatagList'></RecTable>

		<div style="height: 40px;"></div>
   		<Pager 	v-bind:current_page='curPage' 
   				v-bind:pages='totalPage'
   		       	@setPage='filterSearchData'
   		       	></Pager>	

	</div>
</template>

<script type="text/javascript">
	import global_ from '@/components/Global.js';
	import Utils from '@/components/Utils.js';
	import RecTable from './RecTable.vue';
	import Pager from '@/components/Pager.vue';

	export default {
		components: {
			'RecTable': RecTable,
			'Pager': Pager
		},

		data(){
			return {
				//displayed data
				list: [],
				//all data
				tableData: [],
				search_state:'',
				curPage: 1,
				totalRow: 0,
				rowsPerPage: 5,
				mod_name: 'expcatag',
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
			invokeSearch(e){
				if(e.keyCode == 13) {
					//this.list = this.searchReq(this.tableData);
					this.filterSearchData(1);
				}
			},

			reqCatagList(page){
				var api = global_.expcatag_list;
				let data = {
					'all': 1
				}

				this.$http.post(api, data).then((resp)=>{
					this.tableData = resp.body;
					this.totalRow = resp.body.length;

					//this.tableData[1].sub_categories[0].created_at = 1548148931;
					//this.tableData[1].sub_categories[0].updated_at = 1548149001;
					/*
					for(var i in this.tableData) {
						if(this.tableData[i].hasOwnProperty('sub_categories')) {
							for(var j in this.tableData[i].sub_categories) {
								this.tableData.splice(i+1, 0, this.tableData[i].sub_categories[j]);
							}
						}
					}*/
					this.filterSearchData(page);
					//console.log(resp.body);
					layer.close(this.loading);

				}, (err)=>{
					Utils.lalert('请求实验分类列表失败');
					layer.close(this.loading);
					console.log(err);
				});
			},

			/*
			filterData(page){
				this.list = this.tableData.slice(this.rowsPerPage*(page-1), this.rowsPerPage*page);
				this.curPage = page;				
			},*/

			// filter data with search keyword
			filterSearchData(page){
				this.list = this.searchReq(this.tableData).slice(this.rowsPerPage*(page-1), this.rowsPerPage*page);
				this.curPage = page;	
			},

			searchReq(data){
				var result = [];

				if(!this.search_state) {
					result = data;

				} else {
					result = data.filter( item => item.name.indexOf(this.search_state) != -1 );
					var parents = data.filter( item => item.hasOwnProperty('sub_categories'));
					for(let i in parents) {
						result = result.concat(this.searchReq(parents[i].sub_categories));
					}
				}
				this.totalRow = result.length;
				return result;
			},

			addCatag(){
				this.$router.push('/expcatagadd');
			},

			pageSizeChange(){
				this.filterSearchData(1);
			}
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
			this.reqCatagList(1);
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