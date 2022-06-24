import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import './Profile.scss'
import * as actions from '../../store/actions'
import * as userService from '../../services/userServices'
import { ToastContainer, toast } from 'react-toastify';
import Header from "../Header/Header";
import List from "../List/List";



class Profile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isModal: false,
            keyword: '',
            dataSuggest: '',
            refresh: false,
            notification: 0,
            contentNotification: [],
            isModalNotification: false
        }
    }
    async componentDidMount() {


    }
    async componentDidUpdate(prevProps) {

    }

    render() {
        console.log(this.props.socket);
        return (
            <>
                <div className="Profile-container">
                    <div className="header">
                        <Header />
                    </div>
                    <div className="profile-content">
                        <div className="list-friend">
                            <List />
                        </div>
                    </div>
                </div>
                <ToastContainer
                    position="bottom-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
            </>
        )
    }
}
const mapStateToProps = (state) => ({
    socket: state.app.socket

})
const dispatchStateToProps = (dispatch) => {
    return ({

    })
}

export default withRouter(connect(mapStateToProps, dispatchStateToProps)(Profile))