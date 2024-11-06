import React from "react";
import { useNavigate } from "react-router-dom";

function AllUsers(props){
    const navigateTo = useNavigate();

    const queryParams = new URLSearchParams({
        username: props.username,
        authenticated: false
        
    }).toString();
    return (
        <>
            <div className="container">
                <div className="card">
                    <h2>{props.name}</h2>
                    <p className="book-collection">Collection Name: {props.collection}</p>
                    <p>{props.about}</p>
                    <p className="read-it" style={{ fontWeight: "800", color: "blue"}} onClick={() => { navigateTo(`/collection?${queryParams}`)}}>Books I've Read</p>
                </div>
            </div>
        </>
    )
}

export default AllUsers;