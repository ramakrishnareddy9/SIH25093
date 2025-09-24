const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');

// Ensure the temp directory exists
const tempDir = path.join(__dirname, '../../temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Generate PDF from HTML template
const generatePdf = async (templateName, data) => {
  try {
    // Read the EJS template
    const templatePath = path.join(__dirname, `../templates/${templateName}.ejs`);
    const template = fs.readFileSync(templatePath, 'utf-8');
    
    // Render the template with data
    const html = ejs.render(template, { data });
    
    // Generate a unique filename
    const filename = `portfolio_${Date.now()}.pdf`;
    const filePath = path.join(tempDir, filename);
    
    // Launch a headless browser
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set the HTML content
    await page.setContent(html, {
      waitUntil: 'networkidle0'
    });
    
    // Generate PDF
    await page.pdf({
      path: filePath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    });
    
    await browser.close();
    
    return filePath;
  } catch (error) {
    console.error('Error in generatePdf:', error);
    throw new Error('Failed to generate PDF');
  }
};

module.exports = {
  generatePdf
};
