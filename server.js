const express = require("express");
require("dotenv").config();
const hubspot = require("@hubspot/api-client");
const axios = require("axios");
const cron = require("node-cron");

// Initialize HubSpot client
const hubspotClient = new hubspot.Client({
  accessToken: process.env.HUBSPOT_API_KEY,
});

const app = express();
const PORT = 5500;

const centers = [
  {
    id: "8fe8852e-98f8-4945-8648-e3fae90ce487",
    name: "Center 1",
    key: process.env.ZENOTI_API_KEY_1,
  },
  {
    id: "25e968f4-4a92-4056-a8a9-4ba31dcc6f1a",
    name: "Center 2",
    key: process.env.ZENOTI_API_KEY_1,
  },
  {
    id: "dfe33ac8-aae8-4f92-9b4d-0b33d893c940",
    name: "Center 3",
    key: process.env.ZENOTI_API_KEY_1,
  },
  {
    id: "8e634212-d979-46fc-9edf-f8f8227f9ef7",
    key: process.env.ZENOTI_API_KEY_2,
  },
  {
    id: "6296aaf5-2a2c-47de-af50-e64c7f3dec94",
    key: process.env.ZENOTI_API_KEY_2,
  },
  {
    id: "49398f3b-8c34-44e1-8583-c712ee8c844e",
    key: process.env.ZENOTI_API_KEY_2,
  },
  {
    id: "57fba04b-9e03-4da1-aec5-bfdbdd9eaedb",
    key: process.env.ZENOTI_API_KEY_2,
  },
  {
    id: "118acd89-3336-4810-9fbc-367cc04e2334",
    key: process.env.ZENOTI_API_KEY_2,
  },
  {
    id: "72692502-3785-495b-a0e6-18865935ce62",
    key: process.env.ZENOTI_API_KEY_2,
  },
  {
    id: "0bea90ce-8c76-4902-bf7b-50315560c718",
    key: process.env.ZENOTI_API_KEY_2,
  },
  {
    id: "14ab298f-7959-4840-8335-8842900dfe39",
    key: process.env.ZENOTI_API_KEY_2,
  },
  {
    id: "bde237de-5389-460a-8bd6-ba190bc26398",
    key: process.env.ZENOTI_API_KEY_2,
  },
  {
    id: "64892dc5-0c9c-4e48-a11a-12580e8254c7",
    key: process.env.ZENOTI_API_KEY_2,
  },
  {
    id: "82d239f0-f9db-44ec-804c-e9263b96be04",
    key: process.env.ZENOTI_API_KEY_2,
  },
  {
    id: "02cf466a-7c95-4c06-b9ee-fae80b894e81",
    key: process.env.ZENOTI_API_KEY_2,
  },
  {
    id: "a3e6c79d-9e3c-4562-a8d8-18e77f655e81",
    key: process.env.ZENOTI_API_KEY_2,
  },
  {
    id: "9427b806-1328-4211-bad7-66c01603e564",
    key: process.env.ZENOTI_API_KEY_2,
  },
  {
    id: "99cdee03-0cf0-4a8e-9184-1db054e78522",
    key: process.env.ZENOTI_API_KEY_2,
  },
  {
    id: "6380ef55-ae65-425c-9188-197de11cae43",
    key: process.env.ZENOTI_API_KEY_2,
  },
  {
    id: "27034048-b769-4667-958e-d9a58132d3f6",
    key: process.env.ZENOTI_API_KEY_2,
  },
  {
    id: "abe59ba8-36bc-427a-b10e-067d12faad2f",
    key: process.env.ZENOTI_API_KEY_2,
  },
  {
    id: "9a779fc1-aa3b-4ca2-81b4-cba82b56d709",
    key: process.env.ZENOTI_API_KEY_2,
  },
  {
    id: "decf528f-eb63-46b2-a828-c48c54acede4",
    key: process.env.ZENOTI_API_KEY_2,
  },
  {
    id: "ac554727-863c-4794-934d-6a28316b6828",
    key: process.env.ZENOTI_API_KEY_2,
  },
  {
    id: "d1d07d92-a74c-423e-aec0-fcc89cf20a5c",
    key: process.env.ZENOTI_API_KEY_2,
  },
  {
    id: "e5299f15-2e7d-46b3-9c6a-7d9a6ea3ca53",
    key: process.env.ZENOTI_API_KEY_2,
  },
  {
    id: "e7becd24-13c5-4a1e-80e9-c99201eeb2d5",
    key: process.env.ZENOTI_API_KEY_2,
  },
  {
    id: "4b670843-cc9a-4505-9d32-e88a67d3754a",
    key: process.env.ZENOTI_API_KEY_2,
  },
  {
    id: "4223d2cd-2e95-4a04-b618-192f1fdba4e0",
    key: process.env.ZENOTI_API_KEY_2,
  },
  {
    id: "8d8099c4-a2ce-4b9a-a6b1-39c6bf2bbb83",
    key: process.env.ZENOTI_API_KEY_2,
  },
  {
    id: "96faa7e5-7ee6-4954-8621-ee837fee454b",
    key: process.env.ZENOTI_API_KEY_2,
  },
  {
    id: "4573731a-6390-43ed-8c27-8644b2f631cf",
    key: process.env.ZENOTI_API_KEY_2,
  },
  {
    id: "5a093672-6a4a-4b77-b1ef-d043f9cd35b2",
    key: process.env.ZENOTI_API_KEY_2,
  },
  {
    id: "2d0a89ed-38d1-4f06-8fe4-e19cdc65185d",
    key: process.env.ZENOTI_API_KEY_2,
  },
  {
    id: "6a63c68f-c9a3-4c7a-b0e8-ce7d6c98d826",
    key: process.env.ZENOTI_API_KEY_2,
  },
  {
    id: "328cce55-d2bf-4ae8-8677-91d85c95abf7",
    key: process.env.ZENOTI_API_KEY_2,
  },
];

// Constants
const UNATTENDED_STAGE_ID =
  process.env.HUBSPOT_UNATTENDED_APPOINTMENT_STAGE_ID || "45084769";
const SOURCE_STAGE_ID = "45084768";
const CONVERTED_STAGE_ID = "45084770";
const UNCONVERTED_STAGE_ID = "45084769";

async function fetchZenotiData(startDate, endDate, center_id, key) {
  try {
    const formattedStart = startDate.toISOString().split("T")[0];
    const formattedEnd = endDate.toISOString().split("T")[0];

    console.log(
      `Fetching appointments from ${formattedStart} to ${formattedEnd} for center ${center_id}`
    );

    const response = await axios.get(
      "https://api.zenoti.com/v1/appointments?include_no_show_cancel=true",
      {
        headers: {
          Authorization: `apikey ${key}`,
        },
        params: {
          start_date: formattedStart,
          end_date: formattedEnd,
          center_id,
        },
      }
    );

    const appointments = response.data;

    // Filter for unattended appointments (status -1 or -2)
    const unattendedAppointments = appointments.filter(
      (appointment) => appointment.status === -1 || appointment.status === -2
    );

    console.log(
      `Found ${unattendedAppointments.length} unattended appointments`
    );

    const batchSize = 5;
    const results = [];

    for (let i = 0; i < unattendedAppointments.length; i += batchSize) {
      const batch = unattendedAppointments.slice(i, i + batchSize);
      console.log(
        `Processing batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(
          unattendedAppointments.length / batchSize
        )}`
      );

      const batchResults = await Promise.all(
        batch.map(async (appointment) => {
          let email = appointment.guest.email;

          try {
            const price = await fetchInvoiceAmount(appointment.invoice_id, key);

            email = correctEmailTypos(email);
            if (!isValidEmail(email)) {
              console.error(`Invalid email address: ${email}, skipping...`);
              return null;
            }

            return {
              properties: {
                firstname: appointment.guest.first_name,
                lastname: appointment.guest.last_name,
                email: email,
                phone: appointment.guest.mobile?.display_number,
              },
              appointmentId: appointment.appointment_id,
              invoice_id: appointment.invoice_id,
              status: appointment.status,
              price: price,
              creation_date_utc: appointment.creation_date_utc,
              start_time_utc: appointment.start_time_utc,
              end_time_utc: appointment.end_time_utc,
              service_name: appointment.service?.name,
            };
          } catch (err) {
            console.error(
              `Error fetching invoice ${appointment.invoice_id}: ${err.message}`
            );
            return null;
          }
        })
      );

      results.push(...batchResults.filter(Boolean));
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    return results;
  } catch (error) {
    console.error(`Error in fetchZenotiData: ${error.message}`);
    if (error.response) {
      console.error(
        `Response error data: ${JSON.stringify(error.response.data)}`
      );
    }
    throw error;
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

async function fetchInvoiceAmount(invoice_id, key) {
  try {
    const response = await axios.get(
      `https://api.zenoti.com/v1/invoices/${invoice_id}`,
      {
        headers: {
          Authorization: `apikey ${key}`,
        },
      }
    );

    if (!response.data || response.data.error) {
      return 0;
    } else {
      const spend = response.data?.invoice?.total_price?.sum_total;
      if (spend === undefined) {
        return 0;
      }
      return spend;
    }
  } catch (error) {
    console.error(`Error fetching invoice ${invoice_id}: ${error.message}`);
    return 0;
  }
}

async function processUnattendedAppointments(data) {
  try {
    // Upsert contacts
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

    const contactUpsertResponse =
      await hubspotClient.crm.contacts.batchApi.upsert(
        BatchInputSimplePublicObjectInputForCreate
      );

    // Process each appointment
    for (const appointment of data) {
      const contact = contactUpsertResponse.results.find(
        (c) => c.properties.email === appointment.properties.email
      );

      if (!contact) continue;

      const contactId = contact.id;
      const contactName = `${appointment.properties.firstname} ${appointment.properties.lastname}`;

      // Check if deal exists
      const existingDeal = await checkIfDealExists(
        appointment.properties.email
      );

      if (existingDeal) {
        // Update existing deal to unattended stage
        await hubspotClient.crm.deals.basicApi.update(existingDeal.id, {
          properties: {
            dealstage: UNATTENDED_STAGE_ID,
            status: appointment.status === -1 ? "no-show" : "cancelled",
            closedate: convertUtcToGmtPlus1(appointment.end_time_utc),
          },
        });
        console.log(`Updated deal ${contactName} to unattended stage`);
      } else {
        // Create new deal in unattended stage
        const dealProperties = {
          dealname: contactName,
          dealstage: UNATTENDED_STAGE_ID,
          pipeline: process.env.HUBSPOT_PIPELINE_ID || "default",
          createdate: convertUtcToGmtPlus1(appointment.creation_date_utc),
          closedate: convertUtcToGmtPlus1(appointment.end_time_utc),
          status: appointment.status === -1 ? "no-show" : "cancelled",
          appointment_booking_date: new Date(appointment.creation_date_utc)
            .toISOString()
            .split("T")[0],
          date_booked: new Date(appointment.start_time_utc)
            .toISOString()
            .split("T")[0],
          service_type: appointment.service_name,
          amount: appointment.price,
        };

        const dealResponse = await hubspotClient.crm.deals.basicApi.create({
          associations: [
            {
              types: [
                {
                  associationCategory: "HUBSPOT_DEFINED",
                  associationTypeId: 3,
                },
              ],
              to: { id: contactId },
            },
          ],
          properties: dealProperties,
        });

        // Create line item for the appointment
        await createLineItem(dealResponse.id, appointment);
        console.log(`Created new deal for ${contactName} in unattended stage`);
      }
    }
  } catch (error) {
    console.error("Error processing unattended appointments:", error.message);
    throw error;
  }
}

/**
 * Check if a deal exists for a contact
 */
async function checkIfDealExists(contactEmail) {
  try {
    const contactsSearchResponse =
      await hubspotClient.crm.contacts.searchApi.doSearch({
        filterGroups: [
          {
            filters: [
              {
                propertyName: "email",
                operator: "EQ",
                value: contactEmail,
              },
            ],
          },
        ],
      });

    if (contactsSearchResponse.total === 0) {
      return null;
    }

    const contactId = contactsSearchResponse.results[0].id;

    const associationsResponse =
      await hubspotClient.crm.contacts.basicApi.getById(
        contactId,
        undefined,
        undefined,
        ["deals"],
        false,
        undefined
      );

    if (associationsResponse.associations.deals.results.length === 0) {
      return null;
    }

    const dealIds = associationsResponse.associations.deals.results.map(
      (association) => association.id
    );
    const dealsResponse = await hubspotClient.crm.deals.batchApi.read({
      inputs: dealIds.map((id) => ({ id })),
    });

    return dealsResponse.results[0];
  } catch (error) {
    console.error("Error checking if deal exists:", error.message);
    return null;
  }
}

async function createLineItem(dealId, appointment) {
  try {
    const lineItemProperties = {
      name: appointment.service_name,
      price: appointment.price,
      quantity: 1,
      appointment_booking_date: new Date(appointment.creation_date_utc)
        .toISOString()
        .split("T")[0],
      zenoti_appointment_id: appointment.appointmentId,
    };

    const lineItemResponse = await hubspotClient.crm.lineItems.basicApi.create({
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

    return lineItemResponse;
  } catch (error) {
    console.error(`Error creating line item: ${error.message}`);
    return null;
  }
}

function convertUtcToGmtPlus1(utcTimestamp) {
  const date = new Date(utcTimestamp);
  date.setHours(date.getHours() + 1); // Convert to GMT+1
  return date.getTime();
}

async function processWeeklyData(startDate) {
  let currentDate = new Date();
  let weekStartDate = new Date(startDate);

  while (weekStartDate < currentDate) {
    let weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekEndDate.getDate() + 7);

    if (weekEndDate > currentDate) {
      weekEndDate = currentDate;
    }

    console.log(
      `Processing week from ${weekStartDate.toISOString().split("T")[0]} to ${
        weekEndDate.toISOString().split("T")[0]
      }`
    );

    for (const center of centers) {
      try {
        // Fetch and process unattended appointments
        const unattendedData = await fetchZenotiData(
          weekStartDate,
          weekEndDate,
          center.id,
          center.key
        );
        if (unattendedData.length > 0) {
          await processUnattendedAppointments(unattendedData);
        }
      } catch (error) {
        console.error(`Error processing center ${center.id}: ${error.message}`);
      }

      // Add delay between centers
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    // Move to next week
    weekStartDate = new Date(weekEndDate);
  }

  console.log("Weekly data processing complete");
}

// Original deal processing functions
async function processDealStage(
  sourceStageId,
  convertedStageId,
  unconvertedStageId
) {
  const results = {
    processed: 0,
    converted: 0,
    unconverted: 0,
    errors: [],
  };

  try {
    // Get all deals in the source stage
    const deals = await fetchDealsByStage(sourceStageId);
    results.processed = deals.length;

    console.log(`Processing ${deals.length} deals from stage ${sourceStageId}`);

    let index = 0;
    // Process each deal
    for (const deal of deals) {
      //   await new Promise((resolve) => setTimeout(resolve, 500));
      index++;
      try {
        // Get associated contact with required properties
        const contact = await fetchAssociatedContact(deal.id);

        // Get associated line items
        const lineItems = await fetchAssociatedLineItems(deal.id);

        // Determine if deal should be converted
        const shouldConvert = evaluateDealConditions(contact, lineItems);

        if (
          new Date(deal.properties.closedate) > new Date() &&
          !shouldConvert
        ) {
          console.log(
            `Deal ${deal.id}(${index}/${deals.length}) has a future close date, skipping.`
          );
          continue;
        }

        // Move deal to appropriate stage
        if (shouldConvert) {
          if (deal.properties.dealstage != convertedStageId) {
            await moveDealToStage(deal.id, convertedStageId);
          }
          results.converted++;
          console.log(
            `Deal ${deal.id}(${index}/${deals.length}) moved to converted stage ${convertedStageId}`
          );
        } else {
          if (deal.properties.dealstage != unconvertedStageId) {
            await moveDealToStage(deal.id, unconvertedStageId);
          }
          results.unconverted++;
          console.log(
            `Deal ${deal.id}(${index}/${deals.length}) moved to unconverted stage ${unconvertedStageId}`
          );
        }
      } catch (error) {
        console.error(
          `Error processing deal ${deal.id}(${index}/${deals.length}):`,
          error.message
        );
        results.errors.push({
          dealId: deal.id,
          error: error.message,
        });
      }
    }
  } catch (error) {
    console.error("Error in processDealStage:", error.message);
    results.errors.push({
      stage: "processDealStage",
      error: error.message,
    });
  }

  return results;
}

async function fetchDealsByStage(stageId) {
  let deals = [];
  let after = undefined;

  // Paginate through all deals in the given pipeline and stage
  do {
    const response = await hubspotClient.crm.deals.searchApi.doSearch({
      filterGroups: [
        {
          filters: [
            { propertyName: "pipeline", operator: "EQ", value: "default" },
            { propertyName: "dealstage", operator: "EQ", value: stageId },
          ],
        },
      ],
      properties: ["amount", "createdate", "dealstage", "closedate"], // Fetch only required properties
      limit: 200, // Fetch up to 100 deals at a time
      after: after ? String(after) : undefined,
      // sorts: [{ propertyName: "createdate", direction: "DESCENDING" }],
    });

    deals = deals.concat(response.results);
    console.log(response.paging?.next?.after);
    after = response.paging?.next?.after;
  } while (after);

  return deals;
}

async function fetchAssociatedContact(dealId) {
  const contactProperties = [
    "zenoti_package_name",
    "zenoti_package_amount",
    "membership_status",
  ];

  // Get associations
  const associationsResponse = await hubspotClient.crm.deals.basicApi.getById(
    dealId,
    undefined,
    undefined,
    ["contacts"],
    false,
    undefined
  );

  // If no contacts are associated, return empty object
  if (
    !associationsResponse?.associations?.contacts?.results ||
    associationsResponse?.associations?.contacts?.results?.length === 0
  ) {
    return {};
  }

  // Get the first associated contact
  const contactId = associationsResponse?.associations?.contacts?.results[0].id;

  // Get contact properties
  const contactResponse = await hubspotClient.crm.contacts.basicApi.getById(
    contactId,
    contactProperties
  );

  return contactResponse.properties;
}

async function fetchAssociatedLineItems(dealId) {
  let lineItems = [];
  let after = undefined;

  // Fetch each line item
  try {
    do {
      const searchResponse =
        await hubspotClient.crm.lineItems.searchApi.doSearch({
          filterGroups: [
            {
              filters: [
                {
                  propertyName: "associations.deal",
                  operator: "EQ",
                  value: dealId,
                },
              ],
            },
          ],
          properties: ["name"], // Fetch only the name property
          limit: 100, // Ensure we get all line items
          after,
        });
      lineItems = lineItems.concat(searchResponse.results);
      after = searchResponse.paging?.next?.after;
    } while (after);
  } catch (error) {
    console.error(`Error fetching line items:`, error.message);
  }

  return lineItems;
}

function evaluateDealConditions(contact, lineItems) {
  // Condition 1: zenoti_package_amount exists and > 100
  if (
    contact.zenoti_package_amount &&
    parseFloat(contact.zenoti_package_amount) > 100
  ) {
    return true;
  }

  // Condition 2: At least 2 line items
  if (lineItems.length >= 2) {
    return true;
  }

  // Condition 3: membership_status == "Active"
  if (
    contact.membership_status &&
    contact.membership_status.toLowerCase() === "active"
  ) {
    return true;
  }

  // Condition 4: zenoti_package_name is not empty
  if (
    contact.zenoti_package_name &&
    contact.zenoti_package_name.trim() !== ""
  ) {
    return true;
  }

  // If none of the conditions are met, the deal should not be converted
  return false;
}

async function moveDealToStage(dealId, stageId) {
  // First fetch the deal to get its current properties
  const dealResponse = await hubspotClient.crm.deals.basicApi.getById(dealId);
  const dealProperties = dealResponse.properties;

  // Update the pipeline stage
  const updateProperties = {
    dealstage: stageId,
  };

  // Update the deal
  const updatedDeal = await hubspotClient.crm.deals.basicApi.update(dealId, {
    properties: updateProperties,
  });

  return updatedDeal;
}

/**
 * Main function to run the script
 */
async function main() {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 2);

  console.log(
    `Starting processing from ${startDate.toISOString().split("T")[0]}`
  );

  try {
    // First process unattended appointments from Zenoti
    await processWeeklyData(startDate);

    // Then process deals in the source stage
    console.log("Starting deal stage processing...");
    const results = await processDealStage(
      SOURCE_STAGE_ID,
      CONVERTED_STAGE_ID,
      UNCONVERTED_STAGE_ID
    );

    console.log("\nProcessing complete:");
    console.log(`Total deals processed: ${results.processed}`);
    console.log(`Deals moved to converted stage: ${results.converted}`);
    console.log(`Deals moved to unconverted stage: ${results.unconverted}`);
    console.log(`Errors encountered: ${results.errors.length}`);

    if (results.errors.length > 0) {
      console.log("\nErrors:");
      results.errors.forEach((error) => {
        console.log(`- Deal ${error.dealId || "unknown"}: ${error.error}`);
      });
    }
  } catch (error) {
    console.error("Fatal error:", error.message);
    return error;
  }
}

// Set up cron job to run main() every 7 days at midnight
cron.schedule("0 0 */7 * *", () => {
  console.log("Running scheduled task...");
  main()
    .then(() => {
      console.log("Scheduled task completed successfully.");
    })
    .catch((error) => {
      console.error("Scheduled task failed:", error.message);
    });
});

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  // main()
  //   .then(() => {
  //     console.log("Initial script execution completed successfully.");
  //   })
  //   .catch((error) => {
  //     console.error("Initial script execution failed:", error.message);
  //     process.exit(1);
  //   });
});