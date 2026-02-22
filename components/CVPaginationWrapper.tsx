import React from 'react';
import { CVData, PaperSize, Theme, WorkExperience, Education, Certificate } from '../types';
import ModernTheme from '../themes/ModernTheme';
import ClassicTheme from '../themes/ClassicTheme';
import CreativeTheme from '../themes/CreativeTheme';
import MinimalistTheme from '../themes/MinimalistTheme';
import TechnicalTheme from '../themes/TechnicalTheme';
import CorporateTheme from '../themes/CorporateTheme';
import ElegantTheme from '../themes/ElegantTheme';
import AcademicTheme from '../themes/AcademicTheme';
import BoldTheme from '../themes/BoldTheme';
import GraphicTheme from '../themes/GraphicTheme';
import InfographicTheme from '../themes/InfographicTheme';
import VintageTheme from '../themes/VintageTheme';
import CVContinuationPage from '../themes/CVContinuationPage';

interface CVPaginationWrapperProps {
    cvData: CVData;
    theme: Theme;
    paperSize: PaperSize;
}

// Estimated content capacity per page based on paper size
// These are conservative estimates to ensure content fits
const CONTENT_LIMITS: Record<PaperSize, { experience: number; education: number; certificates: number }> = {
    [PaperSize.A4]: { experience: 4, education: 3, certificates: 3 },
    [PaperSize.LETTER]: { experience: 3, education: 2, certificates: 2 },
};

// Continuation page capacity (more items since no header/sidebar)
const CONTINUATION_LIMITS: Record<PaperSize, { experience: number; education: number; certificates: number }> = {
    [PaperSize.A4]: { experience: 6, education: 5, certificates: 5 },
    [PaperSize.LETTER]: { experience: 5, education: 4, certificates: 4 },
};

interface ContinuationPageData {
    experienceStartIndex: number;
    educationStartIndex: number;
    certificatesStartIndex: number;
    showExperience: boolean;
    showEducation: boolean;
    showCertificates: boolean;
}

const CVPaginationWrapper: React.FC<CVPaginationWrapperProps> = ({ cvData, theme, paperSize }) => {
    const limits = CONTENT_LIMITS[paperSize];
    const contLimits = CONTINUATION_LIMITS[paperSize];
    const { experience, education, certificates } = cvData;

    // Calculate which content needs continuation pages
    const needsExperienceContinuation = experience.length > limits.experience;
    const needsEducationContinuation = education.length > limits.education;
    const needsCertificatesContinuation = certificates.length > limits.certificates;

    // Calculate continuation page indices (what's left after page 1)
    const experienceRemaining = needsExperienceContinuation ? experience.slice(limits.experience) : [];
    const educationRemaining = needsEducationContinuation ? education.slice(limits.education) : [];
    const certificatesRemaining = needsCertificatesContinuation ? certificates.slice(limits.certificates) : [];

    // Generate continuation pages
    const generateContinuationPages = (): ContinuationPageData[] => {
        const pages: ContinuationPageData[] = [];
        
        let expIndex = limits.experience;
        let eduIndex = limits.education;
        let certIndex = limits.certificates;
        
        let hasMoreContent = true;
        let pageNumber = 1;
        
        while (hasMoreContent) {
            const expStart = expIndex;
            const eduStart = eduIndex;
            const certStart = certIndex;
            
            // Calculate what fits on this continuation page
            const expEnd = Math.min(expIndex + contLimits.experience, experience.length);
            const eduEnd = Math.min(eduIndex + contLimits.education, education.length);
            const certEnd = Math.min(certIndex + contLimits.certificates, certificates.length);
            
            // Update indices for next page
            expIndex = expEnd;
            eduIndex = eduEnd;
            certIndex = certEnd;
            
            // Check if there's more content
            hasMoreContent = expIndex < experience.length || eduIndex < education.length || certIndex < certificates.length;
            
            pages.push({
                experienceStartIndex: expStart,
                educationStartIndex: eduStart,
                certificatesStartIndex: certStart,
                showExperience: expStart < experience.length,
                showEducation: eduStart < education.length,
                showCertificates: certStart < certificates.length,
            });
            
            pageNumber++;
        }
        
        return pages;
    };

    const continuationPages = generateContinuationPages();
    const needsContinuation = continuationPages.length > 0;

    const renderTheme = () => {
        switch (theme) {
            case Theme.MODERN:
                return <ModernTheme data={cvData} />;
            case Theme.CLASSIC:
                return <ClassicTheme data={cvData} />;
            case Theme.CREATIVE:
                return <CreativeTheme data={cvData} />;
            case Theme.MINIMALIST:
                return <MinimalistTheme data={cvData} />;
            case Theme.TECHNICAL:
                return <TechnicalTheme data={cvData} />;
            case Theme.CORPORATE:
                return <CorporateTheme data={cvData} />;
            case Theme.ELEGANT:
                return <ElegantTheme data={cvData} />;
            case Theme.ACADEMIC:
                return <AcademicTheme data={cvData} />;
            case Theme.BOLD:
                return <BoldTheme data={cvData} />;
            case Theme.GRAPHIC:
                return <GraphicTheme data={cvData} />;
            case Theme.INFOGRAPHIC:
                return <InfographicTheme data={cvData} />;
            case Theme.VINTAGE:
                return <VintageTheme data={cvData} />;
            default:
                return <ModernTheme data={cvData} />;
        }
    };

    return (
        <>
            {/* Page 1: Main CV */}
            <div
                id="cv-page-1"
                className="bg-white shadow-2xl"
                style={{
                    width: paperSize === PaperSize.A4 ? '210mm' : '215.9mm',
                    height: paperSize === PaperSize.A4 ? '297mm' : '279.4mm',
                    overflow: 'hidden',
                }}
            >
                {renderTheme()}
            </div>

            {/* Continuation Pages */}
            {continuationPages.map((pageData, index) => (
                <div
                    key={`continuation-${index}`}
                    id={`cv-page-${2 + index}`}
                    className="bg-white shadow-2xl"
                    style={{
                        width: paperSize === PaperSize.A4 ? '210mm' : '215.9mm',
                        height: paperSize === PaperSize.A4 ? '297mm' : '279.4mm',
                        overflow: 'hidden',
                    }}
                >
                    <CVContinuationPage
                        cvData={cvData}
                        paperSize={paperSize}
                        experienceStartIndex={pageData.experienceStartIndex}
                        educationStartIndex={pageData.educationStartIndex}
                        certificatesStartIndex={pageData.certificatesStartIndex}
                        showExperience={pageData.showExperience}
                        showEducation={pageData.showEducation}
                        showCertificates={pageData.showCertificates}
                        pageNumber={continuationPages.length > 1 ? index + 1 : undefined}
                    />
                </div>
            ))}
        </>
    );
};

export default CVPaginationWrapper;
