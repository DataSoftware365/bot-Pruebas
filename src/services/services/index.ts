import { N8N_GET_FROM_SERVICIOS } from 'src/config'

/**
 * get registers services to bussines
 * @returns
 */
const ListServices = async (): Promise<{servicio:string, profesional:string, duracion: number, precio: number , calendario: string }[]> => {
    const dataServices = await fetch(N8N_GET_FROM_SERVICIOS)  
    const json  = await dataServices.json()
    // Eliminar la propiedad "row_number" de cada objeto en el arreglo JSON
    const newData = json.map(obj => {
        const { row_number, ...rest } = obj;
        return rest;
    },[]);
    return newData
}

export { ListServices }
