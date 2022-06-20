import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import './Profile.scss'
import * as actions from '../../store/actions'
import List from "../List/List";
import * as userService from '../../services/userServices'
import { ToastContainer, toast } from 'react-toastify';



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

        return (
            <>
                profile
                <ToastContainer
                    position="bottom-right"
                    autoClose={5000}
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


})
const dispatchStateToProps = (dispatch) => {
    return ({

    })
}

export default withRouter(connect(mapStateToProps, dispatchStateToProps)(Profile))