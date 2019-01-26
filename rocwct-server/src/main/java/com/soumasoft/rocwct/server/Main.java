package com.soumasoft.rocwct.server;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;

import com.soumasoft.rocwct.server.web.socket.RocWctWebSocketManager;

import lombok.extern.log4j.Log4j2;

@Log4j2
public class Main {

	public static volatile boolean running = true;

	public static void main(String[] args) throws IOException, InterruptedException {

		if (!Config.getInstance().init()) {
			log.fatal(
					"Error on loading settings - not able to start RocWCT server. Please check previouse messages for further details.");
		}

		if (System.getProperty("cmd") != null && "shutdown".equals(System.getProperty("cmd"))) {
			WebSocketClient mWs;
			try {
				mWs = new WebSocketClient(new URI("ws://localhost:8053")) {
					@Override
					public void onMessage(String message) { }

					@Override
					public void onOpen(ServerHandshake handshake) { 
						send("shutdown");
						close();
					}

					@Override
					public void onClose(int code, String reason, boolean remote) { }

					@Override
					public void onError(Exception ex) { }

				};
				mWs.connectBlocking();
				while(mWs.isOpen()) {
					Thread.sleep(1);					
				}
			} catch (URISyntaxException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			System.exit(0);
			return;
		}

		// log.debug(Config.getInstance().getRocrailHostname());
		// log.warn(Config.getInstance().getRocrailHostname());
		// log.info(Config.getInstance().getRocrailPort());
		// log.fatal(Config.getInstance().getRocWctHostname());
		// log.trace(Config.getInstance().getRocWctHttpPort());
		// log.debug(Config.getInstance().getRocWctWebSocketPort());
		RocWctWebSocketManager.getInstance().start(Config.getInstance().getRocWctHostname(),
				Config.getInstance().getRocWctWebSocketPort());

		// ExecutorService executorService = Executors.newFixedThreadPool(2);
		// List<Callable<?>> tasks = new ArrayList<>();
		// tasks.add(new ConsoleReader());
		// tasks.add(new MyTestRunnable());

		// invokeAll wartet bis alle erledigt sind
		// executorService.invokeAll(tasks);
		// executorService.shutdownNow();

		while (running) {

		}

		RocWctWebSocketManager.getInstance().stop();

		log.info("RocWCT server stopped gracefully");

	}

}
