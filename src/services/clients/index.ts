import { N8N_ADD_TO_CLIENTES, N8N_GET_FROM_CLIENTES } from 'src/config'

/**
 * get registers to calendars
 * @returns 
 */
const getThisIsClient = async (phone:string): Promise<{ nombre:string, email:string, start: string, end: string ,phone:string, servicio: string , profesional:string ,idevent:string ,calendario: string,row_number:number }[]> => {
    
    const dataClientReseved = await fetch(N8N_GET_FROM_CLIENTES+"?phone="+phone)
    const json = await dataClientReseved.json()

    const newData = json.map(obj => {
        const {...rest } = obj;
        return rest;
    });
    return newData
    
}

/** 
 * add to register client to db or add with trigger to n8n to add event
 * @param body 
 * @returns 
 */
const addToRegisterClient = async (payload: { name: string, email: string, startDate: Date, endData: Date, phone: string, servicio: string , profesional:string , duracion:string ,idevent:string,calendario: string }) => {
    try {
        const dataApi = await fetch(N8N_ADD_TO_CLIENTES, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload)
        })
        return dataApi
    } catch (err) {
        console.log(`error: `, err)
    }
}


export { getThisIsClient, addToRegisterClient }