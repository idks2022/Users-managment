

const Main_userTodos = ({todo, callbackCompleted}) => {
    
    
    return (
        <>
        
        <div className="todo">
            
        <strong>Task ID:</strong> {todo.id} <strong>Title:</strong> {todo.title} <br />
        <strong>Completed: </strong> 
        {todo.completed ? 'Yes' : <span>No <button onClick={()=>callbackCompleted(todo.id)}>Mark Completed</button></span>} <br />
        
        </div>
        </>
    )
}
export default Main_userTodos;