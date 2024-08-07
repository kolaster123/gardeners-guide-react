import { useNavigate, useParams } from "react-router-dom"
import { AuthedUserContext } from "../../App"
import { useState, useEffect, useContext } from "react"
import * as plantService from "../../services/plantService"
import { Link } from "react-router-dom"

import WaterForm from "../WhenToWater/WhenToWater"
import FertForm from "../WhenToFertilize/WhenToFertilize"

const PlantDetails = (props) => {
  const [plant, setPlant] = useState(null)
  const [isWaterFormVisible, setIsWaterFormVisible] = useState(false)
  const [isFertFormVisible, setIsFertFormVisible] = useState(false)

  const user = useContext(AuthedUserContext)
  const { plantId } = useParams()

  const navigate = useNavigate()

  const fetchPlant = async () => {
    const plantData = await plantService.show(plantId)
    setPlant(plantData)
  }

  const toggleFertVisibility = () => {
    setIsFertFormVisible(true)
    if (isFertFormVisible) {
      setIsFertFormVisible(false)
    }
  }

  const toggleWaterVisibility = () => {
    setIsWaterFormVisible(true)
    if (isWaterFormVisible) {
      setIsWaterFormVisible(false)
    }
  }

  useEffect(() => {
    fetchPlant()
  }, [plantId])

  const handleAddWater = async (plantFormData) => {
    const plantWater = await plantService.createWater(plantId, plantFormData)
    setPlant({ ...plant, whenToWater: [...plant.whenToWater, plantWater] })
    fetchPlant()
    toggleWaterVisibility()
  }

  const handleAddFertilizer = async (plantFormData) => {
    const plantFertilizer = await plantService.createFertilizer(
      plantId,
      plantFormData
    )
    setPlant(plant)
    fetchPlant()
    toggleFertVisibility()
  }

  const handleDeleteFertilizer = async (fertilizerId) => {
    const deletedFertilizer = await plantService.deleteFertilizer(
      plantId,
      fertilizerId
    )
    setPlant({
      ...plant,
      whenToFertilize: plant.whenToFertilize.filter(
        (fertilize) => fertilize._id !== deletedFertilizer._id
      ),
    })
    fetchPlant()
  }

  const handleDeleteWater = async (waterId) => {
    const deletedWater = await plantService.deleteWater(plantId, waterId)
    setPlant({
      ...plant,
      whenToWater: plant.whenToWater.filter(
        (water) => water._id !== deletedWater._id
      ),
    })
    fetchPlant()
  }

  if (!plant) return <main>Loading...</main>
  return (
    <main className="flex-container">
      <div className="container">
        <h1>{plant.name}</h1>
        <img src={plant.img} alt={plant.name} />
        <p>
          <span className="Bold">Indoor/Outdoor:</span>
          {plant.indoorOutdoor}
        </p>
        <p>
          <span className="Bold">Light (hrs/day):</span>
          {plant.howMuchSun}
        </p>
        <p>
          <span className="Bold">Type of Light:</span> {plant.typeOfLight}
        </p>
        <p>
          <span className="Bold">Best Season to Plant:</span>{" "}
          {plant.bestSeasonToPlant}
        </p>
        <p>
          <span className="Bold">Grow Time:</span> {plant.growTime}
        </p>

        <section>
          <h4>When to Fertilize:</h4>
          {plant.whenToFertilize.map((fertilize) => (
            <article key={fertilize._id}>
              <p>
                {/* see attributions section  */}
                {fertilize.dateOfDay.match(/.{10}/)}
              </p>

              <div>
                <Link to={`/plants/${plantId}/fertilize/${fertilize._id}/edit`}>
                  <button className="buttons1">Edit Fertilizer Schedule</button>
                </Link>
                <button
                  className="buttons"
                  onClick={() => handleDeleteFertilizer(fertilize._id)}
                >
                  Delete Fertilizer Schedule
                </button>
              </div>
            </article>
          ))}
          {!plant.whenToFertilize.length && (
            <div>
              <button className="buttons" onClick={toggleFertVisibility}>
                Add Fertilizer Schedule
              </button>
              {isFertFormVisible && (
                <FertForm handleAddFertilizer={handleAddFertilizer} />
              )}
            </div>
          )}
        </section>

        <section>
          <h4>When to Water:</h4>
          {plant.whenToWater.map((water) => (
            <article key={water._id}>
              <header>
                <p>Water every {water.dateOfDay} days</p>
              </header>
              <p>Notes: {water.conditionOfSoil}</p>
              <div>
                <Link to={`/plants/${plantId}/water/${water._id}/edit`}>
                  <button className="buttons1">Edit Water Schedule</button>
                </Link>
                <button
                  className="buttons"
                  onClick={() => handleDeleteWater(water._id)}
                >
                  Delete Water Schedule
                </button>
              </div>
            </article>
          ))}
          {!plant.whenToWater.length && (
            <>
              <div className="addwater">
                <button className="buttons" onClick={toggleWaterVisibility}>
                  Add Water Schedule
                </button>
              </div>
              <div className="waterform">
                {isWaterFormVisible && (
                  <WaterForm handleAddWater={handleAddWater} />
                )}
              </div>
            </>
          )}
        </section>
        <span>
          <Link to={`/plants/${plantId}/edit`}>
            <button className="buttons">Edit Plant</button>
          </Link>
          <button
            className="buttons"
            onClick={() => props.handleDeletePlant(plantId)}
          >
            Delete
          </button>
        </span>
      </div>
    </main>
  )
}

export default PlantDetails
