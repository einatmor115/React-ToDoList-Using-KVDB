import React, { useEffect, useState }  from 'react';
import './App.css';
import Checkbox from '@material-ui/core/Checkbox';
import axios from "axios";
import { v4 as uuidV4 } from "uuid";
import store from "store";

const BUCKET_NAME = "RqyRuHjZX8Z87JhBMhZZu6";
let userId = "";
// let myuserId = '';

export default function App() {
  
 useEffect(async () => {

  //get userid from store
       userId = store.get("userId");
       if (!userId) {
       userId = uuidV4();
       store.set("userId", userId);
       }
 
      console.log('User id is',{userId});

   // Set Todos 
     console.log(store.get("userId"));
     store.set("todos", todos); 
     console.log(store.get("todos"));
     let response2 =  axios.get(
       `https://kvdb.io/${BUCKET_NAME}/${userId}`
     );
     console.log(response2);
    
  } ,[]);

  let [todos, setTodos] = React.useState([
    // { text: "Sleep", isCompleted: false },
    // { text: "Eat", isCompleted: false },
    // { text: "Work", isCompleted: false }
  ]);

  let addTodo = value => {
    if (value !== "") {
      let updatedList = [...todos, {text: value, isCompleted: false}];  
      addItems(updatedList);
    }
    // let newTodos = [...todos, { text }];
    setTodos(prevList => [...prevList, {text: value, isCompleted: false}])
    // setTodos(newTodos);
  };

  let addItems = async (updatedList) => {
    let response = await axios.post(
      `https://kvdb.io/${BUCKET_NAME}/${userId}`,
      updatedList
    );    
    // console.log(response);
  };
  
  let completeTodo = async index => {
    let newTodos = [...todos];
    newTodos[index].isCompleted ?  (newTodos[index].isCompleted = false) : (newTodos[index].isCompleted = true);   
    let updatedList = [...todos];
    let response = await axios.post(
      `https://kvdb.io/${BUCKET_NAME}/${userId}`
      ,updatedList         
    );
    setTodos(newTodos);
    };

  let removeTodo = index => {
    let newTodos = [...todos];
    newTodos.splice(index, 1);    
    deleteItem(newTodos, index);
  };
  
  let deleteItem = async (updatedList, index) => {
    console.log(index);
    let response = await axios.delete(
      `https://kvdb.io/${BUCKET_NAME}/${userId}`
      ,{ id: index}, updatedList         
    );
      
    console.log(updatedList);
    let response2 = await axios.post(
      `https://kvdb.io/${BUCKET_NAME}/${userId}`,
      updatedList
    );
    setTodos(updatedList);
    // console.log(response);
  };
  
  //  initial List from KVDB:
      useEffect(()=>
        {
          console.log(todos);
          (async function getList(){
            let responseList = await axios.get(`https://kvdb.io/${BUCKET_NAME}/${userId}`)
           console.log((responseList.data)); 
     
            let data = (responseList.data);       
            console.log(data);
            setTodos(data);       
           let map = Array.prototype.map;
            let newList = map.call(data, eachItem => {
           return (eachItem)
            })
            console.log(newList);

          setTodos(newList)
        
          })();
        },[])


  return (
 <div className="app">
   <h3 className="h3">My ToDo List</h3>
   <div className="contain">
      <div className="todo-list">
        {todos.map((todo, index) => (      
          <Todo
            key={index}            
            index={index}
            todo={todo}
            completeTodo={completeTodo}
            removeTodo={removeTodo}  
          />  
        ))}
        <TodoForm addTodo={addTodo} />
      </div>
      </div>
    </div>
  );
}

function Todo({ todo, index, completeTodo, removeTodo }) {
  return ( 
     <div
      className="todo"
      style={{ textDecoration: todo.isCompleted ? "line-through" : "" }}>
      {todo.text}
      <div>    
     <Checkbox style={{color:'cornflowerblue'}} className="Checkbox" onClick={() => completeTodo(index)}> </Checkbox>
        <button style={{fontsize: '20px'}} onClick={() => removeTodo(index)}>x</button>
      </div>
    </div>
  );
};

function TodoForm({ addTodo }) {
  let [value, setValue] = React.useState("");
  let handleSubmit = e => {
    e.preventDefault();
    if (!value) return;
    addTodo(value);
    setValue("");
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="value"
        className="input"
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    </form>
  );
}