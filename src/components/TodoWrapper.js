import React, { useEffect, useState} from 'react'
import { TodoForm } from './TodoForm'
import { v4 as uuidv4 } from 'uuid'
import { Todo } from './Todo'
import { db } from '../firebase'
import { onSnapshot, collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { EditTodoForm } from './EditTodoForm'
uuidv4();

export const TodoWrapper = () => {
    const [todos, setTodos] = useState([])

    //fetch tasks from firebase when the component mounts
    useEffect(() => {
      //onSnapshot is a real-time listener provided by firebase that allow the app to automatically update
      const unsubscribe = onSnapshot(collection(db,"tasks"), (onSnapshot) => {
        const todosFromDB = onSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setTodos(todosFromDB);
      })
      return () => unsubscribe() // stop listening. Update state with real-time data
    }, [])

    //Add new todo to firebase
    const addTodo = async (todo) => {
      try {
        const docRef = await addDoc(collection(db, 'tasks'), {
          task: todo,
          completed: false,
          isEditing: false,
          isLiked: false,
        });
        setTodos((prevTodos) => [...prevTodos, {id: docRef.id, task: todo, completed: false, isEditing: false, isLiked: false }])
        console.log("Task added successfully!!!")
      } catch (error){
        console.error("Error adding task:", error)
      }
    }

    //Toggle completed state in Firebase
    const toggleComplete = async (id) => {
      const todoRef = doc(db, 'tasks', id)
      setTodos(
        todos.map((todo) => 
          todo.id === id ? {...todo, completed: !todo.completed} : todo
      )
    )
    await updateDoc(todoRef, {
      completed: !todos.find((todo) => todo.id === id).completed,
    })
    }

    //function for deleting the selected task if i click to the trash icon
    const deleteTodo = async (id) => {
      try {
        await deleteDoc(doc(db, 'tasks', id))
        setTodos(todos.filter((todo) => todo.id !== id ))
      } catch (error) {
        console.error('Error deleting task:', error)
      }
    }

    //function for editing the selected task if i click to edit icon
    const editTodo = (id) => {
      setTodos(
        todos.map((todo) => 
          todo.id === id ? {...todo, isEditing: !todo.isEditing} : todo
       )
      )
    }

    //Update edited task in firebase
    const editTask = async (task, id) => {
      const todoRef = doc(db, 'tasks', id)
      try {
        await updateDoc(todoRef, { task })
        setTodos(
          todos.map((todo) => todo.id === id ? {...todo, task, isEditing: !todo.isEditing} : todo
        )
       )
      } catch (error) {
        console.error('Error updating task:', error)
      }
    }

    //function for the like and dislike
      const colorTodoHeart = async (id) => {
        const todoRef = doc(db, 'tasks', id)
           setTodos(
             todos.map((todo) => 
               todo.id === id ? {...todo, isLiked: !todo.isLiked} : todo
           )
         )
         await updateDoc(todoRef, {
           isLiked: !todos.find((todo) => todo.id === id).isLiked,
         })
      }

  return (
    <div className='TodoWrapper'>
      <h1>What's your plan ?</h1>
        <TodoForm addTodo={addTodo}/>
        {todos.map((todo,index) => (
          todo.isEditing ? (
            <EditTodoForm key={index} editTodo={editTask} task={todo}/>
          ) : (
            <Todo task={todo} key={index}
            toggleComplete={toggleComplete} deleteTodo={deleteTodo} editTodo={editTodo} colorTodoHeart={colorTodoHeart}/>
          )  
        ))}    
    </div>
  )
}
