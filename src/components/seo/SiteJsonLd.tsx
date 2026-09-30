type SiteJsonLdProps={siteUrl?:string};
export default function SiteJsonLd({siteUrl}:SiteJsonLdProps){
 const normalizedUrl=siteUrl?.replace(/\/$/,"");
 const organization={"@context":"https://schema.org","@type":"Organization",name:"Smart PLC Solutions",description:"Industrial automation products and engineering services for PLC, HMI, SCADA, drives, sensors, industrial communication and control panels.",...(normalizedUrl?{url:normalizedUrl}:{})};
 const website={"@context":"https://schema.org","@type":"WebSite",name:"Smart PLC Solutions",description:"Industrial controls products and automation engineering services.",...(normalizedUrl?{url:normalizedUrl}:{})};
 return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify([organization,website]).replace(/</g,"\\u003c")}}/>;
}

