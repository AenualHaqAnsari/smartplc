import type { Metadata } from "next";

export type AiService = {
  slug: string;
  name: string;
  shortName: string;
  keyword: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  benefit: string;
  challenge: string;
  approach: string;
  capabilities: string[];
  outcomes: string[];
  process: [string, string][];
  faqs: [string, string][];
  quoteLabel: string;
  accent: string;
  visual: string;
};

export const aiServices: AiService[] = [
  {
    slug: "school-ai-agents", name: "School AI Agents", shortName: "Schools", keyword: "AI agents for schools",
    title: "AI Agents for Schools | School Administration Automation | SmartPLC",
    description: "Explore AI agents for schools that can answer routine admissions and parent enquiries, share approved information and route requests to staff.",
    h1: "AI Agents for Schools and Education Teams",
    intro: "Help families find clear answers to routine school questions while giving staff a more organised way to handle enquiries. SmartPLC Solutions designs school AI agents around your approved information, communication channels and escalation process.",
    benefit: "Make routine school information easier for families to access and simpler for staff to maintain.",
    challenge: "Admissions dates, fee procedures, transport questions and school policies often arrive across several channels. Staff may spend time repeating answers or forwarding requests to the right department.",
    approach: "A school AI agent can respond using information the school has approved, collect the context needed to route an enquiry and hand sensitive or unclear matters to a staff member. The system is scoped with the school, rather than treated as a source of unofficial policy.",
    capabilities: ["Answer common admissions and enrolment questions from approved content", "Share school hours, contact details, term information and published procedures", "Collect a parent or prospective family’s question and preferred follow-up method", "Route complex, personal or safeguarding-related concerns to designated staff", "Support a website chat experience, with other channels assessed separately"],
    outcomes: ["Consistent answers drawn from school-approved material", "A clearer route for families to reach admissions or administration teams", "Less repeated information gathering for common questions", "A human review path for matters that need judgement or confidentiality"],
    process: [["Map the enquiry journey", "Identify the questions families ask, who owns each answer and when a conversation must go to a staff member."], ["Prepare trusted information", "Select and review the school content the agent may use, including who maintains it and how changes are handled."], ["Configure and test", "Set response boundaries, escalation routes and the chosen channel, then review representative questions with staff."], ["Launch with oversight", "Agree access, monitoring and update responsibilities before making the agent available to families." ]],
    faqs: [["What can a school AI agent help with?", "It can answer routine questions from school-approved information, gather enquiry details and direct families to the relevant team. The school defines the topics and boundaries."], ["Can it handle admissions enquiries?", "It can share published admissions information and collect a request for follow-up. Application decisions and commitments remain with authorised school staff."], ["Can the agent access student records?", "No access is assumed. Any connection to school systems requires separate technical, privacy and access review, with the school’s approval."], ["Can families use it on WhatsApp?", "A WhatsApp channel can be assessed through an eligible WhatsApp Business integration, authorized account and applicable platform requirements."], ["How are sensitive concerns handled?", "The agent should avoid making judgements on sensitive matters and direct them promptly to the school’s designated staff or existing safeguarding process."], ["What do you need to scope a project?", "Share the school’s common enquiries, existing approved information, intended channel, staff escalation contacts and any privacy or IT requirements."]],
    quoteLabel: "School AI Agent", accent: "from-blue-700 to-cyan-500", visual: "school",
  },
  {
    slug: "restaurant-ai-agents", name: "Restaurant AI Agents", shortName: "Restaurants", keyword: "AI agents for restaurants",
    title: "Restaurant AI Agents for Enquiries and Guest Service | SmartPLC",
    description: "Use a restaurant AI agent to answer menu and opening-hour questions, capture dining enquiries and route requests to your team.",
    h1: "AI Agents for Restaurants and Food Businesses",
    intro: "Give guests a convenient way to ask about menus, opening hours, dietary information and dining options. A restaurant AI agent from SmartPLC Solutions can use your approved details and pass requests to the team when a person needs to confirm them.",
    benefit: "Help guests get useful information quickly and give your team structured enquiries to follow up.",
    challenge: "Restaurants receive repeat questions about menus, hours, group dining, takeaway and special requests while teams are focused on service. Incomplete enquiries can also make timely follow-up harder.",
    approach: "We shape an agent around your published menu and service information, then define which requests it can answer and which need staff confirmation. Booking or ordering actions depend on a suitable system integration and are not assumed to exist.",
    capabilities: ["Answer questions about published menus, opening times and location", "Share approved dietary and allergen information with clear limits", "Collect group dining, catering or event enquiries", "Capture a callback request or direct guests to your existing contact route", "Escalate special requests, uncertain information and complaints to staff"],
    outcomes: ["More accessible answers to common guest questions", "Better structured event and group dining enquiries", "A consistent place to maintain customer-facing information", "Staff remain responsible for confirmations and exceptions"],
    process: [["Review guest questions", "List common enquiries, menu sources, operational hours and requests that require staff judgement."], ["Set information boundaries", "Confirm the approved menu and allergen wording, and decide how uncertainty or out-of-date information is handled."], ["Choose the channel", "Assess website chat or a supported WhatsApp Business setup according to account access and the intended guest journey."], ["Test and maintain", "Run practical guest scenarios, confirm escalation ownership and set a schedule for menu and hours updates."]],
    faqs: [["Can the AI take table reservations?", "It can collect a reservation request. Confirmed bookings require an available reservation system integration and configuration; live availability is not assumed."], ["Can it answer allergen questions?", "It can present information approved by the restaurant, but should not guess or replace staff confirmation when a guest has an allergy or a question is unclear."], ["Can the agent take food orders?", "Order capture or placement depends on the ordering platform, supported integrations and the permissions you provide. The scope is confirmed before implementation."], ["Can it answer questions after closing?", "A website agent can be configured to share approved information outside service hours, subject to the selected platform and hosting setup."], ["Does it work with WhatsApp?", "WhatsApp use requires a supported WhatsApp Business integration, an authorized business account and compliance with relevant platform policies."], ["How do we keep menus current?", "The project defines the approved source, update owner and review process so that menu, hours and service information can be maintained."]],
    quoteLabel: "Restaurant AI Agent", accent: "from-orange-600 to-amber-400", visual: "restaurant",
  },
  {
    slug: "whatsapp-ai-agents", name: "WhatsApp AI Agents", shortName: "WhatsApp", keyword: "WhatsApp AI agents for business",
    title: "WhatsApp AI Agents for Business | SmartPLC Solutions",
    description: "Plan a WhatsApp AI agent for customer questions, lead capture and routine support using a supported WhatsApp Business integration.",
    h1: "WhatsApp AI Agents for Business Conversations",
    intro: "Turn routine business conversations into a clearer, more manageable customer journey. SmartPLC Solutions can scope a WhatsApp AI agent to answer approved questions, collect enquiry details and route conversations to your team through a supported business setup.",
    benefit: "Organise common customer conversations in a channel your business is authorized to use.",
    challenge: "Customer messages can arrive at any time and include a mix of simple questions, sales enquiries and requests that need a person. Without agreed response boundaries, routing and account setup, automation may create confusion.",
    approach: "We define the use case, information sources, escalation rules and account requirements first. WhatsApp automation is implemented only through an appropriate supported WhatsApp Business integration with the necessary permissions and platform configuration.",
    capabilities: ["Respond to approved frequently asked questions", "Collect enquiry details and identify the reason for contact", "Route conversations to the appropriate team or human operator", "Provide guided information and links to relevant business pages", "Assess approved workflow connections where APIs, access and configuration are available"],
    outcomes: ["A more consistent first response for routine questions", "Structured context for staff handling a handover", "Clearer ownership of unanswered or sensitive conversations", "An integration scope based on platform access and actual business needs"],
    process: [["Define the messaging use case", "Agree which customer journeys belong in WhatsApp and which should continue through another channel."], ["Verify account readiness", "Review WhatsApp Business account ownership, provider options, permissions, templates and policy requirements."], ["Design conversation controls", "Approve the knowledge sources, handoff rules, response limits and any workflow connections."], ["Pilot and monitor", "Test message flows and error cases with the business, then agree how responses and account configuration are maintained."]],
    faqs: [["Does this work with a regular WhatsApp account?", "Business automation should use an appropriate supported WhatsApp Business integration. Account eligibility, provider setup and platform rules must be checked."], ["Can the agent send messages first?", "Outbound messaging depends on the applicable WhatsApp Business rules, customer permissions, approved templates where required and provider configuration."], ["Can it transfer a chat to staff?", "A human handoff can be included when the selected integration and operating process support it. The destination and ownership need to be defined."], ["Can it connect to a CRM or order system?", "That depends on available APIs, credentials, data permissions and technical suitability. No external connection is presumed until reviewed."], ["Will it answer every customer question automatically?", "The agent should answer within approved boundaries and route unclear, sensitive or unsupported requests to a person."], ["What is needed to start?", "Describe the customer journeys, business account setup, information sources, staff handoff process and any systems you want assessed."]],
    quoteLabel: "WhatsApp AI Agent", accent: "from-emerald-700 to-green-400", visual: "whatsapp",
  },
  {
    slug: "ai-voice-assistants", name: "AI Voice Assistants", shortName: "Voice Assistants", keyword: "AI voice assistants for business",
    title: "AI Voice Assistants for Business Calls | SmartPLC Solutions",
    description: "Explore AI voice assistants for routine business calls, enquiry capture and call routing with compatible telephony and voice AI services.",
    h1: "AI Voice Assistants for Business Calls",
    intro: "A voice assistant can help callers reach the right information or team through a carefully scoped phone experience. SmartPLC Solutions assesses call flows, approved responses and handoff needs alongside compatible telephony and voice AI services.",
    benefit: "Give callers a consistent first point of contact for routine enquiries and routing.",
    challenge: "Missed calls, repeat questions and unclear routing can make it harder for customers to reach the right person. A phone agent also needs to handle interruptions, uncertainty and escalation safely.",
    approach: "We map the caller journey and define what the assistant may say or do. Live calling requires compatible telephony, voice AI services, account authorization and suitable configuration; availability and integrations are verified during discovery.",
    capabilities: ["Provide approved business information and opening hours", "Identify the caller’s reason for contacting the business", "Route or request a callback according to an agreed process", "Capture structured enquiry details where the telephony setup allows", "Escalate unclear, urgent or sensitive calls to staff"],
    outcomes: ["A consistent greeting and call flow", "Clearer call routing and callback context", "Defined fallback behavior when speech is unclear or a service is unavailable", "Human ownership for decisions and exceptional situations"],
    process: [["Map the call flow", "Identify caller intents, business hours, routing destinations and situations where the assistant must stop or transfer."], ["Check telephony fit", "Review phone number ownership, provider capabilities, regions, recording needs and compatible voice AI options."], ["Build and test dialogue", "Prepare approved prompts and responses, then test accents, noisy environments, interruptions and fallback handling."], ["Agree operating controls", "Set monitoring, escalation ownership and update procedures before activating a live calling configuration."]],
    faqs: [["Can an AI voice assistant answer our phone number?", "Live calls require compatible telephony and voice AI services, authorized accounts and configuration. Compatibility must be confirmed for your setup."], ["Can it transfer callers to a person?", "Call transfer or callback routing can be scoped where the selected telephony service supports it and the business defines the destination and operating rules."], ["Can it book appointments?", "Appointment confirmation requires a compatible scheduling integration with authorized access. Without that, the assistant can capture a request for staff follow-up."], ["Can it handle multiple languages?", "Supported languages and voice quality depend on the selected voice services. Required languages should be tested during solution design."], ["Are calls recorded?", "Recording is an implementation and policy decision subject to applicable consent, privacy and telecom requirements. Recording is not assumed by default."], ["What happens when it does not understand?", "A well-scoped flow should ask for clarification within limits or route the caller to a person or agreed fallback channel."]],
    quoteLabel: "AI Voice Assistant", accent: "from-violet-700 to-fuchsia-400", visual: "voice",
  },
  {
    slug: "hotel-ai-agents", name: "Hotel AI Agents", shortName: "Hotels", keyword: "AI agents for hotels",
    title: "AI Agents for Hotels and Guest Services | SmartPLC",
    description: "Plan a hotel AI agent for guest FAQs, property information and enquiry routing, with booking and availability integrations assessed separately.",
    h1: "AI Agents for Hotels and Hospitality Teams",
    intro: "Help guests find property information and direct questions to the right team. A hotel AI agent can share approved details about amenities, location, check-in guidance and services while routing booking or stay-specific requests for staff confirmation.",
    benefit: "Make approved guest information easier to access before and during a stay.",
    challenge: "Guests may ask about amenities, directions, check-in, dining or room options through different channels. Requests involving a particular reservation or real-time availability need access to the hotel’s operational systems.",
    approach: "We scope a guest information agent using content the property approves and identify the handoff path for booking, availability and in-stay issues. A property management system, booking engine or other connection requires a separate integration assessment and authorized access.",
    capabilities: ["Answer property FAQs using approved hotel information", "Share directions, published amenities and check-in guidance", "Capture booking, event or group-stay enquiries for follow-up", "Route in-stay service requests to the appropriate team", "Assess PMS or booking connections where compatible interfaces and access are available"],
    outcomes: ["A consistent source for routine guest questions", "More structured booking and group enquiry details", "An explicit route for urgent or stay-specific requests", "Clear separation between general information and live reservation data"],
    process: [["Understand the guest journey", "Map pre-arrival, on-property and post-stay questions, including who is responsible for responding."], ["Approve guest information", "Select current property details and define how changes to facilities, policies and hours are maintained."], ["Assess operational systems", "Review booking, PMS or service-desk interfaces only where the property wants a connection and can authorize access."], ["Test guest scenarios", "Check routine questions, booking requests, urgent issues, handoff paths and behavior when live data is unavailable."]],
    faqs: [["Can it check live room availability?", "Live availability requires a compatible property management system or booking integration, authorized access and configuration. It is not included by default."], ["Can it confirm a reservation?", "Reservation confirmation requires a working connection to the hotel’s booking system and an agreed transaction flow. Otherwise the agent should collect an enquiry for staff."], ["Can it answer questions about hotel facilities?", "Yes, it can share information supplied and approved by the property, such as published amenities, directions and check-in guidance."], ["Can guests report an issue during their stay?", "The agent can collect and route a service request if the hotel defines a staffed handoff or connected service workflow. Urgent matters should have a clear immediate route."], ["Which channels can a hotel use?", "Website chat can be assessed directly. Messaging or voice channels depend on supported providers, authorized accounts and the hotel’s operational preferences."], ["Can it connect to our PMS?", "A PMS connection needs technical discovery, a supported interface, property authorization and a defined data and security scope."]],
    quoteLabel: "Hotel AI Agent", accent: "from-sky-800 to-teal-400", visual: "hotel",
  },
  {
    slug: "clinic-ai-agents", name: "Clinic AI Agents", shortName: "Clinics", keyword: "AI agents for clinics",
    title: "Administrative AI Agents for Clinics | SmartPLC Solutions",
    description: "Explore clinic AI agents for administrative FAQs and enquiry routing, with privacy safeguards and no autonomous diagnosis or treatment.",
    h1: "Administrative AI Agents for Clinics",
    intro: "Support clinic administration with a carefully bounded agent for routine questions, contact details and enquiry routing. SmartPLC Solutions keeps the focus on administrative assistance: the agent is not designed to diagnose, recommend treatment or replace clinical judgement.",
    benefit: "Help patients find approved administrative information while keeping clinical decisions with qualified professionals.",
    challenge: "Patients often need clear directions on clinic hours, services, preparation instructions and how to contact the right team. These conversations can also involve sensitive data and questions that must go directly to a qualified person.",
    approach: "We define administrative-only topics, approved content and a clear route to clinic staff. Any handling of patient information or connection to clinical systems requires separate privacy, security, regulatory and technical review, appropriate safeguards and clinic authorization.",
    capabilities: ["Share approved clinic hours, location and administrative contact information", "Direct patients to published service information and clinic-approved instructions", "Collect limited administrative enquiries where the clinic approves the fields and channel", "Route symptoms, urgent concerns and clinical questions to qualified staff or existing emergency guidance", "Assess scheduling or record-system connections only after privacy, security and access review"],
    outcomes: ["Clear administrative answers from clinic-approved content", "A defined boundary between administration and clinical care", "Reduced collection of unnecessary patient details", "Human routing for clinical, urgent or uncertain matters"],
    process: [["Set a strict administrative scope", "Agree permitted topics, prohibited clinical advice, urgent routing language and staff ownership."], ["Review privacy and data handling", "Identify data minimization, retention, access control, hosting and applicable healthcare or privacy requirements with the clinic."], ["Approve content and channel", "Use current clinic-approved information and assess the chosen channel for suitability and authorization."], ["Validate and oversee", "Test clinical-boundary scenarios, escalation and data handling with clinic representatives before release and during ongoing review."]],
    faqs: [["Can the agent diagnose symptoms or recommend treatment?", "No. This service is scoped for administrative support and should not diagnose, triage clinically or recommend treatment. Clinical questions must go to qualified healthcare staff."], ["Can it book appointments?", "Appointment booking requires a compatible scheduling system, authorized access and a reviewed privacy and security design. Otherwise it can direct patients to the clinic’s existing booking route."], ["Will it handle patient records?", "No record access is presumed. Any connection to patient or clinical systems requires explicit clinic authorization and a separate security, privacy, regulatory and technical assessment."], ["What if a patient describes an urgent problem?", "The agent should not assess the condition. The clinic must approve clear instructions that direct the person to the appropriate clinical or emergency contact route."], ["How is sensitive information protected?", "The design should minimize collected information and define access, retention, security and vendor controls. Applicable privacy and healthcare requirements need review for the clinic and region."], ["Can it answer questions about preparation or medication?", "Only clinic-approved administrative instructions may be shared, and the agent should route uncertainty or individualized medical questions to qualified clinic staff."]],
    quoteLabel: "Clinic AI Agent", accent: "from-teal-800 to-emerald-400", visual: "clinic",
  },
  {
    slug: "custom-business-ai-agents", name: "Custom Business AI Agents", shortName: "Custom Business", keyword: "custom AI agents for business",
    title: "Custom Business AI Agents and Workflow Automation | SmartPLC",
    description: "Design a custom business AI agent around approved information, practical workflow requirements, controlled integrations and human oversight.",
    h1: "Custom AI Agents for Business Workflows",
    intro: "Every business has its own information, systems and approval steps. SmartPLC Solutions scopes custom AI agents around a specific business workflow, with controlled information access, tested actions and human oversight suited to the task.",
    benefit: "Automate a well-defined workflow while keeping access, approvals and exceptions visible.",
    challenge: "Generic automation may not match how a team actually works. Useful systems need clear inputs, reliable sources, defined permissions and a safe way to handle missing information or actions that require judgement.",
    approach: "We begin with the task and its boundaries, then assess suitable models, data sources and interfaces. External integrations require available APIs or other supported access, credentials, authorization and configuration; sensitive actions can include human approval steps.",
    capabilities: ["Internal knowledge assistants grounded in approved business documents", "Lead and enquiry intake with structured routing", "Document and information workflows with review steps", "Task-specific agents that use controlled tools and permissions", "Workflow automation opportunities assessed against current systems and APIs"],
    outcomes: ["A use case and success criteria agreed before implementation", "Access limited to the information and tools needed for the task", "Fallbacks and review steps for uncertain or consequential actions", "A maintainable workflow with ownership for content and integration changes"],
    process: [["Choose a specific task", "Document users, inputs, current steps, pain points, exceptions and what a useful outcome means."], ["Assess data and integrations", "Review source quality, interfaces, authorization, privacy and security constraints before promising connectivity."], ["Design controls and human review", "Set permissions, tool boundaries, verification, logging and approval needs according to the consequences of an action."], ["Prototype and validate", "Test representative cases and failure scenarios with users, then plan rollout, monitoring and maintenance responsibilities."]],
    faqs: [["What kinds of tasks can a custom agent support?", "Potential uses include approved knowledge search, enquiry handling, document workflows and controlled task routing. Suitability depends on the data, workflow and risk of each action."], ["Can it connect to our existing software?", "Possibly, if a supported interface is available and your organization can authorize access. Each integration needs technical and security review."], ["Can it take actions without approval?", "That depends on the task’s risk and controls. Sensitive, financial or consequential actions may need verification, limits or human approval."], ["Will it always give correct answers?", "No AI system is error-free. The design should use approved sources, test representative queries, communicate uncertainty and provide a route to human review."], ["How do you protect business information?", "The project should define data access, retention, credentials, hosting and vendor controls. Requirements vary by system and information type and are reviewed before implementation."], ["What should we include in an enquiry?", "Describe the workflow, users, current systems, information sources, exceptions and desired result. Do not send passwords or sensitive customer data in an initial enquiry."]],
    quoteLabel: "Custom Business AI Agent", accent: "from-indigo-800 to-blue-400", visual: "custom",
  },
];

export const aiServiceBySlug = new Map(aiServices.map((service) => [service.slug, service]));
export const aiHubPath = "/ai-automation-solutions";
export const siteOrigin = "https://smartplcsolutions.com";

export function aiMetadata(service: AiService): Metadata {
  const url = `${siteOrigin}/${service.slug}`;
  return {
    title: { absolute: service.title },
    description: service.description,
    keywords: [service.keyword, service.name.toLowerCase(), "business AI automation", "SmartPLC Solutions"],
    alternates: { canonical: url },
    openGraph: { type: "website", siteName: "SmartPLC Solutions", title: service.title, description: service.description, url, images: [{ url: "/og-smart-plc.png", width: 1200, height: 630, alt: `${service.name} | SmartPLC Solutions` }] },
    twitter: { card: "summary_large_image", title: service.title, description: service.description, images: ["/og-smart-plc.png"] },
  };
}

export const aiHubMetadata: Metadata = {
  title: { absolute: "AI Automation Solutions for Businesses | SmartPLC Solutions" },
  description: "Explore AI automation solutions for schools, restaurants, hotels, clinics and businesses. Custom AI agents, WhatsApp automation and voice assistants by SmartPLC Solutions.",
  keywords: ["AI automation solutions", "AI agents for businesses", "WhatsApp AI agents", "AI voice assistants", "business workflow automation"],
  alternates: { canonical: `${siteOrigin}${aiHubPath}` },
  openGraph: { type: "website", siteName: "SmartPLC Solutions", title: "AI Automation Solutions for Businesses | SmartPLC Solutions", description: "Explore AI automation solutions for schools, restaurants, hotels, clinics and businesses. Custom AI agents, WhatsApp automation and voice assistants by SmartPLC Solutions.", url: `${siteOrigin}${aiHubPath}`, images: [{ url: "/og-smart-plc.png", width: 1200, height: 630, alt: "AI Automation Solutions | SmartPLC Solutions" }] },
  twitter: { card: "summary_large_image", title: "AI Automation Solutions for Businesses | SmartPLC Solutions", description: "Explore AI automation solutions for businesses from SmartPLC Solutions.", images: ["/og-smart-plc.png"] },
};
