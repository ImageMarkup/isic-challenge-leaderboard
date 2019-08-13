module.exports = {
  lintOnSave: false,


   devServer: {
     port: 8081,

     proxy: {
       '/api': {
         target: 'http://localhost:8000',
         changeOrigin: true,
       }
     }
   }
}
