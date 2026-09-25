
import { useContext } from 'react'
import { LocationContext } from './LocationContext'

const useLocation = () => useContext(LocationContext)

export default useLocation