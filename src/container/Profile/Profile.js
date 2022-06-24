import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import './Profile.scss'
import * as actions from '../../store/actions'
import * as userService from '../../services/userServices'
import { ToastContainer, toast } from 'react-toastify';
import Header from "../Header/Header";
import List from "../List/List";
import Conversation from "../Conversation/Conversation";



class Profile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dataCreateRoom: null
        }
    }
    async componentDidMount() {


    }
    async componentDidUpdate(prevProps) {

    }
    handleCreateRoomChat = (item) => {
        if (item.status === 'OK') {
            this.setState({
                dataCreateRoom: item
            })
        } else {
            toast.warn(`Bạn và ${item['User.username']} vẫn chưa kết bạn !`)
        }
    }

    render() {
        // console.log(this.props.socket);
        let { dataCreateRoom } = this.state
        return (
            <>
                <div className="Profile-container">
                    <div className="header">
                        <Header />
                    </div>
                    <div className="profile-content">
                        <div className="list-friend">
                            <List handleCreateRoomChat={this.handleCreateRoomChat} />
                        </div>
                        <div className="conversation-box">
                            <Conversation dataCreateRoom={dataCreateRoom} />
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