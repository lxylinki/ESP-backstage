<template>
	<div id="examconfig">
		<div style="width: 100%; height: 35px;">
			<span style="color: #1890ff; font-weight: bold">|</span> 
			考核管理
		</div>

		<div class="selectclass">

			<div class="addbtndiv">
				<el-button class="addbtn" v-on:click="">添加</el-button>
			</div>

			<div class="searchwindow econfig-searchwindow">

				<input class="searchinput" 
						  v-model="search_state"
						  v-on:keydown=""
						  placeholder="请搜索试题名称">
				</input>

				<div class="searchbtn econfig-searchbtn" v-on:click="searchReq()">
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
		      prop="question"
		      label="试题名称"
		      min-width="100">
		    </el-table-column>
		    	    
		    <el-table-column
		      prop="exp_catag"
		      label="实验分类"
		      min-width="100">
		    </el-table-column>

		    <el-table-column
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
		    <!--
		    <el-table-column
		      prop="update_time"
		      label="更新时间"
		      min-width="100">
		    </el-table-column>-->

		    <el-table-column
		      label="操作"
		      min-width="100">

		      <template slot-scope="scope">
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
	import global_ from '@/components/Global.js';
	import Utils from '@/components/Utils.js';
	import Pager from '@/components/Pager.vue';
	export default {
		components: {
			'Pager': Pager
		},
		data(){
			return {
				id: '',
				search_state:'',
				rowsPerPage: 10,
				totalRow: 0,
				curPage: 1,
				list:[],
				tableTable:[],
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
			reqEquesList(page){
				var api = global_.exam_ques_list;
				console.log(this.id);
				let data = {
					"exam_id": this.id
				}

				this.$http.post(api, data).then((resp)=>{
					this.tableData = resp.body._list;

					for(let i in this.tableData) {
						let item = this.tableData[i];
						item.create_time = Utils.convTime(item.created_at);
						if(resp.body.eids.hasOwnProperty(item.eid)) {
							item.exp_catag = resp.body.eids[item.eid].name;
						}
					}

					this.filterSearchData(page);
					
					
				}, (err)=>{
					Utils.err_process.call(this, err, '请求考核试题列表失败');
				});
			},

			searchReq(data){
				var result = [];
				if(!this.search_state) {
					result = data;

				} else {
					result = data.filter( item => item.question.indexOf(this.search_state) != -1 );
				}
				//this.totalRow = result.length;
				return result;
			},

			filterSearchData(page) {
				var search_res = this.searchReq(this.tableData);
				this.list = search_res.slice(this.rowsPerPage*(page-1), this.rowsPerPage*page);
				this.totalRow = search_res.length;
				this.curPage = page;
			},
		},

		computed: {
			totalPage(){
				return Math.ceil(this.totalRow / this.rowsPerPage);
			}
		},

		mounted(){
			var edit = this.$store.state.edit;
			if(!edit) {
				this.$router.go(-1);

			} else {
				var row = this.$store.state.row;
				this.id = row.id;
				this.reqEquesList(1);
			}
		}
	}
</script>

<style type="text/css" scoped>
.selectclass {
	background: white;
}

.addbtndiv {
	display: inline-block;
	margin-top: 15px;
}
</style>