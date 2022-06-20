import { connectedRouterRedirect } from 'redux-auth-wrapper/history4/redirect'  //create hoc redirect in order to protect wrapped component
import locationHelperBuilder from 'redux-auth-wrapper/history4/locationHelper'

const locationHelper = locationHelperBuilder({}) // hàm này lấy prop location của component

const configProtector = {
    authenticatedSelector: state => state.auth.isLoggedIn, // nếu đk này đúng, đi tới component mà nó wrap
    redirectPath: '/login', // nếu đk trên sai đi tới route này
    wrapperDisplayName: 'UserIsAuthenticated' // set up a name (option)
}
const configRedirect = {
    authenticatedSelector: state => !state.auth.isLoggedIn,
    // nếu đk trên sai đi xuống đây, nếu bị redirect tới login từ trang nào thì login xong về lại trang đấy, 
    // nếu tới login ko qua redirect (tự bấm tới) thì login xong tới /system/profile
    redirectPath: (state, props) => locationHelper.getRedirectQueryParam(props) || '/system/profile',
    wrapperDisplayName: 'UserIsNotAuthenticated'
}

export const protector = connectedRouterRedirect(configProtector)
export const redirecter = connectedRouterRedirect(configRedirect)

