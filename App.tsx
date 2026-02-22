import React, { useState, useRef, useCallback } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { CVData, PaperSize, Theme } from './types';
import CVForm from './components/CVForm';
import CVPreview from './components/CVPreview';
import { initialCVData } from './constants';

const App: React.FC = () => {
  const [cvData, setCvData] = useLocalStorage<CVData>('cv-data', initialCVData);
  const [theme, setTheme] = useState<Theme>(Theme.MODERN);
  const [paperSize, setPaperSize] = useState<PaperSize>(PaperSize.A4);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handlePdfExport = useCallback(async () => {
    const previewContainer = previewRef.current;
    if (!previewContainer || isGeneratingPdf) return;

    setIsGeneratingPdf(true);
    
    const html2canvas = (window as any).html2canvas;
    const { jsPDF } = (window as any).jspdf;

    if (!html2canvas || !jsPDF) {
      alert("PDF generation libraries are not loaded yet. Please try again in a moment.");
      setIsGeneratingPdf(false);
      return;
    }
    
    const scalingWrapper = previewContainer.parentElement as HTMLDivElement;
    const originalTransform = scalingWrapper.style.transform;
    // Reset scale for accurate, full-size capture
    scalingWrapper.style.transform = 'scale(1)';
    
    // Allow browser time to re-render at the new scale before capture
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const pages = previewContainer.querySelectorAll<HTMLDivElement>('div[id^="cv-page-"]');
      
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: paperSize.toLowerCase(),
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const canvas = await html2canvas(page, {
          scale: 2, // Capture at high resolution
          useCORS: true,
          logging: false,
          windowWidth: page.scrollWidth,
          windowHeight: page.scrollHeight,
        });

        // Use JPEG for smaller file sizes
        const imgData = canvas.toDataURL('image/jpeg', 0.98); 

        if (i > 0) {
          pdf.addPage();
        }
        
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      }

      pdf.save(`${cvData.personal.fullName.replace(/\s/g, '_')}_CV.pdf`);

    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("An error occurred while generating the PDF. Please check the console for details.");
    } finally {
      // Restore original scale and state
      scalingWrapper.style.transform = originalTransform;
      setIsGeneratingPdf(false);
    }
  }, [cvData.personal.fullName, paperSize, isGeneratingPdf]);


  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans text-gray-800">
      <main className="w-full lg:w-1/2 p-4 md:p-8 overflow-y-auto h-screen">
        <CVForm 
          cvData={cvData} 
          setCvData={setCvData} 
          theme={theme}
          setTheme={setTheme}
          paperSize={paperSize}
          setPaperSize={setPaperSize}
          onExport={handlePdfExport}
          isGeneratingPdf={isGeneratingPdf}
        />
      </main>
      <aside className="w-full lg:w-1/2 p-4 md:p-8 bg-gray-200 flex items-center justify-center overflow-y-auto h-screen">
        <CVPreview ref={previewRef} cvData={cvData} theme={theme} paperSize={paperSize} />
      </aside>
    </div>
  );
};

export default App;