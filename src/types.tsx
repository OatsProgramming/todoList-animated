import { ReactNode } from "react"

// Custom Types
export type Action = {
    type: 'added' | 'deleted' | 'edited',
    id?: number,
    value?: string,
    [key: string] : any,
}

export type TodoItem = {
    id: number,
    value: string,
    done: boolean
}

export type Todos = Array<TodoItem>

export type ChildrenProp = {
    children : ReactNode
}