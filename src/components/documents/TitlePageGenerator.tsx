import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import type { Project, System, LegalEntity } from '@/lib/project-manager';
import { getLegalEntityById } from '@/lib/project-manager';

interface TitlePageGeneratorProps {
  project: Project;
  system: System;
  onClose: () => void;
}

export default function TitlePageGenerator({ project, system, onClose }: TitlePageGeneratorProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const legalEntity: LegalEntity | null = getLegalEntityById(project.legalEntityId);

  const handlePrint = () => {
    if (!printRef.current) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Титульный лист - ${project.title}</title>
          <meta charset="utf-8">
          <style>
            @page {
              size: A4;
              margin: 20mm;
            }
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Times New Roman', serif;
              font-size: 14pt;
              line-height: 1.5;
              color: #000;
            }
            .page {
              width: 210mm;
              min-height: 297mm;
              padding: 20mm;
              margin: 0 auto;
              background: white;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            }
            .header {
              text-align: center;
              margin-bottom: 40mm;
            }
            .header h1 {
              font-size: 16pt;
              font-weight: bold;
              text-transform: uppercase;
              margin-bottom: 10mm;
            }
            .content {
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: center;
              text-align: center;
            }
            .content h2 {
              font-size: 18pt;
              font-weight: bold;
              text-transform: uppercase;
              margin-bottom: 15mm;
            }
            .content .system-name {
              font-size: 16pt;
              font-weight: bold;
              margin-bottom: 10mm;
            }
            .content .object-name {
              font-size: 14pt;
              margin-bottom: 20mm;
            }
            .footer {
              text-align: center;
              margin-top: 40mm;
            }
            .footer .year {
              font-size: 16pt;
              font-weight: bold;
            }
            @media print {
              body {
                width: 210mm;
              }
              .page {
                page-break-after: always;
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
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const currentYear = new Date().getFullYear();
  const organizationName = legalEntity?.name || 'Организация не указана';
  const objectName = project.title;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-auto">
      <Card className="w-full max-w-4xl bg-white">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">Титульный лист исполнительной документации</h3>
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

        <div className="p-8 overflow-auto max-h-[70vh]">
          <div 
            ref={printRef}
            className="bg-white mx-auto"
            style={{
              width: '210mm',
              minHeight: '297mm',
              padding: '20mm',
              fontFamily: '"Times New Roman", serif',
              fontSize: '14pt',
              lineHeight: '1.5',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div className="text-center mb-16">
              <h1 className="text-xl font-bold uppercase mb-8">
                {organizationName}
              </h1>
            </div>

            <div className="flex-1 flex flex-col justify-center text-center">
              <h2 className="text-2xl font-bold uppercase mb-12">
                ИСПОЛНИТЕЛЬНАЯ ДОКУМЕНТАЦИЯ
              </h2>
              
              <div className="text-lg font-bold mb-8">
                {system.name}
              </div>
              
              <div className="text-base mb-16">
                Объект: {objectName}
              </div>
            </div>

            <div className="text-center mt-16">
              <div className="text-lg font-bold">
                {currentYear}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
