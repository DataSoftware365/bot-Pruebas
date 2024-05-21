import { addKeyword, EVENTS,utils } from "@builderbot/bot";
import { flowNewService } from "./newService.flow";


const registerFlow = addKeyword(EVENTS.ACTION)
    .addAction(async (ctx, { state, flowDynamic }) => {
        await flowDynamic([`${ctx.name} ya has usado nuestros servicios con antelación`,`¿ Puedes decirme un email con el que agendar esta nueva cita ?`])
        await state.update({ name: ctx.name })
})
   .addAction({ capture: true }, async (ctx, { state, globalState , gotoFlow, fallBack , flowDynamic}) => {
            const email = ctx.body;
            const regEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para validar un correo electrónico
        
            if (!regEx.test(email)) {
            return fallBack('El correo electrónico ingresado no es válido. Por favor intenta nuevamente.')
            }       
            await state.update({ email: ctx.body })
            return gotoFlow(flowNewService)

    })             
    
    export {registerFlow}