import puppeteer from "puppeteer"
import { supabase } from "../config/supabase.js"

const daysMap = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

/**
 * Generates a PDF for the given trip and uploads it to Supabase storage.
 * @param {Object} trip - Object containing trip details.
 * @returns {Promise<string>} - Public URL of the generated PDF.
 */

export const generateTripPDF = async (trip) => {
  // Create HTML content for the PDF
  const htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; text-align: center; }
          h2 { color: #555; margin-top: 20px; }
          .day { margin-bottom: 30px; }
          .activity { margin-bottom: 15px; }
          .activity img { max-width: 200px; height: auto; display: block; margin-top: 10px; }
        </style>
      </head>
      <body>
        <h1>Trip: ${trip.tripInfo.origin} → ${trip.tripInfo.destination}</h1>
        <p><strong>Mode:</strong> ${trip.tripInfo.travelMode}</p>
        <p><strong>Duration:</strong> ${new Date(trip.tripInfo.startDate).toDateString()} 
           to ${new Date(trip.tripInfo.endDate).toDateString()}</p>

        ${(trip.itinerary || [])
          .map(
            (day) => `
            <div class="day">
              <h2>Day ${day.day}</h2>
              ${(day.activities || [])
                .map(
                  (activity) => `
                    <div class="activity">
                      <h3>${activity.place?.name || "Unknown"} (${activity.category || ""})</h3>
                      <p>${activity.place?.address || ""}</p>
                      <p>${activity.place?.summary || ""}</p>
                      <h4>Opening Hours:</h4>
                      <p>${
                        activity.place?.openingHours
                          ? activity.place.openingHours
                              .map(
                                (oh) =>
                                  `${daysMap[oh.open.day]}: ${oh.open.time} - ${oh.close.time}`
                              )
                              .join("<br>")
                          : "N/A"
                      }</p>
                      <p>Phone: ${activity.place?.phone || "N/A"}</p>
                      <p>Website: <a href="${activity.place?.website || "#"}">${
                    activity.place?.website || "#"
                  }</a></p>
                      <p>Google maps: <a href="https://www.google.com/maps/dir/${
                        activity.place?.coordinates.latitude
                      },${activity.place?.coordinates.longitude}">Google Maps Link</a></p>

                      ${
                        activity.place?.photo
                          ? `<img src="${activity.place.photo}" alt="${
                              activity.place?.name || ""
                            }"/>`
                          : ""
                      }
                    </div>
                  `
                )
                .join("")}
            </div>
          `
          )
          .join("")}
      </body>
    </html>
  `

  // Launch Puppeteer to generate PDF
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  })
  
  const page = await browser.newPage()
  await page.setContent(htmlContent, { waitUntil: "networkidle0" })
  const pdfBuffer = await page.pdf({ format: "A4", printBackground: true })
  await browser.close()

  // Upload PDF to Supabase storage
  const fileName = `trip_${trip._id}.pdf`
  const { error } = await supabase.storage.from("map-my-way-pdfs").upload(fileName, pdfBuffer, {
    cacheControl: "3600",
    upsert: true,
    contentType: "application/pdf",
  })

  if (error) {
    console.error("Error uploading PDF to Supabase:", error)
    throw new Error("Failed to upload PDF")
  }

  // Get public URL of the uploaded PDF
  const { data, error: urlError } = supabase.storage.from("map-my-way-pdfs").getPublicUrl(fileName)

  if (urlError) {
    console.error("Error getting public URL from Supabase:", urlError)
    throw new Error("Failed to get public URL")
  }

  return data.publicUrl
}

/** Deletes the PDF associated with the given trip ID from Supabase storage.
 * @param {string} tripId - The ID of the trip whose PDF should be deleted.
 * @returns {Promise<boolean>} - True if deletion was successful, false otherwise.
 */
export const deleteTripPDF = async (tripId) => {
  const fileName = `trip_${tripId}.pdf`

  try {
    const { error } = await supabase.storage.from("map-my-way-pdfs").remove([fileName])

    if (error) {
      console.error("Failed to remove PDF from Supabase:", error)
      throw new Error("Error deleting PDF: " + error.message)
    }
  } catch (err) {
    throw new Error("Error deleting PDF: " + err.message)
  }
}
