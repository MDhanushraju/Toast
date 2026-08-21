// Export utilities for PDF, PNG, JPG, DOC (Word), and JSON formats

// 1. Export / Print as PDF
export const exportAsPDF = (title = 'Meeting_Report') => {
  window.print();
};

// 2. Export as Word Document (.doc)
export const exportAsDOC = (title = 'Meeting_Report', elementId = 'master-report-content') => {
  const element = document.getElementById(elementId) || document.querySelector('.report-container') || document.body;
  
  // Clone element & strip buttons/no-print elements
  const clone = element.cloneNode(true);
  const noPrints = clone.querySelectorAll('.no-print, button');
  noPrints.forEach(el => el.remove());

  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${title}</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 25px; color: #0f172a; line-height: 1.5; }
        h1, h2, h3, h4 { color: #006094; margin-top: 15px; margin-bottom: 8px; }
        .header-box { background: #006094; color: white; padding: 15px; border-radius: 8px; text-align: center; }
        table { border-collapse: collapse; width: 100%; margin: 15px 0; }
        th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; font-size: 13px; }
        th { background-color: #006094; color: #ffffff; font-weight: bold; }
        .badge { background: #781327; color: white; padding: 3px 8px; border-radius: 4px; font-size: 11px; }
        .grid-box { border: 1px solid #e2e8f0; padding: 12px; margin-bottom: 10px; border-radius: 6px; background: #f8fafc; }
      </style>
    </head>
    <body>
      <div class="header-box">
        <h2>TOASTMASTERS INTERNATIONAL • DISTRICT 227</h2>
        <h3>${title}</h3>
      </div>
      <hr/>
      ${clone.innerHTML}
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_master_report.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// 3. Export as PNG / JPG Image using Canvas
export const exportAsImage = (title = 'Meeting_Report', elementId = 'master-report-content', format = 'png') => {
  const element = document.getElementById(elementId) || document.querySelector('.report-container') || document.body;

  // Create SVG foreignObject container to render HTML node into canvas
  const clone = element.cloneNode(true);
  const noPrints = clone.querySelectorAll('.no-print, button');
  noPrints.forEach(el => el.remove());

  const width = Math.max(element.scrollWidth || 800, 800);
  const height = Math.max(element.scrollHeight || 1000, 1000);

  const svgData = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml" style="background:#ffffff; color:#0f172a; padding:20px; font-family:sans-serif;">
          <style>
            table { border-collapse: collapse; width: 100%; margin: 10px 0; }
            th, td { border: 1px solid #cbd5e1; padding: 6px 10px; text-align: left; }
            th { background-color: #006094; color: white; }
          </style>
          ${clone.innerHTML}
        </div>
      </foreignObject>
    </svg>
  `;

  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const svgUrl = URL.createObjectURL(svgBlob);
  const img = new Image();

  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    // Fill white background for JPG
    if (format === 'jpeg' || format === 'jpg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
    }

    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(svgUrl);

    const mimeType = (format === 'jpeg' || format === 'jpg') ? 'image/jpeg' : 'image/png';
    const dataUrl = canvas.toDataURL(mimeType, 0.95);

    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_report.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  img.src = svgUrl;
};

// 4. Export as JSON Data
export const exportAsJSON = (title = 'Meeting_Report', data = {}) => {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_data.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
