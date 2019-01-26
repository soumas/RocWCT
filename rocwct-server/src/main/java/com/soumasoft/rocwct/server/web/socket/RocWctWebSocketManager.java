package com.soumasoft.rocwct.server.web.socket;

import java.net.InetSocketAddress;

import lombok.Getter;
import lombok.extern.log4j.Log4j2;

@Log4j2
public class RocWctWebSocketManager {

	// singleton instance
	private static RocWctWebSocketManager instance = new RocWctWebSocketManager();
	private RocWctWebSocketManager() { /* private constructor */ }
	public static RocWctWebSocketManager getInstance() {
		return instance;
	}
	
	//private Thread socketThread;
	private RocWctWebSocket socket;
	
	@Getter
	private String host;
	@Getter
	private int port;
	
	public void start(String host, int port) {
		this.host = host;
		this.port = port;
		startInternal();
	}

	private void startInternal() {
		log.info(String.format("Rocrail-WCP WcpWebSocketManager: starting websocket at %s:%d", host, port));
		socket = new RocWctWebSocket(this, new InetSocketAddress(host, port));
		socket.start();
//		socketThread = new Thread(socket);
//		socketThread.start();
	}

	public void stop() {
		try {
			socket.stop(1000);
		} catch (Exception e) {
			//log.error(e);
		}
	}
	
	
	public void tmpBroadcast(String json) {
		socket.broadcast(json);
	}
}
