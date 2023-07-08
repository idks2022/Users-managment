import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import * as utils from './utils';
import './style.css';
import Main_users from "./Main_users";
import Main_userTodos from "./Main_userTodos";
import Main_userPosts from "./Main_userPosts";

const usersUrl = 'https://jsonplaceholder.typicode.com/users';
const postsUrl = 'https://jsonplaceholder.typicode.com/posts';
const todosUrl = 'https://jsonplaceholder.typicode.com/todos';

const Main = () => {

    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const [showForId, setShowForId] = useState(null);
    const [errors, setErrors] = useState({});

    const [users, setUsers] = useState([]);
    const [addNewUser, setAddNewUser] = useState(false);
    const [addUserContent, setAddUserContent] = useState({"name" : '', "email" : ''});

    const [todos, setTodos] = useState([]);
    const [userTodos, setUserTodos] = useState([]);
    const [addTodoForId, setAddTodoForId] = useState(false)
    const [addTodoContent, setAddTodoContent] = useState('')
    const [currentTodosPage, setcurrentTodosPage] = useState(0)

    const [posts, setPosts] = useState([]);
    const [userPosts, setUserPosts] = useState([]);
    const [addPostForId, setAddPostForId] = useState(false);
    const [addPostContent, setAddPostContent] = useState({"title" : '', "body" : ''});
    const [currentPostsPage, setCurrentPostsPage] = useState(0);
    
    const itemsPerPage = 5;
    const debounceDelay = 250;

    /*
    const renderCount = useRef(1);
    useEffect(() => {
      renderCount.current = renderCount.current+1;
    });
    */
    
    useEffect(()=>{
        const timerId = setTimeout(()=>{
            setDebouncedSearch(search);
        }, debounceDelay);

        return () =>{
            clearTimeout(timerId);
        };
    }, [search, debounceDelay]);

    const callbackDetails = (newDetails, userDelete) => {
        if (!userDelete)
            {        
                console.log('User', newDetails.id, 'passed the following details:', newDetails)
                const updatedUsers = users.map(user=>{
                    if (user.id === newDetails.id) {
                        return {...user, ...newDetails}
                    }
                    return user;
                });
                setUsers(updatedUsers)
                setShowForId(null)
                console.log("User ID", newDetails.id, "has been updated")
            }
        if (userDelete)
            {
                const updatedUsers = users.filter(user => user.id !== newDetails.id)
                setUsers(updatedUsers)
                console.log("User ID", newDetails.id, "has been deleted")
                setShowForId(null)
                setUserTodos([])   
                setUserPosts([])
            }
    };

    const callbackTodosPosts = (userId) => {
        if(showForId === userId){
            setShowForId(null)
            setUserTodos([])
            setUserPosts([])
        }
        else{
        setAddTodoForId(false)
        setAddTodoContent('')
        
        setAddPostForId(false)
        setAddPostContent({"title" : '', "body" : ''})

        setAddNewUser(false)
        setAddUserContent({"name" : '', "email" : ''})


        setShowForId(userId)
        
        
        }
    };

    const callbackCompleted = (todoId) => {
        const updatedTodos = todos.map((todo => {
            if(todo.id === todoId){
                return {...todo, completed: true}
            }
            else {
                return todo
            }
        }))
        setTodos(updatedTodos)
        console.log('mark todo',todoId, 'as Completed')
    };

    const validateInput = () => {
        const emailRegex = /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/;
        const newErrors = {};
    
        if (!addUserContent.name) {
            newErrors.name = 'Invalid name';
        }
        if (!addUserContent.email || !emailRegex.test(addUserContent.email)) {
            newErrors.email = 'Invalid email';
        }
    
        return newErrors;
    };

    const addTodo = () => {
        const newTodo = {   
            "userId": showForId,
            "id": ((todos[todos.length-1].id) + 1),
            "title": addTodoContent,
            "completed": false
            }
        setTodos([...todos, newTodo])
        console.log('user', showForId, 'adds task', newTodo)
        setAddTodoForId(false)
        setAddTodoContent('')
        
    };

    const addPost = () => {
        const newPost = {
            "userId": showForId,
            "id": ((posts[posts.length-1].id) + 1),
            "title": addPostContent.title,
            "body": addPostContent.body,
            }
        setPosts([...posts, newPost])
        console.log('user', showForId, 'adds post', newPost)
        setAddPostForId(false)
        setAddPostContent({"title" : '', "body" : ''})
    };

    const addUser = () => {
        
        const newErrors = validateInput();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } 
        else {
            const newId = ((users[users.length - 1].id) + 1)
            const newUser = {
                "id": newId,
                "name": addUserContent.name,
                "email": addUserContent.email,
                "address": {
                    "street": '',
                    "city": '',
                    "zipcode": '',
                    },
                };
            setUsers([...users, newUser])
            console.log('New user has been added:', newUser)
            setAddNewUser(false)
            setAddUserContent({"name" : '', "email" : ''})
            setShowForId(newId)
        }
        };

    useEffect(() => {
        const getData = async () => {
        try {
            const [usersData, todosData, postsData] = await Promise.all([
                utils.getAll(usersUrl),
                utils.getAll(todosUrl),
                utils.getAll(postsUrl),
              ]);
              setUsers(usersData.data);
              setTodos(todosData.data);
              setPosts(postsData.data);
            }
        catch (error) {
            console.error("An error occurred while fetching data:", error);
            }
        };
        getData();
    }, []);

    useEffect(() => {
        const filteredTodos = todos.filter(todo => todo.userId === showForId)
        setUserTodos(filteredTodos)
    },[todos, showForId])

    useEffect(() => {
        const filteredPosts = posts.filter(post => post.userId === showForId)
        setUserPosts(filteredPosts)
    }, [posts, showForId])

    useEffect(() => {
        setcurrentTodosPage(0);
        setCurrentPostsPage(0);
    }, [showForId])

    const filteredUsers = useMemo(() => {
        return users.map((user)=>{
            if ((user.name.toLowerCase().includes(debouncedSearch)) || (user.email.toLowerCase().includes(debouncedSearch)) ) {
                return <Main_users 
                        key={user.id} 
                        user={user} 
                        todos={(todos.filter(todo=>todo.userId===user.id))} 
                        callbackDetails={callbackDetails}                                
                        callbackTodosPosts={() => callbackTodosPosts(user.id)}
                        onShowTodosPosts={user.id === showForId}/> }
            else {
                return null;
            }
        })
    },[users, debouncedSearch, todos, callbackDetails, callbackTodosPosts, showForId]);

    const renderedUserTodos = useMemo(() => {
        return userTodos.slice(currentTodosPage * itemsPerPage, (currentTodosPage + 1) * itemsPerPage).map((todo) => {
            return <Main_userTodos 
                    key={todo.id} 
                    todo={todo} 
                    callbackCompleted={callbackCompleted}/>;
        });
    }, [userTodos, currentTodosPage, itemsPerPage, callbackCompleted]);
    
    const renderedUserPosts = useMemo(() => {
        return userPosts.slice(currentPostsPage * itemsPerPage, (currentPostsPage + 1) * itemsPerPage).map((post) => {
            return <Main_userPosts
                    key={post.id}
                    post={post}/>;
        });
    }, [userPosts, currentPostsPage, itemsPerPage]);
    

    return (
        <>
        
        <header>
            
            <button onClick={()=>{setAddNewUser(true); setShowForId(null);}} className="nes-btn">Add New User</button>
        </header>
        <div className="main">
            <fieldset className="usersContainer">
                <legend>Search User: <input type="text" onChange={(e)=>{setSearch((e.target.value).toLowerCase())}}/> </legend>
                {filteredUsers}
            </fieldset>
            <div className="todosAndPosts"> 
                {addNewUser &&(
                <>
                
                <fieldset>
                <legend>Add New User:</legend>
                <strong>Name:</strong><input type="text" onChange={(e)=>{setAddUserContent({...addUserContent,name: e.target.value})}} /> <br />
                <strong>Email:</strong><input type="email" onChange={(e)=>{setAddUserContent({...addUserContent,email: e.target.value})}} /> <br />
                {errors.email && <div className="errors">{errors.email}</div>}
                <div className="buttoms">
                <button onClick={()=>setAddNewUser(false)}>Cancel</button>
                <button onClick={addUser} disabled={!addUserContent.name || !addUserContent.email}>Add User</button>
                </div>
                </fieldset>

                </>
                )}

                {showForId!==null && (
                <>
                <div>
                    {!addTodoForId &&
                        <fieldset>
                            <legend>User {showForId} Tasks List <button onClick={()=>setAddTodoForId(true)}>Add Task</button> </legend>
                            {renderedUserTodos}
                            <div className="buttoms">
                            <button onClick={() => setcurrentTodosPage(currentTodosPage - 1)} disabled={currentTodosPage === 0}>Previous Page</button>
                            <button onClick={() => setcurrentTodosPage(currentTodosPage + 1)} disabled={currentTodosPage >= Math.ceil(userTodos.length / itemsPerPage) - 1}>Next Page</button>
                            </div>
                        </fieldset>
                    }
                    {addTodoForId &&
                    <fieldset>
                        <legend>Add a task for user {showForId}</legend>
                        <strong>Title:</strong><input type="textarea" onChange={(e)=>{setAddTodoContent(e.target.value)}}/> <br/>  <br />
                        <div className="buttoms">
                        <button onClick={()=>setAddTodoForId(false)}>Cancel</button>
                        <button onClick={addTodo} disabled={!addTodoContent}>Add Task</button>
                        </div>
                    </fieldset>
                    }
                </div>
                <div>
                    {!addPostForId &&
                        <fieldset>
                            <legend>User {showForId} Posts List <button onClick={()=>setAddPostForId(true)}>Add Post</button></legend>
                                {renderedUserPosts}
                                <div className="buttoms">
                                <button onClick={() => setCurrentPostsPage(currentPostsPage - 1)} disabled={currentPostsPage === 0}>Previous Page</button>
                                <button onClick={() => setCurrentPostsPage(currentPostsPage + 1)} disabled={currentPostsPage >= Math.ceil(userPosts.length / itemsPerPage) - 1}>Next Page</button>
                                </div>
                        </fieldset>
                    }
                    {addPostForId &&
                    <fieldset>
                        <legend>Add a post for user {showForId}</legend>
                        <strong>Title:</strong><input type="textarea" onChange={(e)=>{setAddPostContent({...addPostContent, title: e.target.value})}}/> <br/> <br />
                        <strong>Body:</strong><input type="textarea" onChange={(e)=>{setAddPostContent({...addPostContent, body: e.target.value})}}/> <br/> <br />
                        <div className="buttoms">
                        <button onClick={()=>setAddPostForId(false)}>Cancel</button>
                        <button onClick={addPost} disabled={!addPostContent.title || !addPostContent.body}>Add Post</button>
                        </div>
                    </fieldset>
                    }
                </div>
                </>
                )}
            </div>
        </div>
        
        </>
    )
}
export default Main;