import{c as r,h as c}from"./index-CmCGijFh.js";/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i=r("LoaderCircle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d=r("Upload",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"17 8 12 3 7 8",key:"t8dd8p"}],["line",{x1:"12",x2:"12",y1:"3",y2:"15",key:"widbto"}]]),o=()=>{const{siteUrl:e}=c();return`${"http://localhost:8080".replace(/\/+$/,"")}/wp-json/arazclean/v1/media`},h=async(e=100)=>{const t=await fetch(`${o()}?per_page=${e}`);if(!t.ok){const a=await t.text().catch(()=>"");throw new Error(`دریافت تصاویر ناموفق بود (${t.status}) — ${a.slice(0,200)}`)}return t.json()},l=async e=>{const t=new FormData;t.append("file",e);const a=await fetch(o(),{method:"POST",body:t}),s=await a.json().catch(()=>({}));if(!a.ok)throw new Error(s.error||`آپلود ناموفق بود (${a.status})`);return s},p=async e=>{const t=await fetch(`${o()}/${e}`,{method:"DELETE"}),a=await t.json().catch(()=>({}));if(!t.ok)throw new Error(a.error||`حذف ناموفق بود (${t.status})`);return a};export{i as L,d as U,p as d,h as f,l as u};
