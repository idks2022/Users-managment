import { useEffect, useState } from "react";
import Main_userTodos from "./Main_userTodos";
import * as utils from './utils';


const Main_users = ({user, todos, callbackDetails, callbackTodosPosts, onShowTodosPosts}) => {

    const [allTodosCompleted, setAllTodosCompleted] = useState(true)
    const [showDetails, setShowDetails] = useState(false)
    const [userDetails, setUserDetails] = useState(user)
    const [userDelete, setUserDelete] = useState(false)
    const [errors,setErrors] = useState({});

    const userDivClass = allTodosCompleted ? (onShowTodosPosts ? 'greenDiv orangeDiv' : 'greenDiv') : (onShowTodosPosts ? 'redDiv orangeDiv' : 'redDiv')

    const validateInput = () => {
        const emailRegex = /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/;
        const newErrors = {};
    
        if (!userDetails.name) {
            newErrors.name = 'Invalid name';
        }
        if (!userDetails.email || !emailRegex.test(userDetails.email)) {
            newErrors.email = 'Invalid email';
        }
        if (!userDetails.address.street) {
            newErrors.street = 'Invalid street';
        }
        if (!userDetails.address.city) {
            newErrors.city = 'Invalid city';
        }
        if (!userDetails.address.zipcode) {
            newErrors.zipcode = 'Invalid zipcode';
        }
    
        return newErrors;
    };

    const handleUpdate = () => {
        const newErrors = validateInput();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } 
            else {
            setErrors({})
            if(window.confirm("Are you sure you want to commit these updates?")){
                callbackDetails(userDetails, userDelete);
            } else {
                setUserDetails(user);
            }
        }
    };

    useEffect(() => {
        const handleDelete = () =>{
            if(window.confirm("Are you sure you want to delete this user?")){
                callbackDetails(userDetails, userDelete)
            }
            else {setUserDelete(false);}
        }
        if (userDelete){handleDelete()}
    },[userDelete])

    useEffect(() => {
        setAllTodosCompleted(true);
        const checkTodos = () => {
            todos.forEach((todo) => {
                if (!todo.completed) {
                    setAllTodosCompleted(false);
                    return;
                }})
        }
        checkTodos();
    },[todos])


    return (
        <>
    
        <div className={userDivClass}>
            <div onClick={callbackTodosPosts}>ID: {user.id} <br /></div>
                Name: <input type="text" value={userDetails.name} onChange={(e)=>setUserDetails({...userDetails,name: e.target.value})} /> <br />
                {errors.name && <div className="errors">{errors.name}</div>}
                Email: <input type="email" value={userDetails.email} onChange={(e)=>{setUserDetails({...userDetails,email: e.target.value})}}/> <br />
                {errors.email && <div className="errors">{errors.email}</div>}
                <div className="buttoms">
                <button onMouseOver={()=>setShowDetails(true)} onClick={()=>setShowDetails(prevState=>!prevState)}>{showDetails ? 'Show less' : 'More details'}</button>
                <button onClick={handleUpdate}>Update</button>       
                <button onClick={() => setUserDelete(true)}>Delete</button>
            </div>

            {showDetails &&
            <div style={{backgroundColor:"LightGrey"}}>
                Street: <input type="text" value={userDetails.address.street} onChange={(e)=>{setUserDetails({...userDetails,address:{...userDetails.address, street: e.target.value}})}}/> <br />
                {errors.street && <div className="errors">{errors.street}</div>}
                City: <input type="text" value={userDetails.address.city} onChange={(e)=>{setUserDetails({...userDetails,address:{...userDetails.address, city: e.target.value}})}}/> <br />
                {errors.city && <div className="errors">{errors.city}</div>}
                Zipcode: <input type="text" value={userDetails.address.zipcode} onChange={(e)=>{setUserDetails({...userDetails,address:{...userDetails.address, zipcode: e.target.value}})}}/> <br />
                {errors.zipcode && <div className="errors">{errors.zipcode}</div>}
            </div>
        }
        </div>

        </>
    )
}
export default Main_users;