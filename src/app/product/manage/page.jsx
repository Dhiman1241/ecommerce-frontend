"use client"
import Api from '@/app/Api';
import axios from 'axios'
import Multiselect from 'multiselect-react-dropdown';
import React, { useState, useEffect, useRef } from 'react'



const page = () => {

    const [categories, setCategories] = useState([]);
    const featureImageRef = useRef(null)
    const productImagesRef = useRef(null);


    const [category, setCategory] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("")
    const [quantity, setQuantity] = useState(0)
    const [price, setPrice] = useState(0)
    const [featureImage, setFeatureImage] = useState("")
    const [images, setImages] = useState([])
    const [variation, setVariation] = useState([
        { size: '', color: '', quantity: 0, additionalPrice: 0 }
    ])


    const featureUploadImage = async (e) => {
        console.log("event", e.target.files);


        let image = e.target.files[0];

        if (!image.type.startsWith('image/')) {
            alert('Please upload a valid image file!');
            return;
        }

        try {

            let response = await Api.uploadImage(image);
            if (response.status == 200) {
                setFeatureImage(response.url);

                console.log('upload res ', response)
            }


        } catch (error) {
            console.log('error', error)
        }
    }

    const ProductImageUpload = async (e) => {
        console.log("event", e.target.files);

        let images = e.target.files;
        let tempImages = [];

        console.log("images", images);



        try {
            for (var i = 0; i < images.length; i++) {
                var element = images[i];


                let response = await Api.uploadImage(element);
                if (response.status == 200) {
                    tempImages.push(response.url)
                    console.log('upload res ', response)
                }


            }
        }
        catch (error) {
            console.log('error', error)
        }

        finally {
            console.log('tempImages', tempImages)
            setImages(tempImages);
        }

    }

    const deleteImage = async (url, isMultiple = undefined) => {

        if (window.confirm("Are you sure you want to delete this image")) {
            try {
                let response = await Api.deleteImage(url);
                if (response.status == 200) {
                    if (isMultiple) {
                        let tempImage = images.filter((el) => el !== url);
                        if (tempImage.length == 0) {
                            if (productImagesRef?.current) {
                                productImagesRef.current.value = null;
                            }
                        }
                        setImages(tempImage);
                    }
                    else {
                        setFeatureImage("");
                        if (featureImageRef?.current) {
                            featureImageRef.current.value = null
                        }
                    }

                    console.log('delete res ', response)
                }


            } catch (error) {
                console.log('error', error)
            }
        }


    }


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
                            <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" value={name} onInput={(e) => { setName(e.target.value) }} />

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
                            <textarea value={description} className="form-control" id="exampleInputPassword1" onInput={(e) => { setDescription(e.target.value) }}> </textarea>
                        </div>

                        <div className="mb-3 col-md-6">
                            <label htmlFor="exampleInputPassword1" className="form-label">Quantity</label >
                            <input type="number" className="form-control" id="exampleInputPassword1" value={quantity} onInput={(e) => { setQuantity(e.target.value) }} />
                        </div>

                        <div className="mb-3 col-md-6">
                            <label htmlFor="exampleInputPassword1" className="form-label">Price</label >
                            <input type="number" className="form-control" id="exampleInputPassword1" value={price} onInput={(e) => { setPrice(e.target.value) }} />
                        </div>

                        <div className="col-md-6 mb-3" >
                            <label htmlFor="featureImage">Feature Image</label>
                            <input type="file" className="form-control" ref={featureImageRef} accept="image/*" onChange={featureUploadImage} />
                            {featureImage && <div className="position-relative my-3" >
                                <button type="button" className="btn btn-danger rounded-circle position-absolute p-0 d-flex align-items-center justify-content-center"
                                    style={{ right: "-10px", top: "-10px", height: '30px', width: '30px' }} onClick={() => deleteImage(featureImage)}>
                                    <i className='fa fa-trash  '
                                    ></i>
                                </button>
                                <img src={featureImage} alt="" className='w-100 ' />
                            </div>}


                        </div>

                        <div className="col-md-6 mb-3" >
                            <label htmlFor="">Product Images</label>
                            <input type="file" multiple ref={productImagesRef} className="form-control" accept="image/*" onChange={ProductImageUpload} />

                            <div className="row my-2" >
                                {images.map((image, i) => {
                                    return (
                                        <div className="col-md-4 my-1 position-relative" key={i}>
                                            <button type="button" className="btn btn-danger rounded-circle position-absolute p-0 d-flex align-items-center justify-content-center"
                                                style={{ right: "-10px", top: "-10px", height: '30px', width: '30px' }} onClick={() => deleteImage(image, true)}>
                                                <i className='fa fa-trash  '
                                                ></i>
                                            </button>
                                            <img src={image} alt="" className="w-100" style={{ height: "150px", objectFit: "cover" }} />
                                        </div>

                                    )
                                })}
                            </div>

                        </div>

                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        </>
    )
}

export default page