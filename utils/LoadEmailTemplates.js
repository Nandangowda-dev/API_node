const ejs = require('ejs');
const path = require('path');

const loadTemplate = async (templatePath, data) => {
  try {
    const absolutePath = path.join(__dirname, templatePath);
    const renderedHtml = await ejs.renderFile(absolutePath, { username: data });
    return renderedHtml;  
  } catch (err) {
    throw new Error(`Error rendering EJS template: ${err.message}`);
  }
};

module.exports=loadTemplate;