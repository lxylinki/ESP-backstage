<template>
	<div id="explist">
		<div style="width: 100%; height: 35px;">
			<span style="color: #1281b2; font-weight: bold; font-size: 20px;">|</span> 
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

		    <div id="allcatags" style="display: inline-block;">
		    	<div class="select-header select-header-normal" v-on:click="activate()">
			    	<input type="text" class="select-header-text" placeholder="请搜索实验分类名称" v-on:focus="showToggle=true" v-model="catag_search_state"></input>
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
		      prop="order"
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

	</div>
</template>

<script type="text/javascript">
	import global_ from '@/components/Global.js';
	import Utils from '@/components/Utils.js';
	import RecSelect from './RecSelect.vue';

	export default {
		components: {
			'RecSelect': RecSelect
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
			activate(){
				$('.select-header').removeClass('select-header-normal').addClass('select-header-active');
			},

			toggleList(){
				this.showToggle = !this.showToggle;
			},

			makeChoice(item){
				this.catag_search_state = item.name;
				this.catag_value = item.id;
				this.filterCatag();
				this.showToggle = false;
			},

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
					//this.catag_options = resp.body;
					for(let i in resp.body) {
						this.catag_options.push(resp.body[i]);
						if(resp.body[i].hasOwnProperty('sub_categories')) {
							for(let j in resp.body[i].sub_categories) {
								resp.body[i].sub_categories[j].isleaf = true;
								this.catag_options.push(resp.body[i].sub_categories[j]);
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
		
		watch: {
			catag_search_state(newVal, oldVal) {
				if (!this.catag_search_state) {
					this.filtered_catags = this.catag_options;
				} else {
					this.filtered_catags = this.catag_options.filter( item => item.name.indexOf(this.catag_search_state) != -1);
				}
			}
		},

		beforeMount(){
			this.loading = layer.load(1, {shade: false});
		},

		mounted(){

			$(document).on('blur', '.select-header', function(){
				$(this).removeClass('select-header-active').addClass('select-header-normal');
			});

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


.select-header {
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