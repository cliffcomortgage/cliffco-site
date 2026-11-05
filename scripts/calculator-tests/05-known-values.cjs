/* Verify the maths of the blog archetypes that changed, against independently known values. */
const fs=require("fs"),path=require("path"),http=require("http");
const PUP=require("path").join(__dirname, "../../website/node_modules/puppeteer-core");
const puppeteer=require(PUP);
const ROOT=path.join(__dirname, "../../website/dist/client");
const T={".html":"text/html",".css":"text/css",".js":"text/javascript",".svg":"image/svg+xml",".png":"image/png",".jpg":"image/jpeg",".webp":"image/webp",".avif":"image/avif",".ico":"image/x-icon"};
const srv=http.createServer((q,r)=>{let f=path.join(ROOT,decodeURIComponent(q.url.split("?")[0]));if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,"index.html");if(!fs.existsSync(f)){r.writeHead(404);return r.end();}r.writeHead(200,{"Content-Type":T[path.extname(f).toLowerCase()]||"application/octet-stream"});fs.createReadStream(f).pipe(r);});
let FAIL=0;
const chk=(l,g,w)=>{const ok=typeof w==="function"?w(g):g===w;if(!ok)FAIL++;console.log(`   ${ok?"PASS":"FAIL"}  ${l}: ${g}`);};
(async()=>{
 await new Promise(x=>srv.listen(0,"127.0.0.1",x));
 const base=`http://127.0.0.1:${srv.address().port}`;
 const b=await puppeteer.launch({executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe",headless:"new",args:["--no-sandbox","--disable-gpu"]});
 const p=await b.newPage();
 const run=async(slug,ins,outs)=>{await p.goto(`${base}/mortgage-guides/blog/${slug}/`,{waitUntil:"networkidle0"});
  await p.evaluate(o=>{for(const[k,v]of Object.entries(o)){const e=document.getElementById(k);if(e){e.value=String(v);e.dispatchEvent(new Event("input",{bubbles:true}));e.dispatchEvent(new Event("change",{bubbles:true}));}}
   const btn=[...document.querySelectorAll("button")].find(x=>/calculate|compare|check|estimate|see |run /i.test(x.textContent||""));if(btn)btn.click();},ins);
  return p.evaluate(o=>Object.fromEntries(o.map(i=>[i,(document.getElementById(i)||{}).textContent?.trim()??"(missing)"])),outs);};

 console.log("\n── REVERSE (now HUD's table; was the invented 46% at 68)");
 let r=await run("how-does-a-reverse-mortgage-work",{"art-rm-age":68,"art-rm-value":600000,"art-rm-bal":0},["art-rm-gross","art-rm-net","art-rm-note"]);
 chk("gross at age 68, $600k (HUD 35.7% x 600k)",r["art-rm-gross"],"$214,200");
 chk("  invented formula would have given",r["art-rm-gross"],v=>v!=="$276,000");
 chk("  note states the factor",r["art-rm-note"],v=>v.includes("35.7%"));
 r=await run("how-does-a-reverse-mortgage-work",{"art-rm-age":55,"art-rm-value":600000,"art-rm-bal":0},["art-rm-gross","art-rm-note"]);
 chk("under 62 gives no estimate",r["art-rm-gross"],"$0");
 chk("  and says why",r["art-rm-note"],v=>v.includes("at least 62"));

 console.log("\n── VA FUNDING FEE (was the pre-2023 schedule)");
 r=await run("how-does-a-va-loan-work",{"art-va-price":500000,"art-va-down":0,"art-va-use":"first"},["art-va-fee"]);
 chk("first use, 0% down = 2.15% of 500k",r["art-va-fee"],"$10,750");
 r=await run("how-does-a-va-loan-work",{"art-va-price":500000,"art-va-down":0,"art-va-use":"subsequent"},["art-va-fee"]);
 chk("subsequent, 0% down = 3.3% of 500k",r["art-va-fee"],"$16,500");
 r=await run("how-does-a-va-loan-work",{"art-va-price":500000,"art-va-down":10,"art-va-use":"first"},["art-va-fee"]);
 chk("first use, 10% down = 1.25% of 450k",r["art-va-fee"],"$5,625");

 console.log("\n── RENT VS BUY (was breaking even in Year 1)");
 r=await run("waiting-to-buy-home-first-time-homebuyer",{},["art-rvb-be"]);
 chk("no longer Year 1",r["art-rvb-be"],v=>v!=="Year 1"&&v!=="");

 console.log("\n── PAYMENT ESTIMATOR (zero-rate fallthrough)");
 r=await run("cash-reserves-investment-property-loan",{"art-pe-rate":0},["art-pe-pi"]);
 chk("blank rate prints no principal-only payment",r["art-pe-pi"],"$0");

 console.log("\n"+"=".repeat(60));
 console.log(FAIL===0?"ALL BLOG MATHS CHECKS PASSED":FAIL+" FAILED");
 await b.close();srv.close();
})();
