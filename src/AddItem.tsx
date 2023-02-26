import { getDispatch } from "./StateProvider"
import { ChangeEvent, useState } from "react"

export default function AddItem(){
    const [value, setValue] = useState<string>('')
    const dispatch = getDispatch()

    return (
        <>
            <input 
            placeholder="Laundry..." 
            value={value} 
            onChange={(e) => setValue(e.target.value)}
            >
            </input>
            <button onClick={() => {
                dispatch({
                    type: 'added',
                    value: value
                })
                setValue('')
            }}>ADD</button>
            
        </>
    )
}