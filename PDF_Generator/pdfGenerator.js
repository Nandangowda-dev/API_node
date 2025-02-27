const pdfFromHTML = require('express-pdf');
//const pdfFromHTML = require('html-pdf');
 

 exports.pdfGenerator=(users,template)=>{
    try{
        pdfFromHTML({
        filename: `${users.id}.pdf`,
        htmlContent: '<html><body>Hello Nandan</body></html>'
        //html: template,  
    });
    console.log('generated')
}catch(err){
        console.log(err);
    }
    
};
 
// app.use('/pdfFromHTMLString', function(req, res){
//     res.pdfFromHTML({
//         filename: 'generated.pdf',
//         htmlContent: '<html><body>ASDF</body></html>',
       
//     });
// });
 
// app.use('/pdf', function(req, res){
//     res.pdf(path.resolve(__dirname, './original.pdf'));
// })