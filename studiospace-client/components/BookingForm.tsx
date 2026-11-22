"use client";
import {useState} from "react";
import {toast} from "sonner";
import {createBooking} from "@/lib/api";
export default function BookingForm({studio}:{studio:any}){
 const [date,setDate]=useState(""),[start,setStart]=useState("10:00"),[end,setEnd]=useState("12:00"),[name,setName]=useState("Demo Guest"),[email,setEmail]=useState("guest@example.com"),[busy,setBusy]=useState(false);
 async function submit(e:React.FormEvent){e.preventDefault();setBusy(true);try{await createBooking({studioId:studio._id,guestName:name,guestEmail:email,date,startTime:start,endTime:end});toast.success("Booking request sent");}catch(err){toast.error(err instanceof Error?err.message:"Booking failed")}finally{setBusy(false)}}
 return <form onSubmit={submit} className="space-y-3"><label className="block text-sm font-bold">Your name<input className="input mt-1" value={name} onChange={e=>setName(e.target.value)} required/></label><label className="block text-sm font-bold">Email<input type="email" className="input mt-1" value={email} onChange={e=>setEmail(e.target.value)} required/></label><label className="block text-sm font-bold">Date<input type="date" className="input mt-1" value={date} onChange={e=>setDate(e.target.value)} required/></label><div className="grid grid-cols-2 gap-3"><label className="text-sm font-bold">Start<input type="time" className="input mt-1" value={start} onChange={e=>setStart(e.target.value)}/></label><label className="text-sm font-bold">End<input type="time" className="input mt-1" value={end} onChange={e=>setEnd(e.target.value)}/></label></div><button disabled={busy} className="btn btn-primary w-full">{busy?"Sending...":"Request Booking"}</button></form>
}
