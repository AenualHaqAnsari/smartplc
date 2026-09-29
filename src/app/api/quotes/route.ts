import {sendQuoteRequestEmail} from "@/lib/email";
export async function POST(request:Request){
 try{
  const body=await request.json();
  const clean=(v:unknown,max:number)=>typeof v==="string"?v.trim().slice(0,max):"";
  const name=clean(body.name,120),company=clean(body.company,160),email=clean(body.email,254),phone=clean(body.phone,40),productService=clean(body.productService,200),requirement=clean(body.requirement,40),message=clean(body.message,4000);
  const q=Number(body.quantity);
  const quantity=Number.isInteger(q)&&q>0&&q<=100000?q:undefined;
  if(!name||!/^\S+@\S+\.\S+$/.test(email)||message.length<10) return Response.json({error:"Enter your name, a valid email address and a message of at least 10 characters."},{status:400});
  await sendQuoteRequestEmail({name,company,email,phone,productService,requirement,quantity,message});
  return Response.json({success:true});
 }catch(error){
  console.error("POST /api/quotes error:",error);
  return Response.json({error:error instanceof Error&&error.message==="Quote email configuration is incomplete."?error.message:"Unable to submit your enquiry right now. Please try again later."},{status:error instanceof Error&&error.message==="Quote email configuration is incomplete."?503:500});
 }
}

