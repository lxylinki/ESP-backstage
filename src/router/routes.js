import Vue from 'vue';
//import and use VueRouter
import VueRouter from 'vue-router';
Vue.use(VueRouter);


//0. log in page
const Login = ()=> import('@/components/Login.vue');
const AppInner = ()=> import('@/AppInner.vue');

const Admin = ()=> import('@/components/usermanage/admin/Admin.vue');
const AdminAdd = ()=> import('@/components/usermanage/admin/AdminAdd.vue');
const AdminEdit = ()=> import('@/components/usermanage/admin/AdminEdit.vue');

const School = ()=> import('@/components/usermanage/schoolmanage/School.vue');
const SchoolAdd = ()=> import('@/components/usermanage/schoolmanage/SchoolAdd.vue');
const SchoolEdit = ()=> import('@/components/usermanage/schoolmanage/SchoolEdit.vue');

const SchAdmin = ()=> import('@/components/usermanage/schooladmin/SchoolAdmin.vue');
const SchAdminAdd = ()=> import('@/components/usermanage/schooladmin/SchAdminAdd.vue');
const SchAdminEdit = ()=> import('@/components/usermanage/schooladmin/SchAdminEdit.vue');

const ExpCatag = ()=> import('@/components/expmanage/expcatag/ExpCatagory.vue');
const ExpCatagAdd = ()=> import('@/components/expmanage/expcatag/ExpCatagAdd.vue');
const ExpCatagEdit = ()=> import('@/components/expmanage/expcatag/ExpCatagEdit.vue');

const ExpList = ()=> import('@/components/expmanage/explist/ExpList.vue');
const ExpAdd = ()=> import('@/components/expmanage/explist/ExpAdd.vue');
const ExpEdit = ()=> import('@/components/expmanage/explist/ExpEdit.vue');

const QuesManage = ()=> import('@/components/quesmanage/QuesManage.vue');
const QuesAdd = ()=> import('@/components/quesmanage/QuesAdd.vue');

//2. set route paths
const myRoutes = [
	{path: '/login', meta: {title: '登陆'}, component: Login},

	{path: '  ', 
	 meta: {title: 'ESP'}, 
	 component: AppInner,
	 children:[
	 	{path: '/admin', meta: {title: '超级管理员'}, component: Admin},
	 	{path: '/adminadd', meta: {title: '超级管理员'}, component: AdminAdd},
	 	{path: '/adminedit', meta: {title: '超级管理员'}, component: AdminEdit},

	 	{path: '/school', meta: {title: '学校管理'}, component: School},
	 	{path: '/schooladd', meta: {title: '学校管理'}, component: SchoolAdd},
	 	{path: '/schooledit', meta: {title: '学校管理'}, component: SchoolEdit},

	 	{path: '/schooladmin', meta: {title: '校管理员'}, component: SchAdmin},
	 	{path: '/schadminadd', meta: {title: '校管理员'}, component: SchAdminAdd},
	 	{path: '/schadminedit', meta: {title: '校管理员'}, component: SchAdminEdit},

	 	{path: '/expcatag', meta: {title: '实验管理'}, component: ExpCatag},
	 	{path: '/expcatagadd', meta: {title: '实验管理'}, component: ExpCatagAdd},
	 	{path: '/expcatagedit', meta: {title: '实验管理'}, component: ExpCatagEdit},

	 	{path: '/explist', meta: {title: '实验管理'}, component: ExpList},
	 	{path: '/expadd', meta: {title: '实验管理'}, component: ExpAdd},
	 	{path: '/expedit', meta: {title: '实验管理'}, component: ExpEdit},

	 	{path: '/quesmng', meta: {title: '试题管理'}, component: QuesManage},
	 	{path: '/quesadd', meta: {title: '试题管理'}, component: QuesAdd}
	 ]
	},
	{path: '*', redirect: '/login'}	/*default when no match*/
];

//3. instanciate router from VueRouter
const router = new VueRouter({
	//hash or history
	//mode: 'history',
	mode: 'hash',
	routes: myRoutes
});

//显示每页的标题
router.beforeEach((to, from, next)=>{
	window.document.title = to.meta.title;
	next();
});

export default router;
