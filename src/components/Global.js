	const url_prefix = '/mengoo-esp/';

	const password_encrypt = url_prefix + 'site/pk';	
	const logout = url_prefix + 'site/logout';
	const status_check = url_prefix + 'site/profile';

	const admin_login = url_prefix + 'site/admin-login';
	const admin_list = url_prefix + 'user/admin/search';
	const admin_create = url_prefix + 'user/admin/create';
	const admin_update = url_prefix + 'user/admin/update';
	const admin_delete = url_prefix + 'user/admin/delete';

	const school_list = url_prefix + 'user/school/search';
	const school_create = url_prefix + 'user/school/create';
	const school_update = url_prefix + 'user/school/update';
	const school_delete = url_prefix + 'user/school/delete';

	const schadmin_list = url_prefix + 'user/school-admin/search';
	const schadmin_create = url_prefix + 'user/school-admin/create';
	const schadmin_update = url_prefix + 'user/school-admin/update';

	//const expcatag_list = url_prefix + 'esp_admin/experiment-category/admin-list';
	const expcatag_list = url_prefix + 'esp_admin/experiment-category/list';
	const expcatag_create = url_prefix + 'esp_admin/experiment-category/create';
	const expcatag_update = url_prefix + 'esp_admin/experiment-category/update';
	const expcatag_delete = url_prefix + 'esp_admin/experiment-category/delete';

	const exp_list = url_prefix + 'esp_admin/experiment/list';
	const exp_create = url_prefix + 'esp_admin/experiment/create';
	const exp_update = url_prefix + 'esp_admin/experiment/update';
	const exp_delete = url_prefix + 'esp_admin/experiment/delete';

	const ques_list = url_prefix + 'esp_admin/questions-bank/list';
	const ques_create = url_prefix + 'esp_admin/questions-bank/create';
	const ques_update = url_prefix + 'esp_admin/questions-bank/update';
	const ques_delete = url_prefix + 'esp_admin/questions-bank/delete';

	const exam_list = url_prefix + 'esp_admin/examine/admin-list';
	const exam_create = url_prefix + 'esp_admin/examine/create';
	const exam_update = url_prefix + 'esp_admin/examine/update';
	const exam_delete = url_prefix + 'esp_admin/examine/delete';

	const exam_ques_list = url_prefix + 'esp_admin/examine-questions/list';
	const exam_ques_delete = url_prefix + 'esp_admin/examine-questions/delete';


	export default {
		url_prefix,
		password_encrypt,
		status_check,
		logout,

		admin_login,
		admin_list,
		admin_create,
		admin_update,
		admin_delete,

		school_list,
		school_create,
		school_update,
		school_delete,

		schadmin_list,
		schadmin_create,
		schadmin_update,

		expcatag_list,
		expcatag_create,
		expcatag_update,
		expcatag_delete,

		exp_list,
		exp_create,
		exp_update,
		exp_delete,

		ques_list,
		ques_create,
		ques_update,
		ques_delete,

		exam_list,
		exam_create,
		exam_update,
		exam_delete,

		exam_ques_list,
		exam_ques_delete
	}