import React, { useEffect, useState} from 'react'
import { TodoForm } from './TodoForm'
import { v4 as uuidv4 } from 'uuid'
import { Todo } from './Todo';
import { db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { EditTodoForm } from './EditTodoForm';
uuidv4();

export const TodoWrapper = () => {
    const [todos, setTodos] = useState([])

    //fetch tasks from firebase when the component mounts
    useEffect(() => {
      const fetchTodos = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, 'tasks'));
          const todosFromDB = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTodos(todosFromDB);
        } catch (error) {
          console.error('Error fetching tasks:',error)
        }
      }
      fetchTodos()
    }, [])

    //Add new todo to firebase
    const addTodo = async (todo) => {
      try {
        const docRef = await addDoc(collection(db, 'tasks'), {
          task: todo,
          completed: false,
          isEditing: false,
        });
        setTodos([...todos, {id: docRef.id, task: todo, completed: false, isEditing: false }])
      } catch (error){
        console.log(todos)
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

  return (
    <div className='TodoWrapper'>
      <h1>What's your plan ?</h1>
        <TodoForm addTodo={addTodo}/>
        {todos.map((todo,index) => (
          todo.isEditing ? (
            <EditTodoForm key={index} editTodo={editTask} task={todo}/>
          ) : (
            <Todo task={todo} key={index}
            toggleComplete={toggleComplete} deleteTodo={deleteTodo} editTodo={editTodo}/>
          )  
        ))}    
    </div>
  )
}
