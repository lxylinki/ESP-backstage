import RSAKey from '@/assets/js/rsa.min.js';
import Base from '@/assets/js/base64.js';
import global_ from '@/components/Global.js';


function lalert(text) {
	layer.alert(text, {title:'提示', area:['280px','190px']});
}

function err_process(err, text){
	console.log(err);
	if (err.body.error == -403 || err.status == 403 || err.status == 401) {
		if(this.loading) {
			layer.close(this.loading);
		}		
		this.$router.push('/login');
		
	} else if(text) {
		lalert(text);
	}
}

function lconfirm(text, func) {
	layer.confirm(text, {title:'提示', area:['280px','190px']}, func);		
}

function convTime(ntime) {
	function add0(m){
		return m<10?'0'+m:m 
	}
	var unixTime = new Date(ntime * 1000);
	
	var y = unixTime.getFullYear();
	var m = unixTime.getMonth()+1;
	var d = unixTime.getDate();
	var h = unixTime.getHours();
	var mn = unixTime.getMinutes();

	var commonTime = y + '-'
	               + add0(m) + '-'
	               + add0(d) + ' '
	               + add0(h) + ':' 
	               + add0(mn);
	
	return commonTime;
}

	//login check status: must be super admin
function login_check_status(){
	var profile = global_.status_check;
	this.$http.post(profile, {}).then((resp)=>{
		if(resp.body.group == global_.super_admin_group) {
			this.$router.push('/school');
		}
	}, (err)=>{
		//stay at login
		//err_process.call(this, err, '');
	});
}

	//must be super admin
function page_check_status(){
	var profile = global_.status_check;

	this.$http.post(profile, {}).then((resp)=>{
		if(resp.body.group != global_.super_admin_group) {
			this.$router.push('/login');
		}
	}, (err)=>{
		err_process.call(this, err, '');
	});
}

function encrypt(pswd){
	return new Promise((resolve, reject)=>{
		let nonce, pk, ts, encrypt, epassword;
		var encryptapi = global_.password_encrypt;

		this.$http.post(encryptapi, {}).then((encrypt_response)=>{

			nonce = encrypt_response.body.nonce;
			pk = encrypt_response.body.pk;
			ts = encrypt_response.body.ts;	
			
			let newEncrypter = new RSAKey();
			newEncrypter.setPublic(pk,"10001");
			epassword = Base.hex2b64(newEncrypter.encrypt(JSON.stringify([ts, nonce, pswd])));
			resolve(epassword);

		},(err)=>{
			Utils.lalert('请求加密失败');
			console.log(err);
		});			
	});
}

//page is useless here
function reqSchoolList(name, alias, page){
	return new Promise((resolve, reject)=>{
    	var school_api = global_.school_list
     				  + '?page='
     				  + page;

     	let req_data = {
     		"search": {
     			"name": name,
     			"alias": alias
     		}
     	};

     	this.$http.post(school_api, req_data).then((resp)=>{
     		var total_school = resp.body.total;
     		var full_list_api = school_api + '&pagesize='+ total_school;

     		this.$http.post(full_list_api, req_data).then((resp)=>{
     			resolve(resp);
     			
     		}, (err)=>{
	     		err_process.call(this, err, '请求学校列表失败');
	     		console.log(err);
     		});

     	}, (err)=>{
     		err_process.call(this, err, '请求学校列表失败');
     		console.log(err);
     	});	     	 			
	});
}

function reqExpList() {
	return new Promise((resolve, reject)=>{
		var api = global_.exp_list + '?page=1';
		this.$http.post(api, {}).then((resp)=>{
			var total_exp = resp.body.total;
			var full_list_api = api + '&pagesize='+ total_exp;

			this.$http.post(full_list_api, {}).then((resp)=>{
				layer.close(this.loading);
				resolve(resp);

			}, (err)=>{
				layer.close(this.loading);
				err_process.call(this, err, '请求实验列表失败');
			});

		}, (err)=>{
			layer.close(this.loading);
			err_process.call(this, err, '请求实验列表失败');						
		});
	});				
}

function obj_equal(obj1, obj2) {
	var result = true;
	for (var i in obj1) {
		if(obj1[i] != obj2[i]){
			result = false;
			break;
		}
	}
	return result;
}

function contains_obj(list, item) {
	var result = false;
	for(var i in list) {
		if(this.obj_equal(list[i], item)) {
			result = true;
			break;
		}
	}
	return result;
}

export default {
	lalert,	
	err_process,
	lconfirm,
	convTime,
	login_check_status,
	page_check_status,
	encrypt,
	reqSchoolList,
	reqExpList,
	obj_equal,
	contains_obj
}