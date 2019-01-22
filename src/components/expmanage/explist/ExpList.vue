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
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
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

		<template>
		  <el-table
		    :data="list"
		    style="width: 100%;">
		    <el-table-column
		      prop=""
		      label="实验名称"
		      min-width="100">
		    </el-table-column>
		    
		    <el-table-column
		      prop=""
		      label="编号"
		      min-width="100">
		    </el-table-column>
		    		    
		     <el-table-column
		      prop=""
		      label="所属分类"
		      min-width="100">
		    </el-table-column>

		     <el-table-column
		      prop=""
		      label="创建时间"
		      min-width="100">
		    </el-table-column>

		     <el-table-column
		      prop=""
		      label="创建时间"
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
	export default {
		data(){
			return {
				list: [],
				tableData: [],
				catag_options: [],
				catag_value: '',
				search_state: ''
			}
		},
		methods: {
			
		}
	}
</script>

<style type="text/css" scoped>
.selectclass {
	background: white;
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