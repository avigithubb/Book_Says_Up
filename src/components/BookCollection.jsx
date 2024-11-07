import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReadBook from "./ReadBook";

function BookCollection(){
    const [userResponse, setUserResponse] = useState([]);
    const [userBookResp, setBookResp] = useState({});
    const navigateTo = useNavigate();
    const [isLogOut, setLogOut] = useState(false);
    const location = useLocation();



    const myqueryParams = new URLSearchParams(location.search);
    const userName = myqueryParams.get('username');
    
    const auth = myqueryParams.get("authenticated");
    

    // console.log(auth);

    function handleLogOut(){
        setLogOut(true);
    }
    
    useEffect(() => {

        if(isLogOut){
            const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            // body: JSON.stringify({ title: 'React Hooks POST Request Example' })
            };

            fetch(`https://book-says-back.onrender.com/logout`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setLogOut(false);
                if(data.msg == "success"){
                    navigateTo("/");
                }
                
            
            })
        }
        
    }, [isLogOut])

    useEffect(() => {
    
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            // body: JSON.stringify({ title: 'React Hooks POST Request Example' })
        };
        

        const queryParams = new URLSearchParams({
            username: userName,
            
        });

        fetch(`https://book-says-back.onrender.com/get-user?${queryParams}`, requestOptions)
        .then(response => response.json())
        .then(data => {
            
            setBookResp(data);
         
        })
        
    }, [])

    useEffect(() =>{
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            // body: JSON.stringify({ title: 'React Hooks POST Request Example' })
        };

        const queryParams = new URLSearchParams({
            username: userName,
            
        });

        fetch(`https://book-says-back.onrender.com/get-user-books?${queryParams}`, requestOptions)
        .then(response => response.json())
        .then(data => {
            setUserResponse(data);
         
        })
    }, [])


    // console.log(userResponse);

    if(!userResponse){
        <div>Loading...</div>
    }

    return (
        <main id="collection-main">
            {/* <% if(isAuthenticated){ %>
                <a href="/logout">Logout</a>
            <% }else{ %>
                <a href="/">Go Back</a>
            <% } %>
            <h1><%= name %></h1> */}
            {auth == "true" ? <button onClick={handleLogOut}>Log Out</button> : <button onClick={() => {navigateTo(-1)}}>Go Back</button> }
            <h3 className="alies">Books I've Read</h3>
            <p>Tiny summary but <strong>detailed notes for each</strong>. Use the ISBN number to find it from your local library or anywhere else. <strong>This page will constantly update as I read more</strong>, so bookmark it if you want to check back in a few months.</p>
            <hr style={{marginTop: "20px", marginBottom: "20px"}} />

            <div className="Readed_book" style={{display: "flex", flexDirection: "column"}}>
                    
                    {
                    userResponse.msg == "failure" ?
                        <p style={{fontSize: "30px", margin: "auto"}}>No Books Read Yet.</p> 
                        :
                        userResponse.map(book => (
                            <ReadBook key={book.isbn} bookName={book.book_name} author={book.author_name} date={book.date} rating={book.rating} book_id={book.books_id} description={book.description} authenticated = {auth} cover={book.cover} isbn={book.isbn} username={book.username} userId={book.user_id} />
                        ))
                    }
                
            </div>
            {auth == "true" ? 
                <button onClick={() => {
                    const queryParams = new URLSearchParams({
                        toUpdate: false,
                        user_id: userBookResp[0].id,
                        user: userName,
                    }).toString();
                    navigateTo(`/create?${queryParams}`)}}>Create New</button>
            : ""}
        </main>

    )
}


export default BookCollection;