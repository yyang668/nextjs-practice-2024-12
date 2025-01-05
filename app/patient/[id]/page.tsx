import Header from "@/components/Header";
import Navbar from "@/components/navbar/Navbar";
import CommentList from "@/components/comment/CommentList";
import PatientDetails from "@/components/patient/PatientDetails";
import Footer from "@/components/Footer";

export default function CommentPage({ params }: { params: { id: string } }) {
  const patientId = params.id;

  return (
    <div className="p-4">
      <Header />
      <div className="p-4 pb-20">
        <Navbar />
        <PatientDetails patientId={patientId} />
        <CommentList patientId={patientId} />
      </div>
      <Footer patientId={patientId} />
    </div>
  );
}
