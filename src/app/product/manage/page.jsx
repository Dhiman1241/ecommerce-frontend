"use client"
import axios from 'axios'
import React, {useState, useEffect} from 'react'



const page = () => {

    const[categories, setCategories] = useState([]);

   const fetchCategory = () =>{
    const url = `${process.env.NEXT_PUBLIC_API_URL}/category?limit=all`;
       axios.get(url)
       .then(response =>
       {
        console.log(response);
       }
       )
   }

   useEffect(() =>{
       fetchCategory();
   },[])
 
    return (
        <>
            <div className="p-4 my-5 ">
                <form>
                    <div className="row">
                        <div className="mb-3 col-md-6">
                            <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                        </div>
                        <div className="mb-3 col-md-6">
                            <label htmlFor="exampleInputPassword1" className="form-label">Password</label >
                            <input type="password" className="form-control" id="exampleInputPassword1" />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        </>
    )
}

export default page