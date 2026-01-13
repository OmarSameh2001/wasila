"use client";
import { useRef, useState } from "react";
import { getRecord } from "../../_services/record";
import { useQuery } from "@tanstack/react-query";
import { RecordData, RecordPolicy } from "../../_dto/record";
import PromiseHandler from "../utils/promise_handler/handler";
import LoadingPage from "../utils/promise_handler/loading/loading";
import { showErrorToast, showSuccessToast } from "../utils/toaster/toaster";


function InsuranceReportPDF({ id }: { id: string }) {
  const [pdfLoading, setPdfLoading] = useState(false);
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["adminRecord", id],
    queryFn: () => getRecord(Number(id)),
  });
  const record = (data?.data as RecordData) || null;
  const reportRef = useRef<HTMLDivElement>(null);

  const financialData: RecordPolicy[] = record?.policies ?? [];
  console.log(data?.data);

  const formatNumber = (num: number): string => {
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const downloadPDF = async (): Promise<void> => {
    setPdfLoading(true);
    const element = reportRef.current;

    if (!element) {
      console.error("Report element not found");
      return;
    }

    try {
      // Dynamic imports - only load when needed
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const slides = element.querySelectorAll<HTMLElement>(".slide");

      if (slides.length === 0) {
        throw new Error("No slides found");
      }

      // Create PDF with optimal settings
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [1920, 1080],
        compress: true,
        hotfixes: ["px_scaling"], // Fix for pixel scaling issues
      });

      // Process slides sequentially to avoid memory issues
      for (let i = 0; i < slides.length; i++) {
        if (i > 0) {
          pdf.addPage([1920, 1080], "landscape");
        }
        slides[i].style.width = "1920px";
        // Capture slide with optimized settings
        const canvas = await html2canvas(slides[i] as HTMLElement, {
          scale: 1.5, // Balance between quality and performance
          useCORS: true,
          allowTaint: false,
          logging: false,
          width: 1920,
          height: 1080,
          windowWidth: 1920,
          windowHeight: 1080,
          backgroundColor: "#ffffff",
          imageTimeout: 0,
          removeContainer: true,
        });

        // Convert to JPEG for smaller file size
        const imgData = canvas.toDataURL("image/jpeg", 0.92);

        // Add to PDF
        pdf.addImage(imgData, "JPEG", 0, 0, 1920, 1080, undefined, "FAST");

        // Clean up canvas to free memory
        canvas.width = 0;
        canvas.height = 0;
        slides[i].style.width = "90vw";
      }

      // Save with date stamp
      const filename = `insurance-report-${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      pdf.save(filename);
      showSuccessToast("PDF generated successfully", 2000);
    } catch (error) {
      console.error("PDF generation failed:", error);
      showErrorToast("Failed to generate PDF");
    } finally {
      setPdfLoading(false);
    }
  };

  const policyRecordData = financialData?.sort(
    (a, b) => b?.companyName?.localeCompare(a?.companyName ?? "") ?? 0
  );
  const financialArabic: Record<string, string> = {
    numberOfInsureds: "عدد المؤمن عليهم",
    numberOfPersons: "عدد الاشخاص",
    averageAge: "متوسط اعمار المؤمن عليهم",
    totalAmount: "المبلغ الكلي",
    totalTaxed: "المبلغ الكلي بعد الضريبة",
    avgPricePerPerson: "متوسط السعر لكل شخص",
  };
  const financialEnglish: Record<string, string> = {
    numberOfInsureds: "Number of insureds",
    numberOfPersons: "Total Number",
    averageAge: "Average Age",
    totalAmount: "Tota Amount",
    totalTaxed: "Total Amount with Tax",
    avgPricePerPerson: "Average Price per Person",
  };
  const financialKeys = Object.keys(financialArabic);

  if (isLoading || isError)
    return (
      <PromiseHandler
        isLoading={isLoading}
        isError={isError}
        message={"Error loading record"}
      />
    );
  return (
    <div
      style={{
        position: "relative",
        background: "#f0f0f0",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 1000,
        }}
      >
        <button
          onClick={downloadPDF}
          style={{
            padding: "15px 30px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "18px",
            fontWeight: "bold",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          {pdfLoading ? (
            <LoadingPage height="100px" width="100px" />
          ) : (
            "📄 Download PDF"
          )}
        </button>
      </div>
      {pdfLoading && (
        <LoadingPage className="fixed inset-0 w-screen h-full bg-white dark:bg-black z-[1000]" />
      )}

      <div ref={reportRef}>
        <style>{` 
          .slide {
            width: 90vw;
            height: 1080px;
            margin: 20px auto;
            background: white;
            padding: 80px;
            position: relative;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            page-break-after: always;
          }
          
          .logo {
            position: absolute;
            top: 40px;
            right: 80px;
            font-size: 18px;
            color: #1a237e;
            font-weight: bold;
            text-transform: uppercase;
          }
          
          .page-number {
            position: absolute;
            bottom: 40px;
            right: 80px;
            font-size: 32px;
            color: #1a237e;
            font-weight: bold;
          }
          
          .company-card {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            padding: 40px;
            border-radius: 15px;
            margin-bottom: 30px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          }
          
          .benefits-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
            margin-top: 10px;
          }
          
          .benefits-table th {
            background-color: #1a237e;
            color: white;
            padding: 15px 12px;
            text-align: center;
            font-weight: bold;
            border: 1px solid #5b64c8ff;
          }
          
          .benefits-table td {
            padding: 8px;
            border: 1px solid #ccc;
            background-color: white;
          }
          
          .benefits-table tr:nth-child(even) td {
            background-color: #f5f5f5;
          }
          
          .financial-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 18px;
            margin-top: 40px;
          }
          
          .financial-table th {
            background-color: #1a237e;
            color: white;
            padding: 20px 15px;
            text-align: center;
            font-weight: bold;
            border: 1px solid #1a237e;
          }
          
          .financial-table td {
            padding: 18px 15px;
            border: 1px solid #ccc;
            text-align: center;
            background-color: white;
            color: #1a237e;
          }
           td {
            padding: 18px 15px;
            border: 1px solid #ccc;
            text-align: center;
            background-color: white;
            color: #1a237e;
          } 
        `}</style>

        {/* Slide 1: Cover */}
        <div
          className="slide"
          style={{
            backgroundImage:
              "url('/review-and-upgrade-your-health-insurance.webp')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "cover",
            // height: "100vh",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <h1
              style={{
                fontSize: "72px",
                color: "#10154fff",
                // backgroundColor: "#ffffff2d",
                marginBottom: "40px",
                fontWeight: "bold",
              }}
            >
              Small to Medium-sized Enterprise Insurance
            </h1>
            <div
              style={{
                fontSize: "48px",
                color: "#10154fff",
                // backgroundColor: "#ffffff2d",
                fontWeight: "bold",
                textTransform: "uppercase",
                marginTop: "100px",
              }}
            >
              Wasila for Insurance Brokers
            </div>
          </div>
        </div>

        {/* Slide 2: Table of Contents */}
        <div className="slide page-break">
          <div className="logo">Wasila for Insurance</div>
          <h2
            style={{
              fontSize: "56px",
              color: "#1a237e",
              marginBottom: "60px",
              fontWeight: "bold",
            }}
          >
            Table of Contents
          </h2>
          <ul
            style={{
              listStyle: "none",
              fontSize: "36px",
              lineHeight: "2.5",
              paddingLeft: "40px",
            }}
          >
            <li style={{ marginBottom: "0px", color: "#1a237e" }}>
              <span style={{ color: "#1a237e", marginRight: "20px" }}>•</span>
              Record Description
            </li>
            <div className="ml-10 flex flex-col gap-0 text-[#1a237e] underline">
                {record?.broker?.name ? <span>Broker name: {record.broker.name}</span>: null}
                {record?.client?.name ? <span>Client name: {record.client.name}</span>: null}
                {record?.policies?.length && record?.policies?.length > 0 ? <span>Number of policies: {record?.policies?.length}</span>: null}
            </div>
            <li style={{ marginBottom: "20px", color: "#1a237e" }}>
              <span style={{ color: "#1a237e", marginRight: "20px" }}>•</span>
              Benefits Summary
            </li>
            <li style={{ marginBottom: "20px", color: "#1a237e" }}>
              <span style={{ color: "#1a237e", marginRight: "20px" }}>•</span>
              Financial Proposal
            </li>
          </ul>
          <div className="page-number">2</div>
        </div>


        {/* Slide 7: Benefits Table 1 */}
        <div className="slide page-break">
          <div className="logo">Wasila for Insurance</div>
          <h2
            style={{
              fontSize: "42px",
              color: "#1a237e",
              marginBottom: "10px",
              fontWeight: "bold",
            }}
          >
            Table of Benefits Comparison
          </h2>
          <table className="benefits-table">
            <CustomTableHead recordPolicies={policyRecordData} />
            <tbody>
              <CustomTableRow recordPolicies={policyRecordData} limit={12} />
            </tbody>
          </table>
          <div className="page-number">4</div>
        </div>

        {/* Slide 8: Benefits Table 2 */}
        <div className="slide page-break">
          <div className="logo">Wasila for Insurance</div>
          <h2
            style={{
              fontSize: "42px",
              color: "#1a237e",
              marginBottom: "30px",
              fontWeight: "bold",
            }}
          >
            Table of Benefits Comparison (Continued)
          </h2>
          <table className="benefits-table">
            <CustomTableHead recordPolicies={policyRecordData} />
            <tbody>
              <CustomTableRow
                recordPolicies={policyRecordData}
                startIndex={12}
                limit={13}
              />
            </tbody>
          </table>
          <div className="page-number">5</div>
        </div>

        {/* Slide 10: Financial Proposal */}
        <div className="slide page-break">
          <div className="logo">Wasila for Insurance</div>
          <h2
            style={{
              fontSize: "42px",
              color: "#1a237e",
              marginBottom: "30px",
              fontWeight: "bold",
            }}
          >
            Financial Proposal
          </h2>

          <table className="benefits-table">
            <CustomTableHead recordPolicies={policyRecordData} />
            <tbody>
              {financialKeys.map((key) => (
                <tr key={key}>
                  <td
                    style={{
                      fontWeight: "bold",
                      color: "#1a237e",
                      width: "250px",
                    }}
                  >
                    {financialEnglish[key] || key}
                    <div style={{ fontSize: "12px", color: "#666" }}>
                      ({financialArabic[key] || key})
                    </div>
                  </td>
                  {policyRecordData?.map((policyData, index) => (
                    <td key={index}>
                      {String(policyData[key as keyof typeof policyData] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div
            style={{
              position: "absolute",
              bottom: "40px",
              left: "80px",
              right: "80px",
              fontSize: "14px",
              color: "#666",
              textAlign: "center",
              lineHeight: "1.6",
            }}
          >
            This information is created by Wasila Insurance. Copyright Wasila ©
            2026
          </div>
          <div className="page-number">6</div>
        </div>
      </div>
    </div>
  );
}

function CustomTableRow({
  recordPolicies,
  startIndex = 0,
  limit,
}: {
  recordPolicies: RecordPolicy[];
  startIndex?: number;
  limit?: number;
}) {
  // Map of policy keys to Arabic translations
  const arabicTranslations: Record<string, string> = {
    lifeInsurance: "التأمين على الحياة",
    totalPermanentDisability: "العجز الكلي الدائم",
    accidentalDeath: "الوفاة العرضية",
    partialPermanentDisability: "العجز الجزئي الدائم",
    medicalTpa: "إدارة المطالبات الطبية",
    network: "الشبكة الطبية",
    areaOfCoverage: "منطقة التغطية",
    annualCeilingPerPerson: "الحد السنوي للفرد",
    inPatientAccommodation: "الإقامة الداخلية",
    icu: "العناية المركزة",
    parentAccommodation: "إقامة الوالدين",
    doctorConsultation: "استشارة الطبيب",
    labScan: "الفحوصات والأشعة",
    physiotherapy: "العلاج الطبيعي",
    medication: "الأدوية",
    dental: "طب الأسنان",
    optical: "البصريات",
    maternityLimit: "حد الأمومة",
    newbornCeiling: "حد المواليد الجدد",
    preExistingCases: "الحالات الموجودة مسبقاً",
    newChronic: "الأمراض المزمنة الجديدة",
    organTransplant: "زراعة الأعضاء",
    groundAmbulance: "سيارة الإسعاف الأرضية",
    reimbursementCoverage: "تغطية السداد",
  };

  // Map of English labels
  const englishLabels: Record<string, string> = {
    lifeInsurance: "Life Insurance",
    totalPermanentDisability: "Total Permanent Disability",
    accidentalDeath: "Accidental Death",
    partialPermanentDisability: "Partial Permanent Disability",
    medicalTpa: "Medical TPA",
    network: "Network",
    areaOfCoverage: "Area of Coverage",
    annualCeilingPerPerson: "Annual Ceiling Per Person",
    inPatientAccommodation: "In-Patient Accommodation",
    icu: "ICU",
    parentAccommodation: "Parent Accommodation",
    doctorConsultation: "Doctor Consultation",
    labScan: "Lab & Scan",
    physiotherapy: "Physiotherapy",
    medication: "Medication",
    dental: "Dental",
    optical: "Optical",
    maternityLimit: "Maternity Limit",
    newbornCeiling: "Newborn Ceiling",
    preExistingCases: "Pre-Existing Cases",
    newChronic: "New Chronic",
    organTransplant: "Organ Transplant",
    groundAmbulance: "Ground Ambulance",
    reimbursementCoverage: "Reimbursement Coverage",
  };

  // Get all policy keys (excluding id and policyId)
  //   const displayedPolicies = limit
  //     ? policies.slice(startIndex, startIndex + limit)
  //     : policies.slice(startIndex);

  // Get all policy keys (excluding id, policyId, and healthPricings)
  const policyKeys =
    recordPolicies?.length > 0
      ? Object.keys(recordPolicies[0].policy.healthPolicy).filter(
          (key) =>
            key !== "id" && key !== "policyId" && key !== "healthPricings"
        )
      : [];
  const displayedPoliciesKeys = limit
    ? policyKeys.slice(startIndex, startIndex + limit)
    : policyKeys.slice(startIndex);

  return (
    <>
      {displayedPoliciesKeys.map((key) => (
        <tr key={key}>
          <td style={{ fontWeight: "bold", color: "#1a237e", width: "250px" }}>
            {englishLabels[key] || key}
            <div style={{ fontSize: "12px", color: "#666" }}>
              ({arabicTranslations[key] || key})
            </div>
          </td>
          {recordPolicies.map((policyData, index) => (
            <td key={index}>
              {String(
                policyData.policy.healthPolicy[
                  key as keyof typeof policyData.policy.healthPolicy
                ] ?? ""
              )}
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
function CustomTableHead({
  recordPolicies,
}: {
  recordPolicies: RecordPolicy[];
}) {
  const groupedPolicies = recordPolicies?.reduce((acc, policy) => {
    const company = policy?.policy?.company?.name ?? "";
    if (!acc[company]) {
      acc[company] = [];
    }
    acc[company].push(policy);
    return acc;
  }, {} as Record<string, typeof recordPolicies>);

  return (
    <thead className="text-center">
      <tr>
        <th>Company</th>
        {Object.entries(groupedPolicies ?? {}).map(
          ([companyName, companyPolicies]) => (
            <th key={companyName} colSpan={companyPolicies.length}>
              {companyName}
            </th>
          )
        )}
      </tr>
      <tr>
        <th>Policy</th>
        {Object.entries(groupedPolicies ?? {}).map(
          ([companyName, companyPolicies]) =>
            companyPolicies?.map((policy) => (
              <th
                className="text-center"
                key={`${companyName}-${policy.policy.name}`}
              >
                {policy.policy.name}
              </th>
            ))
        )}
      </tr>
    </thead>
  );
}
export default InsuranceReportPDF;
