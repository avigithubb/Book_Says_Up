import React, { useState, useEffect } from "react";
import registerPic from "../assets/images/roberta.jpg";
import { useNavigate } from "react-router-dom";

function Register(){

    const [content, setContent] = useState({
        myName: "",
        myUsername: "",
        myPassword: "",
        myCollection: "",
        myEmail: "",
        about: ""
    });

    const [sendValue, setSendValues] = useState({
        name: "",
        username: "",
        password: "",
        collection: "",
        email: "",
        about: ""
    });

    const [isResponseSubmit, setIsResponseSubmit] = useState(false);
   
    const navigateTo = useNavigate();

    
    useEffect(() => {
        if(isResponseSubmit){
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // body: JSON.stringify({ title: 'React Hooks POST Request Example' })
            };

            const queryParams = new URLSearchParams({
                name: sendValue.name,
                email: sendValue.email,
                username: sendValue.username,
                password: sendValue.password,
                collection: sendValue.collection,
                about: sendValue.about
            });

            fetch(`http://localhost:3000/register?${queryParams}`, requestOptions)
            .then(response => response.json())
            .then(data => { 
                setIsResponseSubmit(false);
                if(data.msg == "success"){
                    const queryParams = new URLSearchParams({
                        username: data.userName,
                        authenticated: true
                    }).toString();
                    navigateTo(`/collection?${queryParams}`);
                }
                
                
                // setIsRecord(true);
            })
        }
    }, [isResponseSubmit])


    function handleChange(event) {
        const title = event.target.name;
        const content = event.target.value;

        setContent(prevValue =>{
            if(title === "name"){
                return{
                    myName: content,
                    myUsername: prevValue.myUsername,
                    myPassword: prevValue.myPassword,
                    myCollection: prevValue.myCollection,
                    myEmail: prevValue.myEmail,
                    about: prevValue.about
                }
            }
            else if(title === "username"){
                return {
                    myName: prevValue.myName,
                    myUsername: content,
                    myPassword: prevValue.myPassword,
                    myCollection: prevValue.myCollection,
                    myEmail: prevValue.myEmail,
                    about: prevValue.about
                }
            }
            else if(title === "password"){
                return {
                    myName: prevValue.myName,
                    myUsername: prevValue.myUsername,
                    myPassword: content,
                    myCollection: prevValue.myCollection,
                    myEmail: prevValue.myEmail,
                    about: prevValue.about
                }
            }
            else if (title === "email"){
                return {
                    myName: prevValue.myName,
                    myUsername: prevValue.myUsername,
                    myPassword: prevValue.myPassword,
                    myCollection: prevValue.myCollection,
                    myEmail: content,
                    about: prevValue.about
                }
            }
            else if(title === "collection"){
                return {
                    myName: prevValue.myName,
                    myUsername: prevValue.myUsername,
                    myPassword: prevValue.myPassword,
                    myCollection: content,
                    myEmail: prevValue.myEmail,
                    about: prevValue.about
                }
            }
            else{
                return {
                    myName: prevValue.myName,
                    myUsername: prevValue.myUsername,
                    myPassword: prevValue.myPassword,
                    myCollection: prevValue.myCollection,
                    myEmail: prevValue.myEmail,
                    about: content
                }
            }
        })

        event.preventDefault();
    }

    function handleSubmit(event) {
        event.preventDefault();
        setIsResponseSubmit(true);
    }

    var RegisterInfo = {
        display: "flex"
    }

    var RegisterPic = {
        width: "50vw",
        height: "100vh"
    }

    var RegisterImg = {
        width: "50vw",
        height: "100vh"
    }

    var mainContent = {
        width: "50vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    }

    

   var hr = {
    width: "60%",
    height: "5px",
    margin: "auto",
    marginTop: "0px",
    marginBottom: "0px",
    backgroundColor: "black"
   }

   var p = {
    color: "grey",
    marginTop: "-20px"
   }

   var h2 = {
    fontSize: "50px"
   }

    return (
        <>
        <div className="Register-info" style={RegisterInfo}>
            <div className="Register-pic" style={RegisterPic}>
                <img src={registerPic} alt="register-img" className="Register-img" style={RegisterImg} />
            </div>
            <div className="register main-content" style={mainContent}>
                <nav className="register-nav">
                    <button onClick={() => {navigateTo("/")}} style={{ float : "left"}}>Home</button>
                    <button className="register-login-btn" onClick={() => {navigateTo("/login")}} style={{ float: "right"}}>Login</button>
                </nav>
                <h2 style={h2}>Create Your Account</h2>
                <p style={p}>Welcome to Book Says<br />Plz enter your Details</p>
                <div className="hr" style={hr}></div>
                <form action="/register" method="post" onSubmit={handleSubmit}>
                    <input type="text" onChange={handleChange} placeholder="Your Name" name="name" required value={content.myName} />
                    <input type="text" onChange={handleChange} placeholder="Username" name="username" required value={content.myUsername} />
                    <input type="email" onChange={handleChange} placeholder="Email" name="email" required value={content.myEmail} />
                    <input type="password" onChange={handleChange} name="password" id="psw" placeholder="Password" value={content.myPassword} pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters" required />
                    <input type="text" onChange={handleChange} name="collection" placeholder="Collection Name" value={content.myCollection} />
                    <input type="text" onChange={handleChange} name="about" placeholder="About yourself in few words" value={content.about} />
                    <input type="submit" onClick={()=>{
                        sendValue.name = content.myName;
                        sendValue.username = content.myUsername;
                        sendValue.password = content.myPassword;
                        sendValue.collection = content.myCollection;
                        sendValue.email = content.myEmail;
                        sendValue.about = content.about;
                        content.myName = "";
                        content.myUsername= "";
                        content.myPassword= "";
                        content.myCollection= "";
                        content.myEmail= "";
                        content.about= ""
                    }} value="Let me Read" />
                </form>
            </div>

        </div>
        </>
    )
}


export default Register;