<template>
	<div id="explist">
		<div style="width: 100%; height: 35px;">
			<span style="color: #1890ff; font-weight: bold">|</span>  
			<!--<span class="pagetitle">实验列表</span>-->
			实验列表
		</div>

		<div class="selectclass">

			<div class="statustitle">分类：</div>
			
			<!--<div style="display: inline-block;">
				<el-select v-model="catag_value" placeholder="请搜索实验分类名称" v-on:change="filterCatag()" filterable>
					<el-option
					  v-for="item in catag_options"
					  :key="item.id"
					  :label="item.name"
					  :value="item.id">
					</el-option>
				</el-select>
			</div>-->

		    <div class="allcatags" style="display: inline-block;">
		    	<div class="select-header select-header-normal">
			    	<input type="text" class="select-header-text" placeholder="请搜索实验分类名称"  v-on:focus="showToggle=true" v-model="catag_search_state"></input>
					<i class="iconfont togglesign" v-on:click="toggleList()" v-show="!showToggle">&#xe607;</i>
					<i class="iconfont togglesign" v-on:click="toggleList()" v-show="showToggle">&#xe608;</i>
		    	</div>

				<div class="select-list" v-show="showToggle" style="overflow-y: scroll; height: 190px;">
			    	<!--<RecSelect v-bind:item_list="catag_options" @makechoice="makeChoice"></RecSelect>-->
					<li class="select-item" v-bind:class="{leafcatag: item.isleaf}" v-for="item in filtered_catags" v-on:click="makeChoice(item)">{{item.name}}</li>	
				</div>
		    </div>

			<div class="searchwindow explist-searchwindow">

				<input class="searchinput" 
						  v-model="search_state"
						  v-on:keydown="invokeSearch($event)"
						  placeholder="请搜索实验名称">
				</input>

				<div class="searchbtn explist-searchbtn" v-on:click="filterSearchData(1)">
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
		      prop="order"
		      label="编号"
		      min-width="100">
		    </el-table-column>
		 
		    <el-table-column
		      prop="name"
		      label="实验名称"
		      min-width="100"
		      :show-overflow-tooltip="true">
		    </el-table-column>
		    		    
		     <el-table-column
		      prop="catagory"
		      label="所属分类"
		      min-width="100"
		      :show-overflow-tooltip="true">
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

		<div style="height: 40px;"></div>
   		<Pager 	v-bind:current_page='curPage' 
   				v-bind:pages='totalPage'
   		       	@setPage='filterSearchData'></Pager>

	</div>
</template>

<script type="text/javascript">
	import global_ from '@/components/Global.js';
	import Utils from '@/components/Utils.js';
	//import RecSelect from './RecSelect.vue';
	import Pager from '@/components/Pager.vue';

	export default {
		components: {
			//'RecSelect': RecSelect
			'Pager': Pager
		},
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
				totalRow: 0,
				filtered_catags: [],
				catag_search_state:'',
				showToggle: false,
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
			/*
			activate(){
				$('.select-header').removeClass('select-header-normal').addClass('select-header-active');
			},*/

			toggleList(){
				this.showToggle = !this.showToggle;
			},

			makeChoice(item){
				this.catag_search_state = item.name;
				this.catag_value = item.id;
				this.filterSearchData(this.curPage);
				this.showToggle = false;

				// all catags opt is selected
				if(this.catag_value === null) {
					this.catag_options = [];
				}
			},

			invokeSearch(e){
				if(e.keyCode == 13) {
					this.filterSearchData(1);
				}
			},

			searchReq(data){
				var result = [];

				if(!this.search_state) {
					result = data;

				} else {
					result = data.filter( item => item.name.indexOf(this.search_state) != -1 );
				}

				//this.totalRow = result.length;
				return result;
			},

			pageSizeChange(){
				this.$store.commit('sign', this.mod_name);
				this.$store.commit('setRowsPerPage', this.rowsPerPage);
				this.filterSearchData(1);
			},

			reqData() {
				asyncReq.call(this);
				async function asyncReq(){
					let resp = await Utils.reqExpList.call(this);
					//console.log(resp);

					this.tableData = resp.body._list;
					
					var catags = resp.body.categories;
					//console.log(catags);
					for(let i in this.tableData) {
						let item = this.tableData[i];
						//catagory can be deleted and nonexist
						if(catags[item.cid]) {
							item.catagory = catags[item.cid].name;
						}
						
						item.create_time = Utils.convTime(item.created_at);
						item.update_time = Utils.convTime(item.updated_at);
					}

					this.totalRow = resp.body.total;
					this.filterSearchData(this.curPage);
				}
			},

			reqCatagList(){
				this.catag_options = [];
				let api = global_.expcatag_list;
				let data = {
					'all': 1
				}
				this.$http.post(api, data).then((resp)=>{
					//this.catag_options = resp.body;
					for(let i of resp.body) {
						this.catag_options.push(i);

						if(i.hasOwnProperty('sub_categories')) {
							for(let j of i.sub_categories) {
								j.isleaf = true;
								this.catag_options.push(j);
							}
						}
					}

					this.filtered_catags = this.catag_options;
					this.filtered_catags.unshift({'id': null, 'name': '全部分类'});
					this.catag_value = null;

				}, (err)=>{
					Utils.err_process.call(this, err, '请求实验分类列表失败');
				});				
			},

			addExp(){
				this.$router.push('/expadd');
			},

			filterSearchData(page){
				var search_res = this.searchReq(this.tableData);
				this.totalRow = search_res.length;

				if(!this.catag_value) {
					this.list = search_res.slice(this.rowsPerPage*(page-1), this.rowsPerPage*page);

				} else {
					var	search_catag_res = search_res.filter(item => item.cid === this.catag_value);
					this.list = search_catag_res.slice(this.rowsPerPage*(page-1), this.rowsPerPage*page);
					this.totalRow = search_catag_res.length;
				}
				this.curPage = page;
			},

			
			inactivate(){
				var _this = this;
				$(document).on('click', 'body', function(){
					_this.showToggle = false;
					$('.select-header').removeClass('select-header-active').addClass('select-header-normal');
				});	

				$(document).on('click', '.select-header, .select-list', function(e){
					$('.select-header').addClass('select-header-active').removeClass('select-header-normal');
					e.stopPropagation();
				});		
			},

			editRow(row){
				this.$store.commit('sign', this.mod_name);
				this.$store.commit('setEdit', true);
				this.$store.commit('pickRow', row);
				this.$store.commit('setCurPage', this.curPage);
				this.$store.commit('setCurSearch', this.search_state);
				this.$store.commit('setRowsPerPage', this.rowsPerPage);

				this.$router.push('/expedit');
			},

			deleteRow(row){
				var _this = this;
				Utils.lconfirm("确定删除实验？", function(){_this.delExp(row)});
			},
			delExp(row) {
				var api = global_.exp_delete;
				let data = {
					'id': row.id
				}
				this.$http.post(api, data).then((resp)=>{
					Utils.lalert('删除实验成功');
					this.reqData();
					//this.filterSearchData(this.curPage);
				}, (err)=>{
					Utils.err_process.call(this, err, '删除实验失败');
				});				
			}
		},

		computed: {
			totalPage(){
				return Math.ceil(this.totalRow / this.rowsPerPage);
			}
		},
		
		watch: {
			catag_search_state(newVal, oldVal) {
				if (!this.catag_search_state) {
					this.filtered_catags = this.catag_options;

				} else {
					this.filtered_catags = this.catag_options.filter( item => item.name.indexOf(this.catag_search_state) != -1);
					//if entry is non-exist, reset
					if(this.filtered_catags.length === 0) {
						this.catag_options = [];
						this.reqCatagList();
						this.catag_value = null;
					}
				}
			},

			catag_value(newVal, oldVal) {
				this.catag_options = [];
				this.reqCatagList();	
			}
		},

		beforeMount(){
			this.loading = layer.load(1, {shade: false});
		},

		mounted(){
			Utils.page_check_status.call(this);
			
			var name = this.$store.state.last_author;
			if(name === this.mod_name) {
				var	pagesize = this.$store.state.rows_per_page,
					keyword = this.$store.state.current_search,
					curpage = this.$store.state.current_page;

				//console.log(name, pagesize, keyword, curpage);
				
				if (pagesize > 0) {
					this.rowsPerPage = pagesize;
				}

				if (keyword) {
					this.search_state = keyword;
				}

				if(curpage > 0) {
					this.curPage = curpage;
				} 				
			}

			this.inactivate();
			this.reqCatagList();
			this.reqData();
		}
	}
</script>

<style type="text/css" scoped>
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

.select-header {
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

.leafcatag {
	padding-left: 15px;
	color: #757575;
}
</style>