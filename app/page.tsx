'use client';
import Header from '@/components/Header'
import PatientList from '@/components/patient/PatientList'

export default function PatientPage() {
  return (
    <div className="p-4">
      <Header />
      <PatientList  />
    </div>
  );
}
