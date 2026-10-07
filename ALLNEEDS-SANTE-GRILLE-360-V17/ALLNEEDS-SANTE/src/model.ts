export type Module = 'patients'|'planning'|'paiements'|'archives';
export type Status = 'À vérifier'|'Validé'|'À corriger';
export type User = {id:string;name:string;email:string;role:'directeur'|'employe';active:boolean;modules:Module[];edit:boolean;invite?:string};
export type Entry = {id:string;module:Module;name:string;detail:string;date:string;amount:number;status:Status;author:string;note:string;file?:string};
export type State = {users:User[];entries:Entry[];history:{id:string;text:string;date:string}[]};
export const modules:Module[]=['patients','planning','paiements','archives'];
export function can(user:User,module:Module){return user.active&&(user.role==='directeur'||user.modules.includes(module))}
export function saveEntry(state:State,user:User,entry:Entry):State {
 if(!can(user,entry.module))throw Error('Accès refusé');
 const old=state.entries.find(e=>e.id===entry.id);
 if(old&&user.role!=='directeur'&&(!user.edit||old.author!==user.id))throw Error('Modification refusée');
 const next={...entry,author:old?.author??user.id,status:user.role==='directeur'?entry.status:'À vérifier' as Status};
 return {...state,entries:old?state.entries.map(e=>e.id===entry.id?next:e):[next,...state.entries],history:[{id:crypto.randomUUID(),text:`${user.name} · ${old?'Modification':'Ajout'} : ${entry.name}`,date:new Date().toISOString()},...state.history]};
}
export function review(state:State,user:User,id:string,status:Status,note:string):State {
 if(user.role!=='directeur'||!user.active)throw Error('Validation réservée au directeur');
 return {...state,entries:state.entries.map(e=>e.id===id?{...e,status,note}:e),history:[{id:crypto.randomUUID(),text:`${user.name} · ${status} : ${state.entries.find(e=>e.id===id)?.name}`,date:new Date().toISOString()},...state.history]};
}
const today=new Date().toISOString().slice(0,10);
export const seed:State={users:[{id:'dir',name:'Dr. Amine Alaoui',email:'direction@demo.allneeds',role:'directeur',active:true,modules,edit:true},{id:'rec',invite:'rec',name:'Sara Bennani',email:'reception@demo.allneeds',role:'employe',active:true,modules:['patients','planning','archives'],edit:true},{id:'compta',invite:'compta',name:'Youssef Idrissi',email:'compta@demo.allneeds',role:'employe',active:true,modules:['paiements'],edit:true}],entries:[
{id:'p1',module:'patients',name:'Salma R.',detail:'Dossier PAT-1042 · Contact : 0600000001',date:today,amount:0,status:'Validé',author:'rec',note:''},
{id:'p2',module:'patients',name:'Omar B.',detail:'Dossier PAT-1043 · Contact : 0600000002',date:today,amount:0,status:'À vérifier',author:'rec',note:''},
{id:'rd1',module:'planning',name:'Salma R.',detail:'09:30 · Dr. Amine · Consultation',date:today,amount:0,status:'Validé',author:'rec',note:''},
{id:'rd2',module:'planning',name:'Omar B.',detail:'11:00 · Dr. Amine · Rendez-vous de suivi',date:today,amount:0,status:'À vérifier',author:'rec',note:''},
{id:'pay1',module:'paiements',name:'Salma R.',detail:'Reçu REC-001 · Carte · Réglé',date:today,amount:450,status:'Validé',author:'compta',note:''},
{id:'pay2',module:'paiements',name:'Omar B.',detail:'Reçu REC-002 · Espèces · Réglé',date:today,amount:300,status:'À vérifier',author:'compta',note:''},
{id:'a1',module:'archives',name:'Salma R.',detail:'Document administratif · Dossier PAT-1042',date:today,amount:0,status:'Validé',author:'rec',note:'',file:'consentement-demo.pdf'}],history:[{id:'h1',text:'Sara Bennani · Création du dossier PAT-1043',date:new Date().toISOString()}]};
