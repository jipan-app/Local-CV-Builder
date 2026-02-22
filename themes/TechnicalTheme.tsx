import React from 'react';
import { CVData } from '../types';

interface ThemeProps {
    data: CVData;
}

const TechnicalTheme: React.FC<ThemeProps> = ({ data }) => {
    const { personal, experience, education, certificates } = data;
    
    const formatDate = (dateString: string) => {
        if (!dateString) return 'Present';
        const date = new Date(dateString);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }

    const Section: React.FC<{title: string, children: React.ReactNode}> = ({title, children}) => (
        <section className="mb-5">
            <h2 className="text-base font-bold text-gray-700 mb-2 font-mono">// {title}</h2>
            {children}
        </section>
    );

    return (
        <div className="p-8 bg-white font-mono text-xs text-gray-800">
            <header className="flex justify-between items-start mb-6 border-b pb-4">
                <div>
                    <h1 className="text-3xl font-bold">{personal.fullName}</h1>
                    <p className="text-green-600">{personal.tagline}</p>
                </div>
                <div className="text-right">
                    <p>{personal.email}</p>
                    <p>{personal.phone}</p>
                    <p>{personal.website}</p>
                    <p>{personal.location}</p>
                </div>
            </header>

            <Section title="SUMMARY">
                <p className="text-gray-600">{personal.bio}</p>
            </Section>

            <Section title="EXPERIENCE">
                {experience.map(exp => (
                    <div key={exp.id} className="mb-4">
                        <div className="flex justify-between items-baseline">
                             <h3 className="font-bold text-sm">{exp.jobTitle} @ {exp.company}</h3>
                             <p className="text-gray-500">{formatDate(exp.startDate)} → {exp.isCurrent ? 'Present' : formatDate(exp.endDate)}</p>
                        </div>
                        <div className="pl-4">
                            <ul className="mt-1 list-disc list-inside text-gray-600 space-y-1">
                                {exp.description.split('\n').map((line, i) => line && <li key={i}>{line.replace(/^- /, '')}</li>)}
                            </ul>
                        </div>
                    </div>
                ))}
            </Section>
            
            <Section title="EDUCATION">
                {education.map(edu => (
                     <div key={edu.id} className="mb-3">
                        <div className="flex justify-between items-baseline">
                            <h3 className="font-bold text-sm">{edu.degree} - {edu.institution}</h3>
                            <p className="text-gray-500">{formatDate(edu.startDate)} → {formatDate(edu.endDate)}</p>
                        </div>
                    </div>
                ))}
            </Section>
            
            {certificates.length > 0 && <Section title="CERTIFICATIONS">
                 {certificates.map(cert => (
                    <p key={cert.id} className="mb-1">
                        <span className="font-bold">{cert.name}</span> - {cert.issuer} ({formatDate(cert.date)})
                    </p>
                 ))}
            </Section>}
        </div>
    );
};

export default TechnicalTheme;
