'use client';

import { Printer } from 'lucide-react';
import { Button } from './Button';

interface PrintButtonProps {
  title?: string;
  className?: string;
  targetSelector?: string;
}

export function PrintButton({ 
  title = 'Imprimer', 
  className = '',
  targetSelector 
}: PrintButtonProps) {
  const handlePrint = () => {
    // Si un targetSelector est fourni, on cache tout le reste
    if (targetSelector) {
      const content = document.querySelector(targetSelector);
      const allElements = document.querySelectorAll('*');
      
      // Cache tout
      allElements.forEach(el => {
        if (el instanceof HTMLElement) {
          el.classList.add('hidden-print');
        }
      });
      
      // Affiche seulement le contenu cible
      if (content instanceof HTMLElement) {
        content.classList.remove('hidden-print');
        content.classList.add('print-content');
      }
      
      // Imprime
      window.print();
      
      // Restore
      allElements.forEach(el => {
        if (el instanceof HTMLElement) {
          el.classList.remove('hidden-print');
        }
      });
      if (content instanceof HTMLElement) {
        content.classList.remove('print-content');
      }
    } else {
      // Impression simple de la page
      window.print();
    }
  };

  return (
    <Button 
      variant="secondary" 
      onClick={handlePrint}
      className={`flex items-center gap-2 ${className}`}
    >
      <Printer className="h-4 w-4" />
      {title}
    </Button>
  );
}