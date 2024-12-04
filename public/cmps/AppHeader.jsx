const { Link, NavLink } = ReactRouterDOM
const { useSelector } = ReactRedux

const { useState, useEffect } = React

import { LoginSignup } from './LoginSignup.jsx'
import { userActions } from '../store/actions/user.actions.js'

export function AppHeader() {

	const user = useSelector(storeState => storeState.userModule.loggedInUser)

	useEffect(() => {
		userActions.loadLoggedInUser()
	}, [])

	function onLogout() {
		userActions.logoutUser()
	}

	return (
		<header className='header'>
			<nav>
				<NavLink to="/">Home</NavLink>
				<NavLink to="/bug">Bugs</NavLink>
				{user && user.isAdmin && <NavLink to="/users">Users</NavLink>}
				<NavLink to="/about">About</NavLink>
			</nav>
			{user ? (
				<section>
					<Link to={`/user/${user._id}`}>Hello {user.fullname}</Link>
					<button onClick={onLogout}>Logout</button>
				</section>
			) : (
				<LoginSignup />
			)}
		</header>
	)
}
