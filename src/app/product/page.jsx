'use client'
import React, { useEffect, useState } from 'react'
import Api from '../Api'
import axios from 'axios'
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic.css';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation'

export default function page() {

  const router = useRouter();

  const uploadImage = async (e) => {
    
    console.log('event ', e.target.files)

    let image = e.target.files[0]
    try {

      let response = await Api.uploadImage(image);
      if (response.status == 200) {
        console.log('upload res ', res)
      }


    } catch (error) {
      console.log('error', error)
    }
  }

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [category,setCategory] = useState([]);



  const getProducts = () => {
    setData([]);
    setLoading(true);
    let url = `${process.env.NEXT_PUBLIC_API_URL}/product/?limit=${limit}&page=${page}`
    if (searchQuery.trim() !== "") {
      url += `&search=${searchQuery}`
    }
    axios.get(url)
      .then(response => {
        console.log(response);
        if (response?.data?.totalRecords) {
          setTotalRecords(+response.data.totalRecords);
        }
        if (response?.data?.data) {

          // console.log(response.data);
          setData(response.data.data);
        }
      })
      .catch(error => console.error('Error fetching data:', error))
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 1000)

      })
  }

  function getCategories(){
     let url = `${process.env.NEXT_PUBLIC_API_URL}/category/?limit=${limit}&page=${page}`
     if (searchQuery.trim() !== "") {
      url += `&search=${searchQuery}`
    }
    axios.get(url)
      .then(response => {
        console.log(response);
        if (response?.data?.totalRecords) {
          setTotalRecords(+response.data.totalRecords);
        }
        if (response?.data?.data) {

          // console.log(response.data);
          setCategory(response.data.data);
        }
      })
      .catch(error => console.error('Error fetching data:', error))
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 1000)

      })
  }

  // const updateCategory = async () => {
  //   setIsCategoryProcessing(true);
  //   let payload = {
  //     name: name,
  //     description: description
  //   }
  //   await axios.put(`http://localhost:8000/category/${updateId}`, payload)
  //     .then(response => {
  //       if (response.status == 200) {
  //         getcategories();
  //       }
  //     })
  //     .catch(error => console.error("error while updated category", error))
  //     .finally(() => {
  //       setTimeout(() => {
  //         resetForm();
  //         setIsCategoryProcessing(false);
  //         let closeBtn = document.getElementById('closeBtn')
  //         if (closeBtn) {
  //           closeBtn.click()
  //         }
  //       }, 1000)

  //     }
  //     )
  // }

  const ConfirmDelete = (id, index) => {
    // const local = data.filter((el) => el._id !== id);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/product/${id}`)
        .then(response => {
          console.log(response);
          if (response.status == 200) {
            // setData(local);
            getProducts();
            Swal.fire({
              title: "Deleted!",
              text: "Categoy delete successfully",
              icon: "success"
            });
          }
        })
        .catch(error => {
          Swal.fire({
            title: "Error",
            text: "Error while delete category",
            icon: "error"
          });
          console.error("error while delete category", error)
        })
      }
    })
  }

  useEffect(() => {
    getProducts();
    getCategories();
  }, [])

 const getCategoryLabel = (id) =>{
    return category.find((el) => el._id == id)?.name ;
 }

  return (
    <>

      <div className="container ">
        
         
        <table className="table my-5">
          <thead>
            <tr>
              <th scope="col">Image</th>
              <th scope="col">Name</th>
              <th scope="col">Description</th>
              <th scope="col">Category</th>
              <th scope="col">Price</th>
              <th scope="col">Quantity</th>
              <th scope="col">Actions</th>

            </tr>
          </thead>



          <tbody>
            {loading
              ?
              <tr >
                <td colSpan='4' className='text-center'>Loading... <i className='fa fa-circle-o-notch fa-spin'></i></td>
              </tr>
              :
              <>
                {data.length == 0 ?
                  <tr >
                    <td colSpan='4' className='text-center'>No results found</td>
                  </tr>
                  :
                  <>
                    {data.map((el, index) => {
                      return (<tr key={index}>
                        <td><img src={el.featureImage} style={{width: "200px", height: "80px", objectFit: "cover"}}/></td>
                        <td>{el?.name}</td>
                        <td>{el?.description}</td>
                        <td>{el?.category.map((elem) => getCategoryLabel(elem) ).join(', ')}</td>
                        <td>{el?.price}</td>
                        <td>{el?.quantity}</td>
                        <td>
                          <i className="fa fa-edit me-4 text-success " onClick={() => router.push(`/product/manage/?id=${el._id}`)}></i>
                          <i className="fa fa-trash cursor-pointer text-danger" onClick={() => ConfirmDelete(el._id, index)}></i>
                        </td>
                      </tr>)
                    })
                    }
                  </>
                }
              </>
            }
          </tbody>
        </table>

        {totalRecords !==0 &&<ResponsivePagination 
        current={page}
        total={Math.ceil(totalRecords / limit)}
        onPageChange={setPage}/>
            }
                </div>
                </>
    
  )

 
}
