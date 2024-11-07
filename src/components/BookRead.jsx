import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";


function BookRead(){
    const [resp, setResp] = useState();
    const navigateTo = useNavigate();
    const location = useLocation();
    const [deleteMe, setDeleteMe] = useState(false);
    const [userResponse, setUserResponse] = useState({});
    const [isLogOut, setLogOut] = useState(false);

    
    const myqueryParams = new URLSearchParams(location.search);
    const bookIsbn = myqueryParams.get('book_isbn');
    const username = myqueryParams.get("myUser");
    const authenticated = myqueryParams.get("auth");

    function handleLogOut(){
        setLogOut(true);
    }

    useEffect(()=>{
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

    function handleDelete(){
        setDeleteMe(true);
    }

    useEffect(()=>{
        if(deleteMe) {
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                // body: JSON.stringify({ title: 'React Hooks POST Request Example' })
            };


            const queryParams = new URLSearchParams({
                book_name: resp.book_name,
                user_id: resp.user_id
                
            });
    
            fetch(`https://book-says-back.onrender.com/delete?${queryParams}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                
                setUserResponse(data);
                setDeleteMe(false);
                if (data.msg == "success") {
                    const queryParams = new URLSearchParams({
                        username: username,
                        authenticated: true
                    }).toString();
                    navigateTo(`/collection?${queryParams}`);
                } 
                else{
                    const queryParams = new URLSearchParams({
                        username: resp.username,
                        authenticated: true
                    }).toString();
                    navigateTo(`/collection?${queryParams}`);
                }
                
            })

        }
    }, [deleteMe])

    if (!userResponse) {
        return <div>Loading ...</div>;
    }

    
    
    useEffect(() => {
    
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        };

        const queryParams = new URLSearchParams({
            book_isbn: bookIsbn
            
        });

        fetch(`https://book-says-back.onrender.com/get_book?${queryParams}`, requestOptions)
        .then(response => response.json())
        .then(data => {
            console.log(data);;
            setResp(data);
            
        })
        
    }, [bookIsbn])

    if (!resp) {
        return <div>Loading...</div>;  // Show a loading message while data is being fetched
    }


    return (
        <main id="book-read-main">
            <button onClick={() => {
                navigateTo(-1);
            }}>Go Back</button>
            { authenticated == "true" ?
                <button onClick={handleLogOut} style={{ float: "right"}}>Log Out</button>
                : 
                ""
            }

            <h2 className="author-name">{username}</h2>
            <div className="Readed_book">
                <div className="book-img">
                    {resp.cover && (
                        <img 
                            src={`https://covers.openlibrary.org/b/id/${resp.cover}-L.jpg`} 
                            alt="book_name" 
                            className="book-cover" 
                        />
                    )}
                </div>
                <div className="readed-book-details">
                    <h2 className="heading">BookName-{resp.book_name}</h2>
                    <p className="sub-details">ISBN: {resp.isbn}</p>
                    <p className="sub-details">Date Read:  { new Date(resp.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }</p>
                    <p className="sub-details">My Personal Rating: {resp.rating}/10</p>
                    
                </div>
            </div>
            <div dangerouslySetInnerHTML={{ __html: resp.description }} className="description">
            </div>
            <hr />
            <h3 style={{marginTop: "100px", marginBottom: "50px"}}>My Notes</h3>
            <div dangerouslySetInnerHTML={{ __html: resp.notes || "No notes for this book" }} className="notes">
                </div>
            {/* <p>{resp.notes == "" ? "No notes for this book" : resp.notes}</p> */}
            {authenticated == "true" ? <div style={{marginTop: "3rem", marginBottom: "3rem", textAlign: "center"}}>
                <button onClick={() => {
                    const queryParams = new URLSearchParams({
                        isbn : bookIsbn,
                        toUpdate: true,
                        user_id: resp.user_id,
                        user: username,
                        book_id: resp.books_id
                    }).toString();
                    navigateTo(`/create?${queryParams}`);
                }}>Update</button>
                <button style={{ marginLeft: "1rem"}} onClick={handleDelete}>Delete</button>                
                </div>
                :
                ""
            }
        </main>
    )
}

export default BookRead;