export type PermissionAction='view'|'create'|'edit'|'delete'|'validate'|'export'|'import'|'sensitive';
export type ModuleId='dashboard'|'reservations'|'floor'|'menu'|'technical'|'stock'|'purchases'|'suppliers'|'receptions'|'inventories'|'waste'|'payments'|'expenses'|'team'|'reports'|'documents'|'settings'|'users';
export type Permission=Record<PermissionAction,boolean>;
export type User={id:string;name:string;email:string;roleId:string;department:string;active:boolean;lastLogin:string;createdAt:string;overrides:Partial<Record<ModuleId,Partial<Permission>>>};
export type Role={id:string;name:string;description:string;active:boolean;permissions:Record<ModuleId,Permission>};
export type Audit={id:string;actorId:string;actorName:string;action:string;target:string;level:'info'|'sensitive'|'security';at:string;result:'Allowed'|'Denied'};
export type State={users:User[];roles:Role[];audit:Audit[];sessionId:string};
export const actions:PermissionAction[]=['view','create','edit','delete','validate','export','import','sensitive'];
export const actionLabels:Record<PermissionAction,string>={view:'View',create:'Create',edit:'Edit',delete:'Delete',validate:'Validate / Approve',export:'Export',import:'Import',sensitive:'Sensitive information'};
export const moduleLabels:Record<ModuleId,string>={dashboard:"Today's Dashboard",reservations:'Reservations',floor:'Tables & Service',menu:'Menu & prices',technical:'Technical sheets',stock:'Stock & ingredients',purchases:'Purchases',suppliers:'Suppliers',receptions:'Merchandise reception',inventories:'Inventories',waste:'Losses & waste',payments:'Payments & collections',expenses:'Expenses',team:'Team & schedules',reports:'Reports & KPIs',documents:'Documents',settings:'System settings',users:'Users & roles'};
export const moduleOrder:ModuleId[]=['dashboard','reservations','floor','menu','technical','stock','purchases','suppliers','receptions','inventories','waste','payments','expenses','team','reports','documents','settings','users'];
const full=():Permission=>Object.fromEntries(actions.map(a=>[a,true])) as Permission;
const read=(extra:PermissionAction[]=[]):Permission=>Object.fromEntries(actions.map(a=>[a,a==='view'||extra.includes(a)])) as Permission;
const role=(id:string,name:string,description:string,grants:Partial<Record<ModuleId,Permission>>):Role=>({id,name,description,active:true,permissions:Object.fromEntries(moduleOrder.map(m=>[m,grants[m]||read()])) as Record<ModuleId,Permission>});
const withGrant=(base:Permission,items:PermissionAction[]):Permission=>({...base,...Object.fromEntries(items.map(a=>[a,true]))});
export const defaultRoles:Role[]=[
 {id:'owner',name:'Super Admin / Owner',description:'Full access to the entire platform.',active:true,permissions:Object.fromEntries(moduleOrder.map(m=>[m,full()])) as Record<ModuleId,Permission>},
 role('direction','Direction / Manager','Overall operations and performance.',Object.fromEntries(moduleOrder.map(m=>[m,m==='users'?read():full()])) as Record<ModuleId,Permission>),
 role('restaurant-manager','Restaurant Manager','Daily restaurant operations.',Object.fromEntries(moduleOrder.map(m=>[m,read(['create','edit','validate'])])) as Record<ModuleId,Permission>),
 role('supervisor','Head Waiter / Supervisor','Dining-room operations.',{dashboard:read(),reservations:read(['create','edit']),floor:read(['edit']),menu:read(),reports:read()}),
 role('chef','Chef / Kitchen Manager','Kitchen operations and food cost.',{dashboard:read(),menu:read(),technical:read(['create','edit']),stock:read(['edit']),purchases:read(['create']),suppliers:read(),waste:read(['create','edit']),inventories:read(['create']),reports:read()}),
 role('kitchen','Kitchen Staff','Operational kitchen access.',{menu:read(),technical:read(),stock:read(),waste:read(['create']),dashboard:read()}),
 role('cashier','Cashier','Payments and collections.',{dashboard:read(),reservations:read(),floor:read(),payments:read(['create','edit','validate']),reports:read()}),
 role('purchasing','Purchasing / Stock Manager','Procurement and inventory.',{stock:read(['create','edit','validate','export']),purchases:read(['create','edit','validate','export']),suppliers:read(['create','edit','export']),receptions:read(['create','edit','validate']),inventories:read(['create','edit','validate']),waste:read(['create','edit']),reports:read(['export'])}),
 role('hr','HR / Administration','Employee administration and documents.',{dashboard:read(),team:read(['create','edit','validate']),documents:read(['create','edit','export']),reports:read(),users:read()}),
 role('employee','Employee / Staff','Basic operational access.',{dashboard:read(),reservations:read(),floor:read(),menu:read(),team:read(),reports:read()})
];
const now=new Date().toISOString();
export const seed:State={sessionId:'u-owner',roles:defaultRoles,users:[
 {id:'u-owner',name:'Sofia Benali',email:'sofia@maisonatlas.com',roleId:'owner',department:'Direction',active:true,lastLogin:now,createdAt:'2025-01-12T09:00:00.000Z',overrides:{}},
 {id:'u-manager',name:'Karim Haddad',email:'karim@maisonatlas.com',roleId:'restaurant-manager',department:'Operations',active:true,lastLogin:'2026-10-07T08:42:00.000Z',createdAt:'2025-02-18T10:15:00.000Z',overrides:{}},
 {id:'u-chef',name:'Lina Farah',email:'lina@maisonatlas.com',roleId:'chef',department:'Kitchen',active:true,lastLogin:'2026-10-06T22:10:00.000Z',createdAt:'2025-03-02T11:30:00.000Z',overrides:{}},
 {id:'u-cashier',name:'Thomas Roy',email:'thomas@maisonatlas.com',roleId:'cashier',department:'Front of house',active:false,lastLogin:'2026-09-29T17:04:00.000Z',createdAt:'2025-05-09T14:20:00.000Z',overrides:{}},
 {id:'u-nora',name:'Nora Martin',email:'nora.restaurant-manager@maisonatlas.com',roleId:'restaurant-manager',department:'Operations',active:true,lastLogin:'2026-10-07T08:20:00.000Z',createdAt:'2025-06-01T09:00:00.000Z',overrides:{}},
 {id:'u-yassine',name:'Yassine Amrani',email:'yassine.supervisor@maisonatlas.com',roleId:'supervisor',department:'Front of house',active:true,lastLogin:'2026-10-08T08:10:00.000Z',createdAt:'2025-06-12T09:00:00.000Z',overrides:{}},
 {id:'u-adam',name:'Adam Costa',email:'adam.kitchen@maisonatlas.com',roleId:'kitchen',department:'Kitchen',active:true,lastLogin:'2026-10-07T16:30:00.000Z',createdAt:'2025-07-04T09:00:00.000Z',overrides:{}},
 {id:'u-ines',name:'Ines Rahal',email:'ines.purchasing@maisonatlas.com',roleId:'purchasing',department:'Purchasing',active:true,lastLogin:'2026-10-07T12:15:00.000Z',createdAt:'2025-07-18T09:00:00.000Z',overrides:{}},
 {id:'u-salma',name:'Salma Idrissi',email:'salma.hr@maisonatlas.com',roleId:'hr',department:'Administration',active:true,lastLogin:'2026-10-06T15:40:00.000Z',createdAt:'2025-08-03T09:00:00.000Z',overrides:{}},
 {id:'u-mehdi',name:'Mehdi Benali',email:'mehdi.staff@maisonatlas.com',roleId:'employee',department:'Operations',active:true,lastLogin:'2026-10-08T07:55:00.000Z',createdAt:'2025-08-21T09:00:00.000Z',overrides:{}}
],audit:[{id:'a1',actorId:'u-owner',actorName:'Sofia Benali',action:'Updated restaurant settings',target:'ALLNEEDS - TOURISM',level:'sensitive',at:'2026-10-07T08:48:00.000Z',result:'Allowed'},{id:'a2',actorId:'u-manager',actorName:'Karim Haddad',action:'Validated merchandise reception',target:'Reception #MR-1048',level:'info',at:'2026-10-07T08:42:00.000Z',result:'Allowed'},{id:'a3',actorId:'u-owner',actorName:'Sofia Benali',action:'Deactivated account',target:'Thomas Roy',level:'security',at:'2026-10-06T17:04:00.000Z',result:'Allowed'}]};
export function can(state:State,user:User,module:ModuleId,action:PermissionAction='view'){if(!user.active)return false;const role=state.roles.find(r=>r.id===user.roleId);if(!role?.active)return false;return Boolean(user.overrides[module]?.[action]??role.permissions[module]?.[action]);}
export function audit(state:State,user:User,action:string,target:string,level:'info'|'sensitive'|'security'='info',result:'Allowed'|'Denied'='Allowed'):State{return {...state,audit:[{id:crypto.randomUUID(),actorId:user.id,actorName:user.name,action,target,level,at:new Date().toISOString(),result},...state.audit]};}
export function requirePermission(state:State,user:User,module:ModuleId,action:PermissionAction):void{if(!can(state,user,module,action))throw new Error('Permission denied');}

export type BusinessType='restaurant'|'travel-agency'|'transport'|'activities'|'accommodation';
export type Business={id:string;name:string;type:BusinessType;location:string;active:boolean;accent:string;description:string};
export const businesses:Business[]=[
 {id:'restaurant-casablanca',name:'Restaurant Casablanca',type:'restaurant',location:'Casablanca · Morocco',active:true,accent:'#d9eee6',description:'Restaurant ERP · service, stock and financial control'},
 {id:'atlas-travel',name:'Atlas Travel Agency',type:'travel-agency',location:'Marrakech · Morocco',active:true,accent:'#e5ecfa',description:'Travel CRM · dossiers, quotes and departures'},
 {id:'atlas-transport',name:'Atlas Transport',type:'transport',location:'Casablanca · Morocco',active:true,accent:'#f7ead8',description:'Dispatch management · vehicles and drivers'},
 {id:'atlas-activities',name:'Atlas Activities',type:'activities',location:'Agadir · Morocco',active:true,accent:'#f2e5f1',description:'Activity bookings · sessions and participants'},
 {id:'atlas-hebergement',name:'Atlas Hébergement',type:'accommodation',location:'Essaouira · Morocco',active:true,accent:'#e4edf0',description:'Property management · rooms and housekeeping'}
];
export const businessTypeLabels:Record<BusinessType,string>={restaurant:'Restaurant', 'travel-agency':'Agence de Voyage',transport:'Transport',activities:'Activité',accommodation:'Hébergement'};
export const businessTypeIcons:Record<BusinessType,string>={restaurant:'🍽️','travel-agency':'✈️',transport:'🚐',activities:'🎯',accommodation:'🏨'};
