package com.soumasoft.rocwct.server.util;

import java.net.URI;

import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;

import com.soumasoft.rocwct.server.Main;
import com.soumasoft.rocwct.server.config.Properties;
import com.soumasoft.rocwct.server.itc.AbstractRocWctTask;

import lombok.extern.log4j.Log4j2;

/**
 * To shutdown the RocWCT server without console, one can start a second instance of 
 * the RocWCT server with the param -Dshutdown=true, which sends the shutdown command
 * over the WebSocket connection. This is common use, when RocWCT server is running
 * as system service. In default mode it is more comfortable to write the quit-command
 * to the console ;)
 * 
 * @author Thomas Juen, SoumaSoft 
 */
@Log4j2
public class ShutdownHelper {
	
	public static final String SHUTDOWNCOMMAND = "quit";
	
	/**
	 * This method creates a WebSocketClient connection to the running RocWCT
	 * server which is listening to the configured port. When connection is open, 
	 * a shutdown-command gets transmitted and connection gets closed again. 
	 */
	public static void shutdownOtherInstance() {
		WebSocketClient mWs;
		try {
			
			String uri = String.format("ws://localhost:%d", Properties.getRocWctWebSocketPort());
			log.info(String.format("Sending shutdown command to %s...",uri));
			
			mWs = new WebSocketClient(new URI(uri)) {

				@Override
				public void onOpen(ServerHandshake handshake) {
					send(SHUTDOWNCOMMAND);
					close(); 
				}

				@Override
				public void onMessage(String message) { /* not used */ }
				@Override
				public void onClose(int code, String reason, boolean remote) { /* not used */ }
				@Override
				public void onError(Exception ex) { /* not used */ }

			};
			
			mWs.connectBlocking();
			
			// bad busy wait until connection is closed (only one command)
			while (mWs.isOpen()) {
				Thread.sleep(1);
			}
			
			log.info("Sending shutdown command done",uri);
			
		} catch (Exception e) {
			log.fatal(e);
		} 
	}

	/**
	 * This method loops through all task
	 * and calls their shutdown method
	 */
	public static void shutdownThisInstance() {
		for(AbstractRocWctTask task : Main.tasks) {
			task.shutdown();
		}
	}

}
