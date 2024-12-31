"use client";

import React, { useState, useEffect } from 'react';
import {Patient, PatientDetailsProps} from '@/lib/schemas'

const PatientDetails: React.FC<PatientDetailsProps> = ({ patientId }) => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const url = `/api/patients/getPatient?id=${patientId}`;
        console.log('Fetching:', url); //  URLを確認する
        const response = await fetch(url, { cache: 'no-store' });

        if (!response.ok) {
          throw new Error(`Failed to fetch patient: ${response.statusText}`);
        }

        const data: Patient[] = await response.json();
        console.log('Fetched data:', data); // データを確認する

        if (data.length > 0) {
          setPatient(data[0]); // 存在すれば、一番目を取得する
        } else {
          throw new Error('No patient found');
        }
      } catch (err) {
        console.error(err);
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatient();
  },  [patientId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!patient) {
    return <div>患者情報が存在しませんでした.</div>;
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
