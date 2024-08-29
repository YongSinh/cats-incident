import dayjs from "dayjs"


export const isEmptyOrNull = (value) => {
    if(value == "" || value == null || value == 'null' || value == undefined){
        return true;
    }
    return false;
}

export const formatDateForClient = (date) => {
    if(!isEmptyOrNull(date)){
        return dayjs(date).format("MMMM D, YYYY h:mm A")
    }
    return null
}

export const formatDateForServer = (date) => {
    if(!isEmptyOrNull(date)){
        return dayjs(date).format("YYYY-MM-DD")
    }
    return null
}