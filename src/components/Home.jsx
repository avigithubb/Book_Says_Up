import React, { useState, useEffect} from "react";
import { useNavigate} from "react-router-dom";
import AllUsers from "./AllUsers";

function Home(){

    const navigateTo = useNavigate();
    const [users, setUsers] = useState([]);
    const [searched, setSearch] = useState(false)
    const [searchUser, setSearchUser] = useState({
        search_me: ""
    });
    const [navActive, setNavActive] = useState(false);
    


    function toggleNavbar() {
        
        setNavActive(!navActive);
        console.log(navActive);
    };


    useEffect(() => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            // body: JSON.stringify({ title: 'React Hooks POST Request Example' })
        };

        fetch(`https://book-says-back.onrender.com/`, requestOptions)
        .then(response => response.json())
        .then(data => setUsers(data))
    }, []);

    function handleSearch(event) {
        event.preventDefault();
        setSearch(true)
    }

    
   

    

    function handleChange(event) {
        const {name, value} = event.target;
        setSearchUser(prevValue => {
            return {
                ...prevValue,
                [name] : value
            }
        
        })
    }

    useEffect(() => {
        if(searched){
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                // body: JSON.stringify({ title: 'React Hooks POST Request Example' })
            };

            console.log(searchUser.search_me);

            const queryParams = new URLSearchParams({
                user: searchUser.search_me
                
            }).toString();

            fetch(`https://book-says-back.onrender.com/search_user?${queryParams}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if(data.msg == "failure"){
                    setUsers(data.msg);
                }
                else{
                    setUsers(data)
                }
                setSearchUser({
                    search_me: ""
                })
                setSearch(false)
            })
        }}, [searched])


    // function renderUser(user){
    //     <AllUsers name={user.name} collection={user.collection} about={user.about} />
    // }

    // console.log(users);

    var homeNav = {
        display: "unset",
        position: "unset",
        padding: "10px",
        // top: "0",
        // width: "46vw" 
    }

    var homeForm = {
        // marginTop: "100px",
        alignItems: "center",
        textAlign: "center",
        float: "right",
        paddingTop: "0px",
        display: 'inline-flex',
    }

    return (
        <>
            <h1>Book Says</h1>
            <hr />
            <nav style={homeNav}>
                <div className="navbar-container">
                    {/* <button className="toggle-button" id="toggle-btn" onClick={toggleNavbar}>{navActive? <ul><li className="dropdown" style={{listStyle: "none"}}>
                        <button class="dropdown-btn">&#9776; Menu</button>
                        <ul className="dropdown-menu" style={{ paddingTop: '10px', display: 'flex', flexDirection: 'row' }}>
                            <li onClick={() => { navigateTo("/") }}>Home</li>
                            <li onClick={() => { navigateTo("/login")}}>Login</li>
                            <li onClick={() => { navigateTo("/register")}}>Register</li>
                        </ul>
                    </li> </ul>: <p>&#9776; Menu</p>}</button> */}
                    <button
                        className="toggle-button"
                        id="toggle-btn"
                        onClick={toggleNavbar}
                        style={{
                            backgroundColor: 'blue',
                            color: 'white',
                            border: 'none',
                            padding: '10px',
                            cursor: 'pointer',
                            width: '100px', // Ensure full width
                            height: '50px', // Set height explicitly
                            borderRadius: "10rem"
                        }}
                        >
                        {navActive ? <>&times;</> : <>&#9776;</>}
                        </button>

                        {/* Dropdown Menu - only visible if `navActive` is true */}
                        {navActive && (
                        <ul className="dropdown-menu" style={{ paddingTop: '10px', display: 'flex', flexDirection: 'column', position: 'absolute', top: '60px', left: '10px', background: 'blue', width: '100px' }}>
                            <li onClick={() => { navigateTo("/") }} style={{ color: 'white', padding: '10px', cursor: 'pointer' }}>Home</li>
                            <li onClick={() => { navigateTo("/login")}} style={{ color: 'white', padding: '10px', cursor: 'pointer' }}>Login</li>
                            <li onClick={() => { navigateTo("/register")}} style={{ color: 'white', padding: '10px', cursor: 'pointer' }}>Register</li>
                        </ul>
                        )}
                    <form onSubmit={handleSearch} method="post" className="home-form" style={homeForm}>
                        <input type="search" onChange={handleChange} name="search_me" id="search_user" value={searchUser.search_me} style={{paddingTop: "1rem", border: "none", borderBottom: "1px solid rgba(56, 53, 53, 0.075)", textAlign: "center", marginLeft: "100px", background: "url('/images/search-icon.svg') no-repeat left center"
                        }} placeholder="Search User" />
                        <input style={{backgroundColor: "blue", width: "5rem", height: "2.5rem"}} type="submit" />
                    </form>
                    <ul className="nav-list" id="nav-list" style={{ paddingTop: '10px', display: 'flex', flexDirection: 'row' }}>
                        <li onClick={() => { navigateTo("/") }}>Home</li>
                        <li onClick={() => { navigateTo("/login")}}>Login</li>
                        <li onClick={() => { navigateTo("/register")}}>Register</li>
                    </ul>
                </div>
            </nav>
            <section id="carousel">
                <h2 className="my_read">My Readed Books Collection</h2>
                <p className="head-description">A Collection Of Your Random Book Readings</p>
            </section>

            {users == "failure" ? "No User Found" : users.map(user => (
                <AllUsers key={user.id} name={user.name} collection={user.collection} about={user.about} username={user.username} />
            ))}

            {/* <% if (users && users.length > 0){ %>
                <% users.forEach(user => { %>
                    <div className="container">
                        <div className="card">

                                <h2><%= user.name %></h2>
                                <p className="book-collection">Collection Name: <%= user.collection %></p>
                                <p><%= user.about %></p>
                                <p className="read-it"><a href="/collection/<%= user.id %>">Books I've Read</a></p>
                            
                        </div>
                    </div>
                <% }); %>
            <% }else{ %>
                <% if(no_users){ %>
                    <p>No user with this username</p>
                <% }else{ %>
                    <p style="font-size: 30px; margin: auto;">No Entries Yet.</p>
                <% } %>
            <% } %> */}
        </>
            
    )
}

export default Home;