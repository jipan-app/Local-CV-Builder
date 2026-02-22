import React from 'react';
import { PortfolioItem, PaperSize } from '../types';

interface PortfolioPageProps {
    portfolio: PortfolioItem[];
    paperSize?: PaperSize;
    startIndex?: number;
    isLastPage?: boolean;
}

// Fixed number of items per page based on actual measurements
// A4: 297mm height, with header and padding, approximately 6 items (3 rows of 2) fit well
// Letter: 279.4mm height, slightly less, so 4 items (2 rows of 2) fit well
const ITEMS_PER_PAGE: Record<PaperSize, number> = {
    [PaperSize.A4]: 6,    // 3 rows of 2 items
    [PaperSize.LETTER]: 4, // 2 rows of 2 items
};

// Split items into pages
const splitItemsIntoPages = (items: PortfolioItem[], paperSize: PaperSize): PortfolioItem[][] => {
    const pages: PortfolioItem[][] = [];
    const itemsPerPage = ITEMS_PER_PAGE[paperSize];
    
    for (let i = 0; i < items.length; i += itemsPerPage) {
        pages.push(items.slice(i, i + itemsPerPage));
    }
    
    return pages;
};

// Single portfolio page content component
const PortfolioPageContent: React.FC<{
    items: PortfolioItem[];
    showHeader: boolean;
    pageNumber?: number;
}> = ({ items, showHeader, pageNumber }) => {
    return (
        <div className="p-10 bg-white min-h-full font-sans h-full flex flex-col">
            {showHeader && (
                <h1 className="text-3xl font-bold text-center mb-8 border-b-2 pb-4 text-gray-800 shrink-0">
                    Portfolio{pageNumber !== undefined && ` (${pageNumber})`}
                </h1>
            )}
            <div className="grid grid-cols-2 gap-8 flex-1">
                {items.map(item => (
                    <div key={item.id} className="flex flex-col group">
                        {item.image && 
                            <div className="overflow-hidden rounded-lg shadow-md mb-4">
                                <img 
                                    src={item.image} 
                                    alt={item.projectName} 
                                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
                                />
                            </div>
                        }
                        <h2 className="text-xl font-semibold text-gray-800">{item.projectName}</h2>
                        {item.year && <p className="text-sm text-gray-500 mb-2">{item.year}</p>}
                        {item.description && <p className="text-sm text-gray-700">{item.description}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
};

// Main component that renders all portfolio pages
const PortfolioPage: React.FC<PortfolioPageProps> = ({ 
    portfolio, 
    paperSize = PaperSize.A4,
    startIndex = 0,
    isLastPage = false 
}) => {
    // Filter out items that don't have an image or project name
    const validPortfolio = portfolio.filter(item => item.image && item.projectName);

    // Split items into pages
    const pages = splitItemsIntoPages(validPortfolio, paperSize);

    // Render all pages
    return (
        <>
            {pages.map((pageItems, index) => (
                <div
                    key={`portfolio-page-${index}`}
                    id={`cv-page-${startIndex + 2 + index}`}
                    className="bg-white shadow-2xl"
                    style={{
                        width: paperSize === PaperSize.A4 ? '210mm' : '215.9mm',
                        height: paperSize === PaperSize.A4 ? '297mm' : '279.4mm',
                        overflow: 'hidden',
                    }}
                >
                    <PortfolioPageContent 
                        items={pageItems} 
                        showHeader={true}
                        pageNumber={pages.length > 1 ? index + 1 : undefined}
                    />
                </div>
            ))}
        </>
    );
};

export default PortfolioPage;
