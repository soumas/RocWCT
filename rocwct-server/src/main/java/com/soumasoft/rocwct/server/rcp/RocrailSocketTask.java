package com.soumasoft.rocwct.server.rcp;

import java.net.Socket;
import java.util.concurrent.LinkedBlockingQueue;

import com.soumasoft.rocwct.server.config.Properties;
import com.soumasoft.rocwct.server.itc.AbstractRocWctTask;
import com.soumasoft.rocwct.server.util.ShutdownHelper;

import lombok.Getter;
import lombok.extern.log4j.Log4j2;

/**
 * This task is responsible for handling the socket connection between RocWCT  and Rocrail.
 * When connection is esteblished, two thread are started -
 * one for reading and the other one for writing the socket.
 * 
 * @author Thomas Juen, SoumaSoft
 *
 */
@Log4j2
public class RocrailSocketTask extends AbstractRocWctTask {
	
	/**
	 * Flag to decide whether an IOException was expected to be thrown (shutdown)
	 */
	@Getter
	private volatile boolean shutdownInProgress = false;
	
	/**
	 * The socket to Rocrail server.
	 */
	@Getter
	private volatile Socket socket;
	
	/**
	 * Blocking message queue for outgoing messages to Rocrail server.
	 */
	@Getter
	private volatile LinkedBlockingQueue<String> outMessageQueue;	
	
	/**
	 * ReaderThread (see <code>RocrailSocketReader</code>)
	 */
	private volatile Thread reader;
	
	/**
	 * ReaderThread (see <code>RocrailSocketWriter</code>)
	 */
	private volatile Thread writer; 

	@Override
	protected void onStart() throws Exception {
		outMessageQueue = new LinkedBlockingQueue<>();
		setupRocrailConnectionAsync();
	}

	public void setupRocrailConnectionAsync() {

		Thread th = new Thread(() -> {

			while (!shutdownInProgress) {

				log.debug(String.format("Conncting to Rocrail server at %s:%d", Properties.getRocrailHostname(), Properties.getRocrailPort()));

				try {
					// connect to Rocrail socket
					socket = new Socket(Properties.getRocrailHostname(), Properties.getRocrailPort());					
					log.info(String.format("Succesfully connected to Rocrail server at %s:%d", Properties.getRocrailHostname(), Properties.getRocrailPort()));
					
					// start socket reader
					reader = new Thread(new RocrailSocketReader(this));
					reader.start();
					
					// start socket writer
					writer = new Thread(new RocrailSocketWriter(this));
					writer.start();
					
					break;

				} catch (Exception e) {
					log.error(String.format("Cannot connect to Rocrail server at %s:%d. Retry to connect in 15 seconds...",Properties.getRocrailHostname(), Properties.getRocrailPort()), e);
					try {
						for(int i = 0; i<15; i++) {
							Thread.sleep(1000);
							if(shutdownInProgress) {
								break;
							}
						}
					} catch (InterruptedException e1) {
						log.error(e1);
					}
				}
			}
		});

		th.start();
	}

	@Override
	protected void onShutdown() throws Exception {
		shutdownInProgress = true;
		if(socket != null) {			
			socket.close();
		}
		if(reader != null) {
			reader.join(1000);
		}
		if(writer != null) {
			enqueueRocrailCommand(ShutdownHelper.SHUTDOWNCOMMAND);
			writer.join(1000);
		}
	}

	/**
	 * Enqueues an RCP command to be sent to Rocrail (see <code>RocrailSocketWriter</code>)
	 * @param cmd
	 */
	public void enqueueRocrailCommand(String cmd) {
		this.outMessageQueue.add(cmd);
	}
}
