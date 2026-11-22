import type {Studio,Booking} from "./types";
const API=process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
async function request<T>(path:string,init?:RequestInit):Promise<T>{
 const res=await fetch(`${API}${path}`,{...init,credentials:"include",headers:{"Content-Type":"application/json",...(init?.headers||{})},cache:"no-store"});
 const data=await res.json().catch(()=>({message:"Unexpected server response"}));
 if(!res.ok) throw new Error(data.message||"Request failed");
 return data;
}
export const getStudios=()=>request<Studio[]>("/studios");
export const getStudio=(id:string)=>request<Studio>(`/studios/${id}`);
export const createStudio=(body:Partial<Studio>)=>request<Studio>("/studios",{method:"POST",body:JSON.stringify(body)});
export const updateStudio=(id:string,body:Partial<Studio>)=>request<Studio>(`/studios/${id}`,{method:"PATCH",body:JSON.stringify(body)});
export const deleteStudio = (id: string) => request<{ message: string }>(`/studios/${id}`, {method: "DELETE",});
export const getMyListings=(email:string)=>request<Studio[]>(`/studios/owner/${encodeURIComponent(email)}`);
export const createBooking=(body:Record<string,unknown>)=>request<Booking>("/bookings",{method:"POST",body:JSON.stringify(body)});
export const getMyBookings=(email:string)=>request<Booking[]>(`/bookings/guest/${encodeURIComponent(email)}`);
export const cancelBooking=(id:string,email:string)=>request<{message:string}>(`/bookings/${id}/cancel`,{method:"PATCH",body:JSON.stringify({guestEmail:email})});
