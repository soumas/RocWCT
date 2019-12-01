/**
 * this class provides some handy utils
 */
export class Utils {

    /**
     * checks if @see obj is null or undefined
     * @param obj 
     */
    public static nullOrUndefined(obj: any) : boolean {
        return obj == null || typeof obj === 'undefined';
    }

    /**
    * returns the value of the url parameter specified by @see paramname as string
     * @param paramname 
     */
    public static getUrlParam(paramname: string): string {
        return new URL(document.URL).searchParams.get(paramname);
    }

    /**
     * returns the value of the url parameter specified by @see name as string
     * if url parameter is not defined, the @see defaultvalue will be returned
     * @param name 
     * @param defaultvalue 
     */
    public static getUrlParamOrDefault(name : string, defaultvalue: string) : string {
        let param : string = Utils.getUrlParam(name);
        if(!Utils.nullOrUndefined(param)) {
            return param;
        }        
        return defaultvalue;
    }

}