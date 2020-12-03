import React, { createContext, useReducer } from 'react'
import io from 'socket.io-client'

export const CTX = createContext()
const initState = {
    General: [
        { from: 'Sua', msg: 'Hello', topic: 'General' }
    ]/*,
    Topic2: [
        { from: 'Max', msg: 'Salut', topic: 'Topic2' },
        { from: 'Arnold', msg: 'Schwartzenegger', topic: 'Topic2' },
        { from: 'Titeuf', msg: 'Yo', topic: 'Topic2' }
    ]*/
}

let socket

function sendChatAction(value) {
    socket.emit('chat message', value)
}

function reducer(state, action) {
    const { from, msg, topic } = action.payload
    switch (action.type) {
        case 'RECEIVE_MESSAGE':
            return {
                ...state,
                [topic]: [
                    ...state[topic],
                    { from, msg }
                ]
            }
        default:
            return state
    }
}

export default function Store(props) {
    const [allChats, dispatch] = useReducer(reducer, initState)

    if (!socket) {
        socket = io(':3001')
        socket.on('chat message', (msg) => {
            dispatch({ type: "RECEIVE_MESSAGE", payload: msg })
        })
    }

    const user = 'User' + Math.random(100).toFixed(2)

    return (
        <CTX.Provider value={{ allChats, sendChatAction, user }}>
            {props.children}
        </CTX.Provider>
    )
}
