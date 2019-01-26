package com.soumasoft.rocwct.server.itc;

import java.util.concurrent.LinkedBlockingQueue;

import com.soumasoft.rocwct.server.util.ShutdownHelper;

import lombok.extern.log4j.Log4j2;

/**
 * This abstract task implementation is responsible for 
 * starting and shutting down worker threads in RocWCT server.
 * 
 * @author Thomas Juen, SoumaSoft
 *
 */
@Log4j2
public abstract class AbstractRocWctTask implements Runnable {

	/**
	 * The blocking queue of the task.
	 */
	private final LinkedBlockingQueue<String> cmdQueue = new LinkedBlockingQueue<String>();

	/**
	 * Abstract method where the implementing class has to setup and start (e.g. create and open socket, ...)
	 * Make sure that the setup does not block the calling thread. 
	 * @throws Exception
	 */
	protected abstract void onStart() throws Exception;
	
	/**
	 * Abstract method where the implementing class has to stop and clean up it's resources.
	 * Make sure that all threads are finished when the method returns.
	 * @throws Exception
	 */
	protected abstract void onShutdown() throws Exception;

	@Override
	public void run() {

		try {
			
			log.debug(String.format("%s starting...", this.getClass().getSimpleName()));
			onStart();
			log.debug(String.format("%s started", this.getClass().getSimpleName()));

			for (;;) {
				String cmd = cmdQueue.take();
				if (ShutdownHelper.SHUTDOWNCOMMAND.equals(cmd)) {					
					log.debug(String.format("%s stopping...", this.getClass().getSimpleName()));
					onShutdown();
					break;
				} else {
					log.warn(String.format("unknown command: %s", cmd));
				}
			}
			log.debug(String.format("%s stopped", this.getClass().getSimpleName()));
			
		} catch (Exception e) {
			log.fatal(e);
			log.fatal("TASK DIES UNEXPECTLY!");
			try {
				onShutdown();
			} catch (Exception e1) {
				log.error("Error on shutting down task", e1);
			}
		}
	}

	public void shutdown() {
		try {
			cmdQueue.put(ShutdownHelper.SHUTDOWNCOMMAND);
		} catch (Exception e) {
			log.error(e);
		}
	}

}
