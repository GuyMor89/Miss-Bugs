import { showSuccessMsg } from '../services/event-bus.service.js'
const { useEffect } = React

export function AppFooter () {

    useEffect(() => {
        // component did mount when dependancy array is empty
    }, [])

    return (
        <footer>
            <p><i className="fa-solid fa-copyright"></i></p>
            <p>CoffeeRights</p>
        </footer>
    )

}