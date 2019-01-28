<template>
	<div id="examadd">
		<div style="width: 100%; height: 35px;">
			<span style="color: #1281b2; font-weight: bold">|</span> 
			考核管理
		</div>	
		<div class="texts">
			<div class="expbelong">所属实验： 
				<template>
				  <el-select class="longselect"
				  			 v-model="exp_value" 
				  			 placeholder="请搜索实验名称"
				  			 filterable>
				    <el-option
				      v-for="item in exp_options"
				      :key="item.id"
				      :label="item.name"
				      :value="item.id">
				    </el-option>
				  </el-select>
				</template>
					
				<span class="redalert" v-show="!exp_value">*</span>
				<span class="whitedefault" v-show="exp_value">*</span>
			</div>
			<div style="height: 30px;"></div>

			<div> 考核名称： 
				<input class="longinput" type="text" v-model="exam_name">
				<span class="redalert" v-show="!exam_name">*</span>
				<span class="whitedefault"v-show="exam_name">*</span>
			</div>	
			<div style="height: 30px;"></div>
			<div class="countdiv">
				<div class="counttitle">题数限制:</div>
				<input class="longinput countinp" type="text" v-model="count">
				<span>题</span>
				<span class="mincount">最少10题</span>
			</div>
			<div style="height: 30px;"></div>

			<div class="typediv">
				<div class="typetitle">考核类型:</div>
				<!--same v-model: same group-->
				<input id="exam" v-model="type" type="radio" checked="checked" value=1>
				<label for="exam">考核</label>

				<input id="rescue" v-model="type" type="radio" value=2 style="margin-left: 20px;">
				<label for="rescue">抢救治疗</label>
			</div>
			<div style="height: 30px;"></div>

			<div class="btn-group">
				<el-button class="confirm" v-on:click="saveEdit()">确定</el-button>
				<el-button class="goback" v-on:click="goBack()">取消</el-button>
			</div>						
		</div>

	</div>
</template>

<script type="text/javascript">
	import Utils from '@/components/Utils.js';
	import global_ from '@/components/Global.js';
	export default {
		data(){
			return {
				id:'',
				type: 1,
				count: 10,
				exp_value: '',
				exam_name: '',
				exp_options: []
			}
		},

		methods: {
			fillExpSelect(){
				asyncReq.call(this);
				async function asyncReq(){
					let resp = await Utils.reqExpList.call(this);
					this.exp_options = resp.body._list;
					this.exp_options.unshift({'name': '所有实验', 'id': null});
				}				
			},

			saveEdit(){
				var api = global_.exam_update;
				let data = {
					'id': this.id,
					'name': this.exam_name,
					'eid': this.exp_value,
					'type': this.type,
					'count': this.count
				}
				//console.log(data);
				this.$http.post(api, data).then((resp)=>{
					Utils.lalert('编辑考核成功');
					this.$router.go(-1);

				}, (err)=>{
					Utils.err_process.call(this, err, '编辑考核失败');
				});
			},

		    goBack(){
		    	this.$router.go(-1);
		    },
		},

		mounted(){
			var edit = this.$store.state.edit;
			
			if(!edit) {
				this.$router.go(-1);

			} else {
				this.fillExpSelect();
				var row = this.$store.state.row;
				//console.log(row);
				this.id = row.id;
				this.exp_value = row.eid;
				this.exam_name = row.name;
				this.count = row.count;
				this.type = row.type;
			}
		}
	}
</script>


<style type="text/css" scoped>
.longselect /deep/ .el-input__inner {
	height: 34px;
	width: 300px;
}
.redalert {
	color: red;
}
.whitedefault {
	/*same with bg color*/
	color: #ffffff;
}
.texts {
	width: 430px;
	height: 300px;
	text-align: right;
}

.texts .btn-group {
	float: left;
	margin-left: 118px;
}
.countdiv {
	display: flex;
	align-items: baseline;
	margin-left: 30px;
}

/*overwrite global setting*/
.countinp {
	margin-left: 20px;
	margin-right: 10px;
	padding: 0;
	width: 40px;
	text-align: center;
}
.counttitle {
	position: relative;
	left: 8px;
}
.mincount {
	margin-left: 30px;
	color: #cccccc;
}

.typediv {
	display: flex;
	margin-left: 10px;
}

.typetitle {
	margin-left: 28px;
	margin-right: 12px;
}

#rescue + label::before {
  margin-left: 10px;
}
</style>