import React, {Component} from 'react'
import styles from './local.css'
import {register, logIn, logOut, isUsernameAvailable} from './websocketActions.js'

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userToRegister: '',
            userToLogin: '',
            usernameAvailability: 'Available'
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleRegisterChange = this.handleRegisterChange.bind(this)
    }

    handleChange(event) {
        this.setState({userToLogin: event.target.value})
    }

    handleRegisterChange(event) {
        isUsernameAvailable(event.target.value)
        this.setState({userToRegister: event.target.value})
    }

    render() {
        return (
            <div className={styles.welp}>
                <input type="text"
                  value={this.state.userToRegister}
                  onChange={this.handleRegisterChange}
                />
                <div onClick={() => register({
                        username: this.state.userToRegister,
                        password: this.state.userToRegister
                    })}>
                    Register
                </div>
                <input type="text"
                    value={this.state.userToLogin}
                    onChange={this.handleChange}
                />
            <div>{this.state.usernameAvailability}</div>
                <div onClick={() => logIn({
                        username: this.state.userToLogin,
                        password: this.state.userToLogin
                    })}>
                    Log In
                </div>
                <div onClick={() => logOut()}>
                    Log Out
                </div>
            </div>
        )
    }
}

export default App
