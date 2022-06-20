import React from "react";
import { withRouter } from "react-router-dom";
import './header.scss'
import { connect } from 'react-redux'
import * as actions from '../../store/actions'
import { decrypt } from '../../ulties/crypt'


class Header extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            allDataUser: null,
            keyword: '',
            suggestFriends: null
        }
    }
    async componentDidMount() {
        await this.props.fetchAllDataUsers()
    }
    componentDidUpdate(prevProps) {
        if (prevProps.dataAllUsers !== this.props.dataAllUsers) {
            this.setState({
                allDataUser: this.props.dataAllUsers
            })
        }
    }
    handleSearch = (event) => {
        let { allDataUser } = this.state
        this.setState({
            keyword: event.target.value
        }, () => {
            if (this.state.keyword.trim() !== '' && allDataUser.length > 0) {
                let suggestFriends = allDataUser.filter(item => item.username.includes(this.state.keyword) && item.id !== +decrypt(process.env.REACT_APP_SALT, this.props?.currentUser?.userId))
                this.setState({ suggestFriends })
            } else {
                this.setState({
                    suggestFriends: []
                })
            }
        })
    }
    // add friend ???
    render() {
        // console.log(this.props);
        let { keyword, suggestFriends } = this.state
        console.log(suggestFriends);
        return (
            <div className="Header-container">
                <div className="logo">Chat App</div>
                <div className="search">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="search friends..."
                        value={keyword}
                        onChange={(event) => this.handleSearch(event)}
                    />
                </div>
                <div className="avatar">
                    avatar
                    <button className="btn btn-danger">Log out</button>
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return ({
        dataAllUsers: state.user.allDataUser,
        currentUser: state.auth.user
    })
}
const dispatchStateToProps = (dispatch) => {
    return ({
        fetchAllDataUsers: () => dispatch(actions.getAllUsers())
    })
}
export default withRouter(connect(mapStateToProps, dispatchStateToProps)(Header))