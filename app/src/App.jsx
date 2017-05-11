import React, {Component} from 'react'
import styles from './local.css'
import {register, login} from './websocketActions.js'

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userToRegister: '',
            userToLogin: ''
        }
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event, target) {
        this.setState({[target]: event.target.value})
    }

    render() {
        return (
            <div className={styles.welp}>
                <input type="text"
                  value={this.state.userToRegister}
                  onChange={(e) => this.handleChange(e, 'userToRegister')}
                />
                <div onClick={() => register(this.state.userToRegister, this.state.userToRegister)}>
                    Register
                </div>
                <input type="text"
                    value={this.state.userToLogin}
                    onChange={(e) => this.handleChange(e, 'userToLogin')}
                />
                <div onClick={() => login(this.state.userToLogin, this.state.userToLogin)}>
                    Login
                </div>
            </div>
        )
    }
}

export default App
