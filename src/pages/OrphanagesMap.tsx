import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { FiPlus, FiArrowRight } from "react-icons/fi"
import { Map, TileLayer, Marker, Popup } from "react-leaflet"

import mapMarkerImg from "../images/map-marker.svg"
import mapIcon from "../utils/mapIcon"
import api from "../services/api"

import "../styles/pages/orphanages-map.css"

interface Orphanage {
  id: number,
  latitude: number,
  longitude: number,
  name: string
}

export default function OrphanagesMap() {
  const [orphanages, setOrphanages] = useState<Orphanage[]>([])

  useEffect(() => {
    api.get("/orphanages")
      .then(res => {
        const orphanages = res.data
        setOrphanages(orphanages)
    })
  }, [])

  return (
    <div id="page-map">
      <aside>
        <header>
          <img src={mapMarkerImg} alt="Happy"/>
          <h2>Escolha um orfanato no mapa</h2>
          <p>Muitas crianças estão esperando sua visita :)</p>
        </header>

        <footer>
          <strong>Rio de Janeiro</strong>
          <span>Rio de Janeiro</span>
        </footer>
      </aside>

      <Map
        center={[-23.025192,-43.4570791]}
        zoom={15}
        style={{ width: "100%", height: "100%"}}
      >
        <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
        {/*
          Tile Layer do MapBox, caso queira usar o MapBox:
          <TileLayer
            url={`http://www.api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
          />
        */}

        {orphanages.map(orphanage => {
          return (
            <Marker
              key={orphanage.id}
              position={[orphanage.latitude, orphanage.longitude]}
              icon={mapIcon}
            >
              <Popup closeButton={false} minWidth={240} maxWidth={240} className="map-popup">
                {orphanage.name}
                <Link to={`/orphanages/${orphanage.id}`}>
                  <FiArrowRight size={20} color="#FFFFFF" />
                </Link>
              </Popup>
            </Marker>
          )
        })}
      </Map>

      <Link to="/orphanages/create" className="create-orphanage">
        <FiPlus size={32} color="#ffffff"/>
      </Link>
    </div>
  )
}