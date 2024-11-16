const { Link, NavLink } = ReactRouterDOM
const { useNavigate } = ReactRouter

const { useState, useEffect } = React

import { LoginSignup} from './LoginSignup.jsx'
import { userService } from '../services/user.service.js'

export function AppHeader() {

    const navigate = useNavigate()
	const [user, setUser] = useState(null)
        
    useEffect(() => {
		userService.getLoggedinUser()
			.then(setUser)
	}, [])

	function onLogout() {
		userService.logout()
            .then(() => onSetUser(null))
            // .catch(err => showErrorMsg('OOPs try again'))
	}

	function onSetUser(user) {
		setUser(user)
        navigate('/')
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
					<LoginSignup onSetUser={onSetUser} />
			)}
        </header>
    )
}
