package com.soumasoft.rocwct.server.web.socket;

import java.io.Serializable;

import lombok.Getter;

/**
 * This container class is used to transfer some notifications 
 * from the RocWCT Server to the connected clients
 * @author Thomas Juen, SoumaSoft
 *
 */
public class RocWctClientNotification implements Serializable {

	private static final long serialVersionUID = 1L;

	public enum LoggingLevel {
		trace, debug, info, warn, error
	}
	
	@Getter
	private final String type = "RocWctClientNotification";
	
	@Getter
	private LoggingLevel loggingLevel;
	@Getter
	private String msg;
	
	public RocWctClientNotification(LoggingLevel loggingLevel, String msg) {
		this.loggingLevel = loggingLevel;
		this.msg = msg;
	}
	
}
