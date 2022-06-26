import React from "react";
import './List.scss'
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux'
import { Scrollbars } from 'react-custom-scrollbars-2'


class List extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            listFriend: null
        }
    }
    async componentDidMount() {
        this.setState({
            listFriend: this.props.dataAllFriend
        })

    }
    async componentDidUpdate(prevProps) {
        if (prevProps.dataAllFriend !== this.props.dataAllFriend) {
            this.setState({
                listFriend: this.props.dataAllFriend
            })
        }
    }
    render() {
        // console.log(this.props);
        let { listFriend } = this.state
        return (
            <div className="List-container">
                <Scrollbars style={{ width: '100%', height: '100%' }}>
                    {listFriend?.length > 0 && listFriend.map((item, index) => {
                        return (
                            <div onClick={() => this.props.handleCreateRoomChat(item)} className="item" key={index}>
                                <div className="wrap-img">
                                    <img src={item['User.avatar']} alt="avatar" />
                                </div>
                                <div className="username">
                                    {item['User.username']}
                                    <div className="status">
                                        <i className={item.status === 'Pending' ? "fas pending fa-circle" : item.status === 'OK' ? "fas ok fa-circle" : "fas fa-circle"}></i>
                                        {item.status === 'OK' ? 'Bạn bè' : item.status}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </Scrollbars>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return ({
        dataAllFriend: state.user.allFriend,
        socket: state.app.socket

    })
}
const dispatchStateToProps = (dispatch) => {
    return ({

    })
}
export default withRouter(connect(mapStateToProps, dispatchStateToProps)(List))