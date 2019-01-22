import RSAKey from '@/assets/js/rsa.min.js';
import Base from '@/assets/js/base64.js';
import global_ from '@/components/Global.js';

export default {
	lalert(text) {
		layer.alert(text, {title:'提示', area:['280px','190px']});
	},

	lconfirm(text, func) {
		layer.confirm(text, {title:'提示', area:['280px','190px']}, func);		
	},

	convTime(ntime) {
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
	},

	encrypt(pswd){
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
	},

	reqSchoolList(name, alias, page){
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
		     		Utils.lalert('请求学校列表失败');
		     		console.log(err);
	     		});

	     	}, (err)=>{
	     		Utils.lalert('请求学校列表失败');
	     		console.log(err);
	     	});	     	 			
		});
	}
}