import "./style.scss"
import { useState } from 'react'
import AddImagePng from "../../assets/icons/addImage.png"
import { BASE_URL } from "../../store"
import axios from "axios"


function CreateItem(props) {
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        images: [],
    })

    async function submit(e) {
        e.preventDefault()

        // Create form data
        const formData = new FormData()
        formData.append("name", form.name)
        formData.append("description", form.description)
        formData.append("price", form.price)
        // GET ONLY FIRST image as image for now
        formData.append("image", form.images[0][0])
        // -------------------------
        // TODO: Add multiple images
        // form.images.forEach((image, index) => {
        //     formData.append(`images[${index}]`, image)
        // })
        // -------------------------
        const URL = BASE_URL + "/api/products/"
        try {
            const response = await axios.post(URL, formData)
            // TODO:  'Authorization': `Bearer ${token}`
            console.log(response.data);
        } catch (error) {
            console.error('Error uploading images:', error);
        }
        e.target.reset()
        removeImage(null, true)
    }

    function setFormValue(e) {
        const { name, value } = e.target;
        if (name === "images") {
            const file = e.target.files[0]
            const imageUrl = URL.createObjectURL(file)

            // set form images and image URLs
            setForm({ ...form, images: [...form.images, [file, imageUrl]] })
        } else {
            setForm({ ...form, [name]: value })
        }
    }

    function removeImage(e=null, all=false) {
        if (all==true) {
            for (let i=0; i<form.images.length; i++) {
                let imageUrl = form.images[i][1]
                let imgTag = document.querySelector(`img[src="${imageUrl}"]`)
                imgTag.remove()
            }
            form.images = []
        } else {
            let imageUrl = e.target.src
            setForm({ ...form, images: form.images.filter(img => img[1] !== imageUrl) })
    
            try {
                let imageEl = document.querySelector(`${e.target.getAttribute("data-del")}`)
                imageEl.remove()
            } catch (error) {
                console.warn("Image has been deleted")
            }
        }
    }

    return (
        <section className="create-item-page-wrapper">
            <h1>Create your Product</h1>

            <form onSubmit={submit}>
                <div className="form-control">
                    <label htmlFor="product-name">Product name</label>
                    <input id="product-name" type="text"
                        placeholder="Product name" name="name"
                        onChange={setFormValue}
                    />
                </div>
                <div className="form-control">
                    <div className="row">
                        <div className="image-input-wrapper">
                            <input id="product-image"
                                type="file"
                                name="images"
                                onChange={setFormValue}
                                accept="image/*"
                            />
                            <img src={AddImagePng} alt="addImage" />
                            <small>Upload or drag here</small>
                        </div>
                        <div className="price-input-wrapper">
                            <label htmlFor="product-price">Product price</label>
                            <input id="product-price" type="number"
                                placeholder="Product price" name="price"
                                onChange={setFormValue}
                            />
                        </div>
                    </div>
                </div>
                <div className="form-control">
                    <div className="images-container">
                        {
                            form.images.map((image, index) =>
                                <img
                                    key={index}
                                    src={image[1]}
                                    alt="product"
                                    onClick={removeImage}
                                    data-del={image[1].slice(image[1].length - 10)} // last 10 characters of the image URL
                                />
                            )
                        }
                    </div>
                </div>
                <div className="form-control">
                    <label htmlFor="product-description">Product description</label>
                    <textarea id="product-description"
                        placeholder="Product description"
                        rows={8}
                        name="description"
                        onChange={setFormValue}
                    />
                </div>
                <div className="form-control">
                    <button type="submit">Create</button>
                </div>
            </form>
        </section>
    )
}

export default CreateItem
