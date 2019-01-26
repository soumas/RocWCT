package com.soumasoft.rocwct.server.web.socket;

import java.net.BindException;
import java.net.InetSocketAddress;

import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

import com.soumasoft.rocwct.server.Taskmanager;
import com.soumasoft.rocwct.server.config.Properties;
import com.soumasoft.rocwct.server.rcp.RocrailSocketTask;
import com.soumasoft.rocwct.server.util.ShutdownHelper;

import lombok.extern.log4j.Log4j2;

/**
 * The RocWctWebSocket is responsible for communication with webclient(s)
 * (usually WebComponent elements). The WebSocket is the main communication
 * channel of the server (in serviceruntime it's the only channel too)
 * 
 * @author Thomas Juen, SoumaSoft
 *
 */
@Log4j2 
public class RocWctWebSocket extends WebSocketServer {

	protected RocWctWebSocket() {
		super(new InetSocketAddress(Properties.getRocWctWebSocketPort()));
	}

	@Override
	public void onOpen(WebSocket conn, ClientHandshake handshake) {
		log.debug("New connection to WebSocket-client at " + conn.getRemoteSocketAddress());
	}

	@Override
	public void onClose(WebSocket conn, int code, String reason, boolean remote) {
		log.debug("Connection closed (WebSocket-client: " + conn.getRemoteSocketAddress() + ",  exit code: " + code + ", reason: " + reason + ")");
	}

	@Override
	public void onMessage(WebSocket conn, String message) {
		if (ShutdownHelper.SHUTDOWNCOMMAND.equals(message)) {
			ShutdownHelper.shutdownThisInstance();
		} else {
			log.trace(message);
			Taskmanager.getTask(RocrailSocketTask.class).enqueueRocrailCommand(message);
		}
	}

	@Override
	public void onError(WebSocket conn, Exception ex) {		
		log.error(ex);
		if(ex instanceof BindException) {
			log.fatal(String.format("Failed to bind %s:%d. Shutting down RocWCT server.", this.getAddress().getHostName(), this.getAddress().getPort()));
			// without working WebSocket the server is not able to
			// receive commands - so let's find the end for this session!
			ShutdownHelper.shutdownThisInstance();
		}
	}

	@Override
	public void onStart() {
		log.info(String.format("WebSocket is up and listening to %s:%d", this.getAddress().getHostName(), this.getAddress().getPort()));
	}
	
}
