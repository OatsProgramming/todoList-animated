import { useReducer, useContext, createContext } from "react"
import { Todos, TodoItem, ChildrenProp, Action } from "./types"

import {SearchBar} from "./SearchBar"

const initialList: Todos = [
    {id: 0, value: 'Hello', done: false},
    {id: 1, value: 'World', done: false},
    {id: 2, value: 'Sayonara', done: true},
]

let nextId = 3
  
const TodoListContext = createContext<Todos>([])
const DispatchContext = createContext<(action: Action) => void>(() => {})

export function StateProvider({children} : ChildrenProp){
    const [todoList, dispatch] = useReducer(reducerFn, initialList)
    return (
        <TodoListContext.Provider value={todoList}>
            <DispatchContext.Provider value={dispatch}>
                <SearchBar>
                    {children}
                </SearchBar>
            </DispatchContext.Provider>
        </TodoListContext.Provider>
    )
}

export function getTodoList(){
    return useContext(TodoListContext)
}

export function getDispatch(){
    return useContext(DispatchContext)
}


function reducerFn(todoList: Todos, action: Action): Todos{
    switch(action.type){
        case 'added':{
            if (!action.value) return todoList
            return [
                ...todoList,
                {id: nextId++, value: action.value, done: false}
            ]
        }
        case 'deleted':{
            return todoList.filter((item: TodoItem) => item.id !== action.id)
        }
        case 'edited':{
            return todoList.map((item: TodoItem) => 
                action.value && item.id === action.id ? 
                {...item, value: action.value, done: action.done} 
                : item
            )
        }
        default : {
            throw new Error('Unknown action request')
        }
    }
}