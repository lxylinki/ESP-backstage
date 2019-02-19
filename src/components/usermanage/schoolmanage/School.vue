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
			invokeSearch(e){
				if(e.keyCode === 13) {
					this.reqSchList(this.search_state,'', 1);
				}
			},

			searchReq(){
				this.reqSchList(this.search_state,'', 1);
			},

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
					//console.log(resp);
			    	this.$store.commit('sign', this.mod_name);
			    	this.$store.commit('setRowNumBefore', resp.body.total);
			    	this.$store.commit('setRowNumAfter', resp.body.total);
			    	this.$store.commit('setRowsPerPage', this.rowsPerPage);

					this.tableData = resp.body._list;
					this.totalPage = resp.body.total_page;
					this.filterData(page);
					layer.close(this.loading);

				}, (err)=>{
					layer.close(this.loading);
					Utils.err_process.call(this, err, '请求学校列表失败');
				});			
			},
			pageSizeChange(){
				this.reqSchList(this.search_state,'',1);
			},
			filterData(page){
				this.list = this.tableData;
				this.curPage = page;
			},

			loadPage(page){
				this.reqSchList(this.search_state, '', page);
			},

			editRow(row) {
				this.$store.commit('sign', this.mod_name);
				this.$store.commit('setEdit', true);
				this.$store.commit('pickRow', row);
				this.$store.commit('setCurPage', this.curPage);
				this.$store.commit('setCurSearch', this.search_state);
				this.$store.commit('setRowsPerPage', this.rowsPerPage);
				this.$router.push('/schooledit');				
			},

			deleteRow(row) {
				var _this = this;
				Utils.lconfirm("确定删除学校？", function(){_this.delSchool(row)});
			},

			delSchool(row) {
				var api = global_.school_delete;
				let data = {
					'id': row.id
				}
				this.$http.post(api, data).then((resp)=>{
					Utils.lalert('删除学校成功');
					this.loadPage(this.curPage);

				}, (err)=>{
					if(err.body.error.hasOwnProperty('id')){
						Utils.lalert('所选学校已有用户');
					} else {
						Utils.lalert('删除学校失败');
					}
					console.log(err);
				});
			}
		},

		beforeMount(){
			this.loading = layer.load(1, {shade: false});
		},

		mounted(){
			Utils.page_check_status.call(this);
			
			var name = this.$store.state.last_author;

			if(name === this.mod_name) {
				var before = this.$store.state.row_num_before,
					after = this.$store.state.row_num_after,
					pagesize = this.$store.state.rows_per_page,
					keyword = this.$store.state.current_search,
					curpage = this.$store.state.current_page;

				if (pagesize > 0) {
					this.rowsPerPage = pagesize;
				}

				if (keyword) {
					this.search_state = keyword;
				}

				//item added: default append to list end
				if(after > before) {
					this.curPage = Math.ceil(after / this.rowsPerPage);	

				} else if(curpage > 0) {
					this.curPage = curpage;
				} 				
			}
			
			this.reqSchList(this.search_state,'', this.curPage);
		}
	}
</script>

<style type="text/css" scoped>
.addbtndiv {
	display: inline-block;
	margin-top: 15px;
}
</style>