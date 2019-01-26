package com.soumasoft.rocwct.server.config;

import java.io.File;

import org.apache.commons.configuration2.Configuration;
import org.apache.commons.configuration2.builder.fluent.Configurations;
import org.apache.commons.configuration2.ex.ConfigurationException;

import lombok.Getter;
import lombok.extern.log4j.Log4j2;

/**
 * This class is responsible for loading and providing RocWCT Server settings.
 * Settings are loaded from rocwct.properties if available (fallback to DEFAULT values).
 * 
 * @author Thomas Juen, SoumaSoft 
 */
@Log4j2
public class Properties {
	

	/** default value for rocWctWebSocketPort */
	private static final int DEFAULT_ROCWCT_WEBSOCKET_PORT = 8053;
	/** Default value for rocrailHostname */
	private static final String DEFAULT_ROCRAIL_HOSTNAME = "localhost";
	/** Default value for rocrailPort */
	private static final int DEFAULT_ROCRAIL_PORT = 8051;
	/** default value for rocWctHttpPort */
	private static final int DEFAULT_ROCWCT_HTTP_PORT = 8052;
	/** default value for rocWctHttpDefaultPage */
	private static final String DEFAULT_ROCWCT_HTTP_DEFAULT_PAGE = "index.html";
	/** default location for http documents */
	private static final String DEFAULT_ROCWCT_HTTP_DOC_ROOT = "./httpdocs/";
	/** default for http cache (enable/disable) */
	private static final Boolean DEFAULT_ROCWCT_HTTP_CACHE = true;
	
	/**
	 * The port where the RocWCT server is listening for WebSocket requests.
	 */
	@Getter
	private static int rocWctWebSocketPort;
	
	/**
	 * The hostname of the server where Rocrail is running.
	 */
	@Getter
	private static String rocrailHostname;
	
	/**
	 * The port where the Rocrail server is listening for socket connection.
	 */
	@Getter
	private static int rocrailPort;

	/**
	 * The port where the RocWCT server is listening for http requests.
	 */
	@Getter
	private static int rocWctHttpPort;
	
	/**
	 * Location of the http documents (html, js, ...).
	 */
	@Getter
	private static String rocWctHttpDocumentsRoot;
	
	/**
	 * The name of the html page returned by the RocWCT http 
	 * server if no file is specified with the request.
	 */
	@Getter
	private static String rocWctHttpDefaultPage;

	/**
	 * If true, the static http documents will be cached after
	 * the first access. Otherwise RocWCT http server reads the
	 * content every time (useful for development)
	 */
	@Getter
	private static Boolean rocWctHttpCache;

	/**
	 * Initializes all values either with the default value or provided 
	 * values if config-file (rocwct.properties) is available.
	 * 
	 * @throws ConfigurationException
	 * @return False if any exception was thrown, false otherwise. 
	 */
	public static boolean init() {

		File configFile = new File(ConsoleParam.getString(ConsoleParam.PROPERTYFILEPATH));
		if (configFile.exists()) {
			Configurations configs = new Configurations();
			Configuration config;
			try {
				config = configs.properties(configFile);

				rocWctWebSocketPort = config.getInt("rocwct.websocket.port", DEFAULT_ROCWCT_WEBSOCKET_PORT);
				rocrailHostname = config.getString("rocrail.hostname", DEFAULT_ROCRAIL_HOSTNAME);
				rocrailPort = config.getInt("rocrail.port", DEFAULT_ROCRAIL_PORT);
				rocWctHttpPort = config.getInt("rocwct.http.port", DEFAULT_ROCWCT_HTTP_PORT);
				rocWctHttpDefaultPage = config.getString("rocwct.http.defaultpage", DEFAULT_ROCWCT_HTTP_DEFAULT_PAGE);
				rocWctHttpDocumentsRoot = config.getString("rocwct.http.documentroot", DEFAULT_ROCWCT_HTTP_DOC_ROOT);
				rocWctHttpCache = config.getBoolean("rocwct.http.cache", DEFAULT_ROCWCT_HTTP_CACHE);

			} catch (Throwable e) {
				log.error(e);
				return false;
			}
		} else {
			rocWctWebSocketPort = DEFAULT_ROCWCT_WEBSOCKET_PORT;
			rocrailHostname = DEFAULT_ROCRAIL_HOSTNAME;
			rocrailPort = DEFAULT_ROCRAIL_PORT;
			rocWctHttpPort = DEFAULT_ROCWCT_HTTP_PORT;
			rocWctHttpDocumentsRoot = DEFAULT_ROCWCT_HTTP_DOC_ROOT;
			rocWctHttpDefaultPage = DEFAULT_ROCWCT_HTTP_DEFAULT_PAGE;
			rocWctHttpCache = DEFAULT_ROCWCT_HTTP_CACHE;
		}
		return true;
		
	}
	
	public static String getSummary() {
		StringBuilder sb = new StringBuilder();
		sb.append("rocWctWebSocketPort="+rocWctWebSocketPort+", ");
		sb.append("rocrailHostname="+rocrailHostname+", ");
		sb.append("rocrailPort="+rocrailPort+", ");
		sb.append("rocWctHttpPort="+rocWctHttpPort+", ");
		sb.append("rocWctHttpDocumentsRoot="+rocWctHttpDocumentsRoot+", ");
		sb.append("rocWctHttpDefaultPage="+rocWctHttpDefaultPage+", ");
		sb.append("rocWctHttpCache="+rocWctHttpCache+", ");
		return sb.toString();
	}

}
