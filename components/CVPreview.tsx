import React, { forwardRef } from 'react';
import { CVData, PaperSize, Theme } from '../types';
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
import PortfolioPage from '../themes/PortfolioPage';

interface CVPreviewProps {
  cvData: CVData;
  theme: Theme;
  paperSize: PaperSize;
}

const paperStyles = {
  [PaperSize.A4]: {
    width: '210mm',
    height: '297mm',
  },
  [PaperSize.LETTER]: {
    width: '215.9mm',
    height: '279.4mm',
  },
};

const CVPreview = forwardRef<HTMLDivElement, CVPreviewProps>(({ cvData, theme, paperSize }, ref) => {
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
    <div className="transform transition-transform duration-300" style={{ transform: 'scale(0.7)' }}>
      <div ref={ref} id="cv-preview-container" className="flex flex-col gap-4">
        {/* Page 1: Main CV */}
        <div
          id="cv-page-1"
          className="bg-white shadow-2xl overflow-hidden"
          style={{ ...paperStyles[paperSize] }}
        >
          {renderTheme()}
        </div>
        
        {/* Page 2: Portfolio */}
        {cvData.portfolio && cvData.portfolio.length > 0 && (
          <div
            id="cv-page-2"
            className="bg-white shadow-2xl overflow-hidden"
            style={{ ...paperStyles[paperSize] }}
          >
            <PortfolioPage portfolio={cvData.portfolio} />
          </div>
        )}
      </div>
    </div>
  );
});

CVPreview.displayName = 'CVPreview';

export default CVPreview;