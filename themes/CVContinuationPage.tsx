import React from 'react';
import { CVData, PaperSize, WorkExperience, Education, Certificate } from '../types';

interface CVContinuationPageProps {
    cvData: CVData;
    paperSize: PaperSize;
    experienceStartIndex?: number;
    educationStartIndex?: number;
    certificatesStartIndex?: number;
    showExperience?: boolean;
    showEducation?: boolean;
    showCertificates?: boolean;
    pageNumber?: number;
}

const CVContinuationPage: React.FC<CVContinuationPageProps> = ({
    cvData,
    paperSize,
    experienceStartIndex = 0,
    educationStartIndex = 0,
    certificatesStartIndex = 0,
    showExperience = true,
    showEducation = true,
    showCertificates = true,
    pageNumber,
}) => {
    const { experience, education, certificates, personal } = cvData;

    const formatDate = (dateString: string) => {
        if (!dateString) return 'Present';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    };

    const remainingExperience = experience.slice(experienceStartIndex);
    const remainingEducation = education.slice(educationStartIndex);
    const remainingCertificates = certificates.slice(certificatesStartIndex);

    const hasContent = 
        (showExperience && remainingExperience.length > 0) ||
        (showEducation && remainingEducation.length > 0) ||
        (showCertificates && remainingCertificates.length > 0);

    if (!hasContent) return null;

    return (
        <div className="p-10 font-sans h-full">
            <h1 className="text-2xl font-bold text-center mb-6 border-b-2 pb-3 text-gray-800">
                {personal.fullName} - Resume{pageNumber !== undefined && ` (Cont. ${pageNumber})`}
            </h1>

            {showExperience && remainingExperience.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-xl font-bold uppercase text-gray-700 border-b-2 border-gray-300 pb-2 mb-4">
                        Experience (Continued)
                    </h2>
                    {remainingExperience.map((exp, index) => (
                        <div key={exp.id} className="mb-4">
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-lg font-semibold text-gray-800">{exp.jobTitle}</h3>
                                <p className="text-sm text-gray-500">
                                    {formatDate(exp.startDate)} - {exp.isCurrent ? 'Present' : formatDate(exp.endDate)}
                                </p>
                            </div>
                            <h4 className="font-medium text-blue-600">{exp.company}</h4>
                            <ul className="mt-2 list-disc list-inside text-gray-600 space-y-1 text-sm">
                                {exp.description.split('\n').map((line, i) => line && <li key={i}>{line.replace(/^- /, '')}</li>)}
                            </ul>
                        </div>
                    ))}
                </section>
            )}

            {showEducation && remainingEducation.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-xl font-bold uppercase text-gray-700 border-b-2 border-gray-300 pb-2 mb-4">
                        Education (Continued)
                    </h2>
                    {remainingEducation.map((edu) => (
                        <div key={edu.id} className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">{edu.degree}</h3>
                            <p className="text-gray-600">{edu.institution}</p>
                            <p className="text-sm text-gray-500">
                                {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                            </p>
                        </div>
                    ))}
                </section>
            )}

            {showCertificates && remainingCertificates.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-xl font-bold uppercase text-gray-700 border-b-2 border-gray-300 pb-2 mb-4">
                        Certificates (Continued)
                    </h2>
                    {remainingCertificates.map((cert) => (
                        <div key={cert.id} className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">{cert.name}</h3>
                            <p className="text-blue-600">{cert.issuer}</p>
                            <p className="text-sm text-gray-500">Issued {formatDate(cert.date)}</p>
                        </div>
                    ))}
                </section>
            )}
        </div>
    );
};

export default CVContinuationPage;
