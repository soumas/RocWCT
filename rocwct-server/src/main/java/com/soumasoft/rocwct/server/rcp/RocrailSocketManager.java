package com.soumasoft.rocwct.server.rcp;

import java.util.concurrent.ConcurrentLinkedQueue;

import org.json.JSONObject;
import org.json.XML;

import com.soumasoft.rocwct.server.web.socket.RocWctWebSocketManager;

import lombok.Getter;

public class RocrailSocketManager {

	// singleton instance
	private static RocrailSocketManager instance = new RocrailSocketManager();
	private RocrailSocketManager() { /* private constructor */ }
	public static RocrailSocketManager getInstance() {
		return instance;
	}

	@Getter
	private ConcurrentLinkedQueue<String> outMessageQueue;	
	@Getter
	private boolean stopped;
	@Getter
	private String host;
	@Getter
	private int port;

	private Thread socketThread;
	private RocrailSocket socket;

	public void start(String host, int port) {
		this.stopped = false;
		this.host = host;
		this.port = port;
		startInternal();
	}

	private void startInternal() {
		if (this.isStopped()) {
			return;
		}
		System.out.println(String.format("Rocrail-WCP RocrailComManager: connecting to %s:%d", host, port));
		outMessageQueue = new ConcurrentLinkedQueue<>();
		socket = new RocrailSocket(this, this::onMessageIn, this::onException, this::onThreadStop);
		socketThread = new Thread(socket);
		socketThread.start();
	}

	public void stop() {
		System.out.println("Rocrail-WCP RocrailComManager: stopping comminication with Recrail service... ");

		this.stopped = true;
		try {
			socketThread.join(1000);
		} catch (InterruptedException e) {
			throw new RuntimeException(e);
		}
	}

	private void onException(Exception ex) {
		System.err.println("Rocrail-WCP RocrailComManager: ERROR!");
		System.err.println(ex.getMessage() + ex.getStackTrace());
	}

	private void onThreadStop(RocrailSocket ex) {

		if (!isStopped()) {
			System.err.println("Rocrail-WCP RocrailComManager: Unexpected connection loss! Try to reconnect in about 1 second.");
			try {
				Thread.sleep(1000);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
			startInternal();
		}
	}

	private void onMessageIn(String msg) {
		JSONObject xmlJSONObj = XML.toJSONObject(msg);
		RocWctWebSocketManager.getInstance().tmpBroadcast(xmlJSONObj.toString());
	}
	
	public void enqueueOutMessage(String command) {
		outMessageQueue.add(command);
	}
}
