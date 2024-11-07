import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ReadBook(props){
    
    const navigateTo = useNavigate();
    const [deleteMe, setDeleteMe] = useState(false);
    const [userResponse, setUserResponse] = useState({});

    function handleDelete(){
        setDeleteMe(true);
    }

    

    useEffect(()=>{
        if(deleteMe) {
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            };

            const queryParams = new URLSearchParams({
                book_name: props.bookName,
                user_id: props.userId
                
            });
    
            fetch(`https://book-says-back.onrender.com/delete?${queryParams}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                
                setUserResponse(data);
                setDeleteMe(false);
                if (data.msg === "success") {
                    
                    window.location.reload();
    
                }
                
                
                
            }).catch(error => {
                console.error("Error deleting book:", error);
                setDeleteMe(false); 
            });

        }
    }, [deleteMe])

    if (!userResponse) {
        return <div>Loading ...</div>;
    }     

    return (
        <>
        <div style={{display: "flex", marginTop: "50px"}}>
            <div className="book-img">
                <img src={`https://covers.openlibrary.org/b/id/${props.cover}-L.jpg`} alt="book_name" className="book" />
            </div>
            <div className="readed-book-details">     
                <h2 className="heading">{ props.bookName }-{ props.author }</h2>
                <p className="sub-heading">Date Read:  { new Date(props.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }.<br /> My personal rating: { props.rating }/10</p>
                <div dangerouslySetInnerHTML={{ __html: props.description }} className="editor">
                </div>
                <p style={{fontWeight: '800', color: "blue"}} className="ReadMyNotes" onClick={() => {
                    const queryParams = new URLSearchParams({
                        book_isbn: props.isbn,
                        myUser: props.username,
                        auth: props.authenticated
                        
                    }).toString();
                    navigateTo(`/read?${queryParams}`)} }>Read My Notes</p>
                {props.authenticated == "true" ? <div style={{display: "flex"}}>
                    <button style={{width: "10rem"}} onClick={handleDelete}>Delete</button>
                    <button style={{width: "10rem", marginLeft: "1rem"}} onClick={() => {
                        const queryParams = new URLSearchParams({
                            isbn : props.isbn,
                            toUpdate: true,
                            user_id: props.userId,
                            user: props.username,
                            book_id: props.book_id
                        }).toString();
                        navigateTo(`/create?${queryParams}`);
                    }}>Update Book</button>
                    </div>
                : ""}
                
            </div>
        </div>
        </>
    )
}

export default ReadBook;