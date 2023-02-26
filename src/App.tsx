import './App.css'
import { getTodoList, getDispatch, StateProvider } from './StateProvider'
import TodoList from './TodoList'
import AddItem from './AddItem'

import { Todos, TodoItem } from './types'


export default function App() {
  return (
    <>
      <StateProvider>
        <h1>Things To Do: </h1>
        <AddItem />
        <TodoList />
      </StateProvider>
    </>
  )
}


