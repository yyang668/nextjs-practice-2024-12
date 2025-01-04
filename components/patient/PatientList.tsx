import React, { useState, useEffect } from 'react';
import PatientCard from '@/components/patient/PatientCard';
import {Patient} from '@/lib/schemas'
import { getPatients } from '@/app/actions'

const PatientList  = async () => {
  const patients: Patient[] = await getPatients();

  return (
    <div className="space-y-4">
      {patients.map((patient) => (
        <PatientCard key={patient.id} patient={patient} />
      ))}
    </div>
  );
};

export default PatientList;
