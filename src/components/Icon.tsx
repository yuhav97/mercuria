// src/components/Icon.tsx
import React from 'react';
import {
  Loader2, FileText, Palette, Layers, UploadCloud, Wand2, Download, Mic2,
  ListChecks, Edit3, CheckCircle, Zap, Lightbulb, CornerDownRight, XCircle,
  Image as ImageIcon, BarChart3, SpellCheck, LayoutDashboard, FileEdit
} from 'lucide-react';

// Define os nomes de ícones válidos como um tipo união de strings literais
export type IconName =
  | 'loader' | 'file' | 'palette' | 'layers' | 'upload' | 'wand'
  | 'download' | 'mic' | 'listChecks' | 'edit3' | 'checkCircle'
  | 'zap' | 'lightbulb' | 'cornerDownRight' | 'xCircle' | 'image'
  | 'barChart' | 'spellCheck' | 'layoutDashboard' | 'fileEdit';

// Define a interface para as props do componente Icon
export interface IconProps {
  name: IconName;
  className?: string;
}

// Dicionário de componentes de ícone
const iconComponents: Record<IconName, React.FC<{ className?: string }>> = {
  loader: Loader2,
  file: FileText,
  palette: Palette,
  layers: Layers,
  upload: UploadCloud,
  wand: Wand2,
  download: Download,
  mic: Mic2,
  listChecks: ListChecks,
  edit3: Edit3,
  checkCircle: CheckCircle,
  zap: Zap,
  lightbulb: Lightbulb,
  cornerDownRight: CornerDownRight,
  xCircle: XCircle,
  image: ImageIcon,
  barChart: BarChart3,
  spellCheck: SpellCheck,
  layoutDashboard: LayoutDashboard,
  fileEdit: FileEdit,
};

const Icon = ({ name, className }: IconProps): JSX.Element | null => {
  const SelectedIconComponent = iconComponents[name];

  if (!SelectedIconComponent) {
    console.warn(`Ícone "${name}" não encontrado no componente Icon.tsx.`);
    return null;
  }

  const finalClassName = name === 'loader' ? `animate-spin ${className || ''}` : className;

  return <SelectedIconComponent className={finalClassName} />;
};

export default Icon;