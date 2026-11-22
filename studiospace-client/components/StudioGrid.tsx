import type {Studio} from "@/lib/types";
import StudioCard from "./StudioCard";
export default function StudioGrid({studios}:{studios:Studio[]}){return <div className="grid-cards">{studios.map(s=><StudioCard key={s._id} studio={s}/>)}</div>}
