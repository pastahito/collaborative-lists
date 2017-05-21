import React, { Component } from 'react'
import styles from './styles.css'

import { removeListById } from '../../websocketActions.js'

export default class List extends Component {
    constructor(props) {
        super(props)

        this.state = {
            onHover: false
        }

        this._onMouseEnter = this._onMouseEnter.bind(this)
        this._onMouseLeave = this._onMouseLeave.bind(this)
    }

    componentWillAppear(appeared) {
        appeared()
    }

    componentWillEnter(entered) {
        this.list.className += ' animated fadeInDown'
        setTimeout(()=>{
            entered()
        }, 1000)
    }

    componentWillLeave(left) {
        this.list.className += ' animated zoomOut'
        setTimeout(()=>{
            left()
        }, 1000)
    }

    _onMouseEnter(){
        if(!this.state.onHover){
            this.setState({
                onHover: true
            })
        }
    }

    _onMouseLeave(){
        if(this.state.onHover){
            this.setState({
                onHover: false
            })
        }
    }

    render() {
        return <div ref={list => this.list = list} className={styles.container} onMouseEnter={this._onMouseEnter} onMouseLeave={this._onMouseLeave}>
            {this.state.onHover && (
                <div className={styles.coverContainer}>
                    <div className={styles.details}>
                        Details
                    </div>
                    <div className={styles.remove} onClick={() => removeListById(this.props.list.id)}>
                        Remove
                    </div>
                </div>)
            }
            <div className={styles.title}>
                {this.props.list.title || 'Untitle'}
            </div>
            <div className={styles.description}>
                {this.props.list.description || 'No description'}
            </div>
        </div>
    }
}
