import React from "react";
import { useParams } from "react-router-dom";

function User(){
    const {id} = useParams()
    return(
        <div className="p-4 text-4xl bg-green-700 text-center">User: {id}</div>
    )
}

export default User