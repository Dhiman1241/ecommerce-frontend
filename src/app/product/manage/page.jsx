"use client"
import Api from '@/app/Api';
import axios from 'axios'
import Multiselect from 'multiselect-react-dropdown';
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useState, useEffect, useRef } from 'react'
import Swal from 'sweetalert2';



const page = () => {

    const router = useRouter();

    const searchParams = useSearchParams()
    const [id, setId] = useState('')
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


    const fetchData = () => {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/category?limit=all`;
        axios.get(url).then((response) => {
            if (response?.status == 200) {
                setCategories(response.data.data)
                
                let tempCategory = response.data.data
                const id = searchParams.get('id');
               
                if(id) {
                    setId(id)
                    getproductById(id)
                    Api.getProductById(id).then((res) => {
                    if(res?.data){
                        console.log("data" , res.data);
                        if(res?.data?.name) {
                            setName(res.data.name);
                        }
                        if(res?.data?.description){
                            setDescription(res.data.description);
                        }
                        if(res?.data?.quantity){
                            setQuantity(res.data.quantity);
                        }
                        if(res?.data?.price){
                            setPrice(res.data.price);
                        }
                        if(res?.data?.category){
                            let categoriesData = tempCategory?.filter((el) => res.data.category.includes(el._id))
                            setCategory(categoriesData);
                        }
                        if(res?.data?.featureImage){
                            setFeatureImage(res.data.featureImage);
                        }
                        if(res?.data?.images){
                            setImages(res.data.images);
                        }
                        if(res?.data?.variation){
                            setVariation(res.data.variation);
                        }
                    }
                    }).catch((err) => {
                    console.log('an error occured while getting product ', err)
                    })
                }
            }
        })
        .catch(error => console.log("error while fetching category", error))
    }

    const getproductById = (id) => {
      
    }

    useEffect(() => {
        fetchData();
    }, [])

    const onSelect = (e) => {
        setCategory(e)

    }

    const onRemove = (e) => {
        setCategory(e)

    }
    useEffect(() => {
        console.log('variation ', variation)
    }, [variation])

    const changeVariations = (index, key, input) => {
        let cloned = [...variation];
        cloned[index][key] = input;
        setVariation(cloned);
    }


    const addVariation = () =>{
      let payload =  { size: '', color: '', quantity: 0, additionalPrice: 0 };
    //   setVariation((prev) => [...prev, payload]);
       let cloned = [...variation];
       cloned.push(payload);
        setVariation(cloned);
    }

    const [errors, setErrors] = useState({})
    const [isFormTouched,setIsFormTouched] = useState(false); 

    const isFormValid = () => {
        let checkError = {}
        if(name.trim() == ""){
            checkError["name"] = "Name is required";
        } 
        if(description.trim() == ""){
            checkError["description"] = "Description is required";
        } 
        if(quantity < 1 ){
            checkError["quantity"] = "Quantity is required";
        } 
        if(price < 1 ){
            checkError["price"] = "Price is required";
        } 
        if(featureImage == ""){
            checkError["featureImage"] = "FeatureImage is required";
        }
        if(images.length<1){
            checkError["images"] = "Images are required";
        }
        if(category.length<1){
            checkError["category"] = "Category are required";
        }
        setErrors(checkError)
        return Object.keys(checkError).length > 0 ? false : true
    }
    const submitProduct = (e) =>{
        e.preventDefault();
        setIsFormTouched(true)
       const isValid = isFormValid();
       console.log('isValid :- ', isValid);
       console.log("category",category);
       if(isValid) {
        let payload = {
            name : name,
            description: description,
            category: category.map(el => el._id),
            featureImage: featureImage,
            images : images,
            quantity: quantity,
            price: price,
            variation : variation
        }

        // console.log("payload" , payload);
       let api = id ? Api.updateProduct(payload, id) : Api.submitProduct(payload)

       api.then((response) => {
            if(id ? response.status == 200 : response.status == 201){
                console.log(response);
                if(!id) {
                    resetForm();
                } else {
                    router.push('/product');
                }
                Swal.fire({
                    title: "Success",
                    text: response?.data?.message || `Product ${id ? 'updated' : 'added'} Successfully`,
                    icon: "Success",
                    showCancelButton: false,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33"
                  })
            }
        }).catch((error) =>{
            console.log('error ', error);
            Swal.fire({
                title: "Error",
                text: error?.response?.data?.message || `An error occured while ${id ? 'updating' :'adding'} product`,
                icon: "warning",
                showCancelButton: false,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33"
              })
        })
       } else {
        console.log('not valid')
       }
       
    }

    const resetForm = () =>{
        setName(""),
        setDescription(""),
        setCategory([]),
        setFeatureImage(""),
        setImages([]),
        setQuantity(0);
        setPrice(0),
        setVariation([ { size: '', color: '', quantity: 0, additionalPrice: 0 }])
        if (productImagesRef?.current) {
            productImagesRef.current.value = null;
        }
        if (featureImageRef?.current) {
            featureImageRef.current.value = null
        }
    }


    
    return (
        <>
            <div className="p-4 my-5 ">
                <form onSubmit={(e) => submitProduct(e)}>
                    <div className="row">
                        <div className="mb-3 col-md-6">
                            <label htmlFor="exampleInputEmail1" className="form-label">Name</label>
                            <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" value={name} onInput={(e) => { setName(e.target.value) }} />
                           {(isFormTouched && name == '' && errors['name'])
                           &&  <div className="form-text text-danger">{errors['name']}</div>
                           }
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
                             {(isFormTouched && category.length < 1 && errors['category'])
                           &&  <div className="form-text text-danger">{errors['category']}</div>
                           }
                        </div>
                        <div className="mb-3 col-md-12">
                            <label htmlFor="exampleInputPassword1" className="form-label">Description</label >
                           <textarea value={description} className="form-control" id="exampleInputPassword1" onInput={(e) => { setDescription(e.target.value) }}> </textarea>
                           {(isFormTouched && description == '' && errors['description'])
                           &&  <div className="form-text text-danger">{errors['description']}</div>
                           }
                        </div>

                        <div className="mb-3 col-md-6">
                            <label htmlFor="exampleInputPassword1" className="form-label">Quantity</label >
                            <input type="number" className="form-control" id="exampleInputPassword1" value={quantity} onInput={(e) => { setQuantity(+e.target.value) }} />
                            {(isFormTouched && quantity < 1 && errors['quantity'])
                           &&  <div className="form-text text-danger">{errors['quantity']}</div>
                           }                  
                        </div>

                        <div className="mb-3 col-md-6">
                            <label htmlFor="exampleInputPassword1" className="form-label">Price</label >
                            <input type="number" className="form-control" id="exampleInputPassword1" value={price} onInput={(e) => { setPrice(+e.target.value) }} />
                            {(isFormTouched && price < 1 && errors['price'])
                           &&  <div className="form-text text-danger">{errors['price']}</div>
                           }                         
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

                            {(isFormTouched && featureImage == '' && errors['featureImage'])
                           &&  <div className="form-text text-danger">{errors['featureImage']}</div>
                           }    


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

                            {(isFormTouched && images.length < 1 && errors['images'])
                           &&  <div className="form-text text-danger">{errors['images']}</div>
                           }   

                        </div>

                        {variation.map((e, index) => {
                            return (
                                <>
                                    <div className="col-md-3 mb-3">
                                        <label htmlFor="">Size</label>
                                        <select value={e.size} className="form-select" onChange={(e) => changeVariations(index, 'size', e.target.value)}>
                                            <option value="">Select</option>
                                            <option value="xs">XS</option>
                                            <option value="s">S</option>
                                            <option value="m">M</option>
                                            <option value="l">L</option>
                                            <option value="xl">XL</option>
                                            <option value="xxl">XXL</option>
                                        </select>

                                    </div>
                                  
                                    <div className="col-md-3 mb-3">
                                        <label htmlFor="" >Quantity</label>
                                        <input type="number" className="form-control" value={e.quantity} onInput={(e) => changeVariations(index, 'quantity', +e.target.value)} />
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <label htmlFor="" >Additional Price</label>
                                        <input type="number" className="form-control" value={e.additionalPrice} onInput={(e) => changeVariations(index, 'additionalPrice', +e.target.value)} />
                                    </div>
                                    <div className="col-md-2 mb-3">
                                        <label htmlFor="" >Color</label>
                                        <input type="color" className="form-control form-control-color " value={e.color} onChange={(e) => changeVariations(index, 'color', e.target.value)} />

                                    </div>
                                    <div className="col-md-1 mb-3">
                                        {index >0  && <i className="fa fa-trash mt-4 text-danger cursor-pointer"></i>}
                                    </div>
                                </>)
                        })}

                        <div className="col-md-12 mb-3">
                            <button type="button" className='btn btn-outline-primary' onClick={() =>{addVariation()}}>Add Variation</button>
                        </div>

                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        </>
    )
}

export default page