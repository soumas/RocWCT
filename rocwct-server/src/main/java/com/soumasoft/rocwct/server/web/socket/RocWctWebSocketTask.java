package com.soumasoft.rocwct.server.web.socket;

import java.io.IOException;

import com.soumasoft.rocwct.server.itc.AbstractRocWctTask;

/**
 * Task for starting/stopping the <code>RocWctWebSocket</code>. 
 * 
 * @author Thomas Juen, SoumaSoft
 *
 */
public class RocWctWebSocketTask extends AbstractRocWctTask {
	
	private final RocWctWebSocket webSocket = new RocWctWebSocket();
	
	@Override	
	protected void onStart() {
		webSocket.start();				
	}

	@Override
	protected void onShutdown() throws IOException, InterruptedException {
		/* stop websocket */
		webSocket.stop(1000);		
	}
	
	public void broadcast(String msg) {
		if(webSocket != null) {
			webSocket.broadcast(msg);
		}
	}
}
