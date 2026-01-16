import { useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { type TitlePage } from '@/lib/title-page-manager';

interface TitlePagePreviewProps {
  page: TitlePage;
  projectName: string;
  onClose: () => void;
}

export default function TitlePagePreview({ page, projectName, onClose }: TitlePagePreviewProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!printRef.current) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Титульный лист - ${projectName}</title>
          <style>
            @page {
              size: A4;
              margin: 0;
            }
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Times New Roman', Times, serif;
              background: white;
            }
            .page {
              width: 210mm;
              height: 297mm;
              padding: 20mm;
              position: relative;
              background: white;
            }
            .header {
              text-align: center;
              margin-bottom: 40mm;
            }
            .approval {
              position: absolute;
              top: 20mm;
              right: 20mm;
              text-align: left;
              font-size: 12pt;
              line-height: 1.6;
            }
            .approval-line {
              display: inline-block;
              border-bottom: 1px solid black;
              min-width: 150px;
              margin: 0 5px;
            }
            .main-title {
              margin-top: 60mm;
              text-align: center;
              font-size: 18pt;
              font-weight: bold;
              text-transform: uppercase;
              margin-bottom: 30mm;
            }
            .project-info {
              text-align: center;
              font-size: 14pt;
              line-height: 2;
              margin-bottom: 40mm;
            }
            .signatures {
              position: absolute;
              bottom: 30mm;
              left: 20mm;
              right: 20mm;
              font-size: 12pt;
            }
            .signature-row {
              display: flex;
              justify-content: space-between;
              align-items: baseline;
              margin-bottom: 15mm;
              page-break-inside: avoid;
            }
            .signature-position {
              flex: 0 0 40%;
            }
            .signature-line {
              flex: 0 0 25%;
              border-bottom: 1px solid black;
              text-align: center;
            }
            .signature-name {
              flex: 0 0 30%;
              text-align: right;
            }
            .footer {
              position: absolute;
              bottom: 20mm;
              left: 20mm;
              right: 20mm;
              text-align: center;
              font-size: 14pt;
            }
            @media print {
              body {
                margin: 0;
                padding: 0;
              }
              .page {
                margin: 0;
                box-shadow: none;
              }
            }
          </style>
        </head>
        <body>
          ${printRef.current.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-auto">
      <Card className="w-full max-w-4xl bg-white max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center z-10">
          <h3 className="text-lg font-semibold">Предварительный просмотр</h3>
          <div className="flex gap-2">
            <Button onClick={handlePrint} variant="default">
              <Icon name="Printer" size={16} className="mr-2" />
              Печать
            </Button>
            <Button onClick={onClose} variant="outline">
              <Icon name="X" size={16} className="mr-2" />
              Закрыть
            </Button>
          </div>
        </div>

        <div className="p-8 bg-gray-100">
          <div 
            ref={printRef}
            className="bg-white shadow-lg mx-auto"
            style={{
              width: '210mm',
              minHeight: '297mm',
              padding: '20mm',
              position: 'relative',
              fontFamily: "'Times New Roman', Times, serif"
            }}
          >
            {page.approvedBy && (
              <div style={{
                position: 'absolute',
                top: '20mm',
                right: '20mm',
                textAlign: 'left',
                fontSize: '12pt',
                lineHeight: '1.6'
              }}>
                <div>УТВЕРЖДАЮ</div>
                <div style={{ marginTop: '5mm' }}>{page.approvedBy}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', marginTop: '5mm' }}>
                  <span style={{ borderBottom: '1px solid black', minWidth: '50px', display: 'inline-block' }}></span>
                  <span style={{ marginLeft: '10px' }}>
                    «{new Date(page.approvedDate).getDate()}» {
                      new Date(page.approvedDate).toLocaleDateString('ru-RU', { month: 'long' })
                    } {new Date(page.approvedDate).getFullYear()} г.
                  </span>
                </div>
              </div>
            )}

            <div style={{
              marginTop: '60mm',
              textAlign: 'center',
              fontSize: '18pt',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              marginBottom: '30mm'
            }}>
              {page.documentTitle}
            </div>

            <div style={{
              textAlign: 'center',
              fontSize: '14pt',
              lineHeight: '2',
              marginBottom: '40mm'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '10mm' }}>
                {projectName}
              </div>
              {page.address && (
                <div>
                  Адрес объекта: {page.address}
                </div>
              )}
            </div>

            <div style={{
              position: 'absolute',
              bottom: '30mm',
              left: '20mm',
              right: '20mm',
              fontSize: '12pt'
            }}>
              {page.developerName && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: '15mm'
                }}>
                  <span style={{ flex: '0 0 40%' }}>{page.developerPosition}</span>
                  <span style={{
                    flex: '0 0 25%',
                    borderBottom: '1px solid black',
                    textAlign: 'center'
                  }}></span>
                  <span style={{ flex: '0 0 30%', textAlign: 'right' }}>{page.developerName}</span>
                </div>
              )}

              {page.chiefEngineerName && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: '15mm'
                }}>
                  <span style={{ flex: '0 0 40%' }}>{page.chiefEngineerPosition}</span>
                  <span style={{
                    flex: '0 0 25%',
                    borderBottom: '1px solid black',
                    textAlign: 'center'
                  }}></span>
                  <span style={{ flex: '0 0 30%', textAlign: 'right' }}>{page.chiefEngineerName}</span>
                </div>
              )}
            </div>

            <div style={{
              position: 'absolute',
              bottom: '20mm',
              left: '20mm',
              right: '20mm',
              textAlign: 'center',
              fontSize: '14pt'
            }}>
              {page.city} {page.year}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
