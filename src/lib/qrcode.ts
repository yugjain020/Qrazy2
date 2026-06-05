import QRCode from 'qrcode';
import { type BusinessType } from '@/types';

export interface QRGenerationOptions {
  url: string;
  color?: string;
  backgroundColor?: string;
  size?: number;
  margin?: number;
}

export async function generateQRCodeDataURL(
  options: QRGenerationOptions
): Promise<string> {
  try {
    const dataUrl = await QRCode.toDataURL(options.url, {
      width: options.size || 512,
      margin: options.margin || 2,
      color: {
        dark: options.color || '#1e1e2e', // Dark mode default
        light: options.backgroundColor || '#ffffff',
      },
      errorCorrectionLevel: 'H', // High - allows for logo overlay later
    });

    return dataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}

export async function generateQRCodeSVG(
  options: QRGenerationOptions
): Promise<string> {
  try {
    const svgString = await QRCode.toString(options.url, {
      type: 'svg',
      width: options.size || 512,
      margin: options.margin || 2,
      color: {
        dark: options.color || '#1e1e2e',
        light: options.backgroundColor || '#ffffff',
      },
      errorCorrectionLevel: 'H',
    });

    return svgString;
  } catch (error) {
    console.error('Error generating QR SVG:', error);
    throw new Error('Failed to generate QR SVG');
  }
}

export function buildARUrl(workspaceId: string, productId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://qrazy.app';
  return `${baseUrl}/ar/${workspaceId}/${productId}`;
}

export function downloadDataURL(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}