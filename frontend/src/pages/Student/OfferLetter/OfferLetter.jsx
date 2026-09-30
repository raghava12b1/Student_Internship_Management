import { useState } from "react";

import DashboardLayout from "../../../layouts/DashboardLayout";
import "./OfferLetter.css";
import BackButton from "../../../components/common/BackButton/BackButton";

import { apiFetch } from "../../../services/api";


const OfferLetter = () => {

  // ============================================================
  // FORM DATA
  // ============================================================

  const [formData, setFormData] = useState({
    company_name: "",
    role: "",
    company_address: "",
    internship_type: "",
    start_date: "",
    end_date: "",
    stipend_type: "",
    stipend: "",
    hr_name: "",
    hr_email: "",
    hr_phone: "",
  });


  // ============================================================
  // FILE
  // ============================================================

  const [offerLetterFile, setOfferLetterFile] = useState(null);


  // ============================================================
  // UI STATES
  // ============================================================

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  // ============================================================
  // HANDLE INPUT CHANGE
  // ============================================================

  const handleChange = (event) => {

    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

  };


  // ============================================================
  // HANDLE FILE
  // ============================================================

  const handleFileChange = (event) => {

    const file = event.target.files?.[0] || null;

    setError("");
    setSuccess("");

    if (!file) {
      setOfferLetterFile(null);
      return;
    }


    // ----------------------------------------------------------
    // PDF ONLY
    // ----------------------------------------------------------

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {

      setError(
        "Please select a PDF file for the offer letter."
      );

      event.target.value = "";
      setOfferLetterFile(null);

      return;
    }


    setOfferLetterFile(file);

  };


  // ============================================================
  // VALIDATION
  // ============================================================

  const validateForm = () => {

    if (!formData.company_name.trim()) {
      return "Company name is required.";
    }

    if (!formData.role.trim()) {
      return "Internship role is required.";
    }

    if (!formData.internship_type) {
      return "Please select internship type.";
    }

    if (!formData.start_date) {
      return "Start date is required.";
    }

    if (!formData.end_date) {
      return "End date is required.";
    }

    if (!formData.stipend_type) {
      return "Please select a stipend type.";
    }

    if (
      formData.stipend_type === "STIPEND" &&
      (!formData.stipend.trim() || Number(formData.stipend) <= 0)
    ) {
      return "Please enter a stipend amount greater than zero.";
    }


    // ----------------------------------------------------------
    // DATE VALIDATION
    // ----------------------------------------------------------

    if (
      new Date(formData.end_date) <
      new Date(formData.start_date)
    ) {

      return "End date cannot be before start date.";

    }


    // ----------------------------------------------------------
    // OFFER LETTER
    // ----------------------------------------------------------

    if (!offerLetterFile) {
      return "Please upload the offer letter PDF.";
    }


    return "";

  };


  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");
    setSuccess("");


    // ----------------------------------------------------------
    // VALIDATE
    // ----------------------------------------------------------

    const validationError = validateForm();

    if (validationError) {

      setError(validationError);

      return;

    }


    setLoading(true);


    try {

      // ========================================================
      // STEP 1
      // CREATE INTERNSHIP
      // ========================================================

      const internshipPayload = {
        company_name: formData.company_name.trim(),

        role: formData.role.trim(),

        company_address:
          formData.company_address.trim(),

        internship_type:
          formData.internship_type,

        start_date:
          formData.start_date,

        end_date:
          formData.end_date,

        stipend_type:
          formData.stipend_type,

        stipend:
          formData.stipend_type === "STIPEND"
            ? formData.stipend.trim()
            : null,

        hr_name:
          formData.hr_name.trim(),

        hr_email:
          formData.hr_email.trim(),

        hr_phone:
          formData.hr_phone.trim(),
      };


      console.log(
        "CREATING INTERNSHIP:",
        internshipPayload
      );


      const internshipResponse =
        await apiFetch(
          "/internships/",
          {
            method: "POST",

            body: JSON.stringify(
              internshipPayload
            ),
          }
        );


      const internshipData =
        await internshipResponse.json();


      console.log(
        "INTERNSHIP RESPONSE:",
        internshipData
      );


      if (!internshipResponse.ok) {

        throw new Error(
          internshipData?.detail ||
          internshipData?.message ||
          "Unable to create internship."
        );

      }


      // ========================================================
      // STEP 2
      // GET INTERNSHIP ID
      // ========================================================

      const internshipId =
        internshipData?.id;


      if (!internshipId) {

        throw new Error(
          "Internship was created, but no internship ID was returned."
        );

      }


      // ========================================================
      // STEP 3
      // UPLOAD OFFER LETTER
      // ========================================================

      const documentFormData =
        new FormData();


      documentFormData.append(
        "internship",
        internshipId
      );


      documentFormData.append(
        "document_type",
        "OFFER_LETTER"
      );


      documentFormData.append(
        "file",
        offerLetterFile
      );


      console.log(
        "UPLOADING OFFER LETTER FOR INTERNSHIP:",
        internshipId
      );


      const documentResponse =
        await apiFetch(
          "/documents/",
          {
            method: "POST",

            // IMPORTANT:
            // Do NOT manually set Content-Type here.
            // Browser automatically creates the multipart
            // boundary for FormData.
            body: documentFormData,
          }
        );


      const documentData =
        await documentResponse.json();


      console.log(
        "DOCUMENT RESPONSE:",
        documentData
      );


      if (!documentResponse.ok) {

        throw new Error(
          documentData?.detail ||
          documentData?.message ||
          "Internship was created, but offer letter upload failed."
        );

      }


      // ========================================================
      // SUCCESS
      // ========================================================

      setSuccess(
        "Internship details and offer letter uploaded successfully."
      );


      // ========================================================
      // RESET FORM
      // ========================================================

      setFormData({
        company_name: "",
        role: "",
        company_address: "",
        internship_type: "",
        start_date: "",
        end_date: "",
        stipend_type: "",
        stipend: "",
        hr_name: "",
        hr_email: "",
        hr_phone: "",
      });


      setOfferLetterFile(null);


      // Reset file input
      const fileInput =
        document.getElementById(
          "offer-letter-file"
        );

      if (fileInput) {
        fileInput.value = "";
      }


    } catch (error) {

      console.error(
        "Offer letter upload error:",
        error
      );


      setError(
        error.message ||
        "Unable to upload offer letter. Please try again."
      );

    } finally {

      setLoading(false);

    }

  };


  // ============================================================
  // UI
  // ============================================================

  return (

    <DashboardLayout>

      <BackButton />


      <div className="offer-page">

        <h1>
          Upload Offer Letter
        </h1>


        <p>
          Submit your internship details and upload
          the official offer letter issued by the company.
        </p>


        {/* ====================================================
            ERROR
        ==================================================== */}

        {error && (

          <div className="offer-error">
            {error}
          </div>

        )}


        {/* ====================================================
            SUCCESS
        ==================================================== */}

        {success && (

          <div className="offer-success">
            {success}
          </div>

        )}


        <form
          className="offer-card"
          onSubmit={handleSubmit}
        >


          {/* ==================================================
              COMPANY
          ================================================== */}

          <label>
            Company Name
          </label>

          <input
            type="text"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            placeholder="Enter Company Name"
            disabled={loading}
          />


          {/* ==================================================
              ROLE
          ================================================== */}

          <label>
            Internship Role
          </label>

          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="Enter Internship Role"
            disabled={loading}
          />


          {/* ==================================================
              ADDRESS
          ================================================== */}

          <label>
            Company Address
          </label>

          <textarea
            name="company_address"
            rows="3"
            value={formData.company_address}
            onChange={handleChange}
            placeholder="Enter Company Address"
            disabled={loading}
          />


          {/* ==================================================
              INTERNSHIP TYPE
          ================================================== */}

          <label>
            Internship Type
          </label>

          <select
            name="internship_type"
            value={formData.internship_type}
            onChange={handleChange}
            disabled={loading}
          >

            <option value="">
              Select Internship Type
            </option>

            <option value="ONLINE">
              Online
            </option>

            <option value="OFFLINE">
              Offline
            </option>

            <option value="HYBRID">
              Hybrid
            </option>

          </select>


          {/* ==================================================
              DATES
          ================================================== */}

          <div className="date-row">

            <div>

              <label>
                Start Date
              </label>

              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                disabled={loading}
              />

            </div>


            <div>

              <label>
                End Date
              </label>

              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                disabled={loading}
              />

            </div>

          </div>


          {/* ==================================================
              STIPEND
          ================================================== */}

          <label>
            Stipend Type
          </label>

          <select
            name="stipend_type"
            value={formData.stipend_type}
            onChange={(event) => {
              const value = event.target.value;
              setFormData((previousData) => ({
                ...previousData,
                stipend_type: value,
                stipend: value === "STIPEND" ? previousData.stipend : "",
              }));
            }}
            disabled={loading}
          >
            <option value="">Select Stipend Type</option>
            <option value="STIPEND">Stipend</option>
            <option value="NO_STIPEND">No Stipend</option>
            <option value="PAID_BY_STUDENT">Paid By Student</option>
          </select>

          {formData.stipend_type === "STIPEND" && (
            <>
              <label>
                Monthly Stipend Amount (₹)
              </label>
              <input
                type="number"
                name="stipend"
                value={formData.stipend}
                onChange={handleChange}
                placeholder="Enter Monthly Stipend"
                min="0.01"
                step="0.01"
                disabled={loading}
                required
              />
            </>
          )}


          {/* ==================================================
              HR NAME
          ================================================== */}

          <label>
            HR Name (Optional)
          </label>

          <input
            type="text"
            name="hr_name"
            value={formData.hr_name}
            onChange={handleChange}
            placeholder="Enter HR Name"
            disabled={loading}
          />


          {/* ==================================================
              HR EMAIL
          ================================================== */}

          <label>
            HR Email (Optional)
          </label>

          <input
            type="email"
            name="hr_email"
            value={formData.hr_email}
            onChange={handleChange}
            placeholder="Enter HR Email"
            disabled={loading}
          />


          {/* ==================================================
              HR PHONE
          ================================================== */}

          <label>
            HR Phone (Optional)
          </label>

          <input
            type="tel"
            name="hr_phone"
            value={formData.hr_phone}
            onChange={handleChange}
            placeholder="Enter HR Phone Number"
            disabled={loading}
          />


          {/* ==================================================
              OFFER LETTER PDF
          ================================================== */}

          <label>
            Upload Offer Letter (PDF)
          </label>

          <input
            id="offer-letter-file"
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            disabled={loading}
          />


          {/* ==================================================
              SELECTED FILE
          ================================================== */}

          {offerLetterFile && (

            <p className="selected-file">

              Selected:
              {" "}
              <strong>
                {offerLetterFile.name}
              </strong>

            </p>

          )}


          {/* ==================================================
              SUBMIT
          ================================================== */}

          <button
            type="submit"
            disabled={loading}
          >

            {loading
              ? "Uploading..."
              : "Upload Offer Letter"}

          </button>

        </form>

      </div>

    </DashboardLayout>

  );

};


export default OfferLetter;