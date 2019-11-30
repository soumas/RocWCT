export class Utils {

    public static nullOrUndefined(obj: any) : boolean {
        return obj == null || typeof obj === 'undefined';
    }

    public static getUrlParam(paramname: string): string {
        return new URL(document.URL).searchParams.get(paramname);
    }

    public static getUrlParamOrDefault(name : string, defaultvalue: string) : string {
        let param : string = Utils.getUrlParam(name);
        if(!Utils.nullOrUndefined(param)) {
            return param;
        }        
        return defaultvalue;
    }

}