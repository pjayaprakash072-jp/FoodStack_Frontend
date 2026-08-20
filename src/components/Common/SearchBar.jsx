

import {Search} from "lucide-react"
const SearchBar = ({value,onChange, placeholder = "Search..."}) => {
  return (
    <div className="search">
        <Search size={18}/>
        <input type="text"
            value={value}
            onChange={(e)=> onChange(e.target.value)
            }
            placeholder={placeholder}
            />
    </div>
  )
}

export default SearchBar