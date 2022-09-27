const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			urlBase: "http://127.0.0.1:3001/api",
			urlPrivate: "/private",
			urlSignUp: "/signup",
			urlLogin: "/",

			users: [],
			tokens: localStorage.getItem("token") || ""
		},
		actions: {
			signUpCredentials: (user) => {
				if (user.username == undefined ||   
					user.email == undefined || 
					user.password == undefined){
					return false
				} else {
					if (user.username.trim() != "" &&
					user.username.length <= 12 &&
					user.email.trim() != "" &&
					(user.email.includes("@gmail.com") || user.email.includes("@hotmail.com")) &&
					user.password.trim() != "" &&
					user.password.length >= 8) {
						return true
					} else {
						return false
					}
				}
			},
			logInCredentials: (user) => {
				if (user.email.trim() != "" && user.password.trim() != "") {
					return true
				} else {
					return false
				}
			},
			userPrivate: async() => {
				let store = getStore();
				try {
					let response = await fetch(`http://127.0.0.1:3001/api.private`, {
						method: 'GEt',
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${store.tokens}`,
						},
						body: JSON.stringify(),
					})
					if (response.ok) {
						const data = await response.json()
						setStore({
							users: data
						});
						return true
					} else {
						return false
					}
				} catch (error) {
					console.log(`Error: ${error}`)
				}
			},
			userSignUp: async(user) => {
				let store = getStore()
				try {
					let response = await fetch(`http://127.0.0.1:3001/api/signup`, {
						method: 'POST',
						headers: {
							"content-Type":"application/json",
						},
						body: JSON.stringify(user),
					})
					if (response.ok) {
						return true
					} else {
						return false
					}
				} catch (error) {
					console.log(`Error: ${error}`)
				}
			},
			userLogIn: async(user) => {
				let store = getStore()
				try {
					let response = await fetch(`http://127.0.0.1:3001/api/`, {
						method: 'POST', 
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(user), 
					})
					if (response.ok) {
						let data = await response.json()
						setStore({
							token: data.token
						})
						localStorage.setItem("token", data.token)
						return true
					} else {
						return false
					}
				} catch (error){
					console.log(`Error: ${error}`)
				}
			},
			userLogOut: () => {
				localStorage.removeItem("token"),
				setStore({
					token: ""
				})
			}
		}
	};
};

export default getState;
