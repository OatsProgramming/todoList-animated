import React, { useState, forwardRef, useRef, useEffect, Fragment } from "react"
import { getFilteredList } from "./SearchBar"
import { getDispatch } from "./StateProvider"
import { TodoItem, Todos } from "./types"

import { AnimatePresence, motion, MotionValue, useMotionValue, useMotionValueEvent, useTransform } from "framer-motion"

import './TodoList.modules.css'

type Overflow = 'scroll' | ''

export default function TodoList(){
    const filteredList: Todos = getFilteredList()
    const ref = useRef<HTMLUListElement>(null)
    
    
    return (
      <motion.ul 
      ref={ref}
      className='todoList'
      >
        <AnimatePresence mode='sync' initial={false}>
            {filteredList.map((item: TodoItem) => (
                <TodoMotion
                layout
                todo={item} 
                key={item.id}
                initial={{scale: 0}}
                animate={{scale: 1}}
                exit={{scale: 0}}
                />
            ))}
        </AnimatePresence>
      </motion.ul>
    )
  }
  
const Todo = forwardRef(function Todo({todo}: {todo: TodoItem}, ref: React.ForwardedRef<HTMLLIElement>){
    const dispatch = getDispatch()
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const x = useMotionValue(0)

    // Change color based on swipe of todo item
    const backgroundColor = useTransform<MotionValue, string>(
        x,
        [-100, 0, 100],
        ['hsl(0, 100%, 75%)', 'hsla(0, 0%, 0, 0)' , 'hsl(99, 100%, 75%)', ]
    )

    // Did item pass x-axis threshold and the user dropped the item?
    useMotionValueEvent(x, "change", (latestValue) => {
        // Swipe left for deletion
        if (latestValue < -100 && x.getVelocity() > 0){
            dispatch({
                type: 'deleted',
                id: todo.id
            })
        }

        // Swipe right for completion
        else if (latestValue > 100 && x.getVelocity() < 0){
            console.log('done', 'still need some editing due to bugs')
            // dispatch({
            //     type: 'edited',
            //     id: todo.id,
            //     value: todo.value,
            //     done: !todo.done
            // })
        }
    })

    // Animation: 
    // AnimationPresence set to 'wait' mode to deal with overlapping animations btwn
    // input and span
    return (
      <>
        <motion.li 
            ref={ref} 
            className='gridify threeCols'
            drag='x'
            dragConstraints={{left: 0, right: 0}}
            style={{x, backgroundColor}}
            >
            <AnimatePresence initial={false} mode='wait'>
                {isEditing ? (
                    
                        <motion.input
    
                        key={todo.id}
                        style={{originX: 'right'}}
                        initial={{scaleX: 0}}
                        animate={{scaleX: 1}}
                        exit={{scaleX: 0, transition: {type: 'spring', bounce: 0, duration: 0.25}}}
                        transition={{type: 'spring', velocity: 0.5, bounce: 0.25, duration: 0.25}}
                        className='inputEdit twoSpacesFromStart' 
                        placeholder={todo.value} 
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        dispatch({
                            type: 'edited',
                            id: todo.id,
                            value: e.target.value,
                            done: todo.done,
                        })}}>
                        </motion.input>
                
                ): (
                    <motion.span 
                    initial={{scale: 0}}
                    animate={{scale: 1}}
                    exit={{scaleX: 0, transition: {duration: 0.25}}}
                    key={todo.id + todo.value}
                    className="twoSpacesFromStart gridify twoCols">
                        <input type='checkbox'
                        checked={todo.done}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            dispatch({
                                type: 'edited',
                                id: todo.id,
                                value: todo.value,
                                done: e.target.checked
                            })
                        }}>
                        </input>
                        {todo.value}
                    </motion.span>
                )}
            </AnimatePresence>
            <button onClick={() => setIsEditing(!isEditing)}>{isEditing ? 'Save' : 'Edit'}</button>
        </motion.li>
      </>
    )
})

const TodoMotion = motion(Todo, {forwardMotionProps: true})