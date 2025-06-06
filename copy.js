const express = require("express");
const cron = require("node-cron");
const hubspot = require("@hubspot/api-client");
const axios = require("axios");
require("dotenv").config();
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

const hubspotClient = new hubspot.Client({
  accessToken: process.env.HUBSPOT_API_KEY,
});

// const centers = [
//   "8fe8852e-98f8-4945-8648-e3fae90ce487",
//   "25e968f4-4a92-4056-a8a9-4ba31dcc6f1a",
//   "dfe33ac8-aae8-4f92-9b4d-0b33d893c940",
// ];

const centers = [
  { id: "8e634212-d979-46fc-9edf-f8f8227f9ef7" },
  { id: "6296aaf5-2a2c-47de-af50-e64c7f3dec94" },
  { id: "49398f3b-8c34-44e1-8583-c712ee8c844e" },
  { id: "57fba04b-9e03-4da1-aec5-bfdbdd9eaedb" },
  { id: "118acd89-3336-4810-9fbc-367cc04e2334" },
  { id: "72692502-3785-495b-a0e6-18865935ce62" },
  { id: "0bea90ce-8c76-4902-bf7b-50315560c718" },
  { id: "14ab298f-7959-4840-8335-8842900dfe39" },
  { id: "bde237de-5389-460a-8bd6-ba190bc26398" },
  { id: "64892dc5-0c9c-4e48-a11a-12580e8254c7" },
  { id: "82d239f0-f9db-44ec-804c-e9263b96be04" },
  { id: "02cf466a-7c95-4c06-b9ee-fae80b894e81" },
  { id: "a3e6c79d-9e3c-4562-a8d8-18e77f655e81" },
  { id: "9427b806-1328-4211-bad7-66c01603e564" },
  { id: "99cdee03-0cf0-4a8e-9184-1db054e78522" },
  { id: "6380ef55-ae65-425c-9188-197de11cae43" },
  { id: "27034048-b769-4667-958e-d9a58132d3f6" },
  { id: "abe59ba8-36bc-427a-b10e-067d12faad2f" },
  { id: "9a779fc1-aa3b-4ca2-81b4-cba82b56d709" },
  { id: "decf528f-eb63-46b2-a828-c48c54acede4" },
  { id: "ac554727-863c-4794-934d-6a28316b6828" },
  { id: "d1d07d92-a74c-423e-aec0-fcc89cf20a5c" },
  { id: "e5299f15-2e7d-46b3-9c6a-7d9a6ea3ca53" },
  { id: "e7becd24-13c5-4a1e-80e9-c99201eeb2d5" },
  { id: "4b670843-cc9a-4505-9d32-e88a67d3754a" },
  { id: "4223d2cd-2e95-4a04-b618-192f1fdba4e0" },
  { id: "8d8099c4-a2ce-4b9a-a6b1-39c6bf2bbb83" },
  { id: "96faa7e5-7ee6-4954-8621-ee837fee454b" },
  { id: "4573731a-6390-43ed-8c27-8644b2f631cf" },
  { id: "5a093672-6a4a-4b77-b1ef-d043f9cd35b2" },
  { id: "2d0a89ed-38d1-4f06-8fe4-e19cdc65185d" },
  { id: "6a63c68f-c9a3-4c7a-b0e8-ce7d6c98d826" },
  { id: "328cce55-d2bf-4ae8-8677-91d85c95abf7" },
];

const PREVIOUS_STATUS_FILE = "previous_status.json";
const NO_SHOW_SERVICES = [
  "no show/cancelled consult fee 29",
  "no show/cancelled inject consult fee 59",
];

const statusMapping = {
  1: "closed",
  0: "new",
  "-1": "cancelled",
  "-2": "no-show",
};


// async function fetchZenotiData(startDate = null, endDate = null, center_id) {
//   try {
//     let start = startDate ? new Date(startDate) : new Date();
//     let end = endDate ? new Date(endDate) : new Date();

//     if (!startDate || !endDate) {
//       end.setDate(end.getDate() + 1);
//     }

//     const formattedStart = start.toISOString().split("T")[0];
//     const formattedEnd = end.toISOString().split("T")[0];

//     const response = await axios.get(
//       "https://api.zenoti.com/v1/appointments?include_no_show_cancel=true",
//       {
//         headers: {
//           Authorization: `apikey ${process.env.ZENOTI_API_KEY}`,
//         },
//         params: {
//           start_date: formattedStart,
//           end_date: formattedEnd,
//           center_id,
//         },
//       }
//     );

//     const updatedAppointments = response.data

//     const final = await Promise.all(updatedAppointments
//       .filter((appointment) =>
//         appointment?.service?.name.toLowerCase().includes("consult")
//       )
//       .map(async (appointment) => {
//         let email = appointment.guest.email;

//         if (email) {
//           email = correctEmailTypos(email);
//           if (!isValidEmail(email)) {
//             console.error(`Invalid email address: ${email}, skipping...`);
//             return null;
//           }

//           return {
//             properties: {
//               firstname: appointment.guest.first_name,
//               lastname: appointment.guest.last_name,
//               email: email,
//               phone: appointment.guest.mobile.display_number,
//             },
//             appointmentId: appointment.appointment_id,
//             invoice_id: appointment.invoice_id,
//             status: appointment.status,
//             price: await fetchInvoiceAmount(appointment.invoice_id),
//             creation_date_utc: appointment.creation_date_utc,
//             start_time_utc: appointment.start_time_utc,
//             end_time_utc: appointment.end_time_utc,
//             service_name: appointment.service.name,
//           };
//         }
//       }))

//     return final.filter(Boolean);
//   } catch (error) {
//     console.log(error);
//     console.log(error.response.data.message);
//     error.from = "Fetch Zenoti data";
//     throw error;
//   }
// }

// async function fetchZenotiData(startDate = null, endDate = null, center_id) {
//   try {
//     let start = startDate ? new Date(startDate) : new Date();
//     let end = endDate ? new Date(endDate) : new Date();
    
//     if (!startDate || !endDate) {
//       end.setDate(end.getDate() + 1);
//     }
    
//     const formattedStart = start.toISOString().split("T")[0];
//     const formattedEnd = end.toISOString().split("T")[0];
    
//     console.log(`Fetching appointments from ${formattedStart} to ${formattedEnd}`);
    
//     const response = await axios.get(
//       "https://api.zenoti.com/v1/appointments?include_no_show_cancel=true",
//       {
//         headers: {
//           Authorization: `apikey ${process.env.ZENOTI_API_KEY}`,
//         },
//         params: {
//           start_date: formattedStart,
//           end_date: formattedEnd,
//           center_id,
//         },
//       }
//     );
    
//     const updatedAppointments = response.data;
//     console.log(`Fetched ${updatedAppointments.length} appointments`);
    
//     // Process appointments in smaller batches to avoid rate limiting
//     const consultAppointments = updatedAppointments
//       .filter((appointment) =>
//         appointment?.service?.name.toLowerCase().includes("consult")
//       );
      
//     console.log(`Found ${consultAppointments.length} consultation appointments`);
    
//     // Process in batches of 5 to avoid rate limiting
//     const batchSize = 5;
//     const results = [];
    
//     for (let i = 0; i < consultAppointments.length; i += batchSize) {
//       const batch = consultAppointments.slice(i, i + batchSize);
//       console.log(`Processing batch ${i/batchSize + 1} of ${Math.ceil(consultAppointments.length/batchSize)}`);
      
//       const batchResults = await Promise.all(
//         batch.map(async (appointment) => {
//           let email = appointment.guest.email;
          
//           if (!email) {
//             console.log(`No email for appointment ${appointment.appointment_id}, skipping...`);
//             return null;
//           }
          
//           email = correctEmailTypos(email);
//           if (!isValidEmail(email)) {
//             console.error(`Invalid email address: ${email}, skipping...`);
//             return null;
//           }
          
//           try {
//             const price = await fetchInvoiceAmount(appointment.invoice_id);
//             console.log(`Fetched price for invoice ${appointment.invoice_id}: ${price}`);
            
//             return {
//               properties: {
//                 firstname: appointment.guest.first_name,
//                 lastname: appointment.guest.last_name,
//                 email: email,
//                 phone: appointment.guest.mobile.display_number,
//               },
//               appointmentId: appointment.appointment_id,
//               invoice_id: appointment.invoice_id,
//               status: appointment.status,
//               price: price,
//               creation_date_utc: appointment.creation_date_utc,
//               start_time_utc: appointment.start_time_utc,
//               end_time_utc: appointment.end_time_utc,
//               service_name: appointment.service.name,
//             };
//           } catch (err) {
//             console.error(`Error fetching invoice ${appointment.invoice_id}: ${err.message}`);
//             return null;
//           }
//         })
//       );
      
//       results.push(...batchResults.filter(Boolean));
//       // Add delay between batches to avoid rate limiting
//       await new Promise(resolve => setTimeout(resolve, 2000));
//     }
    
//     return results;
//   } catch (error) {
//     console.error(`Error in fetchZenotiData: ${error.message}`);
//     if (error.response) {
//       console.error(`Response error data: ${JSON.stringify(error.response.data)}`);
//     }
//     error.from = "Fetch Zenoti data";
//     throw error;
//   }
// }

async function fetchZenotiData(startDate = null, endDate = null, center_id) {
  try {
    let start = startDate ? new Date(startDate) : new Date();
    let end = endDate ? new Date(endDate) : new Date();
    
    if (!startDate || !endDate) {
      end.setDate(end.getDate() + 1);
    }
    
    const formattedStart = start.toISOString().split("T")[0];
    const formattedEnd = end.toISOString().split("T")[0];
  
    
    const response = await axios.get(
      "https://api.zenoti.com/v1/appointments?include_no_show_cancel=true",
      {
        headers: {
          Authorization: `apikey ${process.env.ZENOTI_API_KEY}`,
        },
        params: {
          start_date: formattedStart,
          end_date: formattedEnd,
          center_id,
        },
      }
    );
    
    const updatedAppointments = response.data;
    
    // Process appointments in smaller batches to avoid rate limiting
    const consultAppointments = updatedAppointments
      .filter((appointment) =>
        appointment?.service?.name.toLowerCase().includes("consult")
      );
    
    // Process in batches of 5 to avoid rate limiting
    const batchSize = 5;
    const results = [];
    
    for (let i = 0; i < consultAppointments.length; i += batchSize) {
      const batch = consultAppointments.slice(i, i + batchSize);
      console.log(`Processing batch ${i/batchSize + 1} of ${Math.ceil(consultAppointments.length/batchSize)}`);
      
      const batchResults = await Promise.all(
        batch.map(async (appointment) => {
          let email = appointment.guest.email;
          
          if (!email) {
            console.log(`No email for appointment ${appointment.appointment_id}, skipping...`);
            return null;
          }
          
          email = correctEmailTypos(email);
          if (!isValidEmail(email)) {
            console.error(`Invalid email address: ${email}, skipping...`);
            return null;
          }
          
          try {
            const price = await fetchInvoiceAmount(appointment.invoice_id);
            // console.log(`Fetched price for invoice ${appointment.invoice_id}: ${price}`);
            
            return {
              properties: {
                firstname: appointment.guest.first_name,
                lastname: appointment.guest.last_name,
                email: email,
                phone: appointment.guest.mobile.display_number,
              },
              appointmentId: appointment.appointment_id,
              invoice_id: appointment.invoice_id,
              status: appointment.status,
              price: price,
              creation_date_utc: appointment.creation_date_utc,
              start_time_utc: appointment.start_time_utc,
              end_time_utc: appointment.end_time_utc,
              service_name: appointment.service.name,
            };
          } catch (err) {
            console.error(`Error fetching invoice ${appointment.invoice_id}: ${err.message}`);
            return null;
          }
        })
      );
      
      results.push(...batchResults.filter(Boolean));
      // Add delay between batches to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    return results;
  } catch (error) {
    console.error(`Error in fetchZenotiData: ${error.message}`);
    if (error.response) {
      console.error(`Response error data: ${JSON.stringify(error.response.data)}`);
    }
    error.from = "Fetch Zenoti data";
    throw error;
  }
}

async function fetchInvoiceAmount(invoice_id) {
  try {
    // console.log(`Fetching invoice ${invoice_id}...`);
    const response = await fetch(`https://api.zenoti.com/v1/invoices/${invoice_id}`, {
      headers: {
        Authorization: `apikey ${process.env.ZENOTI_API_KEY}`,
      },
    });
    
    if (!response.ok) {
      // console.error(`Invoice fetch failed with status: ${response.status}`);
      return 0;
    }
    
    const invoice = await response.json();
    if (invoice.error) {
      // console.error(`Invoice error: ${JSON.stringify(invoice.error)}`);
      return 0;
    } else {
      const spend = invoice?.invoice?.total_price?.sum_total;
      if (spend === undefined) {
        console.warn(`No sum_total found for invoice ${invoice_id}`);
        console.log(`Invoice data: ${JSON.stringify(invoice)}`);
        return 0;
      }
      return spend;
    }
  } catch (error) {
    // console.error(`Error fetching invoice ${invoice_id}: ${error.message}`);
    return 0;
  }
}

// Email validation function
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Email typo correction function
function correctEmailTypos(email) {
  const commonTypos = {
    "gmail.con": "gmail.com",
    "gmail.cpm": "gmail.com",
    "gmail.comm": "gmail.com",
    "gmail.clom": "gmail.com",
    "gmail.vom": "gmail.com",
    "gmail.com2": "gmail.com",
    "gmail.comcom": "gmail.com",
    "gmail.clm": "gmail.com",
    "gmail.c": "gmail.com",
    "live.co.un": "live.co.uk",
    "yahoo.con": "yahoo.com",
    "yahoo.com.fg": "yahoo.com",
    "yahoo.com.an": "yahoo.com",
    "yahoo.clom": "yahoo.com",
    "att.nett": "att.net",
    "hotmail.con": "hotmail.com",
    "hotmail.conm": "hotmail.com",
    "hotmail.coma": "hotmail.com",
    "hotmai.clom": "hotmail.com",
    "outlook.con": "outlook.com",
    "icloud.con": "icloud.com",
    "gamil.com": "gmail.com", // Fix common misspelling
  };

  const emailParts = email.split("@");
  if (emailParts.length !== 2) return email; // Invalid email format

  const domain = emailParts[1].toLowerCase();
  if (commonTypos[domain]) {
    return `${emailParts[0]}@${commonTypos[domain]}`;
  }

  return email;
}

// async function upsertHubspotContactsAndDeals(data) {
//   try {
//     const BatchInputSimplePublicObjectInputForCreate = {
//       inputs: data.map((item) => ({
//         idProperty: "email",
//         id: item.properties.email,
//         properties: {
//           ...item.properties,
//         },
//       })),
//     };

//     const contactUpsertResponse =
//       await hubspotClient.crm.contacts.batchApi.upsert(
//         BatchInputSimplePublicObjectInputForCreate
//       );

//     for (let i = 0; i < contactUpsertResponse.results.length; i++) {
//       const contact = contactUpsertResponse.results[i];
//       const appointment = data[i];
//       const contactId = contact.id;
//       const contactName = `${appointment.properties.firstname} ${appointment.properties.lastname}`;

//       const existingDeal = await checkIfDealExists(contactName);
//       if (existingDeal) {
//         // if (
//         //   existingDeal.properties.dealstage ==
//         //   process.env.HUBSPOT_CONSULTATION_BOOKED_STAGE_ID
//         // ) {
//           await updateExistingDeal(
//             existingDeal,
//             appointment,
//             contactId,
//             contactName
//           );
//         // }
//       } else {
//         await createNewDeal(contactId, contactName, appointment);
//       }
//     }
//   } catch (error) {
//     console.log(error);
//     error.from = "Upsert HubSpot contacts and deals";
//     throw error;
//   }
// }

async function upsertHubspotContactsAndDeals(data) {
  try {
    const uniqueContacts = Object.values(
      data.reduce((acc, item) => {
        acc[item.properties.email] = item;
        return acc;
      }, {})
    );

    const BatchInputSimplePublicObjectInputForCreate = {
      inputs: uniqueContacts.map((item) => ({
        idProperty: "email",
        id: item.properties.email,
        properties: { ...item.properties },
      })),
    };

    const contactUpsertResponse = await hubspotClient.crm.contacts.batchApi.upsert(
      BatchInputSimplePublicObjectInputForCreate
    );

    for (const appointment of data) {
      const contact = contactUpsertResponse.results.find(
        (c) => c.properties.email === appointment.properties.email
      );

      if (!contact) continue; 

      const contactId = contact.id;
      const contactName = `${appointment.properties.firstname} ${appointment.properties.lastname}`;

      const existingDeal = await checkIfDealExists(appointment.properties.email);
      if (existingDeal) {
        await updateExistingDeal(existingDeal, appointment, contactId, contactName);
      } else {
        await createNewDeal(contactId, contactName, appointment);
      }
    }
  } catch (error) {
    console.log(error);
    error.from = "Upsert HubSpot contacts and deals";
    throw error;
  }
}

async function checkIfDealExists(contactEmail) {
  try {
    const contactsSearchResponse = await hubspotClient.crm.contacts.searchApi.doSearch({
      filterGroups: [
        {
          filters: [
            {
              propertyName: 'email',
              operator: 'EQ',
              value: contactEmail,
            },
          ],
        },
      ],
    });

    // Check if the contact exists
    if (contactsSearchResponse.total === 0) {
      console.log('No contact found with the provided email.');
      return null;
    }

    const contactId = contactsSearchResponse.results[0].id;

    // Step 2: Retrieve deals associated with the contact ID
    const associationsResponse = await hubspotClient.crm.contacts.basicApi.getById(
      contactId,
      undefined,
      undefined,
      ["deals"],
      false,
      undefined
    );

    // Check if there are any associated deals
    if (associationsResponse.associations.deals.results.length === 0) {
      console.log('No deals associated with this contact.');
      return null;
    }

    // Fetch details of the associated deals
    const dealIds = associationsResponse.associations.deals.results.map(association => association.id);
    const dealsResponse = await hubspotClient.crm.deals.batchApi.read({
      inputs: dealIds.map(id => ({ id })),
    });

    return dealsResponse.results[0];
  } catch (error) {
    console.error('Error checking if deal exists:', error.message);
    throw error;
  }
}


async function createNewDeal(contactId, contactName, appointment) {
  try {
    let dealstage = determineDealStage(
      appointment.status,
      appointment.price,
      appointment.service_name
    );
    const closeDate =
      appointment.status !== 0
        ? convertUtcToGmtPlus1(appointment.end_time_utc)
        : null;

    const dealProperties = {
      dealname: contactName,
      dealstage: dealstage,
      pipeline: process.env.HUBSPOT_PIPELINE_ID,
      createdate: convertUtcToGmtPlus1(appointment.creation_date_utc),
      status: statusMapping[appointment.status.toString()],
      appointment_booking_date: new Date(appointment.creation_date_utc)
        .toISOString()
        .split("T")[0],
      date_booked: new Date(appointment.start_time_utc)
        .toISOString()
        .split("T")[0],
      service_type: appointment.service_name,
      amount: appointment.price,
    };

    if (closeDate) {
      dealProperties.closedate = closeDate;
    }

    // Create and associate deal
    const dealResponse = await hubspotClient.crm.deals.basicApi.create({
      associations: [
        {
          types: [
            { associationCategory: "HUBSPOT_DEFINED", associationTypeId: 3 },
          ],
          to: { id: contactId },
        },
      ],
      properties: dealProperties,
    });

    // Create line item for the appointment
    await createLineItem(dealResponse.id, appointment);

    // console.log(`Created deal for ${contactName} with stage: ${dealstage}`);
    return dealResponse;
  } catch (error) {
    console.error("Error creating deal:", error.message);
    throw error;
  }
}

async function updateExistingDeal(
  existingDeal,
  appointment,
  contactId,
  contactName
) {
  try {
    // Check if the service is a no-show fee
    const isNoShowFee = NO_SHOW_SERVICES.some((service) =>
      appointment.service_name.toLowerCase().includes(service.toLowerCase())
    );

    let newStage = isNoShowFee
      ? process.env.HUBSPOT_UNATTENDED_APPOINTMENT_STAGE_ID
      : determineDealStage(
          appointment.status,
          appointment.price,
          appointment.service_name
        );

    if (newStage && newStage != existingDeal.properties.dealstage) {
      await hubspotClient.crm.deals.basicApi.update(existingDeal.id, {
        properties: {
          dealstage: newStage,
          createdate: convertUtcToGmtPlus1(appointment.creation_date_utc),
          closedate: convertUtcToGmtPlus1(appointment.end_time_utc),
          status: statusMapping[appointment.status.toString()],
          appointment_booking_date: new Date(appointment.creation_date_utc)
            .toISOString()
            .split("T")[0],
          date_booked: new Date(appointment.start_time_utc)
            .toISOString()
            .split("T")[0],
          service_type: appointment.service_name,
          amount: (
            parseFloat(existingDeal.properties.amount || 0) + appointment.price
          ).toString(),
        },
      });
      console.log(
        `Updated deal ${contactName} (${appointment.status}) from ${existingDeal.properties.dealstage} to ${newStage} `
      );
    }

    // Create line item for the new appointment
    await createLineItem(existingDeal.id, appointment);
  } catch (error) {
    console.error("Error updating deal:", error.message);
    throw error;
  }
}

async function checkIfLineItemExists(dealId, zenotiAppointmentId, name) {
  try {
    const searchResponse = await hubspotClient.crm.lineItems.searchApi.doSearch(
      {
        filterGroups: [
          {
            filters: [
              {
                propertyName: "associations.deal",
                operator: "EQ",
                value: dealId,
              },
              {
                propertyName: "name",
                operator: "EQ",
                value: name,
              },
            ],
          },
        ],
      }
    );

    return searchResponse.results.length > 0;
  } catch (error) {
    console.error("Error checking if line item exists:", error.message);
    throw error;
  }
}

async function createLineItem(dealId, appointment) {
  try {
    const lineItemExists = await checkIfLineItemExists(
      dealId,
      appointment.appointmentId,
      appointment.service_name
    );
    if (lineItemExists) {
      // console.log(
      //   `Line item for appointment ${appointment.appointmentId} already exists in deal ${dealId}. Skipping...`
      // );
      return null;
    }

    const lineItemProperties = {
      name: appointment.service_name,
      price: appointment.price,
      quantity: 1,
      appointment_booking_date: new Date(appointment.creation_date_utc)
        .toISOString()
        .split("T")[0],
      zenoti_appointment_id: appointment.appointmentId,
    };

    const lineItem = await hubspotClient.crm.lineItems.basicApi.create({
      associations: [
        {
          types: [
            { associationCategory: "HUBSPOT_DEFINED", associationTypeId: 20 },
          ],
          to: { id: dealId },
        },
      ],
      properties: lineItemProperties,
    });

    return lineItem;
  } catch (error) {
    console.error("Error creating line item:", error.message);
    throw error;
  }
}

function determineDealStage(status, price, serviceName) {
  // Check for no-show fee services
  if (
    NO_SHOW_SERVICES.some((service) =>
      serviceName.toLowerCase().includes(service.toLowerCase())
    )
  ) {
    return process.env.HUBSPOT_UNATTENDED_APPOINTMENT_STAGE_ID;
  }

  // Normal status-based logic
  if (status === 1) {
    return price < 100
      ? process.env.HUBSPOT_CONSULT_UNCONVERTED_STAGE_ID
      : process.env.HUBSPOT_CONSULT_CONVERTED_STAGE_ID;
  } else if (status === -1 || status === -2) {
    return process.env.HUBSPOT_UNATTENDED_APPOINTMENT_STAGE_ID;
  }

  return null;
}

// Convert UTC timestamp to GMT+1
function convertUtcToGmtPlus1(utcTimestamp) {
  const date = new Date(utcTimestamp);
  date.setHours(date.getHours() + 1); // Convert to GMT+1
  return date.getTime();
}

// Sync past 6 months of data
async function syncPastSixMonths(center_id) {
  let errorEncountered = false;

  console.log(
    `Starting one-time sync for past 6 months on center: ${center_id}...`
  );
  let startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 1);
  let currentDate = new Date();

  while (startDate < currentDate) {
    let endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7);

    if (endDate > currentDate) {
      endDate = currentDate;
    }

    try {
      console.log(
        `Syncing from ${startDate.toISOString().split("T")[0]} to ${
          endDate.toISOString().split("T")[0]
        }`
      );
      const consultationData = await fetchZenotiData(
        startDate,
        endDate,
        center_id
      );
      await upsertHubspotContactsAndDeals(consultationData);
    } catch (error) {
      console.error(`Error syncing data (${error?.from}):`, error.message);
      errorEncountered = true;
      break;
    }

    await new Promise((resolve) => setTimeout(resolve, 3000));
    startDate = new Date(endDate);
  }

  if (errorEncountered) {
    console.log(`Couldn't complete 6-month sync`);
  } else {
    console.log(`Completed one-time sync for past 6 months`);
  }
}


// Start the server

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  for (let i = 0; i < centers.length; i++) {
    const center = centers[i];
    await syncPastSixMonths(center.id);
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
 });
