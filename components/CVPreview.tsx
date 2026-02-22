import React, { forwardRef, useMemo } from 'react';
import { CVData, PaperSize, Theme, PortfolioItem } from '../types';
import CVPaginationWrapper from './CVPaginationWrapper';
import PortfolioPage from '../themes/PortfolioPage';

interface CVPreviewProps {
  cvData: CVData;
  theme: Theme;
  paperSize: PaperSize;
}

// Calculate the number of continuation pages needed
const calculateContinuationPages = (cvData: CVData, paperSize: PaperSize): number => {
    const limits = {
        [PaperSize.A4]: { experience: 4, education: 3, certificates: 3 },
        [PaperSize.LETTER]: { experience: 3, education: 2, certificates: 2 },
    }[paperSize];

    const contLimits = {
        [PaperSize.A4]: { experience: 6, education: 5, certificates: 5 },
        [PaperSize.LETTER]: { experience: 5, education: 4, certificates: 4 },
    }[paperSize];

    let count = 0;
    let expIndex = limits.experience;
    let eduIndex = limits.education;
    let certIndex = limits.certificates;
    
    while (expIndex < cvData.experience.length || eduIndex < cvData.education.length || certIndex < cvData.certificates.length) {
        count++;
        expIndex = Math.min(expIndex + contLimits.experience, cvData.experience.length);
        eduIndex = Math.min(eduIndex + contLimits.education, cvData.education.length);
        certIndex = Math.min(certIndex + contLimits.certificates, cvData.certificates.length);
    }

    return count;
};

// Calculate the number of portfolio pages needed
const calculatePortfolioPages = (portfolio: PortfolioItem[], paperSize: PaperSize): number => {
    const itemsPerPage = paperSize === PaperSize.A4 ? 6 : 4;
    const validPortfolio = portfolio.filter(item => item.image && item.projectName);
    return Math.ceil(validPortfolio.length / itemsPerPage);
};

const CVPreview = forwardRef<HTMLDivElement, CVPreviewProps>(({ cvData, theme, paperSize }, ref) => {
  // Calculate page counts
  const continuationPages = useMemo(() => calculateContinuationPages(cvData, paperSize), [cvData, paperSize]);
  const portfolioPages = useMemo(() => calculatePortfolioPages(cvData.portfolio, paperSize), [cvData.portfolio, paperSize]);

  return (
    <div ref={ref} className="transform transition-transform duration-300" style={{ transform: 'scale(0.7)' }}>
      <div id="cv-preview-container" className="flex flex-col gap-4">
        {/* Main CV Pages (with auto-pagination) */}
        <CVPaginationWrapper
          cvData={cvData}
          theme={theme}
          paperSize={paperSize}
        />
        
        {/* Portfolio Pages (may span multiple pages) */}
        {cvData.portfolio && cvData.portfolio.length > 0 && (
          <PortfolioPage
            portfolio={cvData.portfolio}
            paperSize={paperSize}
            startIndex={1 + continuationPages}
          />
        )}
      </div>
    </div>
  );
});

CVPreview.displayName = 'CVPreview';

export default CVPreview;