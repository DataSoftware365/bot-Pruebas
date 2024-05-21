import { addKeyword, EVENTS,utils } from "@builderbot/bot";
import { clearHistory } from "../utils/handleHistory";
import { delToCalendar } from "src/services/calendar";
import { flowNewService } from "./newService.flow";
import { isWithinInterval, format, parse } from "date-fns";

const isNumeric = (val: string) : boolean => {
    return !isNaN(Number(val));
 }
const flowDelService = addKeyword(EVENTS.ACTION).addAction(async (ctx, {state, globalState , flowDynamic}) => {
    
    const FutureAppointments = globalState.get('FutureAppointments')

    const valprimerdigito= globalState.get('valprimerdigito')

    if(isNumeric(valprimerdigito)){
        await state.update({ name: FutureAppointments[valprimerdigito-1].nombre })
        await state.update({ email: FutureAppointments[valprimerdigito-1].email })
        await state.update({ servicio: FutureAppointments[valprimerdigito-1].servicio })
        await state.update({ profesional:FutureAppointments[valprimerdigito-1].profesional})
        await state.update({ cita:FutureAppointments[valprimerdigito-1].fromDate})
        await state.update({ idevent:FutureAppointments[valprimerdigito-1].idevent})
        await state.update({ calendario:FutureAppointments[valprimerdigito-1].calendario})
        await state.update({ row_number:FutureAppointments[valprimerdigito-1].row_number}) 

        console.log("Accion seleccionada")
        console.log(globalState.get('accionborrado'))

        const accionselected = globalState.get('accionborrado')
        await globalState.update({ accionborrado: accionselected.substring(2,15) }) 

        console.log("Accion sin primer digito")
        console.log(accionselected)
    }else{
        await state.update({ name: FutureAppointments[0].nombre })
        await state.update({ email: FutureAppointments[0].email })
        await state.update({ servicio: FutureAppointments[0].servicio })
        await state.update({ profesional:FutureAppointments[0].profesional})
        await state.update({ cita:FutureAppointments[0].fromDate})
        await state.update({ idevent:FutureAppointments[0].idevent})
        await state.update({ calendario:FutureAppointments[0].calendario})
        await state.update({ row_number:FutureAppointments[0].row_number})  
    }
    const message=[`Vale,${ctx.name} vamos a ${globalState.get('accionborrado')} la cita que selecionaste voy a pedirte que confirmes los datos`,`El Nombre con el que  agendaste fue ${state.get('name')} y el email que usaste fue ${state.get('email')} con ${state.get('profesional')} para la cita del dia ${format(state.get('cita'), 'dd/MM/yyyy HH:mm:ss')}`,`¿Deseas ${globalState.get('accionborrado')} esta cita? Debes de afirmar con *si* o denegar con *cancelar*`]
    await flowDynamic(message)   
})
.addAction({ capture: true }, async (ctx, { state, globalState, flowDynamic, fallBack , gotoFlow, endFlow }) => {
    if (ctx.body.toLocaleLowerCase().includes('cancelar')) {
        clearHistory(state)
        return endFlow(`¿decidiste *NO ${globalState.get('accionborrado')}* Como puedo ayudarte?`)
    }
    if (!ctx.body.toLocaleLowerCase().includes('si')) {
        return fallBack('Debes de afirmar con *si* o denegar con *cancelar*')
    }
    const dateObject = {
        idevent:state.get('idevent'),
        email:state.get('email'),
        calendario:state.get('calendario'),
        row_number:state.get('row_number')
    }
    await flowDynamic(`Dame un momento trato de ${globalState.get('accionborrado')} con ${state.get('profesional')}....`)
    
    console.log('objeto a borrar')
    console.log(dateObject)
    
    const resp = await delToCalendar(dateObject)
    const accion =globalState.get('accionborrado')

    //mirar si devuelve 200
    const nom=ctx.name
    //segun reagendar = enviar de nuevo
    if (accion === 'reagendar'){ return gotoFlow(flowNewService)}
    clearHistory(state)
    return flowDynamic(`Listo! ${nom} se ha ${globalState.get('accionborrado')} tu cita que tengas un Buen dia`)
})
export {flowDelService}