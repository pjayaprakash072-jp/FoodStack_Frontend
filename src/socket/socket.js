import {io} from "socket.io-client"
const socket = ()=>{
    import.meta.env.VITE_API_BASE_URL,
    {
        autoConnect:false, // we don't want every page in applicatino to connect socket.
        withCredentials:true
    }
}
export default socket;