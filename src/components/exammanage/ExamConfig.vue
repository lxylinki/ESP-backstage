<template>
	<div id="examconfig">

		<div style="width: 100%; height: 35px;">
			<span style="color: #1890ff; font-weight: bold">|</span> 
			考核管理
			<el-button class="altgoback" type="text" v-on:click="goBack()">返回</el-button>
		</div>

		<div class="selectclass">

			<div class="addbtndiv">
				<el-button class="addbtn" v-on:click="showQbank()">添加</el-button>
			</div>

			<div class="searchwindow econfig-searchwindow">

				<input class="searchinput" 
						  v-model="search_state"
						  v-on:keydown="invokeSearch($event)"
						  placeholder="请搜索试题名称">
				</input>

				<div class="searchbtn econfig-searchbtn" v-on:click="filterSearchData(1)">
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
		    class="mytable"
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
		      min-width="100"
		      :show-overflow-tooltip="true">
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
		      	<span v-if="scope.row.type == 2">多选</span>
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

   		<div id="show-quesbank" v-show="false">
			<div class="selectclass">
				<div style="display: inline-block; width: 20px;"></div>
				<div class="pickexptitle">实验： </div>
			    <div class="allexp" style="display: inline-block;">
			    	<div class="select-header select-header-normal">
				    	<input type="text" class="select-header-text" placeholder="请搜索实验名称" v-on:focus="showToggle=true" v-model="exp_search_state"></input>
						<i class="iconfont togglesign" v-on:click="toggleList()" v-show="!showToggle">&#xe607;</i>
						<i class="iconfont togglesign" v-on:click="toggleList()" v-show="showToggle">&#xe608;</i>
			    	</div>

					<div class="select-list" v-show="showToggle" style="overflow-y: scroll; height: 190px;">
						<li class="select-item" v-for="item in filtered_exp" v-on:click="makeChoice(item)">{{item.name}}</li>	
					</div>
			    </div>

				<div style="display: inline-block; width: 20px;"></div>
				<div class="pickquestype">题型： </div>

			    <div class="alltype" style="display: inline-block;">
			    	<div class="select-header-2 select-header-normal">
				    	<input type="text" class="select-header-text" placeholder="请选择题型" v-on:focus="showTypeToggle=true" v-model="type_search_state"></input>
						<i class="iconfont togglesign" v-on:click="toggleTypeList()" v-show="!showTypeToggle">&#xe607;</i>
						<i class="iconfont togglesign" v-on:click="toggleTypeList()" v-show="showTypeToggle">&#xe608;</i>
			    	</div>

					<div class="select-list" v-show="showTypeToggle" style="height: 120px;">
						<li class="select-item" v-for="item in type_options" v-on:click="makeTypeChoice(item)">{{item.label}}</li>	
					</div>
			    </div>

				<div class="searchwindow quesmng-searchwindow">
					<input class="searchinput" 
							  v-model="ques_search_state"
							  v-on:keydown="invokeQSearch($event)"
							  placeholder="请搜索试题名称">
					</input>
					<div class="searchbtn quesmng-searchbtn" v-on:click="filterSearchData(1)">
						<i class="el-icon-search" ></i>
					</div>
				</div>
			</div><!--selectclass-->

			<div style="height: 20px;"></div>
			<template>
			  <el-table
			    :data="qlist"
			    style="width: 100%;">
			    <el-table-column
			      prop="question"
			      label="试题名称"
			      min-width="100"
			      :show-overflow-tooltip="true">
			    </el-table-column>
			    
			    <el-table-column
			      prop="exp_belong"
			      label="所属实验"
			      min-width="100">
			    </el-table-column>
			    		    
			     <el-table-column
			      prop="type"
			      label="题型"
			      min-width="100">
			      <template slot-scope="scope">
			      	<span v-if="scope.row.type == 1">单选</span>
			      	<span v-if="scope.row.type == 2">多选</span>
			      </template>
			    </el-table-column>
			    <!--
			     <el-table-column
			      prop="create_time"
			      label="创建时间"
			      min-width="100">
			    </el-table-column>

			     <el-table-column
			      prop="update_time"
			      label="更新时间"
			      min-width="100">
			    </el-table-column>-->

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
			      	<el-button v-show="!focus_qids.includes(scope.row.id)" class="op selectbtn" type="text" @click="selectRow(scope.row)">
			      		+选题
			      	</el-button>
			      	<el-button v-show="focus_qids.includes(scope.row.id)" class="op removebtn" type="text" @click="removeRow(scope.row)">
			      		-移除
			      	</el-button>
			      </template>
			    </el-table-column>

			  </el-table>
			</template>

			<div style="height: 40px;"></div>
	   		<Pager 	v-bind:current_page='curQPage' 
	   				v-bind:pages='totalQPage'
	   		       	@setPage='filterQSearchData'></Pager>

   		</div>

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
				exam_id: '',
				exp_value: '',
				qtype_value: '',
				search_state:'',
				rowsPerPage: 10,
				totalRow: 0,
				totalQRow: 0,
				qRowsPerPage: 5,
				curPage: 1,
				curQPage: 1,
				list:[],
				qlist:[],
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
				exp_search_state: '',
				type_search_state: '',
				ques_search_state: '',
				filtered_exp: [],
				showToggle: false,
				showTypeToggle: false,	
				type_options:[
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
				type_value: '',	
				focus_qids: [],	
				limit: 0,
				current_count: 0
			}
		},

		watch: {
			exp_search_state(newVal, oldVal) {
				if (!this.exp_search_state) {
					this.filtered_exp = this.exp_options;
				} else {
					this.filtered_exp = this.exp_options.filter( item => item.name.indexOf(this.exp_search_state) != -1);
				}
			},
		},

		methods: {
			selectRow(qrow){
				//console.log(this.current_count, this.limit);
				if(this.current_count === this.limit) {
					Utils.lalert('已达到最大题数限制');
					return;
				} 
				var api = global_.exam_ques_create;
				let data = {
					'exam_id': this.exam_id,
					'question_id': qrow.id
				}
				this.$http.post(api, data).then((resp)=>{
					this.focus_qids.push(qrow.id);
					qrow.new_id = resp.body.id;
					this.current_count += 1;
					this.reqEquesList(1);

				}, (err)=>{
					Utils.err_process.call(this, err, '添加考核试题失败');
				});
			},

			/*
			contains(arr, item) {
				for(let i in arr) {
					if (arr[i] === item) {
						return true;
					}
				}
				return false;
			},*/

			remove(arr, item) {
				for(let i in arr) {
					if (arr[i] === item) {
						arr.splice(i, 1);
					}
				}
			},

			removeRow(qrow){
				var _this = this;
				Utils.lconfirm("确定删除考核试题？", function(){_this.delQrow(qrow)});
			},

			delQrow(qrow) {
				var api = global_.exam_ques_delete;
				let data = {
					'id': qrow.new_id
				}
				this.$http.post(api, data).then((resp)=>{
					this.remove(this.focus_qids, qrow.id);
					this.reqEquesList(this.curPage);
					Utils.lalert('删除考核试题成功');

				}, (err)=>{
					Utils.err_process.call(this, err, '删除考核试题失败');
				});						
			},

			invokeQSearch(e) {
				if(e.keyCode == 13) {
					this.filterQSearchData(1);
				}
			},
			
			inactivate(){
				$(document).on('click', '.select-header', function(){
					$(this).removeClass('select-header-normal').addClass('select-header-active');
				});

				$(document).on('click', '.select-header-2', function(){
					$(this).removeClass('select-header-normal').addClass('select-header-active');
				});

				var _this = this;
				$(document).on('blur', '.select-header', function(){
					$(this).removeClass('select-header-active').addClass('select-header-normal');
					_this.showToggle = false;
				});		

				$(document).on('blur', '.select-header-2', function(){
					$(this).removeClass('select-header-active').addClass('select-header-normal');
					_this.showTypeToggle = false;
				});				
			},

			reqEquesList(page){
				var api = global_.exam_ques_list;
				let data = {
					"exam_id": this.exam_id
				}

				this.$http.post(api, data).then((resp)=>{
					this.tableData = resp.body._list;
					this.current_count = this.tableData.length;
					//console.log(this.current_count);

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

			findExp(exp_list, eid){
				for (let i in exp_list) {
					if(exp_list[i].id === eid) {
						return exp_list[i];
					}
				}
				return null;
			},

			reqQuesList(page){
				asyncReq.call(this);
				async function asyncReq(){
					let resp = await Utils.reqExpList.call(this);
					this.exp_options = resp.body._list;
					this.filtered_exp = resp.body._list;
					this.filtered_exp.unshift({'name': '所有实验', 'id': null});

					//fetch all then slice
					var api = global_.ques_list + '?page=1'; 

					this.$http.post(api, {}).then((resp)=>{
						var total_ques = resp.body.total;
						this.totalQRow = resp.body.total;
						var full_list_api = api + '&pagesize='+ total_ques;

			     		this.$http.post(full_list_api, {}).then((resp)=>{
							
							this.tableQData = resp.body._list;

							for(let i in this.tableQData) {
								let item = this.tableQData[i];
								let exp = this.findExp(this.exp_options, item.eid);
								if(exp) {
									item.exp_belong = exp.name; 
								}
							}
					    	//cut page here
							this.filterQSearchData(page);
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

			invokeSearch(e){
				if(e.keyCode == 13) {
					this.filterSearchData(1);
				}
			},

			searchReq(data, keyword){
				var result = [];
				if(!keyword) {
					result = data;

				} else {
					result = data.filter( item => item.question && item.question.indexOf(keyword) != -1 );
				}
				return result;
			},

			pageSizeChange(){
				this.filterSearchData(1);
			},

			filterSearchData(page) {
				var search_res = this.searchReq(this.tableData, this.search_state);
				this.list = search_res.slice(this.rowsPerPage*(page-1), this.rowsPerPage*page);
				this.totalRow = search_res.length;
				this.curPage = page;
			},

			filterQSearchData(page) {
				var search_res;
				if(!this.type_value) {
					search_res = this.searchReq(this.tableQData, this.ques_search_state);

				} else {
					search_res = this.searchReq(this.tableQData, this.ques_search_state).filter(item => item.type == this.type_value);
				}

				this.totalQRow = search_res.length;
				if(!this.exp_value) {
					this.qlist = search_res.slice(this.qRowsPerPage*(page-1), this.qRowsPerPage*page);

				} else {
					var	search_exp_res = search_res.filter(item => item.eid === this.exp_value);
					this.qlist = search_exp_res.slice(this.qRowsPerPage*(page-1), this.qRowsPerPage*page);
					this.totalQRow = search_exp_res.length;
				}
				this.curQPage = page;
			},

			deleteRow(row){
				console.log(row);
				var _this = this;
				Utils.lconfirm("确定删除考核试题？", function(){_this.delEques(row)});
			},

			delEques(row) {
				var api = global_.exam_ques_delete;
				let data = {
					'id': row.id
				}
				this.$http.post(api, data).then((resp)=>{
					this.reqEquesList(this.curPage);
					Utils.lalert('删除考核试题成功');

				}, (err)=>{
					Utils.err_process.call(this, err, '删除考核试题失败');
				});						
			},

		    goBack(){
		    	this.$router.go(-1);
		    },

		    showQbank(){
				layer.open({
					type: 1,
					area: [],
					title: '',
					content: $('#show-quesbank')
				});		    	
		    },

			toggleList(){
				this.showToggle = !this.showToggle;
			},

			toggleTypeList(){
				this.showTypeToggle = !this.showTypeToggle;
			},

			makeChoice(item){
				this.exp_search_state = item.name;
				this.exp_value = item.id;
				this.filterQSearchData(this.curQPage);
				this.showToggle = false;
			},

			makeTypeChoice(item){
				this.type_search_state = item.label;
				this.type_value = item.value;
				this.filterQSearchData(this.curQPage);
				this.showTypeToggle = false;
			}
		},

		computed: {
			totalPage(){
				return Math.ceil(this.totalRow / this.rowsPerPage);
			},

			totalQPage(){
				return Math.ceil(this.totalQRow / this.qRowsPerPage);
			}
		},

		mounted(){
			Utils.page_check_status.call(this);

			var edit = this.$store.state.edit;
			if(!edit) {
				this.$router.go(-1);

			} else {
				var row = this.$store.state.row;
				this.exam_id = row.id;
				this.limit = Number(row.count);
				this.reqEquesList(1);
				this.reqQuesList(1);
				this.inactivate();
			}
		}
	}
</script>

<style type="text/css" scoped>
#show-quesbank {
	padding: 20px;
	height: 100%;
}
.selectclass {
	background: white;
}

.addbtndiv {
	display: inline-block;
	margin-top: 15px;
}
.altgoback {
	margin-left: 20px;
}

.pickexptitle {
	display: inline-block; 
	line-height: 70px;
}

.pickquestype {
	display: inline-block;
}

.select-header, .select-header-2 {
	background: #ffffff;
	box-sizing: border-box;
	font-size: 14px;
	margin: auto;
	margin-top: 10px;
	padding-left: 10px;
	padding-right: 10px;
	padding-top: 5px;
	width: 200px;
	height: 30px;
	border-radius: 0px;
}

.select-header-normal {
	border: 1px solid #cccccc;
	/*box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);*/
}

.select-header-active {
	border: 1px solid #619cde;
	/*box-shadow: 0 1px 6px rgba(97, 156, 222, 0.2);*/
}

.select-list {
	box-sizing: border-box;
	background: #ffffff;
	position: absolute;
	z-index: 10;
	margin: auto;
	padding-left: 5px;
	padding-right: 5px;
	margin-top: 5px;
	width: 200px;
	height: 100%;
	border: 1px solid #cccccc;
	box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
}

.togglesign {
	float: right;
	font-size: 12px;
	color: #cccccc;
	cursor: pointer;
}

.select-header-text, .togglesign {
	display: inline-block;
}

.select-header-text {
	border: none;
}

.select-header-text:focus {
	outline: none;
}

.select-item {
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	cursor: pointer !important;
	font-size: 14px;
	margin: 5px;
	height: 30px;
	line-height: 30px;
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