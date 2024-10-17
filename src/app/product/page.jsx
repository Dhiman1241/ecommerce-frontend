'use client'
import React from 'react'
import Api from '../Api'

export default function page() {

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
  return (
    <div>
      <input type="file" onChange={(e) => uploadImage(e)} />
    </div>
  )
}
