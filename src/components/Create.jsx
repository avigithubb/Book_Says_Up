import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ClassicEditor, Context, Bold, Essentials, Italic, Paragraph, ContextWatchdog, Image, CKFinderUploadAdapter, ImageUpload, CKFinder, ImageInsertUI, SimpleUploadAdapter, Link, BlockQuote, List, Heading } from 'ckeditor5';
import { CKEditor, CKEditorContext } from '@ckeditor/ckeditor5-react';
import 'ckeditor5/ckeditor5.css';


function Create(){

    const location = useLocation();
    const navigateTo = useNavigate();
    const [book, setBook] = useState({});
    const [isSearch, setSearch] = useState(false);
    const [mySearch, setMySearch] = useState({ docs: [] })
    const [isSubmit, setSubmit] = useState(false);
    const [isUpdate, setUpdate] = useState(false);
    const [load, setLoad] = useState("");
    const [searched, setSearched] = useState({
        search : ""
    });
    

    const myqueryParams = new URLSearchParams(location.search);
    const toUpdate = myqueryParams.get("toUpdate");
    const id = myqueryParams.get("user_id");
    const myUser = myqueryParams.get("user");
    const book_id = myqueryParams.get("book_id");

    const [bookDetails, setBookDetails] = useState({
        book_name : "",
        author_name : "",
        isbn: "",
        description : "",
        my_notes: "",
        cover : "",
        date : "",
        rating : ""
    })


    function handleSearch(event){
        
        const {name, value} = event.target;
        setSearched((prevValue) => {
            return {
                ...prevValue,
                [name] : value
            }
        })
        
        event.preventDefault();
    }

    function handleSearchSubmit(event) {
        event.preventDefault();
        setSearch(true);
    }

    function handleBookClick(){
        window.scrollTo({
            top: 800,
            behavior: "smooth"
        });
    }

    function handleSubmit(event){
        const {name, value} = event.target;

        setBookDetails((prevValues) => {
            return {
                ...prevValues,
                [name] : value
            }
        })
        
    }

    function handlehtmlFormSubmit(event) {
        event.preventDefault();
        setSubmit(true);
    }

    function handleCkeditor(event, editor) {
        const data = editor.getData();
        setBookDetails(prevValue => {
            return {
                book_name : prevValue.book_name,
                author_name : prevValue.author_name,
                isbn: prevValue.isbn,
                description : data,
                my_notes: prevValue.my_notes,
                cover : prevValue.cover,
                date : prevValue.date,
                rating : prevValue.rating
            }
        })
    }

    function handleCkeditorNotes(event, editor) {
        const data = editor.getData();
        setBookDetails(prevValue => {
            return {
                book_name : prevValue.book_name,
                author_name : prevValue.author_name,
                isbn: prevValue.isbn,
                description : prevValue.description,
                my_notes: data,
                cover : prevValue.cover,
                date : prevValue.date,
                rating : prevValue.rating
            }
        })
    }



    function handleUpdateSubmit(event) {
        event.preventDefault();
        setUpdate(true);
    }

    useEffect(() => {
        if(isSearch){
            // const requestOptions = {
            //     method: 'GET',
            //     headers: { 'Content-Type': 'application/json' },
            // };
    
            // const queryParams = new URLSearchParams({
            //     book_isbn: bookIsbn
                
            // });
            setLoad("Loading...");
            const searchhtmlFor = searched.search;
            const replaced = searchhtmlFor.replace(" ", "+");
            const lower_name = replaced.toLocaleLowerCase();
    
            fetch(`https://openlibrary.org/search.json?title=${lower_name}`)
            .then(response => response.json())
            .then(data => {
                
                setMySearch(data);
                setSearch(false);
                setSearched(() => (
                    {
                        search: ""
                    }
                ))

                setLoad("");

                
            })
        }
    }, [isSearch])
    // if(searched){
    //     console.log(mySearch.docs[0].title);
    // }

    // console.log(mySearch);



    useEffect(() => {
        if(isSubmit){
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            };
            
           
            
            const queryParams = new URLSearchParams({
                user_id: id,
                book_name: bookDetails.book_name,
                author_name: bookDetails.author_name[0],
                isbn: bookDetails.isbn,
                description: bookDetails.description,
                my_notes: bookDetails.my_notes,
                cover: bookDetails.cover,
                date: bookDetails.date,
                rating: bookDetails.rating
                
            });
    
            fetch(`https://book-says-back.onrender.com/create?${queryParams}`, requestOptions)
            .then(response => response.json())
            .then(data => {

                setBookDetails(() => ({
                    book_name : "",
                    author_name : "",
                    isbn: "",
                    description : "",
                    my_notes: "",
                    cover : "",
                    date : "",
                    rating : ""
                }))

                setSubmit(false);
                if(data.msg == "success"){
                    console.log("data recieved");
                    const queryParams = new URLSearchParams({
                        username: myUser,
                        authenticated: true
                    })
                    navigateTo(`/collection?${queryParams}`)
                }
              
                
            })
        }

    }, [isSubmit])

    useEffect(() => {
        if(isUpdate){
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            };

    
            const queryParams = new URLSearchParams({
                id: book_id,
                book_name: bookDetails.book_name,
                author_name: bookDetails.author_name,
                isbn: bookDetails.isbn,
                description: bookDetails.description,
                my_notes: bookDetails.my_notes,
                cover: bookDetails.cover,
                date: bookDetails.date,
                rating: bookDetails.rating
                
            });
    
            fetch(`https://book-says-back.onrender.com/update_book?${queryParams}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                                
                setBook({});

                setUpdate(false);
                if(data.msg == "success"){
                    const queryParams = new URLSearchParams({
                        username: myUser,
                        authenticated: true
                    })
                    navigateTo(`/collection?${queryParams}`)
                }
          
                
            })
        }
    }, [isUpdate])



    useEffect(() =>{
        if (toUpdate){
            const bookIsbn = myqueryParams.get("isbn");
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
                
                setBookDetails({
                    book_name : data.book_name,
                    author_name : data.author_name,
                    isbn: data.isbn,
                    description : data.description,
                    my_notes: data.notes,
                    cover : data.cover,
                    date : data.date,
                    rating : data.rating
                });
                
            })
        }
    }, [toUpdate])

    if(!book){
        <div>Loading...</div>
    }

    return (
        <>
        <div className="all-content">
            <button onClick={() => {
                const queryParams = new URLSearchParams({
                    username: myUser,
                    authenticated: true
                    
                }).toString();
                navigateTo(`/collection?${queryParams}`) }} >Go Back</button>
            <h2 className="ive_read">I've Read</h2>
            <hr />
            <form onSubmit={handleSearchSubmit} method="post" id="search">
                <label htmlFor="search"><b>Search the book By ISBN or Name:</b></label>
                <input type="search" onChange={handleSearch} name="search" value={searched.search} />
                <input type="submit" value="Search" />
            </form>

            
            {mySearch.docs.length > 0 ? <>
                <div className="related-books">
                    <ul style={{display: "flex", flexDirection: "column", width: "100%", height: "30vh", overflow: "auto", marginTop: "20px", marginBottom: "20px", padding: "20px", border: "1px solid black", borderRadius: "20px"}}>
                        {mySearch.docs.map((book, index) => (
                            <div key={index} onClick={handleBookClick} style={{display: "flex", width: "100%"}}>
                                <li style={{display: "flex", width: "100%"}}>
                                    <div onClick={() => {setBookDetails({
                                        book_name : book.title,
                                        author_name : book.author_name,
                                        isbn: book.isbn && book.isbn.length > 0 ? book.isbn[0] : 'N/A',
                                        description : "",
                                        my_notes: "",
                                        cover : book.cover_i,
                                        date : "",
                                        rating : ""
                                    })}} style={{display: "flex", width: "100%"}}>
                                        <img src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`} alt="book-cover" style={{ width: "100px"}} />
                                        <span style={{display: "flex", flexDirection: "column", width: "100%", marginTop: "50px", marginLeft: "10px", textAlign: "center"}}>
                                            <span>{book.title }</span>
                                            <span>ISBN-{ book.isbn && book.isbn.length > 0 ? book.isbn[0] : 'N/A' }</span>
                                        </span>
                                    </div>
                                </li>
                            </div>
                        ))}
                        
                    </ul>
                </div>
            </> : load
            }
                
            

            { toUpdate == "true" ? 
                (
                    <form onSubmit={handleUpdateSubmit} id="add_book" method="post">

                        <label htmlFor="book_name">Book Name</label>
                        <input type="text" onChange={handleSubmit} value={ bookDetails.book_name || "" } name="book_name" id="book_name" required />
                        <label htmlFor="name">Author Name:</label>
                        <input type="text" onChange={handleSubmit} name="author_name" value={bookDetails.author_name || ""} style={{border: "none", borderBottom: "1px solid black"}} required />
                        <label htmlFor="ISBN">ISBN No:</label>
                        <input type="text" onChange={handleSubmit} id="isbn" name="isbn" value={bookDetails.isbn || ""} style={{border: "none", borderBottom: "1px solid black"}} required />
                        <label htmlFor="description">Book Description:</label>
                        {/* <textarea name="description" onChange={handleSubmit} id="description" cols="30" rows="10" style={{padding: "20px", borderStartEndRadius: "20px"}} value={bookDetails.description || ""}  required></textarea> */}
                        <CKEditorContext
                            context={ Context }
                            contextWatchdog={ ContextWatchdog }
                            onChangeInitializedEditors={ ( editors ) => {
                                console.info( editors.editor1?.instance, editors.editor1?.yourAdditionalData );
                            } }
                        >
                        
                        
                            <CKEditor
                                editor={ ClassicEditor }
                                config={ {
                                plugins: [ Essentials, Bold, Italic, Paragraph, BlockQuote, Link, Image, ImageInsertUI, CKFinderUploadAdapter, CKFinder, ImageUpload, SimpleUploadAdapter, List, Heading ],
                                toolbar: [ 'undo', 'redo', '|', 'bold', 'italic', '|', 'numberedList', 'bulletedList', 
                                '|', 'link', 
                                '|', 'uploadImage'],
                                placeholder:"Tell me about your book",
                                } }
                                data={bookDetails.description || ""}
                                contextItemMetadata={{
                                    name: 'editor1',
                                    yourAdditionalData: 2
                                }}
                                onReady={ ( editor ) => {
                                // You can store the "editor" and use when it is needed.
                                console.log( 'Editor 1 is ready to use!', editor );
                                } }
                                onChange={handleCkeditor}
                                
                            />

                            </CKEditorContext>
                        <label htmlFor="notes">Your Notes:</label>
                        {/* <textarea name="my_notes" onChange={handleSubmit} id="my_notes" className="my_notes" cols="30" rows="10" style={{padding: "20px"}} value={bookDetails.my_notes || ""}></textarea> */}
                        <CKEditorContext
                            context={ Context }
                            contextWatchdog={ ContextWatchdog }
                            onChangeInitializedEditors={ ( editors ) => {
                                console.info( editors.editor1?.instance, editors.editor1?.yourAdditionalData );
                            } }
                        >
                        
                        
                            <CKEditor
                                editor={ ClassicEditor }
                                config={ {
                                plugins: [ Essentials, Bold, Italic, Paragraph, BlockQuote, Link, Image, ImageInsertUI, CKFinderUploadAdapter, ImageUpload, CKFinder, SimpleUploadAdapter, List, Heading  ],
                                toolbar: [ 'undo', 'redo', '|', 'bold', 'italic', '|', 'numberedList', 'bulletedList', 
                                '|', 'link', 
                                '|', 'uploadImage' ],
                                placeholder:"What do you think about this book",
                                } }
                                data={bookDetails.my_notes || ""}
                                contextItemMetadata={{
                                    name: 'editor1',
                                    yourAdditionalData: 2
                                }}
                                onReady={ ( editor ) => {
                                // You can store the "editor" and use when it is needed.
                                console.log( 'Editor 1 is ready to use!', editor );
                                } }
                                onChange={handleCkeditorNotes}
                                
                            />

                            </CKEditorContext>
                        <label htmlFor="cover">Cover Image:</label>
                        <input type="number" onChange={handleSubmit} name="cover" id="cover" value={ bookDetails.cover || ""} />
                        <label htmlFor="date">Date:</label>
                        <input type="date" onChange={handleSubmit} name="date" value={ bookDetails.date ? new Date(bookDetails.date).toISOString().slice(0, 10) : '' } className="date" required />
                        <label htmlFor="rating">How much you recommend the book:</label>
                        <input type="number" onChange={handleSubmit} name="rating" value={ bookDetails.rating || "" } min="1" max="10" />
                        <input type="submit" value="Update" />
                        
                    </form>
                )
                
            :
            
                (
                    <form onSubmit={handlehtmlFormSubmit} id="add_book">
                        <label htmlFor="book_name">Book Name</label> 
                        <input type="text" onChange={handleSubmit} placeholder="Book Name" name="book_name" id="book_name" value={bookDetails.book_name || ""} />
                        <label htmlFor="name">Author Name:</label>
                        <input type="text" onChange={handleSubmit} name="author_name" placeholder="Author Name" style={{border: "none", borderBottom: "1px solid black"}} value={bookDetails.author_name || ""} required />
                        <label htmlFor="ISBN">ISBN No:</label>
                        <input type="text" onChange={handleSubmit} id="isbn" name="isbn" placeholder="ISBN" style={{border: "none", borderBottom: "1px solid black"}} value={bookDetails.isbn || ""} required />
                        <label htmlFor="description">Book Description:</label>
                        {/* <textarea name="description" onChange={handleSubmit} id="description" cols="30" rows="10" value={bookDetails.description || ""} style={{padding: "20px", borderStartEndRadius: "20px"}} placeholder="Tell me about your book" required></textarea> */}
                        <div className="custom-editor">
                        <CKEditorContext
                            context={ Context }
                            contextWatchdog={ ContextWatchdog }
                            onChangeInitializedEditors={ ( editors ) => {
                                console.info( editors.editor1?.instance, editors.editor1?.yourAdditionalData );
                            } }
                        >
                        
                        
                            <CKEditor
                                editor={ ClassicEditor }
                                config={ {
                                plugins: [ Essentials, Bold, Italic, Paragraph, BlockQuote, Link, Image, ImageInsertUI, CKFinderUploadAdapter, ImageUpload, CKFinder, SimpleUploadAdapter, List, Heading  ],
                                toolbar: [ 'undo', 'redo', '|', 'bold', 'italic', '|', 'numberedList', 'bulletedList', 
                                '|', 'link', 
                                '|', 'uploadImage' ],
                                placeholder:"Tell me about your book",
                                } }
                                data={bookDetails.description || ""}
                                contextItemMetadata={{
                                    name: 'editor1',
                                    yourAdditionalData: 2
                                }}
                                onReady={ ( editor ) => {
                                // You can store the "editor" and use when it is needed.
                                console.log( 'Editor 1 is ready to use!', editor );
                                } }
                                onChange={handleCkeditor}
                                
                            />

                            </CKEditorContext>
                        </div>
                    
                        <label htmlFor="notes">Your Notes:</label>
                        {/* <textarea name="my_notes" onChange={handleSubmit} id="my_notes" className="my_notes" cols="30" rows="10" value={bookDetails.my_notes || ""} placeholder="What do you think about this book" style={{padding: "20px"}}></textarea> */}
                        <div className="custom-editor">
                        <CKEditorContext
                            context={ Context }
                            contextWatchdog={ ContextWatchdog }
                            onChangeInitializedEditors={ ( editors ) => {
                                console.info( editors.editor1?.instance, editors.editor1?.yourAdditionalData );
                            } }
                        >
                        
                        
                            <CKEditor
                                editor={ ClassicEditor }
                                config={ {
                                plugins: [ Essentials, Bold, Italic, Paragraph, BlockQuote, Link, Image, ImageInsertUI, ImageUpload, CKFinderUploadAdapter, CKFinder, SimpleUploadAdapter, List, Heading ],
                                toolbar: [ 'undo', 'redo', '|', 'bold', 'italic', '|', 'numberedList', 'bulletedList',
                                 '|', 'link',
                                 '|', 'uploadImage'], 
                                placeholder:"What do you think about this book",
                                } }
                                data={bookDetails.my_notes || ""}
                                contextItemMetadata={{
                                    name: 'editor1',
                                    yourAdditionalData: 2
                                }}
                                onReady={ ( editor ) => {
                                // You can store the "editor" and use when it is needed.
                                console.log( 'Editor 1 is ready to use!', editor );
                                } }
                                onChange={handleCkeditorNotes}
                                
                            />

                            </CKEditorContext>
                        </div>
                        <label htmlFor="cover">Cover Image:</label>
                        <input type="number" onChange={handleSubmit} name="cover" id="cover" placeholder="cover_id" value={bookDetails.cover || ""} />
                        <label htmlFor="date">Date:</label>
                        <input type="date" onChange={handleSubmit} name="date" required value={bookDetails.date || ""} />
                        <label htmlFor="rating">How much you recommend the book:</label>
                        <input type="number" onChange={handleSubmit} name="rating" value={bookDetails.rating || ""} min="1" max="10" />
                        <input type="submit" value="Collect" />
                        
                    </form>
                )
            
            }

        </div>
    </>
    )
}


export default Create;