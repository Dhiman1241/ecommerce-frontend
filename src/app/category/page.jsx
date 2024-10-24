"use client";
import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react'
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic.css';
import Swal from 'sweetalert2';


export default function page() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [updateId, setUpdateId] = useState("");
  const [isCategoryProcessing, setIsCategoryProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);


  const resetForm = () => {
    setName("");
    setDescription("");
    setUpdateId("");
  }

  useEffect(() => {
      getcategories();
  }, [searchQuery, page]);




  const openUpdateModal = (e) => {
    setName(e.name);
    setDescription(e.description);
    setUpdateId(e._id);
  }


  const getcategories = () => {
    setData([]);
    setLoading(true);
    let url = `${process.env.NEXT_PUBLIC_API_URL}/category/?limit=${limit}&page=${page}`
    if (searchQuery.trim() !== "") {
      url += `&search=${searchQuery}`
    }
    axios.get(url)
      .then(response => {
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

  const updateCategory = async () => {
    setIsCategoryProcessing(true);
    let payload = {
      name: name,
      description: description
    }
    await axios.put(`http://localhost:8000/category/${updateId}`, payload)
      .then(response => {
        if (response.status == 200) {
          getcategories();
        }
      })
      .catch(error => console.error("error while updated category", error))
      .finally(() => {
        setTimeout(() => {
          resetForm();
          setIsCategoryProcessing(false);
          let closeBtn = document.getElementById('closeBtn')
          if (closeBtn) {
            closeBtn.click()
          }
        }, 1000)

      }
      )
  }

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
        axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/category/${id}`)
        .then(response => {
          // console.log(response);
          if (response.status == 200) {
            // setData(local);
            getcategories();
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
    getcategories();
  }, [])

  const createCategory = async () => {
    setIsCategoryProcessing(true);
    let payload = {
      name: name,
      description: description
    }
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/category`, payload)
      .then(response => {
        if (response.status == 201) {
          getcategories();
        }
      })
      .catch(error => console.error("error while creating category", error))
      .finally(() => {
        setTimeout(() => {
          setIsCategoryProcessing(false);
          resetForm();
          let closeBtn = document.getElementById('closeBtn')
          if (closeBtn) {
            closeBtn.click()
          }
        }, 1000)

      }
      )
  }
  return (
    <>
      <div className="container ">
        <div className="fields">

          <div>
            <input className="form-control mt-4" type="text" value={searchQuery} aria-label="readonly input example" onInput={(e) => setSearchQuery(e.target.value)} placeholder="Search Category"/>
          </div>
          <div className='text-end'>
            <button type="button" className="btn btn-primary mt-4" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => resetForm()}>
              Create Category
            </button>

          </div>

        </div>
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">{updateId ? 'Update' : 'Create'} Category</h1>
                <button type="button" className="btn-close" id="closeBtn" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="exampleInputEmail1" className="form-label">Name</label>
                  <input type="text" className="form-control" id="exampleInputEmail1" placeholder="Name" aria-describedby="emailHelp" value={name} onInput={e => setName(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">Description</label>
                  <input type="text" className="form-control" id="exampleInputPassword1" placeholder="Description" value={description} onInput={e => setDescription(e.target.value)} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary" disabled={name.trim() == "" || description.trim() == "" || isCategoryProcessing} onClick={() => { updateId ? updateCategory() : createCategory() }}>
                  {!isCategoryProcessing ? <span>{updateId ? 'Update' : 'Save'} changes</span>
                    : <span>Processing... <i className='fa fa-circle-o-notch fa-spin'></i></span>}
                </button>
              </div>
            </div>
          </div>
        </div>
        <table className="table my-5">
          <thead>
            <tr>
              <th scope="col">Id</th>
              <th scope="col">Title</th>
              <th scope="col">Description</th>
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
                        <td>{el?._id}</td>
                        <td>{el?.name}</td>
                        <td>{el?.description}</td>
                        <td>
                          <i className="fa fa-edit me-4 text-success " data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => openUpdateModal(el)}></i>
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
