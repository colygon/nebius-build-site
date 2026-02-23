module.exports=[63109,e=>{"use strict";var t=e.i(21213),a=e.i(13194),o=e.i(71080),n=e.i(72196),r=e.i(56452),i=e.i(33221),s=e.i(41563),l=e.i(73931),p=e.i(48129),d=e.i(72669),c=e.i(2377),u=e.i(57435),g=e.i(71732),m=e.i(76393),h=e.i(92746),y=e.i(93695);e.i(41598);var b=e.i(885),f=e.i(33809);async function w(e,t,a,o,n){if(!process.env.SENDGRID_API_KEY){console.log(`[EMAIL] To: ${e} | Subject: ${t}`),console.log(`[EMAIL] Body:
${a}`);return}let r={personalizations:[{to:[{email:e}],...n?.length?{cc:n.map(e=>({email:e}))}:{}}],from:{email:"events@clawhack.ai",name:"AgentHack"},subject:t,content:o?[{type:"text/plain",value:a},{type:"text/html",value:o}]:[{type:"text/plain",value:a}]},i=await fetch("https://api.sendgrid.com/v3/mail/send",{method:"POST",headers:{Authorization:`Bearer ${process.env.SENDGRID_API_KEY}`,"Content-Type":"application/json"},body:JSON.stringify(r)});if(!i.ok){let e=await i.text();console.error(`[EMAIL] SendGrid error (${i.status}):`,e)}}async function v(e){try{var t,a;let o,{type:n,data:r}=await e.json(),i="",s="";if("nomination"===n)i=`[AgentHack] New Nomination: ${r.agentName}`,s=`New Claward nomination submitted!

Agent: ${r.agentName}
URL: ${r.agentUrl||"N/A"}
Builder: ${r.builderName}
Email: ${r.email}
Description: ${r.description}
Demo Person: ${r.demoPersonName||"Same as above"}
Demo Person Email: ${r.demoPersonEmail||"Same as above"}
Phone: ${r.demoPersonPhone}
Categories: ${r.categories.join(", ")}
Custom Categories: ${r.customCategories?.join(", ")||"None"}`;else if("speaker"===n)i=`[AgentHack] New Speaker Application: ${r.name}`,s=`New speaker application submitted!

Name: ${r.name}
Email: ${r.email}
Twitter: ${r.twitter||"N/A"}
Company: ${r.company||"N/A"}
Topic: ${r.topic}
Format: ${r.format}
Bio: ${r.bio}`;else if("people_application"===n)i=`[AgentHack] New ${r.role} Application: ${r.name}`,s=`New people application submitted!

Role: ${r.role}
Name: ${r.name}
Email: ${r.email}
Timezone: ${r.timezone||"N/A"}
Availability: ${(r.availability||[]).join(", ")}
Availability confirmed: ${r.canConfirmAvailability?"Yes":"No"}
Question 1: ${r.questionOne||"N/A"}
Question 2: ${r.questionTwo||"N/A"}`;else{if("sponsor"!==n)return f.NextResponse.json({error:"Unknown type"},{status:400});i=`[AgentHack] New Sponsor Inquiry: ${r.company}`,s=`New sponsorship inquiry submitted!

Name: ${r.firstName} ${r.lastName}
Email: ${r.email}
Company: ${r.company}
Previous Sponsor: ${"yes"===r.previousSponsor?"Yes":"No"}
Telegram: ${r.telegram||"N/A"}
Donation/Sponsor Amount: ${r.donationAmount||"N/A"}
Plans: ${r.plans}`}if(await w("colin@lowenberg.org",i,s),"nomination"===n&&r.email){let e,t=`${r.agentName} has been nominated for a Claward!`,a=`Congratulations! ${r.agentName} has been nominated for a Claward at ClawHack Demo Day & AI Agent Awards. Our AI judge will review all nominations and top projects will be selected to demo live on stage. Questions? Reply to this email or visit clawhack.ai.`,o=(e=r.categories?.join(", ")||"",`
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; padding: 40px 30px; border: 1px solid rgba(255,255,255,0.1);">
  <h1 style="font-size: 24px; margin: 0 0 8px 0;">AgentHack 🦞</h1>
  <p style="color: rgba(255,255,255,0.5); font-size: 14px; margin: 0 0 30px 0;">ETHDenver 2026 &middot; Demo Day & AI Agent Awards</p>
  <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 0 0 30px 0;" />
  <h2 style="font-size: 20px; margin: 0 0 16px 0;">Congratulations!</h2>
  <p style="color: rgba(255,255,255,0.7); line-height: 1.6; margin: 0 0 24px 0;">
    <strong>${r.agentName}</strong> has been nominated for a Claward at ClawHack Demo Day & AI Agent Awards!
  </p>
  <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 20px; margin: 0 0 24px 0;">
    <p style="margin: 0 0 8px 0;"><strong>Agent:</strong> ${r.agentName}</p>
    ${r.agentUrl?`<p style="margin: 0 0 8px 0;"><strong>URL:</strong> <a href="${r.agentUrl}" style="color: #ec4899;">${r.agentUrl}</a></p>`:""}
    <p style="margin: 0 0 8px 0;"><strong>Categories:</strong> ${e}</p>
    <p style="margin: 0;"><strong>Description:</strong> ${r.description?.slice(0,200)}${r.description?.length>200?"...":""}</p>
  </div>
  <div style="background: rgba(236,72,153,0.1); border: 1px solid rgba(236,72,153,0.3); padding: 20px; margin: 0 0 24px 0;">
    <p style="margin: 0 0 8px 0; font-size: 16px;"><strong>Please confirm you'll be there!</strong></p>
    <p style="color: rgba(255,255,255,0.7); margin: 0; line-height: 1.6;">If your project is selected, we'll call you on stage to demo live. <strong>Reply to this email</strong> to confirm you'll be attending in person so we know you'll be there when it's your turn.</p>
  </div>
  <h3 style="font-size: 16px; margin: 0 0 12px 0;">Next Steps</h3>
  <table style="width: 100%; border-collapse: collapse; margin: 0 0 24px 0;">
    <tr>
      <td style="padding: 12px 16px; border: 1px solid rgba(255,255,255,0.1); vertical-align: top;">
        <strong style="color: #ec4899;">1.</strong> <strong>Register for the Event on Luma</strong><br/>
        <a href="https://luma.com/clawhack" style="color: #ec4899;">luma.com/clawhack</a>
      </td>
    </tr>
    <tr>
      <td style="padding: 12px 16px; border: 1px solid rgba(255,255,255,0.1); vertical-align: top;">
        <strong style="color: #ec4899;">2.</strong> <strong>Getting There</strong><br/>
        <span style="color: rgba(255,255,255,0.7);">ClawHack is happening at SHACK15, San Francisco, CA.</span><br/>
        <a href="https://maps.app.goo.gl/a1NzbKaeSEFVFgt36" style="color: #ec4899;">View on Google Maps</a>
      </td>
    </tr>
    <tr>
      <td style="padding: 12px 16px; border: 1px solid rgba(255,255,255,0.1); vertical-align: top;">
        <strong style="color: #ec4899;">3.</strong> <strong>Getting In</strong><br/>
        <span style="color: rgba(255,255,255,0.7);">Have your Luma QR code ready at the door.</span>
      </td>
    </tr>
    <tr>
      <td style="padding: 12px 16px; border: 1px solid rgba(255,255,255,0.1); vertical-align: top;">
        <strong style="color: #ec4899;">4.</strong> <strong>Check If You Were Selected!</strong><br/>
        <span style="color: rgba(255,255,255,0.7);">You'll get an email and your name and project will be listed on <a href="https://clawhack.ai" style="color: #ec4899;">clawhack.ai</a>.</span>
      </td>
    </tr>
    <tr>
      <td style="padding: 12px 16px; border: 1px solid rgba(255,255,255,0.1); vertical-align: top;">
        <strong style="color: #ec4899;">5.</strong> <strong>Didn't Apply with the Right URL? Want to Change Your Submission? It's Not Too Late.</strong><br/>
        <span style="color: rgba(255,255,255,0.7);">Just re-submit your nomination at <a href="https://clawhack.ai" style="color: #ec4899;">clawhack.ai</a>!</span>
      </td>
    </tr>
  </table>
  <p style="color: rgba(255,255,255,0.7); line-height: 1.6; margin: 0 0 30px 0;">
    Questions? Reply to this email or find us at <a href="https://clawhack.ai" style="color: #ec4899;">clawhack.ai</a>.
  </p>
  <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 0 0 20px 0;" />
  <p style="color: rgba(255,255,255,0.3); font-size: 12px; margin: 0;">ClawHack &middot; ETHDenver 2026 &middot; March 14, San Francisco, CA</p>
</div>`);await w(r.email,t,a,o,["justin@ethdenver.com"])}return process.env.GOOGLE_SHEETS_WEBHOOK_URL&&fetch(process.env.GOOGLE_SHEETS_WEBHOOK_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:{nomination:"Nominations",speaker:"Speakers",people_application:"People Applications",sponsor:"Sponsors"}[n]||n,row:(t=n,a=r,o=new Date().toISOString(),"nomination"===t?[o,a.agentName,a.agentUrl||"",a.builderName,a.email,a.description,a.demoPersonName||"",a.demoPersonEmail||"",a.demoPersonPhone||"",a.categories?.join(", ")||"",a.customCategories?.join(", ")||""]:"speaker"===t?[o,a.name,a.email,a.twitter||"",a.company||"",a.topic,a.format,a.bio]:"people_application"===t?[o,a.role||"",a.name||"",a.email||"",(a.availability||[]).join(", "),a.canConfirmAvailability?"Confirmed":"Unconfirmed",a.questionOne||"",a.questionTwo||"",a.timezone||""]:"sponsor"===t?[o,a.firstName,a.lastName,a.email,a.company,"yes"===a.previousSponsor?"Yes":"No",a.telegram||"",a.donationAmount||"",a.plans]:[])})}).catch(e=>console.error("[GOOGLE SHEETS SYNC] Failed:",e)),f.NextResponse.json({ok:!0})}catch{return f.NextResponse.json({error:"Failed"},{status:500})}}e.s(["POST",()=>v],82288);var x=e.i(82288);let A=new t.AppRouteRouteModule({definition:{kind:a.RouteKind.APP_ROUTE,page:"/api/notify/route",pathname:"/api/notify",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/nebius-site/src/app/api/notify/route.ts",nextConfigOutput:"",userland:x}),{workAsyncStorage:R,workUnitAsyncStorage:N,serverHooks:E}=A;function C(){return(0,o.patchFetch)({workAsyncStorage:R,workUnitAsyncStorage:N})}async function $(e,t,o){A.isDev&&(0,n.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let f="/api/notify/route";f=f.replace(/\/index$/,"")||"/";let w=await A.prepare(e,t,{srcPage:f,multiZoneDraftMode:!1});if(!w)return t.statusCode=400,t.end("Bad Request"),null==o.waitUntil||o.waitUntil.call(o,Promise.resolve()),null;let{buildId:v,params:x,nextConfig:R,parsedUrl:N,isDraftMode:E,prerenderManifest:C,routerServerContext:$,isOnDemandRevalidate:S,revalidateOnlyGenerated:k,resolvedPathname:P,clientReferenceManifest:T,serverActionsManifest:O}=w,H=(0,s.normalizeAppPath)(f),I=!!(C.dynamicRoutes[H]||C.routes[P]),_=async()=>((null==$?void 0:$.render404)?await $.render404(e,t,N,!1):t.end("This page could not be found"),null);if(I&&!E){let e=!!C.routes[P],t=C.dynamicRoutes[H];if(t&&!1===t.fallback&&!e){if(R.experimental.adapterPath)return await _();throw new y.NoFallbackError}}let D=null;!I||A.isDev||E||(D="/index"===(D=P)?"/":D);let U=!0===A.isDev||!I,j=I&&!U;O&&T&&(0,i.setManifestsSingleton)({page:f,clientReferenceManifest:T,serverActionsManifest:O});let q=e.method||"GET",L=(0,r.getTracer)(),M=L.getActiveScopeSpan(),F={params:x,prerenderManifest:C,renderOpts:{experimental:{authInterrupts:!!R.experimental.authInterrupts},cacheComponents:!!R.cacheComponents,supportsDynamicResponse:U,incrementalCache:(0,n.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:R.cacheLife,waitUntil:o.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,o,n)=>A.onRequestError(e,t,o,n,$)},sharedContext:{buildId:v}},G=new l.NodeNextRequest(e),K=new l.NodeNextResponse(t),z=p.NextRequestAdapter.fromNodeNextRequest(G,(0,p.signalFromNodeResponse)(t));try{let i=async e=>A.handle(z,F).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=L.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==d.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let o=a.get("next.route");if(o){let t=`${q} ${o}`;e.setAttributes({"next.route":o,"http.route":o,"next.span_name":t}),e.updateName(t)}else e.updateName(`${q} ${f}`)}),s=!!(0,n.getRequestMeta)(e,"minimalMode"),l=async n=>{var r,l;let p=async({previousCacheEntry:a})=>{try{if(!s&&S&&k&&!a)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let r=await i(n);e.fetchMetrics=F.renderOpts.fetchMetrics;let l=F.renderOpts.pendingWaitUntil;l&&o.waitUntil&&(o.waitUntil(l),l=void 0);let p=F.renderOpts.collectedTags;if(!I)return await (0,u.sendResponse)(G,K,r,F.renderOpts.pendingWaitUntil),null;{let e=await r.blob(),t=(0,g.toNodeOutgoingHttpHeaders)(r.headers);p&&(t[h.NEXT_CACHE_TAGS_HEADER]=p),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==F.renderOpts.collectedRevalidate&&!(F.renderOpts.collectedRevalidate>=h.INFINITE_CACHE)&&F.renderOpts.collectedRevalidate,o=void 0===F.renderOpts.collectedExpire||F.renderOpts.collectedExpire>=h.INFINITE_CACHE?void 0:F.renderOpts.collectedExpire;return{value:{kind:b.CachedRouteKind.APP_ROUTE,status:r.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:o}}}}catch(t){throw(null==a?void 0:a.isStale)&&await A.onRequestError(e,t,{routerKind:"App Router",routePath:f,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:j,isOnDemandRevalidate:S})},!1,$),t}},d=await A.handleResponse({req:e,nextConfig:R,cacheKey:D,routeKind:a.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:C,isRoutePPREnabled:!1,isOnDemandRevalidate:S,revalidateOnlyGenerated:k,responseGenerator:p,waitUntil:o.waitUntil,isMinimalMode:s});if(!I)return null;if((null==d||null==(r=d.value)?void 0:r.kind)!==b.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(l=d.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});s||t.setHeader("x-nextjs-cache",S?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),E&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let y=(0,g.fromNodeOutgoingHttpHeaders)(d.value.headers);return s&&I||y.delete(h.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||t.getHeader("Cache-Control")||y.get("Cache-Control")||y.set("Cache-Control",(0,m.getCacheControlHeader)(d.cacheControl)),await (0,u.sendResponse)(G,K,new Response(d.value.body,{headers:y,status:d.value.status||200})),null};M?await l(M):await L.withPropagatedContext(e.headers,()=>L.trace(d.BaseServerSpan.handleRequest,{spanName:`${q} ${f}`,kind:r.SpanKind.SERVER,attributes:{"http.method":q,"http.target":e.url}},l))}catch(t){if(t instanceof y.NoFallbackError||await A.onRequestError(e,t,{routerKind:"App Router",routePath:H,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:j,isOnDemandRevalidate:S})},!1,$),I)throw t;return await (0,u.sendResponse)(G,K,new Response(null,{status:500})),null}}e.s(["handler",()=>$,"patchFetch",()=>C,"routeModule",()=>A,"serverHooks",()=>E,"workAsyncStorage",()=>R,"workUnitAsyncStorage",()=>N],63109)}];

//# sourceMappingURL=597f9_next_dist_esm_build_templates_app-route_09e135d0.js.map