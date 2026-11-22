"use client";
import {useEffect,useMemo,useState} from "react";
import {useSearchParams} from "next/navigation";
import {getStudios} from "@/lib/api";
import type {Studio} from "@/lib/types";
import StudioGrid from "@/components/StudioGrid";
import LoadingGrid from "@/components/LoadingGrid";
const cats=["All","Photo Studio","Film Stage","Podcast Lounge","Music Suite","Workshop"];
export default function StudiosPage(){
 const [items,setItems]=useState<Studio[]>([]),[loading,setLoading]=useState(true),[q,setQ]=useState(""),[cat,setCat]=useState("All");
 const params=useSearchParams();
 useEffect(()=>{const c=params.get("category");if(c) setCat(c)},[params]);
 useEffect(()=>{getStudios().then(setItems).catch(()=>setItems([])).finally(()=>setLoading(false))},[]);
 const filtered=useMemo(()=>items.filter(s=>(cat==="All"||s.category===cat)&&(`${s.title} ${s.location} ${s.category}`).toLowerCase().includes(q.toLowerCase())),[items,cat,q]);
 return <div className="container section"><p className="eyebrow">Explore creative spaces</p><h1 className="section-title mt-1 text-4xl">Find Your Studio</h1><div className="card mb-7 grid gap-3 p-4 md:grid-cols-[1fr_260px]"><input className="input" placeholder="Search studio, category or location..." value={q} onChange={e=>setQ(e.target.value)}/><select className="input" value={cat} onChange={e=>setCat(e.target.value)}>{cats.map(c=><option key={c}>{c}</option>)}</select></div>{loading?<LoadingGrid/>:filtered.length?<StudioGrid studios={filtered}/>:<div className="card p-12 text-center"><h2 className="text-xl font-bold">No studios found</h2><p className="mt-2 text-gray-600">Try another search or category.</p><button className="btn btn-primary mt-4" onClick={()=>{setQ("");setCat("All")}}>Clear filters</button></div>}</div>
}
