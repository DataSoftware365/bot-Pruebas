
function isValidHorary(horary:any, validateDay:string, validatehours:string ) {
    
    interface horarios{
        Dia:string,
        turno1de:string,
        turno1hasta:string,
        turno2de:string,
        turno2hasta:string
    }
    
    const horario : horarios[] = horary

    //ENCARGADO DE VER SI LA HORA ES VALIDA
    const isInRange = (start, end, time) => {
        if(time < '00:00' || time > '23:59' || time.substring(3) > '59') {
        console.log('Hora no válida');
        return;
        // o throw new Error('Hora no válida');
        }
        return time >= start && time <= end;
    }
  
  //RECORRE EL HORARIO A VER SI ESTA DENTRO DE EL O FUERA
   var datevalid:boolean=false
     const list = horario.reduce((prev, current) => {
           console.log(current.Dia)
                  if (current.Dia===validateDay){
                      prev.push(current.turno1de)
                      prev.push(current.turno1hasta)
                      prev.push(current.turno2de)
                      prev.push(current.turno2hasta)
                      console.log(prev)
                      var total_time = 0;                    
                     for(var i = 1; i < prev.length; i++) {
                             console.log(prev[(i-1)],prev[i])
                             const isValid=isInRange(prev[(i-1)], prev[i], validatehours)
                             console.log(isValid)
                             if (isValid){
                                datevalid=true
                                return prev
                            }
                      }
                  }         
                return prev
      }, [])
  //console.log(list)
  return datevalid
  
}

function isValidFeriado(Feriados:any, validatey:string ) {
    const isValid:boolean=true
    return isValid
}

export { isValidHorary ,isValidFeriado  };