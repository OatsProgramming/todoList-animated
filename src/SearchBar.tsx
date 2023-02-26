import React, { useState, createContext, useContext } from "react"
import { getTodoList } from "./StateProvider"
import { ChildrenProp, TodoItem, Todos } from "./types"

import { motion } from "framer-motion"

import './SearchBar.modules.css'

const FilteredListContext = createContext<Todos>([])

type SelectedFilter = 'Incomplete' | 'Complete' | 'None' 
const listOfSelections: SelectedFilter[] = ['Incomplete', 'Complete', 'None']

export function getFilteredList(){
    return useContext(FilteredListContext)
}

export function SearchBar({children}: ChildrenProp){
    const [selectedFilter, setSelectedFilter] = useState<SelectedFilter>('None')
    const [query, setQuery] = useState('')
    const todoList = getTodoList()

    // This is to help deal with the filteredList
    // It'd be a filtered list based on 'doneness' selection then filtered by query
    let primordialFilter;
    switch(selectedFilter){
        case 'None':{
            primordialFilter = todoList
            break;
        }
        case 'Complete':{
            primordialFilter = todoList.filter((item: TodoItem) => item.done)
            break;
        }
        case 'Incomplete':{
            primordialFilter = todoList.filter((item: TodoItem) => !item.done)
            break;
        }
        default:{
            throw new Error('Selected filter unknown')
        }
    }

    function handleSelection(e: React.MouseEvent<HTMLLIElement>){
        let target = e.target as HTMLLIElement
        setSelectedFilter(target.id as SelectedFilter)
    }

    const filteredList = primordialFilter.filter((item: TodoItem) => {
        let word = item.value.toLowerCase()
        let searchFor = query.toLowerCase()
        if (word.includes(searchFor)) return item
    })


    return (
        <>
            <FilteredListContext.Provider value={filteredList}>
                {children}
            </FilteredListContext.Provider>
            <section className="filteringSection">
                <label htmlFor="searchBar">
                    Search Task: <input
                        name="searchBar"
                        value={query}
                        type='text'
                        placeholder="Dilly dally..."
                        onChange={(e) => setQuery(e.target.value)}
                    >
                    </input>
                </label>
                <br />
                <motion.ul className='filterChoice'>
                    {listOfSelections.map((selection: SelectedFilter) => (
                        <motion.li
                        key={selection}
                        id={selection}
                        onClick={((e: React.MouseEvent<HTMLLIElement>) => handleSelection(e))}
                        style={{color : selectedFilter === selection ? 'black' : 'white'}}
                        >
                            {selection}
                            {selectedFilter === selection && (
                                <motion.div 
                                className='selectedBubble' 
                                layoutId='selectedBubble'
                                >
                                    &nbsp;
                                </motion.div>
                            )}
                        </motion.li>
                    ))}
                </motion.ul>
            </section>
        </>
    )
}