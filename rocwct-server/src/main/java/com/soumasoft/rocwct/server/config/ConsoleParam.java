package com.soumasoft.rocwct.server.config;

import lombok.Getter;
import lombok.Setter;

/**
 * This enum handles settings/commands provided by console parameters
 * e.g. java -jar -Dshutdown=true rocwct-server.jar
 * 
 * @author Thomas Juen, SoumaSoft
 *
 */
public enum ConsoleParam {
	
	/** indicates if server runs in console mode (default) or as system service. */
	SERVICERUNTIME("serviceruntime", "false"),
	/** in this mode, the program just sends a shutdown-command to the running RocWCT server and exists immediately (<code>ShutdownHelper</code>) */
	SHUTDOWN("shutdown", "false"),
	/** allows to specify an alternative path to the <see>Properties</see> File */
	PROPERTYFILEPATH("propertyfilepath","./rocwct.properties");
	
	@Getter
	@Setter
	private String key;
	
	@Getter
	@Setter
	private String defaultValue;
	
	private ConsoleParam(String key, String defaultValue) {
		this.key = key;
		this.defaultValue = defaultValue;		
	}
	
	public static Boolean getBoolean(ConsoleParam param) {
		return Boolean.parseBoolean(System.getProperty(param.key, param.defaultValue));
	}
	
	public static String getString(ConsoleParam param) {
		return System.getProperty(param.key, param.defaultValue);
	}
	
	public static String getSummary() {
		StringBuilder sb = new StringBuilder();
		for(ConsoleParam p : ConsoleParam.values()) {
			if(System.getProperty(p.getKey()) != null) {
				sb.append(p.getKey()+"="+getString(p)+", ");
			}
		}
		return sb.toString();
	}
}
