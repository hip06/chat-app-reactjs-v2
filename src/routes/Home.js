import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";



class Home extends React.Component {

    render() {
        let { isLoggedIn } = this.props
        let path = isLoggedIn ? '/system/profile' : 'login'
        return (
            <div className="Home-container">
                <Redirect to={path} />
            </div>
        )
    }
}
const mapStateToProps = (state) => ({
    isLoggedIn: state.auth.isLoggedIn
})
export default connect(mapStateToProps, null)(Home)