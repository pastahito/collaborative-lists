import React, {Component} from 'react'
import { connect } from 'react-redux'
import {register, logIn, isUsernameAvailable} from '../../websocketActions.js'
import styles from './styles.css'

class LandingPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: '',
            usernameAvailability: 'Available',
            logInForm: true
        }
        this.handleChange = this.handleChange.bind(this)
        this.toggleMode = this.toggleMode.bind(this)
        this.submit = this.submit.bind(this)
    }

    submit() {
        if (this.state.logInForm) {
            logIn({ username: this.state.username, password: this.state.password })
        } else {
            register({ username: this.state.username, password: this.state.password })
        }
    }
    handleChange(event, k) {
        this.setState({[k]: event.target.value})
    }
    toggleMode() {
        this.setState({
            logInForm: !this.state.logInForm,
            username: '',
            password: ''
        })
    }

    render() {
        return (
            <div className={styles.background}>
                <div className={styles.overlay}>
                    <div className={styles.title}>
                        <div><span>C</span>ollaborative</div><div><span>L</span>ists</div>
                    </div>
                    <div className={styles.info}>
                        <div className={styles.description}>
                            <h1>Idea collecting and decision making made easier.</h1>
                            <p>Useful tool for holding brainstormings or making online surveys.</p>
                        </div>
                        <div className={styles.form}>

                            <div className={styles.inputs}>
                                <div className={styles.row}>
                                    <svg viewBox="0 0 20 20">
                                        <path d="M0,20 a10,8 0 0,1 20,0z M10,0 a4,4 0 0,1 0,8 a4,4 0 0,1 0,-8"></path>
                                    </svg>
                                    <input type="text" placeholder="Username"
                                        value={this.state.username}
                                        onChange={(e)=>this.handleChange(e,'username')}/>
                                </div>
                                <div className={styles.row}>
                                    <svg viewBox="0 0 20 20">
                                        <path d="M0,20 20,20 20,8 0,8z M10,13 10,16z M4,8 a6,8 0 0,1 12,0"></path>
                                    </svg>
                                    <input type="password" placeholder="Password"
                                        value={this.state.password}
                                        onChange={(e)=>this.handleChange(e,'password')}/>
                                </div>
                                <div className={styles.button} onClick={this.submit}>
                                    {this.state.logInForm?'Log in':'Register'}
                                </div>
                                { this.state.logInForm ?
                                    <p>Don't have an account? &nbsp;<span onClick={this.toggleMode}>Register</span></p>
                                    :
                                    <p>Already have an account? &nbsp;<span onClick={this.toggleMode}>Log in</span></p>
                                }

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default LandingPage
