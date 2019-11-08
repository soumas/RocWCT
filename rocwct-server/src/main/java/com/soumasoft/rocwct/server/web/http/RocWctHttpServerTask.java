package com.soumasoft.rocwct.server.web.http;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.SocketException;

import com.soumasoft.rocwct.server.config.Properties;
import com.soumasoft.rocwct.server.itc.AbstractRocWctTask;

import lombok.extern.log4j.Log4j2;

/**
 * This task hosts and handles a socket, waiting for HTTP requests
 * and transfers it to a runnable <cod>RocWctHttpRequestHandler</code> instance.
 * 
 * @author Thomas Juen, SoumaSoft
 *
 */
@Log4j2
public class RocWctHttpServerTask extends AbstractRocWctTask {

	/**
	 * Time in ms to wait for graceful shutdown of the task.
	 */
	private static final int SHUTDOWN_TIMEOUT = 1000;	
	
	/**
	 * The socket.
	 */
	private ServerSocket httpServerConnect;
	
	/**
	 * The workder thead.
	 */
	Thread worker;
	
	/**
	 * Flag to decide whether an IOException was expected to be thrown (shutdown)
	 */
	private volatile boolean shutdownInProgress = false;
	
	
	@Override
	protected void onStart() throws Exception {
		worker = new Thread(() -> {
		
			try {
				
				log.debug(String.format("Try to start HttpSocket on localhost using Port: %d", Properties.getRocWctHttpPort()));
				httpServerConnect = new ServerSocket(Properties.getRocWctHttpPort());				
				log.info(String.format("HttpSocket is up and listening to %s:%d", httpServerConnect.getInetAddress().getHostName(), httpServerConnect.getLocalPort()));
					
				while (true) {
					RocWctHttpRequestHandler reqHdlr = new RocWctHttpRequestHandler(httpServerConnect.accept());
					log.debug("Client request accepted.");
					Thread thread = new Thread(reqHdlr);
					thread.start();
				}
				
			} catch (IOException e) {
				if(e instanceof SocketException && shutdownInProgress) {
					log.debug("HttpSocket is closed now");
				} else {
					throw new RuntimeException(e);
				}
			} catch (Exception e) {
				log.fatal(String.format("Unexpected error! Thread is dead now! (Port: %d)", Properties.getRocWctHttpPort()),e);
			}
		});
		worker.start();
	}

	@Override
	protected void onShutdown() throws Exception {
		shutdownInProgress = true;
		/* closing the socket results in an IOException */
		httpServerConnect.close();
		/* wait till thread has finished */
		worker.join(SHUTDOWN_TIMEOUT);		
	}

}
