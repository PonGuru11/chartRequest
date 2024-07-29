const {createLogger,transports,format}=require('winston');

const patientChartLogger=createLogger({
 transports:[
    new transports.File({
           filename:'LogFile/patient_info.log',
           level:'info',
           format:format.combine(format.timestamp({format:'YYYY-MM-DD HH:mm:ss'}),format.json())
    }),
    new transports.File({
        filename:'LogFile/patient_Error.log',
        level:'error',
        format:format.combine(format.timestamp({format:'YYYY-MM-DD HH:mm:ss'}),format.json())
 })
 ]
})

module.exports={patientChartLogger}