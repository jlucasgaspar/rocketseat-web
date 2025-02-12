import React, { useState, FormEvent, ChangeEvent } from "react"
import { useHistory } from "react-router-dom"
import { Map, TileLayer, Marker } from "react-leaflet"
import { LeafletMouseEvent } from "leaflet"
import { FiPlus } from "react-icons/fi"

import Sidebar from "../components/Sidebar"
import mapIcon from "../utils/mapIcon"

import "../styles/pages/create-orphanage.css"
import api from "../services/api"

export default function CreateOrphanage() {
  const [position, setPosition] = useState({ latitude: 0, longitude: 0})
  const [name, setName] = useState("")
  const [about, setAbout] = useState("")
  const [instructions, setInstructions] = useState("")
  const [opening_hours, setOpening_hours] = useState("")
  const [open_on_weekends, setOpen_on_weekends] = useState(true)
  const [images, setImages] = useState<File[]>([])
  const [previewImages, setPreviewImages] = useState<string[]>([])
  const history = useHistory()
  
  const handleMapClick = (event: LeafletMouseEvent) => {
    const { lat, lng } = event.latlng
    setPosition({ latitude: lat, longitude: lng})
  }

  const handleSelectImage = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return
    }

    const selectedImages = Array.from(event.target.files)
    setImages(selectedImages)

    const selectedImagesPreview = selectedImages.map(image => {
      return URL.createObjectURL(image)
    })

    setPreviewImages(selectedImagesPreview)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    const { latitude, longitude } = position

    const data = new FormData()

    data.append("name", name)
    data.append("about", about)
    data.append("latitude", String(latitude))
    data.append("longitude", String(longitude))
    data.append("instructions", instructions)
    data.append("opening_hours", opening_hours)
    data.append("open_on_weekends", String(open_on_weekends))
    images.forEach(image => {
      return data.append("image", image)
    })

    await api.post("/orphanages", data)

    alert("Cadastro realizado com sucesso!")

    history.push("/app")
  }

  return (
    <div id="page-create-orphanage">
      <Sidebar />
      <main>
        <form className="create-orphanage-form" onSubmit={handleSubmit}>
          <fieldset>
            <legend>Dados</legend>

            <Map
              center={[-27.2092052,-49.6401092]}
              style={{ width: "100%", height: 280 }}
              zoom={15}
              onClick={handleMapClick}
            >
              <TileLayer 
                url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
              />
              {position.latitude !== 0 && (
                <Marker
                  interactive={false}
                  icon={mapIcon}
                  position={[position.latitude, position.longitude]}
                />
              )}
            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <strong>Máximo de 300 caracteres</strong></label>
              <textarea
                id="name"
                maxLength={300}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>
              <div className="images-container">
                {previewImages.map(image => {
                  return (
                    <img key={image} src={image} alt={name} />
                  )
                })}
                <label htmlFor="image[]" className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
              </div>
              <input multiple onChange={handleSelectImage} type="file" id="image[]" />
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea
                id="instructions"
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horário de funcionamento</label>
              <input
                id="opening_hours"
                value={opening_hours}
                onChange={e => setOpening_hours(e.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button
                  type="button"
                  className={open_on_weekends ? "active" : ""}
                  onClick={() => setOpen_on_weekends(true)}
                >
                  Sim
                </button>
                <button
                  type="button"
                  className={!open_on_weekends ? "active" : ""}
                  onClick={() => setOpen_on_weekends(false)}
                >
                  Não
                </button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  )
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`