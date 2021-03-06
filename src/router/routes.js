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

const ExpAssignList = ()=> import('@/components/expmanage/expassign/ExpAssignList.vue');
const ExpAssign = ()=> import('@/components/expmanage/expassign/ExpAssign.vue');


const QuesManage = ()=> import('@/components/quesmanage/QuesManage.vue');
const QuesAdd = ()=> import('@/components/quesmanage/QuesAdd.vue');
const QuesEdit = ()=> import('@/components/quesmanage/QuesEdit.vue');

const Exam = ()=> import('@/components/exammanage/Exam.vue');
const ExamAdd =()=> import('@/components/exammanage/ExamAdd.vue');
const ExamEdit = ()=> import('@/components/exammanage/ExamEdit.vue');
//const ExamConfig = ()=> import('@/components/exammanage/ExamConfig.vue');
const ExamQuesConfig = ()=> import('@/components/exammanage/ExamQuesConfig.vue');


//2. set route paths
const myRoutes = [
	{path: '/login', meta: {title: '??????'}, component: Login},

	{path: '  ', 
	 meta: {title: 'ESP'}, 
	 component: AppInner,
	 children:[
	 	{path: '/admin', meta: {title: '???????????????'}, component: Admin},
	 	{path: '/adminadd', meta: {title: '???????????????'}, component: AdminAdd},
	 	{path: '/adminedit', meta: {title: '???????????????'}, component: AdminEdit},

	 	{path: '/school', meta: {title: '????????????'}, component: School},
	 	{path: '/schooladd', meta: {title: '????????????'}, component: SchoolAdd},
	 	{path: '/schooledit', meta: {title: '????????????'}, component: SchoolEdit},

	 	{path: '/schooladmin', meta: {title: '????????????'}, component: SchAdmin},
	 	{path: '/schadminadd', meta: {title: '????????????'}, component: SchAdminAdd},
	 	{path: '/schadminedit', meta: {title: '????????????'}, component: SchAdminEdit},

	 	{path: '/expcatag', meta: {title: '????????????'}, component: ExpCatag},
	 	{path: '/expcatagadd', meta: {title: '????????????'}, component: ExpCatagAdd},
	 	{path: '/expcatagedit', meta: {title: '????????????'}, component: ExpCatagEdit},

	 	{path: '/explist', meta: {title: '????????????'}, component: ExpList},
	 	{path: '/expadd', meta: {title: '????????????'}, component: ExpAdd},
	 	{path: '/expedit', meta: {title: '????????????'}, component: ExpEdit},

	 	{path: '/expassignlist', meta: {title: '????????????'}, component: ExpAssignList},
	 	{path: '/expassign', meta: {title: '????????????'}, component: ExpAssign},

	 	{path: '/quesmng', meta: {title: '????????????'}, component: QuesManage},
	 	{path: '/quesadd', meta: {title: '????????????'}, component: QuesAdd},
	 	{path: '/quesedit', meta: {title: '????????????'}, component: QuesEdit},

	 	{path: '/exam', meta: {title: '????????????'}, component: Exam},
	 	{path: '/examadd', meta: {title: '????????????'}, component: ExamAdd},
	 	{path: '/examedit', meta: {title: '????????????'}, component: ExamEdit},
	 	//{path: '/examconfig', meta: {title: '????????????'}, component: ExamConfig},
	 	{path: '/examquesconfig', meta: {title: '????????????'}, component: ExamQuesConfig},
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

//?????????????????????
router.beforeEach((to, from, next)=>{
	window.document.title = to.meta.title;
	next();
});

export default router;
