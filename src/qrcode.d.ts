declare module "qrcode" {
  interface QRCodeToStringOptions {
    type?: "svg" | string;
    errorCorrectionLevel?: "L" | "M" | "Q" | "H" | string;
    margin?: number;
    color?: {
      dark?: string;
      light?: string;
    };
  }

  const QRCode: {
    toString(text: string, options?: QRCodeToStringOptions): Promise<string>;
  };

  export default QRCode;
}
