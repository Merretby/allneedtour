import assert from 'node:assert/strict'
import { createServer } from 'vite'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { RouterContextProvider, createMemoryHistory } from '@tanstack/react-router'
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
try {
 const { hasPublishedDiagnostic } = await server.ssrLoadModule('/src/lib/offer-visibility.ts')
 assert.equal(hasPublishedDiagnostic([], 'own'), false)
 assert.equal(hasPublishedDiagnostic([{ orgId: 'own', status: 'brouillon' }], 'own'), false)
 assert.equal(hasPublishedDiagnostic([{ orgId: 'other', status: 'publie' }], 'own'), false)
 assert.equal(hasPublishedDiagnostic([{ orgId: 'own', status: 'publie' }], 'own'), true)
 assert.equal(hasPublishedDiagnostic([{ orgId: '', status: 'publie' }], ''), false)
 const { router } = await server.ssrLoadModule('/src/router.tsx')
 router.update({ history: createMemoryHistory({ initialEntries: ['/secteurs/sante'] }) }); await router.load()
 const { DemoStoreProvider } = await server.ssrLoadModule('/src/store/store.tsx')
 const { SectorPage } = await server.ssrLoadModule('/src/components/SectorPage.tsx')
 const { MissionPage, MissionIndex } = await server.ssrLoadModule('/src/components/MissionPage.tsx')
 const render = component => renderToString(React.createElement(RouterContextProvider, { router }, React.createElement(DemoStoreProvider, null, component)))
 for (const sector of ['sante', 'enseignement', 'tourisme']) {
  for (const element of [React.createElement(SectorPage,{sector}),React.createElement(MissionIndex,{sector}),...['STARTER','PRO','PERFORMANCE'].map(code=>React.createElement(MissionPage,{sector,code}))]) {
   const html=render(element)
   assert.ok(!html.includes('<table'), 'No public mission comparison before diagnostic')
   assert.ok(!/\d[\d\s,.]*\s*(?:DH|MAD)\b|PRIX DE LANCEMENT|Prix normal HT/.test(html), 'No offer prices: '+sector+' '+html.match(/.{0,60}(?:DH|MAD|PRIX DE LANCEMENT|Prix normal HT).{0,60}/g))
  }
 }
 const html=render(React.createElement(SectorPage,{sector:'sante'}))
 assert.ok(html.includes('Notre analyse porte sur l’organisation'))
 for(const label of ['Confidentialité','Neutralité','Objectivité'])assert.ok(html.includes(label))
 const { ComparisonTable }=await server.ssrLoadModule('/src/components/marketing.tsx')
 const table=render(React.createElement(ComparisonTable,{rows:[{label:'Prix normal HT',values:['495 DH','8495 DH','13945 DH']},{label:'Diagnostic 4 leviers',values:['✓','✓','✓']}]}))
 assert.ok(!table.includes('495 DH'));assert.ok(table.includes('Diagnostic 4 leviers'))
 console.log('V11 : published diagnostic scoping, 15 public sector/mission renders, health copy and price-free comparison passed.')
}finally{await server.close()}
