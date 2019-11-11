package com.soumasoft.rocwct.server.web.socket;

import java.io.IOException;

import org.json.JSONObject;

import com.soumasoft.rocwct.server.itc.AbstractRocWctTask;

/**
 * Task for starting/stopping the <code>RocWctWebSocket</code>. 
 * 
 * @author Thomas Juen, SoumaSoft
 *
 */
public class RocWctWebSocketTask extends AbstractRocWctTask {
	
	/**
	 * Time in ms to wait for graceful shutdown of the task.
	 */
	private static final int SHUTDOWN_TIMEOUT = 1000;
	
	/**
	 * The WebSocket instance.
	 */
	private final RocWctWebSocket webSocket = new RocWctWebSocket();
	
	@Override	
	protected void onStart() {
		webSocket.start();				
	}

	@Override
	protected void onShutdown() throws IOException, InterruptedException {
		/* stop websocket */
		webSocket.stop(SHUTDOWN_TIMEOUT);		
	}
	
	public void broadcast(String msg) {
		if(webSocket != null) {
			webSocket.broadcast(msg);
		}
	}
	
	public void broadcast(RocWctClientNotification msg) {
		if(webSocket != null) {			
			webSocket.broadcast(new JSONObject(msg).toString());
		}
	}
}
