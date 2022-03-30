import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import vm from '../main'

const routes = [
	{
		path: '/',
		name: 'home',
		component: Home,
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/login',
		name: 'login',
		component: () => import('../views/Login.vue')
	}
]

const router = createRouter({
	history: createWebHistory(),
	routes
})

router.beforeEach(async (to, from, next) => {

	//If QueryString contain token, store in localStorage and remove query from URL
	if (to.query.session_token) {
		localStorage.setItem('session_token', to.query.session_token)
		router.replace({'query': null})
	}

	//Now fetch token from localStorage
	const token = localStorage.getItem('session_token') || null

	if (to.matched.some(record => record.meta.requiresAuth)) { // If Any route require authentication
		
		if (token) { //If token exists then verify token validity from server
			const response = await fetch('http://localhost:5022/verify', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ token: token })
			}).then(res => res.json())

			//If token not validate then redirect to login
			if (!response.success) {
				localStorage.removeItem('session_token')
				vm.$toast.error('Something went wrong. Please try again.')
				next('/login')
				return
			}
		} else { //If token not exists then redirect to login
			next('/login')
			return
		}

	} else if (to.matched.some(record => record.name === 'login')) { // If Login route
		if (token) { //If token exists then verify token validity from server
			const response = await fetch('http://localhost:5022/verify', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ token: token })
			}).then(res => res.json())

			//If token validates then redirect to home directly without showing login
			if (response.success) {
				next('/')
				return
			}
		}
	}

	next()
})

export default router;