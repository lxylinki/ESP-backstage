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
}