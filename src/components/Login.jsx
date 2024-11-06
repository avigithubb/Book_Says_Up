import React, { useState, useEffect } from "react";
import bookPic from "../assets/images/B.png";
import loginPicture from "../assets/images/login_pic.jpg";
import { useNavigate } from "react-router-dom";


function Login(){

    const navigateTo = useNavigate();
    const [content, setContent] = useState({
        username: "",
        password: ""
    });
    const [incorrect, setIncorrect] = useState("");
    const [isFormSubmitted, setFormSubmitted] = useState(false);
    const [userResponse, setUserResponse] = useState({});
    const [changeRoute, setChangeRoute] = useState(false);
    

    function formSubmit(event) {
        event.preventDefault();
        setFormSubmitted(true); // This triggers the useEffect to make the API call.
    }
   
        
    useEffect(() => {
        if (isFormSubmitted) {
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            };

    
            const queryParams = new URLSearchParams({
                username: content.username, // These values should be properly set now
                password: content.password
            }).toString();
    
            fetch(`http://localhost:3000/login?${queryParams}`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    setUserResponse(data);
                
                    setFormSubmitted(false); // Reset the form submission state
                    setChangeRoute(true); // Trigger the route change
                    setContent({ // Clear the input fields
                        username: "",
                        password: ""
                    });
                })
                .catch((error) => {
                    console.error('Error:', error);
                    setFormSubmitted(false); // In case of an error, ensure form state is reset
                });
        }
    }, [isFormSubmitted]); // Adding a square bracket at the end confirms that each time when the isFormSubmitted changes useEffect hook exicuted. It totally depends on isFormSubmitted. If it were infact empty then useEffect would've executed only once at the page load.

    
    useEffect(() => {
        if(changeRoute && userResponse.msg == "success"){
            // console.log("yeppeee!!!!");
            const userName = userResponse.userName;
            const queryParams = new URLSearchParams({
                username: userName,
                authenticated: true
                
            }).toString();
            navigateTo(`/collection?${queryParams}`);
            setChangeRoute(false);
        }
        else if( userResponse.msg == "failure"){
            setIncorrect("Authentication Failed");
            setTimeout(() => {
                setIncorrect("");

            }, 2000)
        }
        
    }, [changeRoute])

    
   

    function handleChange(event) {
        const { name, value } = event.target;
    
        setContent((prevValue) => ({
            ...prevValue,
            [name]: value
        }));
    }

    var loginInfo = {
        display: "flex",
    }

    var loginForm = {
        width: "50vw"
        
    }

    var mainContent = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "90vh"
       
    }

    var h2 = {
        marginTop: "200px"
    }

    
    var loginImg = {
        /* height: 100vh; */
        height: "100vh",
        width: "50vw",
        display: "fixed"
    }

    var loginPic = {
        height: "100vh",
        width: "50vw"
    }



    return (
        <>
        <div className="login-info" style={loginInfo}>
            <div className="login-form" style={loginForm}>
                <nav id="login-nav">
                    <img src={bookPic} alt="logo" />
                    <ul className="login-links">
                        <li className="nav-link" onClick={() => { navigateTo("/") }}>HOME</li>
                        <li className="nav-link" onClick={() => { navigateTo("/register") }}>REGISTER</li>
                    </ul>
                    
                </nav>
                <div className="main-content" style={mainContent}>
                    <h2 style={h2}>Welcome to Book Says<br />Sign in to your account</h2>
                    {/* <% if(error_message){ %>
                        <p><%= error_message %></p>
                    <% } %> */}
                    {incorrect == "" ? "": incorrect}
                    <form onSubmit={ formSubmit } method="post" className="login-form">
                        <input type="text" onChange={handleChange} name="username" placeholder="Your Username" value={content.username} />
                        <input type="password" onChange={handleChange} name="password" placeholder="Your Password" value={content.password}/>
                        <input type="submit" />

                    </form>
                </div>
            </div>
            <div className="login-img" style={loginImg}>
                <img src={loginPicture} alt="login_pic" className="login-pic" style={loginPic} />
            </div>
        </div>
        </>
    )
}

export default Login;