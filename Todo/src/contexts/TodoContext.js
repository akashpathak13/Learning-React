import { createContext, useContext } from "react";
export const TodoContext = createContext({
    todo:{
        todos : [
            {
                id: 1,
                todo:'do something',
                completed : false,
            },
            
        ],
        addTodo: (todo)=>{},
        deleteTodo: (id)=>{},
        updateTodo: (id,todo)=>{},
        toggleComplete: (id)=>{},
    }
})



export const TodoProvider =  TodoContext.Provider;

export const useTodo = () =>{
    return useContext(TodoContext)
}
