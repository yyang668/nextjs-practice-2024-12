import React, { useState, useEffect } from 'react';
import {Patient, PatientDetailsProps} from '@/lib/schemas'
import { getPatientByPatientId } from '@/app/actions'

const PatientDetails: React.FC<PatientDetailsProps> = async({ patientId }) => {
  let patient : Patient;
  const data: Patient[] = await getPatientByPatientId(Number(patientId));
  if (data.length > 0) {
    patient = data[0];
  } else {
    throw new Error('No patient found');
  }

  return (
    <div className="flex items-center mb-6 pb-6 border-b-2">
      <div className="bg-gray-300 rounded-lg p-2">
      <svg fill="#000000" width="64px" height="64px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M12 2.5a5.5 5.5 0 00-3.096 10.047 9.005 9.005 0 00-5.9 8.18.75.75 0 001.5.045 7.5 7.5 0 0114.993 0 .75.75 0 101.499-.044 9.005 9.005 0 00-5.9-8.181A5.5 5.5 0 0012 2.5zM8 8a4 4 0 118 0 4 4 0 01-8 0z"/>
      </svg>
      </div>
      <h2 className="text-xl font-bold p-6">{patient.name}</h2>
    </div>
  );
};

export default PatientDetails;
