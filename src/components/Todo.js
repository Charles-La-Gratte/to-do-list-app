import React, { useEffect, useState } from 'react'
import { getTodos } from '../firebase'//import function to fetch tasks
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { motion } from "framer-motion"
import { updateDoc, doc } from 'firebase/firestore'
import { db } from '../firebase'


export const Todo = ({task, toggleComplete, deleteTodo, editTodo}) => {
  const [isLiked, setIsLiked] = useState(task.isLiked)
  //function for the like and dislike
  const colorTodoHeart = async () => {
    setIsLiked (!isLiked)

    try {
      const taskRef = doc(db, "tasks", task.id);
      await updateDoc(taskRef, { isLiked: !isLiked }); // Update Firestore
    } catch (error) {
      console.error("Error updating liked state:", error);
    }
  }

  const [value, setValue] = useState([])

  useEffect(() => {
    const fetchTodos = async () => {
      const todosFromDB = await getTodos() //Fetch tasks
      setValue(todosFromDB)
    }
    fetchTodos()
  }, []) 
  console.log(value)

  
  return (
    <div className='Todo'>
      
      <p onClick={() => toggleComplete(task.id)} className={`${task.completed ? "completed" : ""}`}>{task.task}</p>
      <div>
        <motion.div style={{ display: "inline-block" }} whileHover={{ scale: 1.5 }} whileTap={{ scale: 0.9 }}>  
          <FontAwesomeIcon icon={faPenToSquare} onClick={() => editTodo(task.id)}/>
        </motion.div> 

        <motion.div style={{ display: "inline-block" }} whileHover={{ scale: 1.5 }} whileTap={{ scale: 0.9 }}> 
        <FontAwesomeIcon icon={faTrash} onClick={() => deleteTodo(task.id)}/>
        </motion.div> 

        <motion.div style={{ display: "inline-block" }} whileTap={{ scale: 1.3, rotate: 50 }} whileHover={{ scale: 1.5 }} transition={{ type: "spring", stiffness: 200 }}> 
          <FontAwesomeIcon icon={faHeart} onClick={() => colorTodoHeart(task.id)} style={{ color: isLiked ? "red" : "white", cursor: "pointer" }} />
        </motion.div>
      </div>
    </div>
  )
}


