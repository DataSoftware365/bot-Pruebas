import { addKeyword, EVENTS,utils } from "@builderbot/bot";
import { flowDelService } from "./delService.flow";
import { isWithinInterval, format, parse } from "date-fns";
import { registerFlow } from "./register.flow";

 const isNumeric = (val: string) : boolean => {
   return !isNaN(Number(val));
}



const flowthisClient = addKeyword(EVENTS.ACTION).addAction(async (ctx, {state, globalState , flowDynamic }) => {
    
    await flowDynamic(`Hola ${ctx.name} un placer contactar de nuevo`)
    
    const List= globalState.get('Lastservices')
    
    console.log('Lista de citas Posteriores')
    console.log(List)

    //Tendremos sus ultimos servicios recuperados
    /**
     * Si los servicios no son posteriores a hoy
     * son servicios pasados solo le preguntaos por que servicio dese de nuevo
     * Si tiene servicios futuros le preguntaos si queires cancelar o reagendar
     * o si quiere concertar otra cita nueva 
     */
    const currentD = new Date()

    console.log("currentD")
    console.log(currentD)     

    const FutureAppointments = List.filter(function (serviciosolicitado) {
                                    //console.log(new Date(serviciosolicitado.start))
                                    return new Date(serviciosolicitado.fromDate) > currentD
                            })
                            
    console.log(`FutureAppointments:${FutureAppointments.length}`)
    console.log(FutureAppointments)

    await globalState.update({ FutureAppointments: FutureAppointments })
   
    if(FutureAppointments.length<=0){
        //no teneos ninguna cita
        console.log('sin citas')
        await flowDynamic('¿Quieres una nueva cita??')
         
    }
    
    if(FutureAppointments.length===1){
        console.log('una cita pendiente')
        await state.update({ name: FutureAppointments[0].nombre })
        await state.update({ email: FutureAppointments[0].email })
        await state.update({ servicio: FutureAppointments[0].servicio })
        await state.update({ profesional:FutureAppointments[0].profesional})
        await state.update({ cita:FutureAppointments[0].start})
        await state.update({ idevent:FutureAppointments[0].idEvent})
        await state.update({ calendario:FutureAppointments[0].calendario})         
        await state.update({ row_number:FutureAppointments[0].row_number})
        const message=[`Tienes agendado con nosotros para el dia el día ${format(FutureAppointments[0].fromDate, 'dd/MM/yyyy HH:mm:ss')}`,`para esta cita puedes *cancelar* o tambien *reagendar* como no una *nueva* cita o *salir* si lo desas`,`¿Que podemos hacer por ti?`]
        await flowDynamic(message)

    }
    if(FutureAppointments.length>1){
        console.log('Varias citas pendientes')

        await flowDynamic(`Tienes agendado con nosotros varias citas`)
        for (var i = 0; i < FutureAppointments.length; i++) {
            const dateformat= format(FutureAppointments[i].fromDate, 'dd/MM/yyyy HH:mm:ss')
            await flowDynamic(`${i+1} - cita el dia  ${dateformat} `)          
        }
        const message=[`para estas cita puedes poner *numero,accion*`,`las acciones puden ser *salir*, *cancelar* o *reagendar* como no una *nueva* cita esta no necesita numerador al igual que *salir*`,`¿Que podemos hacer por ti?`]
        await flowDynamic(message)
    }
      
})
.addAction({ capture: true }, async (ctx, { state ,globalState, flowDynamic, gotoFlow , endFlow, fallBack}) => {
    //mirar si la accion tiene un umero delante
     const valprimerdigito=ctx.body.substring(0,1)
     const FutureAppointments= globalState.get('FutureAppointments')

     if(ctx.body.toLocaleLowerCase().includes('salir')){

        return endFlow(`Chao que tengas un buen dia.`)
     }
    if(ctx.body.toLocaleLowerCase().includes('cancelar') || ctx.body.toLocaleLowerCase().includes('reagendar')){
 
        if(FutureAppointments.length<=0){
            return fallBack('No tienes actualment ninguna cita con nosotros,puedes pedir una *nueva* si lo deseas')
        }
        
        //Borrar Cita  
        if (FutureAppointments.length>1){
            if(!isNumeric(valprimerdigito)){
                return fallBack('No es posible actuar si no me indicas el numero de la cita con la orden *numero,accion*')
            }
        }
        await globalState.update({valprimerdigito: valprimerdigito })
        await globalState.update({ accionborrado: ctx.body.toLocaleLowerCase()})

        console.log('Selecionado accionborrado :')
        console.log(ctx.body)

        

        return gotoFlow(flowDelService)
    }

    if(ctx.body.toLocaleLowerCase().includes('nueva')){
        //por si de caso vamos apedirle el nombre ye el email
        // y sacar el nombredel ctx
         return gotoFlow(registerFlow)
    }else{
         return fallBack('debes de decirme un valor valido de lo expuesto')}

})


export {flowthisClient}