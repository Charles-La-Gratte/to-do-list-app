import React, {useState} from 'react'

export const EditTodoForm = ({editTodo, task}) => {
    const [value, setValue] = useState(task.task)
    const handleSubmit = e => {
        //useState is for tracking the change on the input
        //the input change is saved in setValue
        //to prevent the reload of the page in case because if you submit the form the page reload automatically
        e.preventDefault();
        editTodo(value, task.id); 
        //after i submit the form i want to clear it the input
        setValue("")

        
    }
  return (
    <form className='TodoForm' onSubmit={handleSubmit}>
        <input type="text" value={value} className='todo-input' placeholder='Update your task here' onChange={(e) => setValue(e.target.value)}/>
        <button type='submit' className='todo-btn'>Update Task</button>
    </form>

  )
}
