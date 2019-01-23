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

		exp_list
	}