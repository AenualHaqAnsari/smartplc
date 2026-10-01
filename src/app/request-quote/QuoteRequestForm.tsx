"use client";
import {useState} from "react";
export default function QuoteRequestForm({service,type}:{service:string;type:string}){
 const [state,setState]=useState<"idle"|"sending"|"sent"|"error">("idle");const [error,setError]=useState("");
 async function submit(e:React.FormEvent<HTMLFormElement>){
  e.preventDefault();
  const formElement=e.currentTarget;
  setState("sending");
  setError("");
  const payload=Object.fromEntries(new FormData(formElement).entries());

  try{
   const response=await fetch("/api/quotes",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify(payload),
   });
   const responseText=await response.text();
   let data:{error?:string}|undefined;

   if(responseText.trim()){
    try{
     data=JSON.parse(responseText) as {error?:string};
    }catch{
     // A proxy or server error page may not be JSON. Handle it below by status.
    }
   }

   if(!response.ok){
    throw new Error(data?.error||`Unable to submit your enquiry (HTTP ${response.status}). Please try again.`);
   }

   formElement.reset();
   setState("sent");
  }catch(err){
   setError(err instanceof Error?err.message:"Unable to submit your enquiry. Please try again.");
   setState("error");
  }
 }
 const field="mt-1 w-full border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-600";
 return <form onSubmit={submit} className="grid gap-5 border border-slate-200 bg-white p-6 sm:grid-cols-2 sm:p-8"><label className="text-sm font-medium">Name *<input name="name" required maxLength={120} autoComplete="name" className={field}/></label><label className="text-sm font-medium">Company<input name="company" maxLength={160} autoComplete="organization" className={field}/></label><label className="text-sm font-medium">Email *<input name="email" type="email" required maxLength={254} autoComplete="email" className={field}/></label><label className="text-sm font-medium">Phone<input name="phone" type="tel" maxLength={40} autoComplete="tel" className={field}/></label><label className="text-sm font-medium sm:col-span-2">Product or service<input name="productService" defaultValue={service} placeholder="Part number, equipment type or service" maxLength={200} className={field}/></label><label className="text-sm font-medium">Quantity<input name="quantity" type="number" min="1" max="100000" className={field}/></label><label className="text-sm font-medium">Requirement<select name="requirement" defaultValue={type==="service"?"Service":"Product"} className={field}><option>Product</option><option>Service</option><option>Product and service</option></select></label><label className="text-sm font-medium sm:col-span-2">Message *<textarea name="message" required minLength={10} maxLength={4000} rows={6} placeholder="Describe the application, existing equipment, required specifications and target timeline." className={field}/></label><div className="sm:col-span-2">{state==="sent"&&<p role="status" className="mb-3 text-sm font-medium text-green-700">Enquiry received. We’ll follow up using the contact details provided.</p>}{error&&<p role="alert" className="mb-3 text-sm text-red-700">{error}</p>}<button disabled={state==="sending"} className="bg-sky-600 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-60">{state==="sending"?"Sending…":"Submit Quote Request"}</button><p className="mt-3 text-xs leading-5 text-slate-500">Please do not include passwords or other sensitive account information.</p></div></form>
}

