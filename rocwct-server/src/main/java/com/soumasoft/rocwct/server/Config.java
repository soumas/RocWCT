package com.soumasoft.rocwct.server;

import java.io.File;

import org.apache.commons.configuration2.Configuration;
import org.apache.commons.configuration2.builder.fluent.Configurations;
import org.apache.commons.configuration2.ex.ConfigurationException;

import lombok.Getter;
import lombok.extern.log4j.Log4j2;

/**
 * This class is responsible for loading and providing RocWCT Server settings
 * 
 * @author Thomas Juen, SoumaSoft 
 */
@Getter
@Log4j2
public class Config {
	
	private static Config instance = new Config();

	/** Default value for the Rocrail hostname */
	private static final String DEFAULT_ROCRAIL_HOSTNAME = "localhost";
	/** Default value for the Rocrail port */
	private static final int DEFAULT_ROCRAIL_PORT = 8051;
	/** default value for the RocWCT hostname */
	private static final String DEFAULT_ROCWCT_HOSTNAME = "localhost";
	/** default value for the RocWCT port (HTTP) */
	private static final int DEFAULT_ROCWCT_HTTP_PORT = 8052;
	/** default value for the RocWCT port (WebSocket) */
	private static final int DEFAULT_ROCWCT_WEBSOCKET_PORT = 8053;

	private String rocrailHostname;
	private int rocrailPort;
	private String rocWctHostname;
	private int rocWctHttpPort;
	private int rocWctWebSocketPort;

	/** private singleton constructor */
	private Config() { }

	/**
	 * Initializes all values either with the default value or 
	 * provided values if configfile (rocwct.properties) is available
	 * 
	 * @throws ConfigurationException
	 */
	public boolean init() {

		File configFile = new File("./rocwct.properties");
		if (configFile.exists()) {
			Configurations configs = new Configurations();
			Configuration config;
			try {
				config = configs.properties(configFile);

				rocrailHostname = config.getString("rocrail.hostname", DEFAULT_ROCRAIL_HOSTNAME);
				rocrailPort = config.getInt("rocrail.port", DEFAULT_ROCRAIL_PORT);
				rocWctHostname = config.getString("rocwct.hostname", DEFAULT_ROCWCT_HOSTNAME);
				rocWctHttpPort = config.getInt("rocwct.http-port", DEFAULT_ROCWCT_HTTP_PORT);
				rocWctWebSocketPort = config.getInt("rocwct.websocket-port", DEFAULT_ROCWCT_WEBSOCKET_PORT);

			} catch (Throwable e) {
				log.error(e);
				return false;
			}
		} else {
			rocrailHostname = DEFAULT_ROCRAIL_HOSTNAME;
			rocrailPort = DEFAULT_ROCRAIL_PORT;
			rocWctHostname = DEFAULT_ROCWCT_HOSTNAME;
			rocWctHttpPort = DEFAULT_ROCWCT_HTTP_PORT;
			rocWctWebSocketPort = DEFAULT_ROCWCT_WEBSOCKET_PORT;
		}
		return true;
		
	}

	public static Config getInstance() {
		return instance;
	}

}
