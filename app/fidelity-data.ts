import type {Atlas, Concept, SystemId} from './anatomy';
export type LabScene='FACE'|'VISCERA'|'MATERIAL A/B'|'DEEP TRUNK';
export const DEEP_IDS=['FMA13405','FMA13406','FMA22342','FMA22343','FMA13295','FMA13403','FMA13404'];
export const ORGAN_SYSTEMS:SystemId[]=['digestive','respiratory','cardiac','urinary'];
const faceCandidates=[['orbicularis oculi','表情筋'],['orbicularis oris','表情筋'],['zygomaticus major','表情筋'],['zygomaticus minor','表情筋'],['buccinator','表情筋'],['frontalis','表情筋'],['temporalis','咀嚼筋'],['masseter','咀嚼筋'],['platysma','表情筋・頸部'],['levator palpebrae superioris','眼瞼挙筋（表情筋ではない）'],['inferior oblique','眼球運動筋'],['superior oblique','眼球運動筋'],['lateral rectus','眼球運動筋'],['medial rectus','眼球運動筋'],['superior rectus','眼球運動筋'],['inferior rectus','眼球運動筋']];
export interface RealityRow {name:string;group:string;conceptId:string|null;meshIds:string[];declaredIds:string[];status:'PRESENT_IN_MANIFEST'|'MESH_MISSING'|'NOT_FOUND_IN_FIXED_MANIFEST'}
export function diagnose(atlas:Atlas){
 const parts=new Map(atlas.parts.map(p=>[p.id,p]));
 const row=(c:Concept,group:string):RealityRow=>({name:c.name,group,conceptId:c.id,declaredIds:c.elements,meshIds:c.elements.filter(id=>parts.has(id)),status:c.elements.some(id=>parts.has(id))?'PRESENT_IN_MANIFEST':'MESH_MISSING'});
 const face=faceCandidates.flatMap<RealityRow>(([term,group])=>{
  const matches=atlas.concepts.filter(c=>c.name.toLowerCase().includes(term));
  return matches.length?matches.map(c=>{const r=row(c,group);return {...r,meshIds:r.meshIds.filter(id=>parts.get(id)?.system==='muscular')};}).map(r=>({...r,status:r.meshIds.length?'PRESENT_IN_MANIFEST' as const:'MESH_MISSING' as const})):[{name:term,group,conceptId:null,meshIds:[],declaredIds:[],status:'NOT_FOUND_IN_FIXED_MANIFEST' as const}];
 });
 const viscera=['right lung','left lung','heart','liver','stomach','small intestine','large intestine','right kidney','left kidney'].flatMap(name=>{const c=atlas.concepts.find(c=>c.name.toLowerCase()===name);return c?[row(c,'内臓（関連血管等を含む概念）')]:[{name,group:'内臓',conceptId:null,meshIds:[],declaredIds:[],status:'NOT_FOUND_IN_FIXED_MANIFEST' as const}];});
 const deep=DEEP_IDS.map(id=>{const c=atlas.concepts.find(c=>c.id===id);return c?row(c,'深部体幹'):{name:id,group:'深部体幹',conceptId:id,meshIds:[],declaredIds:[],status:'NOT_FOUND_IN_FIXED_MANIFEST' as const};});
 const skull=atlas.concepts.find(c=>c.name.toLowerCase()==='skull')?.elements.filter(id=>parts.get(id)?.system==='skeletal')??[];
 return {face,viscera,deep,skull,counts:{parts:atlas.parts.length,concepts:atlas.concepts.length,chunks:atlas.chunks.length},systemParts:Object.fromEntries(ORGAN_SYSTEMS.map(s=>[s,atlas.parts.filter(p=>p.system===s).length]))};
}
export function downloadFile(blob:Blob,name:string){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
