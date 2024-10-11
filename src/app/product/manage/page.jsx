"use client"
import axios from 'axios'
import Multiselect from 'multiselect-react-dropdown';
import React, { useState, useEffect } from 'react'



const page = () => {

    const [categories, setCategories] = useState([]);



    const [category, setCategory] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("")
    const [quantity, setQuantity] = useState(0)
    const [price, setPrice] = useState(0)
    const [featureImage, setFeatureImage] = useState("")
    const [images, setImages] = useState("")
    const [variation, setVariation] = useState([
        {size: '', color: '', quantity: 0, additionalPrice: 0  }
    ])


    const fetchCategory = () => {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/category?limit=all`;
        axios.get(url)
            .then((response) => {
                if (response?.status == 200) {
                    setCategories(response.data.data)
                }
            })
            .catch(error => console.log("error while fetching category", error))
    }

    useEffect(() => {
        fetchCategory();
    }, [])

    const onSelect = (e) => {
        setCategory(e)

    }

    const onRemove = (e) => {
        setCategory(e)

    }

    return (
        <>
            <div className="p-4 my-5 ">
                <form>
                    <div className="row">
                        <div className="mb-3 col-md-6">
                            <label htmlFor="exampleInputEmail1" className="form-label">Name</label>
                            <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" value={name} onInput={(e) => {setName(e.target.value)}}/>
                           
                        </div>
                        <div className="mb-3 col-md-6">
                            <label htmlFor="exampleInputPassword1" className="form-label">Category</label >

                            <Multiselect
                                options={categories} // Options to display in the dropdown
                                selectedValues={category} // Preselected value to persist in dropdown
                                onSelect={onSelect} // Function will trigger on select event
                                onRemove={onRemove} // Function will trigger on remove event
                                displayValue="name" // Property name to display in the dropdown options
                            />
                        </div>
                        <div className="mb-3 col-md-12">
                            <label htmlFor="exampleInputPassword1" className="form-label">Description</label >
                            <textarea value={description} className="form-control" id="exampleInputPassword1" onInput={(e) => {setDescription(e.target.value)} }> </textarea>
                        </div>

                        <div className="col-md-6 mb-3">
                            <input type="file" className="form-control" />
                            <img src={featureImage} alt="" />
                        </div>

                        <div className="mb-3 col-md-6">
                            <label htmlFor="exampleInputPassword1" className="form-label">Quantity</label >
                            <input type="number" className="form-control" id="exampleInputPassword1" value={quantity} onInput={(e) =>{ setQuantity(e.target.value)}}/>
                        </div>

                        <div className="mb-3 col-md-6">
                            <label htmlFor="exampleInputPassword1" className="form-label">Price</label >
                            <input type="number" className="form-control" id="exampleInputPassword1" value={price} onInput={(e) =>{ setPrice(e.target.value)}}/>
                        </div>

                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        </>
    )
}

export default page