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
		school_create
	}