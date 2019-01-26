package com.soumasoft.rocwct.server.web.socket;

import java.net.InetSocketAddress;

import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

import com.soumasoft.rocwct.server.Main;
import com.soumasoft.rocwct.server.rcp.RocrailSocketManager;

import lombok.extern.log4j.Log4j2;

@Log4j2
public class RocWctWebSocket extends WebSocketServer {

	public RocWctWebSocket(RocWctWebSocketManager comMgr, InetSocketAddress address) {
		super(address);
	}
	
	@Override
	public void onOpen(WebSocket conn, ClientHandshake handshake) {
		//conn.send("Welcome to the server!"); //This method sends a message to the new client
		//broadcast( "new connection: " + handshake.getResourceDescriptor() ); //This method sends a message to all clients connected
		log.info("new connection to " + conn.getRemoteSocketAddress());
	}

	@Override
	public void onClose(WebSocket conn, int code, String reason, boolean remote) {
		log.info("closed " + conn.getRemoteSocketAddress() + " with exit code " + code + " additional info: " + reason);
	}

	@Override
	public void onMessage(WebSocket conn, String message) {
		if(message != null) {
			if(message.equals("shutdown")) {
				Main.running = false;				
			} else {				
				RocrailSocketManager.getInstance().enqueueOutMessage(message);
			}
		}
	}

	@Override
	public void onError(WebSocket conn, Exception ex) {
		log.error(ex);
	}
	
	@Override
	public void onStart() {
		log.info(String.format("RocWCT WebSocket is listening to %s:%d", this.getAddress().getHostName(), this.getAddress().getPort()));
	}

}
